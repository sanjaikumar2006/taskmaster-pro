'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({ error: 'Server returned invalid response' }));
      if (res.ok) {
        router.push('/login');
      } else {
        // Show the detailed error if it exists
        setError(data.details ? `${data.error}: ${data.details}` : (data.error || 'Registration failed'));
      }
    } catch (err) {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'radial-gradient(circle at top right, #1e1b4b, #0f172a)' 
    }}>
      <div className="glass-card animate-fade" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: '1rem', 
            background: 'var(--secondary)', 
            borderRadius: '16px',
            marginBottom: '1rem',
            boxShadow: '0 8px 16px rgba(236, 72, 153, 0.4)'
          }}>
            <UserPlus size={28} color="white" />
          </div>
          <h1>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join us to start managing tasks</p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{ 
              padding: '0.75rem', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid var(--error)', 
              borderRadius: '8px',
              color: 'var(--error)',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Full Name"
              className="input-field"
              style={{ paddingLeft: '40px' }}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="email"
              placeholder="Email address"
              className="input-field"
              style={{ paddingLeft: '40px' }}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              style={{ paddingLeft: '40px' }}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem', background: 'linear-gradient(135deg, var(--secondary), #f472b6)' }}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--secondary)', fontWeight: '600' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
