import React, { useState } from 'react';
import { auth } from '../utils/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const res = await signInWithEmailAndPassword(auth, email, password);
        setUser(res.user);
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        setUser(res.user);
      }
    } catch (err: any) {
      setError(err.message);
    }
    
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      {user ? (
        <div>
          <h3>Welcome, {user.email}</h3>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <form onSubmit={handleAuth}>
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 12, padding: 8 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 12, padding: 8 }}
          />
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          <button type="submit" style={{ width: '100%', padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4 }}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
          <div style={{ marginTop: 12 }}>
            <span style={{ cursor: 'pointer', color: '#2563eb' }} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
            </span>
          </div>
        </form>
      )}
    </div>
  );
}
