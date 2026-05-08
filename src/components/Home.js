import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  {
    to: '/todos',
    icon: '✓',
    title: 'To-Do List',
    description: 'Manage tasks with filtering, completion tracking, and bulk actions.',
    color: '#e94560',
  },
  {
    to: '/notes',
    icon: '✎',
    title: 'Notes',
    description: 'Create, search, and organize quick notes with timestamps.',
    color: '#2196f3',
  },
  {
    to: '/counter',
    icon: '#',
    title: 'Counter',
    description: 'Increment, decrement, reset, or jump to any value instantly.',
    color: '#4caf50',
  },
  {
    to: '/about',
    icon: 'i',
    title: 'About',
    description: 'View build info, version, and CI/CD pipeline details.',
    color: '#ff9800',
  },
];

function Home() {
  const version = process.env.REACT_APP_VERSION || 'dev';
  const buildTime = process.env.REACT_APP_BUILD_TIME || new Date().toISOString().split('T')[0];

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-badge">v{version}</div>
        <h1 className="hero-title">My Jenkins App</h1>
        <p className="hero-subtitle">
          An enhanced CI/CD demo application built and deployed with Jenkins.
        </p>
        <div className="hero-meta">
          <span className="meta-item">Build: <strong>{version}</strong></span>
          <span className="meta-dot">·</span>
          <span className="meta-item">Date: <strong>{buildTime}</strong></span>
          <span className="meta-dot">·</span>
          <span className="meta-item">
            Status: <span className="badge badge-success">Healthy</span>
          </span>
        </div>
      </div>

      <h2 className="section-title">Features</h2>
      <div className="feature-grid">
        {features.map((f) => (
          <Link key={f.to} to={f.to} className="feature-card" style={{ '--card-accent': f.color }}>
            <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
            <span className="feature-link">Open &rarr;</span>
          </Link>
        ))}
      </div>

      <div className="info-banner">
        <strong>Jenkins CI/CD:</strong> This app is automatically built, tested, and deployed
        using a multi-stage Jenkins pipeline with Docker, unit tests, E2E tests, and Netlify.
      </div>
    </div>
  );
}

export default Home;
