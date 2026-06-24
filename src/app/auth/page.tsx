'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../utils/authContext';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../utils/firebase';

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validateForm = (): boolean => {
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return false;
    }

    if (!password) {
      setError('Password is required');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/dashboard');
    } catch (err: any) {
      const errorCode = err.code;
      if (errorCode === 'auth/email-already-in-use') {
        setError('This email is already registered');
      } else if (errorCode === 'auth/user-not-found') {
        setError('Email not found. Please sign up first');
      } else if (errorCode === 'auth/wrong-password') {
        setError('Incorrect password');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>⏳ Loading...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'center', background: '#f9fafb' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>👋 Welcome!</h2>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '1.1rem', color: '#555' }}>Signed in as:</p>
          <p style={{ fontWeight: '600', color: '#2563eb', fontSize: '1.1rem', marginTop: '0.5rem' }}>{user.email}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
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
            Go to Dashboard
          </button>
          <button
            onClick={handleSignOut}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#f9fafb' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem' }}>🔐 {isLogin ? 'Login' : 'Sign Up'}</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>Welcome to Yára</p>

        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {!isLogin && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
          )}

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #fecaca' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? '⏳ Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#666' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#2563eb',
              cursor: 'pointer',
              fontWeight: '600',
              textDecoration: 'underline',
            }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
