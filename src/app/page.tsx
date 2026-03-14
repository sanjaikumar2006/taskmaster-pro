'use client';

import Link from 'next/link';
import { Shield, Zap, Layout, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div style={{ background: 'var(--background)' }}>
      {/* Hero Section */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 10%, #312e81 0%, #0f172a 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Decorative Elements */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.15, zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'var(--secondary)', filter: 'blur(150px)', opacity: 0.1, zIndex: 0 }}></div>

        <div className="animate-fade" style={{ maxWidth: '800px', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-block', 
            padding: '0.5rem 1rem', 
            background: 'rgba(99, 102, 241, 0.1)', 
            border: '1px solid var(--primary)', 
            borderRadius: '30px',
            color: 'var(--primary)',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            Secure • Modern • Efficient
          </div>
          <h1 style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Master Your Workflow with <span style={{ color: 'var(--primary)' }}>TaskMaster Pro</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            The next-generation task management system designed for security-conscious professionals. 
            Built with JWT authentication, AES encryption, and high-performance architecture.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/register">
              <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Get Started Free <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/login">
              <button className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div style={{ 
          marginTop: '6rem', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem',
          width: '100%',
          maxWidth: '1200px'
        }}>
          {[
            { icon: <Shield />, title: 'Military-Grade Security', desc: 'Secure HTTP-only cookies and AES-256 encrypted payload handling.' },
            { icon: <Zap />, title: 'Lightning Fast', desc: 'Optimized API responses with intelligent pagination and indexing.' },
            { icon: <Layout />, title: 'Beautiful UI', desc: 'Experience glassmorphism and premium design at its finest.' }
          ].map((f, i) => (
            <div key={i} className="card" style={{ textAlign: 'left', border: '1px solid var(--glass-border)', background: 'rgba(30, 41, 59, 0.5)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ marginBottom: '0.75rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>© 2026 TaskMaster Pro. Built for Technical Excellence.</p>
      </footer>
    </div>
  );
}
