import React from 'react';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Yára</div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a href="#">My URLs</a>
        <a href="#">Features</a>
        <a href="#">Pricing</a>
        <a href="#">Analytics</a>
        <a href="#">FAQs</a>
        <a href="#">Log in</a>
        <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer' }}>Try for free</button>
      </div>
    </nav>
  );
}
