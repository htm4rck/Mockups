import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Folders and files to exclude from the sidebar tree
const EXCLUDED = new Set([
  'api',
  'favicon.ico',
  'globals.css',
  'layout.tsx',
  'page.tsx', // root page (redirect)
]);

export interface FileNode {
  name: string;
  path: string;   // URL path, e.g. /aplicacion1/mockup_orden_de_venta
  type: 'file' | 'folder';
  children?: FileNode[];
}

function buildTree(dir: string, urlBase: string): FileNode[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const nodes: FileNode[] = [];

  for (const entry of entries) {
    if (EXCLUDED.has(entry.name)) continue;
    // Skip hidden / system folders
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;

    const fullPath = path.join(dir, entry.name);
    const urlPath = `${urlBase}/${entry.name}`;

    if (entry.isDirectory()) {
      const children = buildTree(fullPath, urlPath);
      // Only include folders that have navigable content
      if (children.length > 0) {
        nodes.push({ name: entry.name, path: urlPath, type: 'folder', children });
      }
    } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
      // Represent the page as a file node using the parent folder's URL
      nodes.push({ name: entry.name, path: urlBase, type: 'file' });
    }
  }

  return nodes;
}

export async function GET() {
  const appDir = path.join(process.cwd(), 'app');
  const tree = buildTree(appDir, '');
  return NextResponse.json(tree);
}
