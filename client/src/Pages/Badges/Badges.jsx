import React from 'react';
import { MdStars, MdEmojiEvents, MdTimeline } from 'react-icons/md';
import styles from './Badges.module.css';

const Badges = () => {
  const badgeTiers = [
    { name: 'Platinum', icon: <MdEmojiEvents />, points: '500+', color: 'platinum', desc: 'Elite contributors who have shaped the community with invaluable knowledge.' },
    { name: 'Gold', icon: <MdStars />, points: '100+', color: 'gold', desc: 'Highly respected members with consistent high-quality contributions.' },
    { name: 'Silver', icon: <MdTimeline />, points: '50+', color: 'silver', desc: 'Active members providing helpful answers and engaging in discussions.' },
    { name: 'Bronze', icon: <MdStars />, points: '10+', color: 'bronze', desc: 'Starting your journey as a helpful member of the community.' },
  ];

  return (
    <div className="primary_container">
      <div className={styles.hero}>
        <h1 className="neon-text">Achievement Badges</h1>
        <p>Earn recognition for your contributions and climb the community ranks.</p>
      </div>

      <div className={styles.tierGrid}>
        {badgeTiers.map((tier) => (
          <div key={tier.name} className={`${styles.tierCard} glass-panel ${styles[tier.color]}`}>
            <div className={styles.iconWrapper}>{tier.icon}</div>
            <h2>{tier.name} Rank</h2>
            <div className={styles.pointBadge}>{tier.points} Reputation</div>
            <p>{tier.desc}</p>
          </div>
        ))}
      </div>

      <div className={`${styles.howToEarn} glass-panel`}>
        <h2>How to Earn Reputation?</h2>
        <div className={styles.methods}>
          <div className={styles.method}>
            <span className={styles.plus}>+10</span>
            <p>Your answer is marked as helpful (Liked)</p>
          </div>
          <div className={styles.method}>
            <span className={styles.plus}>+2</span>
            <p>Your question receives a Like</p>
          </div>
          <div className={styles.method}>
            <span className={styles.minus}>-2</span>
            <p>Your answer or question is disliked</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badges;
