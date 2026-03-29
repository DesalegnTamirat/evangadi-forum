import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppState } from "../../App";
import { MdNotificationsNone, MdSearch, MdKeyboardArrowDown, MdCheckCircle } from "react-icons/md";
import { BsSun, BsMoon } from "react-icons/bs";
import { API_BASE_URL } from "../../Data/data";
import axios from "../../Api/axiosConfig";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "./header.module.css";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  const { user, setUser, theme, toggleTheme } = useContext(AppState);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user) {
      fetchNotifications();
    }
  }, [token, user]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get("/notification/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/notification/read/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.notificationid === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const hasUnread = notifications.some(n => !n.is_read);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/signin");
  };

  return (
    <header className={`${styles.header} glass-panel`}>
      <div className={styles.headerLeft}>
        <div className={styles.searchWrapper}>
          <MdSearch className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search Community..." 
            className={styles.headerSearch}
          />
        </div>
      </div>

      <div className={styles.headerRight}>
        <button className={styles.iconBtn} onClick={toggleTheme} title="Toggle Theme">
          {theme === "light" ? <BsMoon /> : <BsSun />}
        </button>

        <div className={styles.iconBtn} onClick={() => setShowNotifications(!showNotifications)}>
          <MdNotificationsNone />
          {hasUnread && <span className={styles.notifyBadge}></span>}
          
          {showNotifications && (
            <div className={styles.notificationDropdown} onClick={(e) => e.stopPropagation()}>
              <div className={styles.notifyHeader}>
                <span>Notifications</span>
              </div>
              <div className={styles.notifyList}>
                {notifications.length === 0 ? (
                  <p className={styles.emptyNotify}>No notifications yet.</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.notificationid} className={`${styles.notifyItem} ${n.is_read ? styles.read : styles.unread}`}>
                      <p>{n.message}</p>
                      <small>{new Date(n.created_at).toLocaleDateString()}</small>
                      {!n.is_read && (
                        <button onClick={() => markAsRead(n.notificationid)} title="Mark as read">
                          <MdCheckCircle />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {user?.profile_picture ? (
              <img src={`${API_BASE_URL}${user.profile_picture}`} alt={user.username} />
            ) : (
              <AccountCircleIcon />
            )}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user ? `${user.firstname} ${user.lastname?.charAt(0)}.` : 'Guest'}</span>
            <span className={styles.userRank}>
                {user?.badges?.[user.badges.length - 1] || 'New Contributor'}
            </span>
          </div>
          <MdKeyboardArrowDown className={styles.dropdownIcon} />
          
          <div className={styles.profileDropdown}>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
