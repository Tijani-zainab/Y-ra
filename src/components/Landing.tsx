import React from 'react';

export default function Landing() {
  return (
    <section style={{ padding: '4rem 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Optimize Your Online Experience with Our Advanced <span style={{ color: '#2563eb' }}>URL Shortening</span> Solution</h1>
      <p style={{ margin: '2rem 0', fontSize: '1.25rem', color: '#555' }}>
        Personalize your shortened URLs to align with your brand identity. Utilize custom slugs, branded links, and domain customization options to reinforce your brand presence and enhance user engagement.
      </p>
      <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', padding: '1rem 2rem', fontSize: '1.1rem', cursor: 'pointer' }}>Sign Up</button>
    </section>
  );
}
