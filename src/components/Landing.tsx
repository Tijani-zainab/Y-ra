'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../utils/authContext';
import URLShortener from './URLShortener';

export default function Landing() {
  const { user } = useAuth();

  const features = [
    { icon: '📊', title: 'Real-Time Analytics', description: 'Track clicks, geography, and device info instantly' },
    { icon: '🎨', title: 'Custom Branding', description: 'Use your own domain and branded links' },
    { icon: '🔗', title: 'QR Code Magic', description: 'Auto-generate QR codes for every link' },
    { icon: '⏰', title: 'Link Expiration', description: 'Set links to expire at a specific date and time' },
    { icon: '🔒', title: 'Privacy First', description: 'Password-protect your shortened URLs' },
    { icon: '⚡', title: 'Bulk Shortening', description: 'Create hundreds of links in minutes' },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '₦2,999',
      period: '/month',
      description: 'Perfect for individuals',
      features: ['100 links/month', 'Basic analytics', 'Custom domain', 'QR codes'],
      cta: 'Get Started',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '₦7,999',
      period: '/month',
      description: 'For growing teams',
      features: ['Unlimited links', 'Advanced analytics', 'Team collaboration', 'API access', 'Custom expiration', 'Password protection'],
      cta: 'Start Free Trial',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For large organizations',
      features: ['Everything in Pro', 'Dedicated support', 'SLA guarantee', 'White-label solution', 'Advanced security'],
      cta: 'Contact Us',
      highlight: false,
    },
  ];

  if (user) {
    return <URLShortener />;
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: '6rem 1rem', textAlign: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Shorten URLs. <span style={{ color: '#2563eb' }}>Amplify Impact.</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#555', maxWidth: '600px', margin: '1.5rem auto 2rem' }}>
          Create smart, shareable links that work harder for you. Track, analyze, and optimize every click.
        </p>
        <Link href="/auth" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', padding: '1rem 2.5rem', fontSize: '1.1rem', cursor: 'pointer', marginRight: '1rem', fontWeight: '600' }}>
            Start Free
          </button>
        </Link>
        <a href="#features" style={{ textDecoration: 'none' }}>
          <button style={{ background: 'transparent', color: '#2563eb', border: '2px solid #2563eb', borderRadius: '4px', padding: '1rem 2.5rem', fontSize: '1.1rem', cursor: 'pointer', fontWeight: '600' }}>
            Learn More
          </button>
        </a>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '6rem 1rem', textAlign: 'center', background: '#fff' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Powerful Features, Simple Design</h2>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Everything you need to manage, track, and optimize your links in one place.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {features.map((feature, idx) => (
            <div key={idx} style={{ padding: '2rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'left' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem' }}>{feature.title}</h3>
              <p style={{ fontSize: '0.95rem', color: '#666' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '6rem 1rem', textAlign: 'center', background: '#f3f4f6' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Simple, Transparent Pricing</h2>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Choose the plan that fits your needs. No hidden fees. Cancel anytime.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {plans.map((plan, idx) => (
            <div
              key={idx}
              style={{
                padding: '2.5rem 2rem',
                background: '#fff',
                borderRadius: '12px',
                border: plan.highlight ? '3px solid #2563eb' : '1px solid #e5e7eb',
                textAlign: 'left',
                position: 'relative',
                transform: plan.highlight ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease',
              }}
            >
              {plan.highlight && (
                <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: '#fff', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                  Most Popular
                </div>
              )}
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{plan.name}</h3>
              <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1.5rem' }}>{plan.description}</p>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2563eb' }}>{plan.price}</span>
                <span style={{ fontSize: '0.95rem', color: '#666', marginLeft: '0.5rem' }}>{plan.period}</span>
              </div>
              <Link href="/auth" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    width: '100%',
                    background: plan.highlight ? '#2563eb' : 'transparent',
                    color: plan.highlight ? '#fff' : '#2563eb',
                    border: plan.highlight ? 'none' : '2px solid #2563eb',
                    borderRadius: '6px',
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    marginBottom: '2rem',
                  }}
                >
                  {plan.cta}
                </button>
              </Link>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} style={{ padding: '0.6rem 0', fontSize: '0.95rem', color: '#555', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ color: '#2563eb', marginRight: '0.75rem' }}>✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '4rem 1rem', textAlign: 'center', background: '#2563eb', color: '#fff' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Ready to Shorten?</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Join thousands of users creating shorter, smarter links. Start for free today.
        </p>
        <Link href="/auth" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#fff', color: '#2563eb', border: 'none', borderRadius: '4px', padding: '1rem 2.5rem', fontSize: '1.1rem', cursor: 'pointer', fontWeight: '600' }}>
            Get Started Now
          </button>
        </Link>
      </section>
    </div>
  );
}
