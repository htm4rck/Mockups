'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  FileCode2,
  FileText,
  Folder,
  FolderOpen,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

function FileIcon({ name, active }: { name: string; active: boolean }) {
  const isMd = name.endsWith('.md');
  const cls = `shrink-0 ${active ? 'text-blue-500' : 'text-slate-400'}`;
  return isMd
    ? <FileText size={14} className={cls} />
    : <FileCode2 size={14} className={cls} />;
}

function TreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  const isActive = node.path !== '' && pathname === node.path;
  const pl = 8 + depth * 12;

  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-1.5 rounded-lg py-1.5 pr-2 text-left text-sm font-semibold text-slate-600 hover:bg-slate-100"
          style={{ paddingLeft: `${pl}px` }}
        >
          {open
            ? <FolderOpen size={15} className="shrink-0 text-amber-500" />
            : <Folder size={15} className="shrink-0 text-amber-500" />}
          <span className="truncate">{node.name}</span>
          {open
            ? <ChevronDown size={13} className="ml-auto shrink-0 text-slate-400" />
            : <ChevronRight size={13} className="ml-auto shrink-0 text-slate-400" />}
        </button>
        {open && node.children && (
          <div>
            {node.children.map((child) => (
              <TreeNode key={child.path + child.name} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={node.path}
      className={`flex items-center gap-1.5 rounded-lg py-1.5 pr-2 text-sm transition-colors ${
        isActive
          ? 'bg-blue-50 font-semibold text-blue-700'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
      style={{ paddingLeft: `${pl}px` }}
    >
      <FileIcon name={node.name} active={isActive} />
      <span className="truncate">{node.name}</span>
    </Link>
  );
}

export default function Sidebar({ tree }: { tree: FileNode[] }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col border-r border-slate-200 bg-white transition-all duration-200 ${
        collapsed ? 'w-12' : 'w-60'
      }`}
      style={{ minHeight: '100vh', position: 'sticky', top: 0, alignSelf: 'flex-start', height: '100vh' }}
    >
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 px-3">
        {!collapsed && (
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Mockups
          </span>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="ml-auto rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
          title={collapsed ? 'Expandir panel' : 'Colapsar panel'}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Tree */}
      {!collapsed && (
        <nav className="flex-1 overflow-y-auto p-2">
          {tree.map((node) => (
            <TreeNode key={node.path + node.name} node={node} />
          ))}
        </nav>
      )}
    </aside>
  );
}
