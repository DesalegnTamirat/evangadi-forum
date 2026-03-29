import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GuestLanding.module.css';

const GuestLanding = () => {
  return (
    <div className={styles.landingContainer}>
      <div className={`${styles.hero} glass-panel`}>
        <h1 className="neon-text">Quantum Discuss</h1>
        <p className={styles.tagline}>Elevating Knowledge Through Professional Discourse</p>
        
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>10k+</span>
            <span className={styles.statLabel}>Questions</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>2.5k</span>
            <span className={styles.statLabel}>Experts</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>50k+</span>
            <span className={styles.statLabel}>Answers</span>
          </div>
        </div>

        <div className={styles.ctaGroup}>
          <Link to="/signup" className="neon-btn">Join the Community</Link>
          <Link to="/signin" className={`${styles.outlineBtn} neon-btn`}>Sign In</Link>
        </div>
      </div>

      <div className={styles.features}>
        <div className={`${styles.featureCard} glass-panel`}>
          <h3>Professional Network</h3>
          <p>Connect with industry experts and build your professional reputation through quality contributions.</p>
        </div>
        <div className={`${styles.featureCard} glass-panel`}>
          <h3>Quality Assured</h3>
          <p>Our reputation system ensures the most helpful answers rise to the top, saving you time.</p>
        </div>
        <div className={`${styles.featureCard} glass-panel`}>
          <h3>Earn Recognition</h3>
          <p>Collect badges and increase your standing in the global community of problem solvers.</p>
        </div>
      </div>
    </div>
  );
};

export default GuestLanding;
