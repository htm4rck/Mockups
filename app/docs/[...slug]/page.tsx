import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import MarkdownViewer from '../../components/MarkdownViewer';

const PROJECT_ROOT = process.env.PROJECT_ROOT ?? process.cwd();

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;

  const decodedSlug = slug.map(decodeURIComponent);
  const filePath = path.join(PROJECT_ROOT, ...decodedSlug);

  // Security: path must stay within project root
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(PROJECT_ROOT))) {
    notFound();
  }

  if (!resolved.endsWith('.md')) {
    notFound();
  }

  let content: string;
  try {
    content = fs.readFileSync(resolved, 'utf-8');
  } catch {
    notFound();
  }

  const fileName = path.basename(resolved);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">
        {decodedSlug.slice(0, -1).map((segment, i) => (
          <span key={i} className="flex items-center gap-2">
            <span>{segment}</span>
            <span>/</span>
          </span>
        ))}
        <span className="font-semibold text-slate-700">{fileName}</span>
      </div>
      <MarkdownViewer content={content} />
    </div>
  );
}
