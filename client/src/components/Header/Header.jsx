import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppState } from "../../App";
import { MdNotificationsNone, MdSearch, MdKeyboardArrowDown } from "react-icons/md";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "./header.module.css";

const Header = () => {
  const { user, setUser } = useContext(AppState);
  const navigate = useNavigate();

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
        <button className={styles.iconBtn}>
          <MdNotificationsNone />
          <span className={styles.notifyBadge}></span>
        </button>

        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {user?.profile_picture ? (
              <img src={user.profile_picture} alt={user.username} />
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
