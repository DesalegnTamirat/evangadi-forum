import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MdDashboard, 
  MdForum, 
  MdQuestionAnswer, 
  MdPeople, 
  MdStars, 
  MdSettings, 
  MdHelp 
} from 'react-icons/md';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <MdDashboard />, path: '/' },
    { name: 'Forums', icon: <MdForum />, path: '/forums' },
    { name: 'Questions', icon: <MdQuestionAnswer />, path: '/questions' },
    { name: 'Members', icon: <MdPeople />, path: '/members' },
    { name: 'Badges', icon: <MdStars />, path: '/badges' },
    { name: 'Settings', icon: <MdSettings />, path: '/settings' },
  ];

  return (
    <aside className="sidebar-container glass-panel">
      <div className="sidebar-logo">
        <div className="logo-icon">Q</div>
        <div className="logo-text">
          <span>QUANTUM</span>
          <span>DISCUSS</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/support" className="nav-item support-link">
          <span className="nav-icon"><MdHelp /></span>
          <span className="nav-text">Support</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
