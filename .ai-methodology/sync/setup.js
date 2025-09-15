#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

console.log(chalk.blue.bold('🚀 AI Methodology - Setup de Sincronización\n'));

async function main() {
  const spinner = ora('Verificando configuración...').start();
  
  try {
    // Verificar si existe .env
    const envPath = join(projectRoot, '.env');
    if (!existsSync(envPath)) {
      spinner.fail('Archivo .env no encontrado');
      console.log(chalk.yellow('Por favor copia .env.example a .env y configura las variables necesarias.'));
      process.exit(1);
    }

    // Cargar variables de entorno
    const envContent = readFileSync(envPath, 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });

    spinner.succeed('Configuración cargada');

    // Verificar variables requeridas
    const requiredVars = ['GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO'];
    const missingVars = requiredVars.filter(v => !envVars[v] || envVars[v].includes('your_'));
    
    if (missingVars.length > 0) {
      console.log(chalk.red(`\n❌ Variables faltantes en .env: ${missingVars.join(', ')}`));
      
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'configure',
          message: '¿Quieres configurar estas variables ahora?',
          default: true
        }
      ]);

      if (answers.configure) {
        await configureEnvironment(envVars, missingVars);
      } else {
        console.log(chalk.yellow('Configura las variables en .env y ejecuta el setup nuevamente.'));
        process.exit(1);
      }
    }

    // Instalar dependencias
    const installSpinner = ora('Instalando dependencias...').start();
    try {
      execSync('npm install', { cwd: __dirname, stdio: 'pipe' });
      installSpinner.succeed('Dependencias instaladas');
    } catch (error) {
      installSpinner.fail('Error instalando dependencias');
      console.error(error.message);
      process.exit(1);
    }

    // Configurar MCP si está habilitado
    if (envVars.MCP_GITHUB_PROJECT_MANAGER || envVars.MCP_TASK_MASTER) {
      const mcpSpinner = ora('Configurando MCP servers...').start();
      try {
        await setupMCPServers(envVars);
        mcpSpinner.succeed('MCP servers configurados');
      } catch (error) {
        mcpSpinner.warn('MCP setup opcional falló: ' + error.message);
      }
    }

    // Crear configuración inicial
    await createInitialConfig(envVars);

    console.log(chalk.green.bold('\n✅ Setup completado exitosamente!\n'));
    console.log(chalk.cyan('Comandos disponibles:'));
    console.log(chalk.white('  npm run sync          - Sincronizar specs con GitHub Projects'));
    console.log(chalk.white('  npm run dashboard     - Ver dashboard de progreso'));
    console.log(chalk.white('  npm run mcp:test      - Probar conexión MCP'));
    console.log(chalk.white('  npm run dev           - Modo desarrollo con watch'));

  } catch (error) {
    spinner.fail('Error en setup');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

async function configureEnvironment(envVars, missingVars) {
  const questions = [];
  
  if (missingVars.includes('GITHUB_TOKEN')) {
    questions.push({
      type: 'password',
      name: 'GITHUB_TOKEN',
      message: 'GitHub Personal Access Token:',
      mask: '*'
    });
  }
  
  if (missingVars.includes('GITHUB_OWNER')) {
    questions.push({
      type: 'input',
      name: 'GITHUB_OWNER',
      message: 'GitHub Owner (username o organización):'
    });
  }
  
  if (missingVars.includes('GITHUB_REPO')) {
    questions.push({
      type: 'input',
      name: 'GITHUB_REPO',
      message: 'GitHub Repository name:'
    });
  }

  const answers = await inquirer.prompt(questions);
  
  // Actualizar .env
  let envContent = readFileSync(join(projectRoot, '.env'), 'utf8');
  Object.entries(answers).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (envContent.match(regex)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  });
  
  writeFileSync(join(projectRoot, '.env'), envContent);
  console.log(chalk.green('✅ Variables actualizadas en .env'));
}

async function setupMCPServers(envVars) {
  // Crear configuración MCP para diferentes editores
  const mcpConfigs = {
    cursor: {
      path: join(projectRoot, '.cursor/mcp.json'),
      format: 'mcpServers'
    },
    vscode: {
      path: join(projectRoot, '.vscode/mcp.json'),
      format: 'servers'
    }
  };

  const serverConfig = {
    "mcp-github-project-manager": {
      "command": "npx",
      "args": ["-y", "mcp-github-project-manager"],
      "env": {
        "GITHUB_TOKEN": envVars.GITHUB_TOKEN,
        "GITHUB_OWNER": envVars.GITHUB_OWNER,
        "GITHUB_REPO": envVars.GITHUB_REPO,
        "ANTHROPIC_API_KEY": envVars.ANTHROPIC_API_KEY || "",
        "OPENAI_API_KEY": envVars.OPENAI_API_KEY || "",
        "GOOGLE_API_KEY": envVars.GOOGLE_API_KEY || "",
        "PERPLEXITY_API_KEY": envVars.PERPLEXITY_API_KEY || ""
      }
    },
    "task-master-ai": {
      "command": "npx",
      "args": ["-y", "--package=task-master-ai", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": envVars.ANTHROPIC_API_KEY || "",
        "OPENAI_API_KEY": envVars.OPENAI_API_KEY || "",
        "GOOGLE_API_KEY": envVars.GOOGLE_API_KEY || "",
        "PERPLEXITY_API_KEY": envVars.PERPLEXITY_API_KEY || ""
      }
    }
  };

  // Crear configuraciones para diferentes editores
  Object.entries(mcpConfigs).forEach(([editor, config]) => {
    const configData = {
      [config.format]: serverConfig
    };
    
    try {
      writeFileSync(config.path, JSON.stringify(configData, null, 2));
      console.log(chalk.green(`✅ MCP config creado para ${editor}`));
    } catch (error) {
      console.log(chalk.yellow(`⚠️  No se pudo crear config para ${editor}: ${error.message}`));
    }
  });
}

async function createInitialConfig(envVars) {
  const configPath = join(__dirname, 'config.json');
  const config = {
    github: {
      owner: envVars.GITHUB_OWNER,
      repo: envVars.GITHUB_REPO,
      projectNumber: parseInt(envVars.GITHUB_PROJECT_NUMBER) || 1
    },
    ai: {
      mainModel: envVars.AI_MAIN_MODEL || 'claude-3-5-sonnet-20241022',
      researchModel: envVars.AI_RESEARCH_MODEL || 'perplexity-llama-3.1-sonar-large-128k-online',
      fallbackModel: envVars.AI_FALLBACK_MODEL || 'gpt-4o'
    },
    methodology: {
      enhancedTaskGeneration: envVars.ENHANCED_TASK_GENERATION === 'true',
      autoCreateTraceability: envVars.AUTO_CREATE_TRACEABILITY === 'true',
      autoGenerateUseCases: envVars.AUTO_GENERATE_USE_CASES === 'true',
      visualTrackingEnabled: envVars.VISUAL_TRACKING_ENABLED === 'true'
    },
    mcp: {
      githubProjectManager: envVars.MCP_GITHUB_PROJECT_MANAGER || 'mcp-github-project-manager',
      taskMaster: envVars.MCP_TASK_MASTER || 'task-master-ai',
      specKitEnabled: envVars.MCP_SPEC_KIT_ENABLED === 'true'
    },
    lastSetup: new Date().toISOString()
  };

  writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(chalk.green('✅ Configuración inicial creada'));
}

main().catch(console.error);
