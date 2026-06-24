'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../utils/authContext';
import { useRouter, useParams } from 'next/navigation';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import { URLData } from '../../../utils/urlService';

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const urlId = params?.urlId as string | undefined;

  const [urlData, setUrlData] = useState<URLData | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
      return;
    }

    if (!user || !urlId) return;

    const fetchUrl = async () => {
      try {
        const docRef = doc(db, 'urls', urlId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError('URL not found');
          return;
        }

        const data = docSnap.data() as URLData;

        if (data.userId !== user.uid) {
          setError('You do not have permission to view this analytics');
          return;
        }

        setUrlData({ ...data, id: docSnap.id });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch analytics');
      } finally {
        setPageLoading(false);
      }
    };

    fetchUrl();
  }, [user, loading, urlId, router]);

  if (loading || pageLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>⏳ Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1.5rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
          ⚠️ {error}
        </div>
        <button
          onClick={() => router.back()}
          style={{
            marginTop: '1rem',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  if (!urlData) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>No data available</p>
      </div>
    );
  }

  const analytics = urlData.analytics || { totalClicks: 0, clicksByDate: {}, clicksByCountry: {}, clicksByDevice: {} };

  return (
    <div style={{ minHeight: '60vh', background: '#f9fafb', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'transparent',
            color: '#2563eb',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '1.5rem',
            fontWeight: '600',
          }}
        >
          ← Back to Dashboard
        </button>

        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>📊 Analytics</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          {urlData.title || 'Untitled'} ({urlData.shortCode})
        </p>

        {/* Main Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Total Clicks</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2563eb' }}>{analytics.totalClicks || 0}</div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Original URL</div>
            <div
              style={{
                fontSize: '0.9rem',
                color: '#2563eb',
                wordBreak: 'break-all',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={() => window.open(urlData.originalUrl, '_blank')}
            >
              {urlData.originalUrl}
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Short URL</div>
            <code
              style={{
                background: '#f3f4f6',
                padding: '0.5rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.9rem',
              }}
            >
              {window.location.origin}/{urlData.shortCode}
            </code>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Clicks by Device */}
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>📱 Clicks by Device</h3>
            {Object.keys(analytics.clicksByDevice || {}).length > 0 ? (
              <div>
                {Object.entries(analytics.clicksByDevice || {}).map(([device, clicks]) => (
                  <div key={device} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>{device}</span>
                      <strong>{clicks}</strong>
                    </div>
                    <div style={{ background: '#e5e7eb', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                      <div
                        style={{
                          background: '#2563eb',
                          height: '100%',
                          width: `${Math.min((Number(clicks) / (analytics.totalClicks || 1)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#999' }}>No device data available</p>
            )}
          </div>

          {/* Clicks by Date */}
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>📅 Clicks by Date</h3>
            {Object.keys(analytics.clicksByDate || {}).length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {Object.entries(analytics.clicksByDate || {})
                  .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                  .map(([date, clicks]) => (
                    <div key={date} style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{new Date(date).toLocaleDateString()}</span>
                        <strong>{clicks} clicks</strong>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p style={{ color: '#999' }}>No date data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
