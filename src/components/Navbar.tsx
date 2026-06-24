'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../utils/authContext';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#2563eb', cursor: 'pointer' }}>
          Yára
        </div>
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#666', fontWeight: '500' }}>
          Home
        </Link>

        {user && (
          <>
            <Link href="/dashboard" style={{ textDecoration: 'none', color: '#666', fontWeight: '500' }}>
              Dashboard
            </Link>
            <div style={{ fontSize: '0.85rem', color: '#999' }}>{user.email}</div>
            <button
              onClick={handleSignOut}
              style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: '600' }}
            >
              Sign Out
            </button>
          </>
        )}

        {!user && (
          <Link href="/auth" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: '600' }}>
              Login / Sign Up
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
