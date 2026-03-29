import React, { useState, useEffect } from 'react';
import axios from '../../Api/axiosConfig';
import { MdSearch, MdStars } from 'react-icons/md';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { API_BASE_URL } from "../../Data/data";
import styles from './Members.module.css';

const Members = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/user/all');
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="primary_container">Loading Members...</div>;

  return (
    <div className="primary_container">
      <div className={styles.pageHeader}>
        <div>
          <h1 className="neon-text">Community Members</h1>
          <p>Meet the experts and contributors driving the discussion.</p>
        </div>
        <div className={styles.searchBox}>
          <MdSearch />
          <input 
            type="text" 
            placeholder="Search members..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.memberList}>
        <div className={styles.listHeader}>
          <span>Member</span>
          <span className={styles.hideMobile}>Questions</span>
          <span className={styles.hideMobile}>Answers</span>
          <span>Reputation</span>
          <span>Rank</span>
        </div>
        
        {filteredUsers.map((user, index) => (
          <div key={user.userid} className={`${styles.memberRow} glass-panel`}>
            <div className={styles.userInfo}>
              <div className={styles.index}>{index + 1}</div>
              <div className={styles.avatar}>
                {user.profile_picture ? (
                  <img src={`${API_BASE_URL}${user.profile_picture}`} alt={user.username} />
                ) : (
                  <AccountCircleIcon />
                )}
              </div>
              <div>
                <p className={styles.name}>{user.firstname} {user.lastname}</p>
                <span className={styles.username}>@{user.username}</span>
              </div>
            </div>

            <div className={`${styles.count} ${styles.hideMobile}`}>{user._count.questions}</div>
            <div className={`${styles.count} ${styles.hideMobile}`}>{user._count.answers}</div>
            
            <div className={styles.reputation}>
              <MdStars className={styles.starIcon} />
              {user.reputation}
            </div>

            <div className={styles.rank}>
              <span className={`reputation-badge ${user.badges[user.badges.length - 1]?.toLowerCase() || 'bronze'}`}>
                {user.badges[user.badges.length - 1] || 'Newbie'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Members;
