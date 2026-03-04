import React from 'react';

export default function Footer() {
  return (
    <footer style={{ padding: '2rem 1rem', borderTop: '1px solid #eee', marginTop: '2rem', textAlign: 'center', color: '#888' }}>
      <div>© {new Date().getFullYear()} Yára. All rights reserved.</div>
    </footer>
  );
}
