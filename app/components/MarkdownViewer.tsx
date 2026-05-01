'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import { useEffect, useRef } from 'react';
import type { Components } from 'react-markdown';

// Mermaid diagram block
function MermaidBlock({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        fontFamily: 'inherit',
      });
      if (!ref.current || cancelled) return;
      const id = `mermaid-${Math.random().toString(36).slice(2)}`;
      try {
        const { svg } = await mermaid.render(id, code);
        if (ref.current && !cancelled) {
          ref.current.innerHTML = svg;
        }
      } catch (err) {
        if (ref.current && !cancelled) {
          ref.current.innerHTML = `<pre class="text-red-500 text-xs p-3">${String(err)}</pre>`;
        }
      }
    }
    render();
    return () => { cancelled = true; };
  }, [code]);

  return (
    <div
      ref={ref}
      className="my-4 flex justify-center overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4"
    />
  );
}

// Custom code block: detect mermaid vs regular code
function CodeBlock({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
  const lang = /language-(\w+)/.exec(className ?? '')?.[1];
  const code = String(children).replace(/\n$/, '');

  if (lang === 'mermaid') {
    return <MermaidBlock code={code} />;
  }

  return (
    <code
      className={`${className ?? ''} rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-slate-800`}
      {...props}
    >
      {children}
    </code>
  );
}

const components: Components = {
  // Headings
  h1: ({ children }) => (
    <h1 className="mb-4 mt-8 border-b border-slate-200 pb-3 text-3xl font-bold text-slate-950 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-8 border-b border-slate-100 pb-2 text-2xl font-bold text-slate-900">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-6 text-xl font-semibold text-slate-900">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-2 mt-4 text-lg font-semibold text-slate-800">{children}</h4>
  ),

  // Paragraph
  p: ({ children }) => (
    <p className="mb-4 leading-7 text-slate-700">{children}</p>
  ),

  // Links
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),

  // Lists
  ul: ({ children }) => (
    <ul className="mb-4 ml-6 list-disc space-y-1 text-slate-700">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1 text-slate-700">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-blue-300 bg-blue-50 py-2 pl-4 pr-3 text-slate-700 italic">
      {children}
    </blockquote>
  ),

  // Tables (GFM)
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
      {children}
    </thead>
  ),
  tbody: ({ children }) => <tbody className="divide-y divide-slate-100">{children}</tbody>,
  tr: ({ children }) => <tr className="hover:bg-slate-50">{children}</tr>,
  th: ({ children }) => <th className="px-4 py-3">{children}</th>,
  td: ({ children }) => <td className="px-4 py-3 text-slate-700">{children}</td>,

  // Horizontal rule
  hr: () => <hr className="my-6 border-slate-200" />,

  // Inline code & fenced code blocks
  code: CodeBlock,

  // Fenced code block wrapper
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100">
      {children}
    </pre>
  ),

  // Images
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ''}
      className="my-4 max-w-full rounded-xl border border-slate-200"
    />
  ),

  // Strikethrough (GFM)
  del: ({ children }) => <del className="text-slate-400">{children}</del>,

  // Task list checkboxes (GFM)
  input: ({ type, checked }) =>
    type === 'checkbox' ? (
      <input
        type="checkbox"
        checked={checked}
        readOnly
        className="mr-2 accent-blue-600"
      />
    ) : null,
};

export default function MarkdownViewer({ content }: { content: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
