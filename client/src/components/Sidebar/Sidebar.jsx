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
    { name: 'Members', icon: <MdPeople />, path: '/members' },
    { name: 'Badges', icon: <MdStars />, path: '/badges' },
    { name: 'Settings', icon: <MdSettings />, path: '/settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <h1>Quantum <br/> Discuss</h1>
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
        <NavLink to="/howitworks" className="nav-item">
          <span className="nav-icon"><MdHelp /></span>
          <span className="nav-text">How it works</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
