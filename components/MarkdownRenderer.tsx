import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownRendererProps {
  children: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ children }) => {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeSanitize]}
      components={{
        p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-bold text-amber-200" {...props} />,
        em: ({ node, ...props }) => <em className="italic text-amber-100/90" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 my-2" {...props} />,
        li: ({ node, ...props }) => <li className="pl-2" {...props} />,
        a: ({ node, ...props }) => <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
};
