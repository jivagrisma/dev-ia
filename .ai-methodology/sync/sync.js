#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { Octokit } from '@octokit/rest';
import { graphql } from '@octokit/graphql';
import yaml from 'js-yaml';
import chalk from 'chalk';
import ora from 'ora';
import { table } from 'table';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

// Cargar variables de entorno
dotenv.config({ path: join(projectRoot, '.env') });

class AIMethodologySync {
  constructor() {
    this.config = this.loadConfig();
    this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    this.graphqlWithAuth = graphql.defaults({
      headers: { authorization: `token ${process.env.GITHUB_TOKEN}` }
    });
    this.stats = {
      specsProcessed: 0,
      tasksCreated: 0,
      tasksUpdated: 0,
      errors: []
    };
  }

  loadConfig() {
    const configPath = join(__dirname, 'config.json');
    if (!existsSync(configPath)) {
      throw new Error('Config no encontrado. Ejecuta "npm run setup" primero.');
    }
    return JSON.parse(readFileSync(configPath, 'utf8'));
  }

  async syncSpecsToGitHub() {
    const spinner = ora('Sincronizando specs con GitHub Projects...').start();
    
    try {
      // 1. Obtener proyecto de GitHub
      const project = await this.getOrCreateProject();
      spinner.text = `Proyecto encontrado: ${project.title}`;

      // 2. Leer todas las specs
      const specs = await this.loadSpecs();
      spinner.text = `${specs.length} specs encontradas`;

      // 3. Sincronizar cada spec
      for (const spec of specs) {
        await this.syncSpecToProject(spec, project);
        this.stats.specsProcessed++;
      }

      spinner.succeed(`Sincronización completada: ${this.stats.specsProcessed} specs procesadas`);
      this.printSyncStats();

    } catch (error) {
      spinner.fail('Error en sincronización');
      console.error(chalk.red(error.message));
      throw error;
    }
  }

  async getOrCreateProject() {
    const { owner, repo, projectNumber } = this.config.github;
    
    try {
      // Intentar obtener proyecto existente
      const query = `
        query($owner: String!, $repo: String!, $number: Int!) {
          repository(owner: $owner, name: $repo) {
            projectV2(number: $number) {
              id
              title
              url
              fields(first: 20) {
                nodes {
                  ... on ProjectV2Field {
                    id
                    name
                    dataType
                  }
                  ... on ProjectV2SingleSelectField {
                    id
                    name
                    dataType
                    options {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const result = await this.graphqlWithAuth(query, { owner, repo, number: projectNumber });
      
      if (result.repository.projectV2) {
        return result.repository.projectV2;
      }

      // Si no existe, crear nuevo proyecto
      return await this.createProject();

    } catch (error) {
      console.log(chalk.yellow('Proyecto no encontrado, creando nuevo...'));
      return await this.createProject();
    }
  }

  async createProject() {
    const { owner, repo } = this.config.github;
    
    const mutation = `
      mutation($ownerId: ID!, $title: String!, $repositoryId: ID!) {
        createProjectV2(input: {
          ownerId: $ownerId,
          title: $title,
          repositoryId: $repositoryId
        }) {
          projectV2 {
            id
            title
            url
          }
        }
      }
    `;

    // Obtener IDs necesarios
    const repoQuery = `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          id
          owner {
            id
          }
        }
      }
    `;

    const repoResult = await this.graphqlWithAuth(repoQuery, { owner, repo });
    
    const result = await this.graphqlWithAuth(mutation, {
      ownerId: repoResult.repository.owner.id,
      title: `AI Methodology - ${repo}`,
      repositoryId: repoResult.repository.id
    });

    return result.createProjectV2.projectV2;
  }

  async loadSpecs() {
    const specsDir = join(projectRoot, 'specs');
    if (!existsSync(specsDir)) {
      return [];
    }

    const specs = [];
    const files = readdirSync(specsDir, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile() && (file.name.endsWith('.yaml') || file.name.endsWith('.yml'))) {
        try {
          const content = readFileSync(join(specsDir, file.name), 'utf8');
          const spec = yaml.load(content);
          spec._filename = file.name;
          specs.push(spec);
        } catch (error) {
          this.stats.errors.push(`Error cargando ${file.name}: ${error.message}`);
        }
      }
    }

    return specs;
  }

  async syncSpecToProject(spec, project) {
    if (!spec.tasks || !Array.isArray(spec.tasks)) {
      return;
    }

    for (const task of spec.tasks) {
      try {
        await this.createOrUpdateProjectItem(spec, task, project);
      } catch (error) {
        this.stats.errors.push(`Error con tarea "${task.title}": ${error.message}`);
      }
    }
  }

  async createOrUpdateProjectItem(spec, task, project) {
    // Crear issue en GitHub si no existe
    const issue = await this.createOrUpdateIssue(spec, task);
    
    // Agregar issue al proyecto
    await this.addIssueToProject(issue, project, task);
    
    this.stats.tasksCreated++;
  }

  async createOrUpdateIssue(spec, task) {
    const { owner, repo } = this.config.github;
    
    // Buscar issue existente por título
    const searchQuery = `repo:${owner}/${repo} in:title "${task.title}"`;
    const searchResult = await this.octokit.rest.search.issuesAndPullRequests({
      q: searchQuery
    });

    if (searchResult.data.items.length > 0) {
      // Issue existe, actualizar si es necesario
      const existingIssue = searchResult.data.items[0];
      this.stats.tasksUpdated++;
      return existingIssue;
    }

    // Crear nuevo issue
    const body = this.generateIssueBody(spec, task);
    const labels = this.generateLabels(spec, task);

    const issue = await this.octokit.rest.issues.create({
      owner,
      repo,
      title: task.title,
      body,
      labels
    });

    return issue.data;
  }

  generateIssueBody(spec, task) {
    let body = `## Descripción\n\n`;
    
    if (task.description) {
      body += `${task.description}\n\n`;
    }

    body += `## Contexto de la Especificación\n\n`;
    body += `- **Spec ID**: ${spec.id}\n`;
    body += `- **Spec Title**: ${spec.title}\n`;
    
    if (spec.objectives) {
      body += `\n### Objetivos\n\n`;
      spec.objectives.forEach(obj => {
        body += `- ${obj}\n`;
      });
    }

    if (task.estimate) {
      body += `\n## Estimación\n\n${task.estimate}\n`;
    }

    if (spec.acceptance_criteria) {
      body += `\n## Criterios de Aceptación\n\n`;
      spec.acceptance_criteria.forEach(criteria => {
        body += `- [ ] ${criteria}\n`;
      });
    }

    body += `\n---\n*Generado automáticamente por AI Methodology*`;
    
    return body;
  }

  generateLabels(spec, task) {
    const labels = ['ai-methodology'];
    
    if (spec.id) {
      labels.push(`spec:${spec.id}`);
    }
    
    if (task.labels && Array.isArray(task.labels)) {
      labels.push(...task.labels);
    }

    return labels;
  }

  async addIssueToProject(issue, project, task) {
    const mutation = `
      mutation($projectId: ID!, $contentId: ID!) {
        addProjectV2ItemByContentId(input: {
          projectId: $projectId,
          contentId: $contentId
        }) {
          item {
            id
          }
        }
      }
    `;

    try {
      await this.graphqlWithAuth(mutation, {
        projectId: project.id,
        contentId: issue.node_id
      });
    } catch (error) {
      // El item ya puede estar en el proyecto
      if (!error.message.includes('already exists')) {
        throw error;
      }
    }
  }

  printSyncStats() {
    console.log(chalk.green.bold('\n📊 Estadísticas de Sincronización\n'));
    
    const data = [
      ['Métrica', 'Valor'],
      ['Specs procesadas', this.stats.specsProcessed],
      ['Tareas creadas', this.stats.tasksCreated],
      ['Tareas actualizadas', this.stats.tasksUpdated],
      ['Errores', this.stats.errors.length]
    ];

    console.log(table(data));

    if (this.stats.errors.length > 0) {
      console.log(chalk.red.bold('\n❌ Errores encontrados:\n'));
      this.stats.errors.forEach(error => {
        console.log(chalk.red(`  • ${error}`));
      });
    }

    // Actualizar estado
    this.updateSyncState();
  }

  updateSyncState() {
    const statePath = join(projectRoot, '.ai-methodology/context/state.json');
    let state = {};
    
    if (existsSync(statePath)) {
      state = JSON.parse(readFileSync(statePath, 'utf8'));
    }

    state.sync = {
      lastRun: new Date().toISOString(),
      direction: 'spec_to_project',
      stats: this.stats
    };

    writeFileSync(statePath, JSON.stringify(state, null, 2));
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const specsOnly = args.includes('--specs-only');
  const githubOnly = args.includes('--github-only');

  console.log(chalk.blue.bold('🔄 AI Methodology - Sincronización\n'));

  try {
    const sync = new AIMethodologySync();
    
    if (!githubOnly) {
      await sync.syncSpecsToGitHub();
    }

    console.log(chalk.green.bold('\n✅ Sincronización completada exitosamente!'));
    
  } catch (error) {
    console.error(chalk.red.bold('\n❌ Error en sincronización:'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { AIMethodologySync };
