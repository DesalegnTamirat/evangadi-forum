import React, { useState, useEffect } from 'react';
import axios from '../../Api/axiosConfig';
import { MdChatBubbleOutline, MdNavigateNext, MdAdd, MdClose } from 'react-icons/md';
import { Link } from 'react-router-dom';
import styles from './Forums.module.css';

const Forums = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newForumName, setNewForumName] = useState('');
  const [newForumDesc, setNewForumDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get('/category/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleJoinLeave = async (id, isMember) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = isMember ? `/category/${id}/leave` : `/category/${id}/join`;
      await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optimistically update the local state
      setCategories(prev => prev.map(c => 
        c.categoryid === id ? { ...c, isMember: !isMember, _count: { ...c._count, members: isMember ? c._count.members - 1 : c._count.members + 1 } } : c
      ));
    } catch (error) {
      console.error("Error updating membership:", error);
    }
  };

  const handleCreateForum = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post('/category/create', {
        name: newForumName,
        description: newForumDesc
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setNewForumName('');
      setNewForumDesc('');
      await fetchCategories(); // Refresh list to get the new group
    } catch (error) {
      console.error("Error creating forum:", error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="primary_container">Loading Forums...</div>;

  return (
    <div className="primary_container">
      <div className={styles.header}>
        <div>
          <h1 className="neon-text">Community Forums</h1>
          <p>Explore specialized discussion areas and connect with experts.</p>
        </div>
        <button className="neon-btn" onClick={() => setShowModal(true)}>
          <MdAdd size={20} style={{marginRight: "8px", verticalAlign: "middle"}} /> Create Forum
        </button>
      </div>

      <div className={styles.categoryGrid}>
        {categories.map((cat) => (
          <div key={cat.categoryid} className={`${styles.categoryCard} glass-panel`}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBox}>
                <MdChatBubbleOutline />
              </div>
              <div className={styles.stats}>
                <span>{cat._count?.questions || 0} Discussions</span>
                <span>•</span>
                <span>{cat._count?.members || 0} Members</span>
              </div>
            </div>
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
            <div className={styles.cardFooter}>
              <button 
                className={`${styles.joinBtn} ${cat.isMember ? styles.joined : ''}`}
                onClick={() => handleJoinLeave(cat.categoryid, cat.isMember)}
              >
                {cat.isMember ? 'Joined' : 'Join Space'}
              </button>
              <Link to={`/forum/${cat.categoryid}`}>
                <button className={styles.enterBtn}>
                  Enter <MdNavigateNext />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} glass-panel`}>
            <div className={styles.modalHeader}>
              <h3>Create New Forum</h3>
              <button onClick={() => setShowModal(false)} className={styles.closeBtn}><MdClose /></button>
            </div>
            <form onSubmit={handleCreateForum}>
              <div className={styles.inputGroup}>
                <label>Forum Name</label>
                <input 
                  type="text" 
                  value={newForumName}
                  onChange={(e) => setNewForumName(e.target.value)}
                  placeholder="e.g. Next.js Masters"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Description</label>
                <textarea 
                  value={newForumDesc}
                  onChange={(e) => setNewForumDesc(e.target.value)}
                  placeholder="What is this forum about?"
                  required
                />
              </div>
              <button type="submit" disabled={creating} className="neon-btn" style={{width: '100%', marginTop: '10px', justifyContent: 'center'}}>
                {creating ? 'Creating...' : 'Create Space'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forums;
