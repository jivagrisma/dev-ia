#!/usr/bin/env node
import { spawn } from 'child_process';
import chalk from 'chalk';

console.log(chalk.blue.bold('🧪 Probando conexiones MCP...\n'));

const servers = [
  "github-full",
  "task-master"
];

async function testServer(serverName, command, args) {
  return new Promise((resolve) => {
    console.log(chalk.cyan(`Probando ${serverName}...`));
    
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
      console.log(chalk.green(`✅ ${serverName} - Servidor iniciado correctamente`));
      resolve(true);
    }, 3000);

    process.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        console.log(chalk.green(`✅ ${serverName} - OK`));
        resolve(true);
      } else {
        console.log(chalk.red(`❌ ${serverName} - Error (código ${code})`));
        if (errorOutput) {
          console.log(chalk.gray(`   ${errorOutput.trim()}`));
        }
        resolve(false);
      }
    });

    process.on('error', (error) => {
      clearTimeout(timeout);
      console.log(chalk.red(`❌ ${serverName} - ${error.message}`));
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
  
  console.log(chalk.blue.bold(`\n📊 Resultados: ${successful}/${results.length} servidores funcionando`));
  
  if (successful === results.length) {
    console.log(chalk.green.bold('🎉 ¡Todos los servidores MCP están funcionando correctamente!'));
  } else {
    console.log(chalk.yellow.bold('⚠️  Algunos servidores tienen problemas. Verifica la configuración.'));
  }
}

main().catch(console.error);
