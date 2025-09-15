#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

// Cargar variables de entorno
dotenv.config({ path: join(projectRoot, '.env') });

class MCPSetup {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    const configPath = join(__dirname, 'config.json');
    if (!existsSync(configPath)) {
      throw new Error('Config no encontrado. Ejecuta "npm run setup" primero.');
    }
    return JSON.parse(readFileSync(configPath, 'utf8'));
  }

  async setupMCPServers() {
    console.log(chalk.blue.bold('🔧 AI Methodology - Configuración MCP\n'));

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'editors',
        message: '¿Para qué editores quieres configurar MCP?',
        choices: [
          { name: 'Cursor', value: 'cursor' },
          { name: 'VS Code', value: 'vscode' },
          { name: 'Windsurf', value: 'windsurf' }
        ],
        default: ['cursor']
      },
      {
        type: 'checkbox',
        name: 'servers',
        message: '¿Qué servidores MCP quieres instalar?',
        choices: [
          { name: 'GitHub Project Manager (kunwarVivek) - Completo con IA', value: 'github-full' },
          { name: 'Task Master AI - Gestión de tareas con IA', value: 'task-master' },
          { name: 'GitHub Project Manager (monsoft) - Básico', value: 'github-basic' }
        ],
        default: ['github-full', 'task-master']
      },
      {
        type: 'confirm',
        name: 'installGlobally',
        message: '¿Instalar paquetes MCP globalmente?',
        default: true
      }
    ]);

    // Instalar paquetes si es necesario
    if (answers.installGlobally) {
      await this.installMCPPackages(answers.servers);
    }

    // Configurar editores
    for (const editor of answers.editors) {
      await this.configureEditor(editor, answers.servers);
    }

    // Crear script de prueba
    await this.createTestScript(answers.servers);

    console.log(chalk.green.bold('\n✅ Configuración MCP completada!\n'));
    console.log(chalk.cyan('Próximos pasos:'));
    console.log(chalk.white('1. Reinicia tu editor para cargar la configuración MCP'));
    console.log(chalk.white('2. Ejecuta "npm run mcp:test" para probar la conexión'));
    console.log(chalk.white('3. En tu editor, verifica que los servidores MCP estén activos'));
  }

  async installMCPPackages(servers) {
    const spinner = ora('Instalando paquetes MCP...').start();
    
    try {
      const packages = [];
      
      if (servers.includes('github-full')) {
        packages.push('mcp-github-project-manager');
      }
      
      if (servers.includes('task-master')) {
        packages.push('task-master-ai');
      }
      
      if (servers.includes('github-basic')) {
        packages.push('@monsoft/mcp-github-project-manager');
      }

      if (packages.length > 0) {
        const installCmd = `npm install -g ${packages.join(' ')}`;
        execSync(installCmd, { stdio: 'pipe' });
        spinner.succeed(`Paquetes instalados: ${packages.join(', ')}`);
      } else {
        spinner.succeed('No hay paquetes para instalar');
      }

    } catch (error) {
      spinner.fail('Error instalando paquetes MCP');
      console.log(chalk.yellow('Puedes instalar manualmente con:'));
      console.log(chalk.white('npm install -g mcp-github-project-manager task-master-ai'));
    }
  }

  async configureEditor(editor, servers) {
    const configs = {
      cursor: {
        path: join(projectRoot, '.cursor'),
        file: 'mcp.json',
        format: 'mcpServers'
      },
      vscode: {
        path: join(projectRoot, '.vscode'),
        file: 'mcp.json',
        format: 'servers'
      },
      windsurf: {
        path: join(process.env.HOME || process.env.USERPROFILE, '.codeium/windsurf'),
        file: 'mcp_config.json',
        format: 'mcpServers'
      }
    };

    const config = configs[editor];
    if (!config) return;

    // Crear directorio si no existe
    if (!existsSync(config.path)) {
      mkdirSync(config.path, { recursive: true });
    }

    const configPath = join(config.path, config.file);
    const serverConfig = this.generateServerConfig(servers);
    
    const mcpConfig = {
      [config.format]: serverConfig
    };

    // Para VS Code, agregar type
    if (editor === 'vscode') {
      Object.keys(mcpConfig.servers).forEach(key => {
        mcpConfig.servers[key].type = 'stdio';
      });
    }

    try {
      writeFileSync(configPath, JSON.stringify(mcpConfig, null, 2));
      console.log(chalk.green(`✅ Configuración creada para ${editor}: ${configPath}`));
    } catch (error) {
      console.log(chalk.red(`❌ Error configurando ${editor}: ${error.message}`));
    }
  }

  generateServerConfig(servers) {
    const config = {};
    const env = this.getEnvironmentVariables();

    if (servers.includes('github-full')) {
      config['mcp-github-project-manager'] = {
        command: 'npx',
        args: ['-y', 'mcp-github-project-manager'],
        env
      };
    }

    if (servers.includes('task-master')) {
      config['task-master-ai'] = {
        command: 'npx',
        args: ['-y', '--package=task-master-ai', 'task-master-ai'],
        env: {
          ANTHROPIC_API_KEY: env.ANTHROPIC_API_KEY || '',
          OPENAI_API_KEY: env.OPENAI_API_KEY || '',
          GOOGLE_API_KEY: env.GOOGLE_API_KEY || '',
          PERPLEXITY_API_KEY: env.PERPLEXITY_API_KEY || ''
        }
      };
    }

    if (servers.includes('github-basic')) {
      config['github-project-manager-basic'] = {
        command: 'npx',
        args: ['-y', '@monsoft/mcp-github-project-manager'],
        env: {
          GITHUB_TOKEN: env.GITHUB_TOKEN,
          GITHUB_OWNER: env.GITHUB_OWNER,
          GITHUB_REPO: env.GITHUB_REPO
        }
      };
    }

    return config;
  }

  getEnvironmentVariables() {
    return {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
      GITHUB_OWNER: process.env.GITHUB_OWNER || '',
      GITHUB_REPO: process.env.GITHUB_REPO || '',
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
      PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY || '',
      XAI_API_KEY: process.env.XAI_API_KEY || '',
      GROQ_API_KEY: process.env.GROQ_API_KEY || '',
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || ''
    };
  }

  async createTestScript(servers) {
    const testScript = `#!/usr/bin/env node
import { spawn } from 'child_process';
import chalk from 'chalk';

console.log(chalk.blue.bold('🧪 Probando conexiones MCP...\\n'));

const servers = ${JSON.stringify(servers, null, 2)};

async function testServer(serverName, command, args) {
  return new Promise((resolve) => {
    console.log(chalk.cyan(\`Probando \${serverName}...\`));
    
    const process = spawn(command, args, {
      env: { ...process.env },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    const timeout = setTimeout(() => {
      process.kill();
      console.log(chalk.green(\`✅ \${serverName} - Servidor iniciado correctamente\`));
      resolve(true);
    }, 3000);

    process.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        console.log(chalk.green(\`✅ \${serverName} - OK\`));
        resolve(true);
      } else {
        console.log(chalk.red(\`❌ \${serverName} - Error (código \${code})\`));
        if (errorOutput) {
          console.log(chalk.gray(\`   \${errorOutput.trim()}\`));
        }
        resolve(false);
      }
    });

    process.on('error', (error) => {
      clearTimeout(timeout);
      console.log(chalk.red(\`❌ \${serverName} - \${error.message}\`));
      resolve(false);
    });
  });
}

async function main() {
  const tests = [];
  
  if (servers.includes('github-full')) {
    tests.push(testServer('GitHub Project Manager (Full)', 'npx', ['-y', 'mcp-github-project-manager']));
  }
  
  if (servers.includes('task-master')) {
    tests.push(testServer('Task Master AI', 'npx', ['-y', '--package=task-master-ai', 'task-master-ai']));
  }
  
  if (servers.includes('github-basic')) {
    tests.push(testServer('GitHub Project Manager (Basic)', 'npx', ['-y', '@monsoft/mcp-github-project-manager']));
  }

  const results = await Promise.all(tests);
  const successful = results.filter(r => r).length;
  
  console.log(chalk.blue.bold(\`\\n📊 Resultados: \${successful}/\${results.length} servidores funcionando\`));
  
  if (successful === results.length) {
    console.log(chalk.green.bold('🎉 ¡Todos los servidores MCP están funcionando correctamente!'));
  } else {
    console.log(chalk.yellow.bold('⚠️  Algunos servidores tienen problemas. Verifica la configuración.'));
  }
}

main().catch(console.error);
`;

    const testPath = join(__dirname, 'mcp-test.js');
    writeFileSync(testPath, testScript);
    console.log(chalk.green(`✅ Script de prueba creado: ${testPath}`));
  }
}

// CLI
async function main() {
  try {
    const setup = new MCPSetup();
    await setup.setupMCPServers();
    
  } catch (error) {
    console.error(chalk.red.bold('\n❌ Error en configuración MCP:'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { MCPSetup };
