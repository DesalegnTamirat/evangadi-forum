import React from 'react';

const Placeholder = ({ title }) => {
  return (
    <div className="primary_container">
      <div className="glass-panel" style={{ padding: '80px', textAlign: 'center' }}>
        <h1 className="neon-text" style={{ fontSize: '3rem', marginBottom: '20px' }}>{title}</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>
          This section is currently under development to bring you a premium community experience.
        </p>
        <div style={{ marginTop: '40px' }}>
          <div className="reputation-badge gold" style={{ display: 'inline-block' }}>Coming Soon</div>
        </div>
      </div>
    </div>
  );
};

export default Placeholder;
