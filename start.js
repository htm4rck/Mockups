#!/usr/bin/env node
// Railway start script — standalone mode
// Next.js standalone server reads PORT and HOSTNAME from environment automatically.

const { execSync } = require('child_process');

const port = process.env.PORT || 3000;
const projectRoot = process.env.PROJECT_ROOT || process.cwd();

console.log(`Starting Next.js standalone on port ${port}, PROJECT_ROOT=${projectRoot}`);

process.env.PROJECT_ROOT = projectRoot;
process.env.PORT = String(port);
process.env.HOSTNAME = '0.0.0.0';

execSync('node .next/standalone/server.js', { stdio: 'inherit' });
