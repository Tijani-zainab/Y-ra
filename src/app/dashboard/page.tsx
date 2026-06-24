'use client';

import React from 'react';
import { useAuth } from '../../utils/authContext';
import { useRouter } from 'next/navigation';
import URLShortener from '../../components/URLShortener';
import URLList from '../../components/URLList';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>⏳ Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: '60vh', background: '#f9fafb', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>📈 Dashboard</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Welcome back, {user.email}! Create and manage your shortened URLs here.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📧</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Account Email</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2563eb', marginTop: '0.5rem' }}>{user.email}</div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🆔</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>User ID</div>
            <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#666', marginTop: '0.5rem', wordBreak: 'break-all' }}>{user.uid}</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '2rem' }}>
          <URLShortener onUrlCreated={() => setRefreshKey((k) => k + 1)} />
        </div>

        <div style={{ background: '#fff', padding: '0', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <URLList key={refreshKey} />
        </div>
      </div>
    </div>
  );
}
