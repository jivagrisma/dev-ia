// Configuración para aplicar metodología a proyecto existente
// Archivo: .ai-methodology/sync/setup.js

const projectConfig = {
  // Configuración específica del proyecto
  github: {
    owner: 'TU_USUARIO_GITHUB',           // Cambiar por tu usuario
    repo: 'TU_PROYECTO_EXISTENTE',        // Cambiar por tu repo
    projectId: 'TU_PROJECT_ID',           // ID del GitHub Project
    token: process.env.GITHUB_TOKEN       // Token desde .env
  },
  
  // Estructura del proyecto existente
  project: {
    name: 'Tu Proyecto Existente',
    description: 'Descripción de tu proyecto',
    techStack: ['Node.js', 'React', 'PostgreSQL'], // Tu stack actual
    
    // Directorios existentes que NO deben modificarse
    preserveDirectories: [
      'src/',
      'public/',
      'components/',
      'pages/',
      'api/',
      'database/',
      'migrations/',
      'uploads/',
      'dist/',
      'build/'
    ],
    
    // Archivos existentes que NO deben modificarse
    preserveFiles: [
      'package.json',           // Se extenderá, no se sobrescribirá
      'package-lock.json',
      'yarn.lock',
      'tsconfig.json',
      'next.config.js',
      'webpack.config.js',
      'docker-compose.yml',
      'Dockerfile',
      '.env.local',
      '.env.production'
    ]
  },
  
  // Configuración de integración
  integration: {
    // Extender package.json existente
    extendPackageJson: true,
    
    // Scripts a agregar (sin sobrescribir existentes)
    additionalScripts: {
      'ai:sync': 'cd .ai-methodology/sync && npm run sync',
      'ai:dashboard': 'cd .ai-methodology/sync && npm run dashboard',
      'ai:setup': 'bash ./.ai-methodology/ai-setup.sh'
    },
    
    // Dependencias de metodología (solo si no existen)
    methodologyDependencies: {
      devDependencies: {
        'jest': '^29.0.0',
        'supertest': '^6.0.0',
        'eslint': '^8.0.0',
        'prettier': '^2.0.0'
      }
    }
  },
  
  // Configuración de specs
  specs: {
    // Directorio donde crear nuevas specs
    directory: 'specs/',
    
    // Prefijo para specs del proyecto
    prefix: 'PROJ',
    
    // Template base para specs del proyecto
    template: {
      id: '${prefix}-${number}',
      title: '${title}',
      description: '${description}',
      objectives: [],
      tasks: [],
      acceptance_criteria: []
    }
  }
};

// Función para aplicar configuración sin conflictos
function applyMethodologyToExistingProject() {
  console.log('🔄 Aplicando metodología AI a proyecto existente...');
  
  // 1. Verificar que no hay conflictos
  const conflicts = checkForConflicts();
  if (conflicts.length > 0) {
    console.warn('⚠️ Conflictos detectados:', conflicts);
    return false;
  }
  
  // 2. Crear estructura de metodología
  createMethodologyStructure();
  
  // 3. Configurar integración
  setupIntegration();
  
  // 4. Configurar MCP
  setupMCPIntegration();
  
  console.log('✅ Metodología aplicada exitosamente');
  return true;
}

function checkForConflicts() {
  const conflicts = [];
  const fs = require('fs');
  
  // Verificar archivos que podrían causar conflictos
  const potentialConflicts = [
    '.ai-methodology/',
    'specs/',
    'docs/metrics.md',
    '.vscode/mcp.json'
  ];
  
  potentialConflicts.forEach(path => {
    if (fs.existsSync(path)) {
      conflicts.push(path);
    }
  });
  
  return conflicts;
}

function createMethodologyStructure() {
  const fs = require('fs');
  const path = require('path');
  
  // Crear directorios necesarios
  const directories = [
    '.ai-methodology',
    '.ai-methodology/sync',
    '.ai-methodology/prompts',
    '.ai-methodology/config',
    '.ai-methodology/mappings',
    'specs',
    'docs',
    'ejemplos-pruebas'
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Creado directorio: ${dir}`);
    }
  });
}

function setupIntegration() {
  const fs = require('fs');
  
  // Extender package.json existente
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Agregar scripts sin sobrescribir
    packageJson.scripts = {
      ...packageJson.scripts,
      ...projectConfig.integration.additionalScripts
    };
    
    // Agregar dependencias solo si no existen
    const devDeps = projectConfig.integration.methodologyDependencies.devDependencies;
    packageJson.devDependencies = packageJson.devDependencies || {};
    
    Object.keys(devDeps).forEach(dep => {
      if (!packageJson.devDependencies[dep]) {
        packageJson.devDependencies[dep] = devDeps[dep];
      }
    });
    
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('📦 package.json extendido con scripts de metodología');
  }
}

function setupMCPIntegration() {
  const fs = require('fs');
  
  // Crear configuración MCP
  const mcpConfig = {
    mcpServers: {
      "github-project-manager": {
        command: "npx",
        args: ["mcp-github-project-manager"],
        env: {
          GITHUB_TOKEN: process.env.GITHUB_TOKEN,
          GITHUB_OWNER: projectConfig.github.owner,
          GITHUB_REPO: projectConfig.github.repo
        }
      },
      "task-master-ai": {
        command: "npx", 
        args: ["claude-task-master"],
        env: {}
      }
    }
  };
  
  // Crear directorio .vscode si no existe
  if (!fs.existsSync('.vscode')) {
    fs.mkdirSync('.vscode');
  }
  
  fs.writeFileSync('.vscode/mcp.json', JSON.stringify(mcpConfig, null, 2));
  console.log('🤖 Configuración MCP creada');
}

module.exports = {
  projectConfig,
  applyMethodologyToExistingProject
};
