#!/usr/bin/env node
// Railway start script — reads $PORT and $PROJECT_ROOT from environment
const { execSync } = require('child_process');

const port = process.env.PORT || 3000;
const projectRoot = process.env.PROJECT_ROOT || process.cwd();

console.log(`Starting Next.js on port ${port}, PROJECT_ROOT=${projectRoot}`);

process.env.PROJECT_ROOT = projectRoot;

execSync(`npx next start -p ${port}`, { stdio: 'inherit' });
