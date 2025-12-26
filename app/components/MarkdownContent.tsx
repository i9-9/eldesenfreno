'use client';

import { useMemo, useState, useEffect } from 'react';
import type MarkdownIt from 'markdown-it';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const [md, setMd] = useState<MarkdownIt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dynamically import markdown-it only when component mounts
    import('markdown-it').then((MarkdownItModule) => {
      const markdownIt = new MarkdownItModule.default({
        html: true,
        linkify: true,
        typographer: true,
        breaks: true,
      });
      setMd(markdownIt);
      setIsLoading(false);
    });
  }, []);

  const htmlContent = useMemo(() => {
    if (!md) return '';
    return md.render(content);
  }, [content, md]);

  if (isLoading) {
    return (
      <div className={`markdown-content ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6 mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}


