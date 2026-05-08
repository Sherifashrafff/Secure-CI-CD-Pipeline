import React from 'react';
import './About.css';

const pipelineStages = [
  { name: 'Build Docker Image',   icon: '&#128736;', desc: 'Builds a custom Playwright Docker image used across pipeline stages.' },
  { name: 'Install & Build',      icon: '&#128295;', desc: 'Runs npm ci and npm run build inside a Node 18 Alpine container.' },
  { name: 'Lint',                 icon: '&#128269;', desc: 'Runs ESLint to enforce code quality and catch errors early.' },
  { name: 'Security Audit',       icon: '&#128274;', desc: 'Runs npm audit to detect known vulnerabilities in dependencies.' },
  { name: 'Unit Tests',           icon: '&#9989;',  desc: 'Runs Jest with coverage. Results published as JUnit and HTML reports.' },
  { name: 'E2E Tests (Local)',    icon: '&#127759;', desc: 'Playwright tests against a local serve build.' },
  { name: 'Deploy to Staging',    icon: '&#128640;', desc: 'Deploys to Netlify staging environment via netlify-cli.' },
  { name: 'E2E Tests (Staging)', icon: '&#128205;', desc: 'Playwright tests against the live staging URL.' },
  { name: 'Deploy to Production', icon: '&#127942;', desc: 'Deploys to Netlify production with --prod flag.' },
  { name: 'Smoke Test (Prod)',    icon: '&#128293;', desc: 'Final Playwright smoke test against the live production URL.' },
];

const techStack = [
  { label: 'React',        version: '18.2',   color: '#61dafb' },
  { label: 'React Router', version: '6.18',   color: '#e94560' },
  { label: 'Jest',         version: 'CRA',    color: '#c21325' },
  { label: 'Playwright',   version: '1.39',   color: '#2ead33' },
  { label: 'Jenkins',      version: 'LTS',    color: '#d33833' },
  { label: 'Docker',       version: 'latest', color: '#2496ed' },
  { label: 'Netlify',      version: 'CLI 20', color: '#00ad9f' },
  { label: 'Node.js',      version: '18 LTS', color: '#339933' },
];

function About() {
  const version = process.env.REACT_APP_VERSION || 'dev';
  const buildTime = process.env.REACT_APP_BUILD_TIME || 'local build';

  return (
    <div className="about-page">
      <div className="page-header">
        <h1>About</h1>
        <p>Build info, tech stack, and CI/CD pipeline overview.</p>
      </div>

      <div className="card about-build">
        <h2>Build Information</h2>
        <dl className="build-info">
          <div className="build-row">
            <dt>Version</dt>
            <dd><code>{version}</code></dd>
          </div>
          <div className="build-row">
            <dt>Build Date</dt>
            <dd>{buildTime}</dd>
          </div>
          <div className="build-row">
            <dt>Environment</dt>
            <dd>
              <span className="badge badge-success">
                {process.env.NODE_ENV || 'development'}
              </span>
            </dd>
          </div>
          <div className="build-row">
            <dt>Status</dt>
            <dd><span className="badge badge-success">Healthy</span></dd>
          </div>
        </dl>
      </div>

      <div className="card">
        <h2>Tech Stack</h2>
        <div className="tech-grid">
          {techStack.map(t => (
            <div key={t.label} className="tech-pill" style={{ '--pill-color': t.color }}>
              <span className="tech-dot" />
              <span className="tech-label">{t.label}</span>
              <span className="tech-version">{t.version}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>CI/CD Pipeline</h2>
        <p className="about-desc">
          This application is built, tested, and deployed through a declarative Jenkins pipeline
          with {pipelineStages.length} stages, including parallel test execution and multi-environment
          deployments.
        </p>
        <ol className="pipeline-list">
          {pipelineStages.map((stage, i) => (
            <li key={i} className="pipeline-stage">
              <span
                className="stage-icon"
                dangerouslySetInnerHTML={{ __html: stage.icon }}
              />
              <div>
                <strong>{stage.name}</strong>
                <p>{stage.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default About;
