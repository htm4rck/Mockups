import fs from 'fs';
import path from 'path';
import Sidebar, { FileNode } from './Sidebar';

// In standalone output, process.cwd() points to .next/standalone.
// PROJECT_ROOT can be set in Railway to the actual project root.
// During build and dev, process.cwd() is the project root.
const PROJECT_ROOT = process.env.PROJECT_ROOT ?? process.cwd();

const EXCLUDED_NAMES = new Set([
  'api',
  'components',
  'docs',
  'node_modules',
  '.git',
  '.next',
  '.vscode',
  'public',
  'favicon.ico',
  'globals.css',
  'layout.tsx',
  'next.config.ts',
  'postcss.config.mjs',
  'eslint.config.mjs',
  'tsconfig.json',
  'package.json',
  'package-lock.json',
  'next-env.d.ts',
]);

const ROOT_MD_FILES = ['README.md', 'AGENTS.md', 'CLAUDE.md'];

function buildTree(dir: string, urlBase: string): FileNode[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const nodes: FileNode[] = [];

  for (const entry of entries) {
    if (EXCLUDED_NAMES.has(entry.name)) continue;
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;

    const fullPath = path.join(dir, entry.name);
    const urlPath = `${urlBase}/${entry.name}`;

    if (entry.isDirectory()) {
      const hasPage =
        fs.existsSync(path.join(fullPath, 'page.tsx')) ||
        fs.existsSync(path.join(fullPath, 'page.ts'));
      const children = buildTree(fullPath, urlPath);

      if (hasPage && children.length === 0) {
        nodes.push({ name: entry.name, path: urlPath, type: 'file' });
      } else if (hasPage) {
        nodes.push({
          name: entry.name,
          path: urlPath,
          type: 'folder',
          children: [
            { name: 'index', path: urlPath, type: 'file' },
            ...children,
          ],
        });
      } else if (children.length > 0) {
        nodes.push({ name: entry.name, path: urlPath, type: 'folder', children });
      }
    } else if (entry.name.endsWith('.md')) {
      const segments = fullPath.replace(PROJECT_ROOT + path.sep, '').split(path.sep);
      const docUrl = '/docs/' + segments.map(encodeURIComponent).join('/');
      nodes.push({ name: entry.name, path: docUrl, type: 'file' });
    }
  }

  return nodes;
}

function buildRootMdNodes(): FileNode[] {
  return ROOT_MD_FILES
    .filter((f) => fs.existsSync(path.join(PROJECT_ROOT, f)))
    .map((f) => ({
      name: f,
      path: `/docs/${encodeURIComponent(f)}`,
      type: 'file' as const,
    }));
}

export default function SidebarServer() {
  const appDir = path.join(PROJECT_ROOT, 'app');
  const appTree = buildTree(appDir, '');
  const mdNodes = buildRootMdNodes();

  const tree: FileNode[] = [
    ...appTree,
  ];

  return <Sidebar tree={tree} />;
}