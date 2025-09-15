#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { Octokit } from '@octokit/rest';
import { graphql } from '@octokit/graphql';
import chalk from 'chalk';
import ora from 'ora';
import { table } from 'table';
import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

// Configurar marked para terminal
marked.setOptions({
  renderer: new TerminalRenderer()
});

// Cargar variables de entorno
dotenv.config({ path: join(projectRoot, '.env') });

class AIMethodologyDashboard {
  constructor() {
    this.config = this.loadConfig();
    this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    this.graphqlWithAuth = graphql.defaults({
      headers: { authorization: `token ${process.env.GITHUB_TOKEN}` }
    });
  }

  loadConfig() {
    const configPath = join(__dirname, 'config.json');
    if (!existsSync(configPath)) {
      throw new Error('Config no encontrado. Ejecuta "npm run setup" primero.');
    }
    return JSON.parse(readFileSync(configPath, 'utf8'));
  }

  async generateDashboard() {
    console.log(chalk.blue.bold('📊 AI Methodology - Dashboard de Progreso\n'));

    const spinner = ora('Recopilando datos...').start();

    try {
      // Obtener datos del proyecto
      const projectData = await this.getProjectData();
      const issuesData = await this.getIssuesData();
      const syncState = this.getSyncState();
      
      spinner.succeed('Datos recopilados');

      // Generar secciones del dashboard
      this.printProjectOverview(projectData);
      this.printTasksProgress(issuesData);
      this.printSpecsStatus(syncState);
      this.printRecentActivity(issuesData);
      this.printNextSteps(issuesData);

      // Generar archivo de métricas
      await this.generateMetricsFile(projectData, issuesData, syncState);

    } catch (error) {
      spinner.fail('Error generando dashboard');
      console.error(chalk.red(error.message));
      throw error;
    }
  }

  async getProjectData() {
    const { owner, repo, projectNumber } = this.config.github;
    
    const query = `
      query($owner: String!, $repo: String!, $number: Int!) {
        repository(owner: $owner, name: $repo) {
          projectV2(number: $number) {
            id
            title
            url
            items(first: 100) {
              totalCount
              nodes {
                id
                content {
                  ... on Issue {
                    id
                    title
                    state
                    labels(first: 10) {
                      nodes {
                        name
                      }
                    }
                    createdAt
                    updatedAt
                  }
                }
                fieldValues(first: 10) {
                  nodes {
                    ... on ProjectV2ItemFieldTextValue {
                      text
                      field {
                        ... on ProjectV2Field {
                          name
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      field {
                        ... on ProjectV2SingleSelectField {
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const result = await this.graphqlWithAuth(query, { owner, repo, number: projectNumber });
    return result.repository.projectV2;
  }

  async getIssuesData() {
    const { owner, repo } = this.config.github;
    
    const issues = await this.octokit.rest.issues.listForRepo({
      owner,
      repo,
      labels: 'ai-methodology',
      state: 'all',
      per_page: 100
    });

    return issues.data;
  }

  getSyncState() {
    const statePath = join(projectRoot, '.ai-methodology/context/state.json');
    if (!existsSync(statePath)) {
      return null;
    }
    return JSON.parse(readFileSync(statePath, 'utf8'));
  }

  printProjectOverview(projectData) {
    console.log(chalk.green.bold('🎯 Resumen del Proyecto\n'));
    
    if (!projectData) {
      console.log(chalk.yellow('No se encontró proyecto GitHub. Ejecuta "npm run sync" para crear uno.\n'));
      return;
    }

    const totalItems = projectData.items.totalCount;
    const openItems = projectData.items.nodes.filter(item => 
      item.content && item.content.state === 'open'
    ).length;
    const closedItems = totalItems - openItems;

    const data = [
      ['Métrica', 'Valor'],
      ['Proyecto', projectData.title],
      ['Total de tareas', totalItems],
      ['Tareas abiertas', openItems],
      ['Tareas completadas', closedItems],
      ['Progreso', `${totalItems > 0 ? Math.round((closedItems / totalItems) * 100) : 0}%`],
      ['URL', projectData.url]
    ];

    console.log(table(data));
    console.log();
  }

  printTasksProgress(issuesData) {
    console.log(chalk.green.bold('📋 Progreso de Tareas\n'));

    if (issuesData.length === 0) {
      console.log(chalk.yellow('No hay tareas de AI Methodology encontradas.\n'));
      return;
    }

    // Agrupar por estado
    const byState = issuesData.reduce((acc, issue) => {
      acc[issue.state] = (acc[issue.state] || 0) + 1;
      return acc;
    }, {});

    // Agrupar por labels (specs)
    const bySpec = issuesData.reduce((acc, issue) => {
      const specLabel = issue.labels.find(label => label.name.startsWith('spec:'));
      if (specLabel) {
        const specId = specLabel.name.replace('spec:', '');
        acc[specId] = (acc[specId] || 0) + 1;
      }
      return acc;
    }, {});

    // Tabla de estado
    const stateData = [
      ['Estado', 'Cantidad'],
      ...Object.entries(byState).map(([state, count]) => [
        state === 'open' ? chalk.yellow('Abierto') : chalk.green('Cerrado'),
        count
      ])
    ];

    console.log(chalk.cyan('Por Estado:'));
    console.log(table(stateData));

    // Tabla de specs
    if (Object.keys(bySpec).length > 0) {
      const specData = [
        ['Spec ID', 'Tareas'],
        ...Object.entries(bySpec).map(([spec, count]) => [spec, count])
      ];

      console.log(chalk.cyan('Por Especificación:'));
      console.log(table(specData));
    }

    console.log();
  }

  printSpecsStatus(syncState) {
    console.log(chalk.green.bold('📄 Estado de Especificaciones\n'));

    if (!syncState || !syncState.sync) {
      console.log(chalk.yellow('No hay datos de sincronización disponibles.\n'));
      return;
    }

    const sync = syncState.sync;
    const lastRun = new Date(sync.lastRun).toLocaleString();

    const data = [
      ['Métrica', 'Valor'],
      ['Última sincronización', lastRun],
      ['Specs procesadas', sync.stats?.specsProcessed || 0],
      ['Tareas creadas', sync.stats?.tasksCreated || 0],
      ['Tareas actualizadas', sync.stats?.tasksUpdated || 0],
      ['Errores', sync.stats?.errors?.length || 0]
    ];

    console.log(table(data));
    console.log();
  }

  printRecentActivity(issuesData) {
    console.log(chalk.green.bold('🕒 Actividad Reciente\n'));

    const recentIssues = issuesData
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 5);

    if (recentIssues.length === 0) {
      console.log(chalk.yellow('No hay actividad reciente.\n'));
      return;
    }

    const data = [
      ['Tarea', 'Estado', 'Actualizada'],
      ...recentIssues.map(issue => [
        issue.title.length > 40 ? issue.title.substring(0, 37) + '...' : issue.title,
        issue.state === 'open' ? chalk.yellow('Abierto') : chalk.green('Cerrado'),
        new Date(issue.updated_at).toLocaleDateString()
      ])
    ];

    console.log(table(data));
    console.log();
  }

  printNextSteps(issuesData) {
    console.log(chalk.green.bold('🎯 Próximos Pasos Recomendados\n'));

    const openIssues = issuesData.filter(issue => issue.state === 'open');
    const recommendations = [];

    if (openIssues.length === 0) {
      recommendations.push('🎉 ¡Todas las tareas están completadas! Considera agregar nuevas especificaciones.');
    } else {
      recommendations.push(`📝 Hay ${openIssues.length} tareas abiertas pendientes`);
      
      // Buscar tareas sin asignar
      const unassigned = openIssues.filter(issue => !issue.assignee);
      if (unassigned.length > 0) {
        recommendations.push(`👤 ${unassigned.length} tareas sin asignar`);
      }

      // Buscar tareas antiguas
      const oldIssues = openIssues.filter(issue => {
        const daysSinceUpdate = (Date.now() - new Date(issue.updated_at)) / (1000 * 60 * 60 * 24);
        return daysSinceUpdate > 7;
      });
      
      if (oldIssues.length > 0) {
        recommendations.push(`⏰ ${oldIssues.length} tareas sin actividad por más de 7 días`);
      }
    }

    recommendations.forEach(rec => {
      console.log(chalk.cyan(`  • ${rec}`));
    });

    console.log();
    console.log(chalk.blue('💡 Comandos útiles:'));
    console.log(chalk.white('  npm run sync          - Sincronizar nuevas specs'));
    console.log(chalk.white('  npm run mcp:test      - Probar conexión MCP'));
    console.log(chalk.white('  npm run dashboard     - Actualizar este dashboard'));
    console.log();
  }

  async generateMetricsFile(projectData, issuesData, syncState) {
    const metricsPath = join(projectRoot, 'docs/metrics.md');
    
    const metrics = {
      generatedAt: new Date().toISOString(),
      project: {
        name: projectData?.title || 'N/A',
        url: projectData?.url || 'N/A',
        totalTasks: projectData?.items.totalCount || 0,
        openTasks: issuesData.filter(i => i.state === 'open').length,
        closedTasks: issuesData.filter(i => i.state === 'closed').length
      },
      sync: syncState?.sync || null,
      issues: issuesData.map(issue => ({
        title: issue.title,
        state: issue.state,
        labels: issue.labels.map(l => l.name),
        createdAt: issue.created_at,
        updatedAt: issue.updated_at
      }))
    };

    const markdownContent = `# AI Methodology - Métricas del Proyecto

*Generado automáticamente el ${new Date().toLocaleString()}*

## Resumen Ejecutivo

- **Total de tareas**: ${metrics.project.totalTasks}
- **Tareas abiertas**: ${metrics.project.openTasks}
- **Tareas completadas**: ${metrics.project.closedTasks}
- **Progreso**: ${metrics.project.totalTasks > 0 ? Math.round((metrics.project.closedTasks / metrics.project.totalTasks) * 100) : 0}%

## Enlaces

- [Proyecto GitHub](${metrics.project.url})
- [Repositorio](https://github.com/${this.config.github.owner}/${this.config.github.repo})

## Datos Detallados

\`\`\`json
${JSON.stringify(metrics, null, 2)}
\`\`\`

---
*Dashboard generado por AI Methodology Sync*
`;

    try {
      const fs = await import('fs');
      fs.writeFileSync(metricsPath, markdownContent);
      console.log(chalk.green(`📄 Métricas guardadas en ${metricsPath}`));
    } catch (error) {
      console.log(chalk.yellow(`⚠️  No se pudieron guardar las métricas: ${error.message}`));
    }
  }
}

// CLI
async function main() {
  try {
    const dashboard = new AIMethodologyDashboard();
    await dashboard.generateDashboard();
    
  } catch (error) {
    console.error(chalk.red.bold('\n❌ Error generando dashboard:'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { AIMethodologyDashboard };
