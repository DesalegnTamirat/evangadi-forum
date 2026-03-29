import React, { useState, useEffect } from 'react';
import axios from '../../Api/axiosConfig';
import { MdChatBubbleOutline, MdNavigateNext } from 'react-icons/md';
import styles from './Forums.module.css';

const Forums = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/category/all');
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div className="primary_container">Loading Forums...</div>;

  return (
    <div className="primary_container">
      <div className={styles.header}>
        <h1 className="neon-text">Community Forums</h1>
        <p>Explore specialized discussion areas and connect with experts.</p>
      </div>

      <div className={styles.categoryGrid}>
        {categories.map((cat) => (
          <div key={cat.categoryid} className={`${styles.categoryCard} glass-panel`}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBox}>
                <MdChatBubbleOutline />
              </div>
              <div className={styles.stats}>
                <span>{cat._count.questions} Questions</span>
              </div>
            </div>
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
            <div className={styles.cardFooter}>
              <button className={styles.enterBtn}>
                Explore Forum <MdNavigateNext />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forums;
