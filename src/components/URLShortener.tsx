'use client';

import React, { useState } from 'react';
import { useAuth } from '../utils/authContext';
import { createShortUrl, generateQRCodeUrl, isValidUrl } from '../utils/urlService';

export default function URLShortener({ onUrlCreated }: { onUrlCreated?: () => void }) {
  const { user } = useAuth();
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('Please sign in first');
      return;
    }

    if (!originalUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(originalUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    if (customSlug && !/^[a-zA-Z0-9-_]+$/.test(customSlug)) {
      setError('Custom slug can only contain letters, numbers, hyphens, and underscores');
      return;
    }

    try {
      setLoading(true);
      await createShortUrl(
        originalUrl,
        user.uid,
        customSlug || undefined,
        title || undefined,
        description || undefined
      );
      setSuccess('URL shortened successfully!');
      setOriginalUrl('');
      setCustomSlug('');
      setTitle('');
      setDescription('');
      setShowAdvanced(false);
      onUrlCreated?.();
    } catch (err: any) {
      setError(err.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        ✨ Shorten Your URL
      </h2>
      
      <form onSubmit={handleSubmit} style={{ background: '#f9fafb', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
            Original URL *
          </label>
          <input
            type="url"
            placeholder="https://example.com/very/long/url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            disabled={!user}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              background: 'transparent',
              color: '#2563eb',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              padding: 0,
            }}
          >
            {showAdvanced ? '▼ Hide Advanced Options' : '▶ Show Advanced Options'}
          </button>
        </div>

        {showAdvanced && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fff', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                Custom Slug (optional)
              </label>
              <input
                type="text"
                placeholder="my-custom-slug"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value.toLowerCase())}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                Title (optional)
              </label>
              <input
                type="text"
                placeholder="Link title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                Description (optional)
              </label>
              <textarea
                placeholder="Link description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  minHeight: '80px',
                }}
              />
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #fecaca' }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #bbf7d0' }}>
            ✅ {success}
          </div>
        )}

        {!user && (
          <div style={{ background: '#fef3c7', color: '#92400e', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #fde68a' }}>
            📝 Please sign in to shorten URLs
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !user}
          style={{
            width: '100%',
            background: user ? '#2563eb' : '#d1d5db',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: user ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? '⏳ Creating...' : '🚀 Shorten URL'}
        </button>
      </form>
    </div>
  );
}
