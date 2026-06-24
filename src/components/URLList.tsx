'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/authContext';
import { getUserUrls, deleteShortUrl, generateQRCodeUrl, URLData } from '../utils/urlService';
import Link from 'next/link';

export default function URLList() {
  const { user } = useAuth();
  const [urls, setUrls] = useState<URLData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQR, setSelectedQR] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUrls = async () => {
      try {
        setLoading(true);
        const userUrls = await getUserUrls(user.uid);
        setUrls(userUrls);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch URLs');
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, [user]);

  const handleDelete = async (urlId: string) => {
    if (!user) return;

    if (confirm('Are you sure you want to delete this URL?')) {
      try {
        await deleteShortUrl(urlId, user.uid);
        setUrls(urls.filter((url) => url.id !== urlId));
      } catch (err: any) {
        alert(err.message || 'Failed to delete URL');
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>Please sign in to view your URLs</p>
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>⏳ Loading your URLs...</div>;
  }

  if (error) {
    return (
      <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '4px', margin: '1rem' }}>
        ⚠️ {error}
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f9fafb', borderRadius: '8px', margin: '1rem' }}>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1rem' }}>📭 No shortened URLs yet</p>
        <p style={{ color: '#999' }}>Create your first shortened URL to get started!</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>📊 My URLs</h2>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600' }}>Title</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600' }}>Short URL</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: '600' }}>Clicks</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: '600' }}>Created</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => (
              <tr key={url.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                      {url.title || 'Untitled'}
                    </div>
                    {url.description && (
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{url.description.substring(0, 50)}...</div>
                    )}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <code style={{ background: '#f3f4f6', padding: '0.4rem 0.8rem', borderRadius: '4px' }}>
                    {url.shortCode}
                  </code>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <strong>{url.clicks || 0}</strong>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                  {url.createdAt ? new Date(url.createdAt.toDate?.()).toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => copyToClipboard(`${window.location.origin}/${url.shortCode}`)}
                      style={{
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={() => setSelectedQR(selectedQR === url.id ? null : url.id!)}
                      style={{
                        background: '#10b981',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      📲 QR
                    </button>
                    <Link href={`/analytics/${url.id}`}>
                      <button
                        style={{
                          background: '#f59e0b',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.4rem 0.8rem',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        📈 Stats
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(url.id!)}
                      style={{
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedQR && (
        <div style={{ marginTop: '2rem', padding: '2rem', background: '#f9fafb', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '1rem' }}>QR Code</h3>
          <img
            src={generateQRCodeUrl(`${window.location.origin}/${urls.find((u) => u.id === selectedQR)?.shortCode}`)}
            alt="QR Code"
            style={{ maxWidth: '300px', borderRadius: '8px' }}
          />
          <div style={{ marginTop: '1rem' }}>
            <a
              href={generateQRCodeUrl(`${window.location.origin}/${urls.find((u) => u.id === selectedQR)?.shortCode}`)}
              download
              style={{
                display: 'inline-block',
                background: '#2563eb',
                color: '#fff',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              ⬇️ Download QR Code
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
