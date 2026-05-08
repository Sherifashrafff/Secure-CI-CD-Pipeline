import React, { useState } from 'react';
import './Counter.css';

const PRESETS = [1, 5, 10, 25, 100];

function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [customValue, setCustomValue] = useState('');
  const [history, setHistory] = useState([{ value: 0, action: 'init', ts: new Date().toLocaleTimeString() }]);

  const record = (value, action) =>
    setHistory(prev => [{ value, action, ts: new Date().toLocaleTimeString() }, ...prev].slice(0, 20));

  const inc = () => { const v = count + step; setCount(v); record(v, `+${step}`); };
  const dec = () => { const v = count - step; setCount(v); record(v, `-${step}`); };
  const reset = () => { setCount(0); record(0, 'reset'); };

  const jumpTo = (e) => {
    e.preventDefault();
    const v = parseInt(customValue, 10);
    if (!isNaN(v)) { setCount(v); record(v, `set to ${v}`); setCustomValue(''); }
  };

  const color = count > 0 ? 'var(--success)' : count < 0 ? 'var(--accent)' : 'var(--text-primary)';

  return (
    <div className="counter-page">
      <div className="page-header">
        <h1>Counter</h1>
        <p>Increment, decrement, or jump to any value.</p>
      </div>

      <div className="card counter-card">
        <div className="counter-display" style={{ color }} aria-live="polite" aria-label={`Counter value: ${count}`}>
          {count}
        </div>

        <div className="step-picker" role="group" aria-label="Step size">
          <span className="step-label">Step:</span>
          {PRESETS.map(p => (
            <button
              key={p}
              className={`step-btn ${step === p ? 'active' : ''}`}
              onClick={() => setStep(p)}
              aria-pressed={step === p}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="counter-controls">
          <button className="btn-danger ctrl-btn" onClick={dec} aria-label={`Decrement by ${step}`}>
            &minus;{step}
          </button>
          <button className="btn-secondary ctrl-btn reset-btn" onClick={reset} aria-label="Reset counter">
            Reset
          </button>
          <button className="btn-success ctrl-btn" onClick={inc} aria-label={`Increment by ${step}`}>
            +{step}
          </button>
        </div>

        <form className="jump-form" onSubmit={jumpTo}>
          <input
            type="number"
            className="jump-input"
            placeholder="Jump to value..."
            value={customValue}
            onChange={e => setCustomValue(e.target.value)}
            aria-label="Jump to custom value"
          />
          <button type="submit" className="btn-primary" aria-label="Set value">Set</button>
        </form>

        <div className="counter-stats">
          <div className="stat">
            <span className="stat-label">Current</span>
            <span className="stat-value">{count}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Step</span>
            <span className="stat-value">{step}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Operations</span>
            <span className="stat-value">{history.length - 1}</span>
          </div>
        </div>
      </div>

      {history.length > 1 && (
        <div className="card history-card">
          <h3 className="history-title">History</h3>
          <ul className="history-list">
            {history.slice(0, 10).map((h, i) => (
              <li key={i} className="history-item">
                <span className="history-action">{h.action}</span>
                <span className="history-value">{h.value}</span>
                <span className="history-time">{h.ts}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Counter;
