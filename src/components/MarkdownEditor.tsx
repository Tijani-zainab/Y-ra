import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState<string>('');

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Markdown Editor</h2>
      <textarea
        value={markdown}
        onChange={e => setMarkdown(e.target.value)}
        rows={8}
        style={{ width: '100%', marginBottom: 16, padding: 8, fontFamily: 'monospace' }}
        placeholder="Write your content in markdown..."
      />
      <h3>Preview</h3>
      <div style={{ background: '#f9f9f9', padding: 12, borderRadius: 4, minHeight: 80 }}>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
