import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import Employees from './Employees';
import LeaveTab from './LeaveTab'
import LeaveApplication from './LeaveApplication';

// Icons (you may want to use a library like react-icons instead)
const DashboardIcon = () => <span className="icon">📊</span>;
const EmployeesIcon = () => <span className="icon">👥</span>;
const LeaveIcon = () => <span className="icon">📅</span>;
const LeaveApplicationIcon = () => <span className="icon">📝</span>;
const SettingsIcon = () => <span className="icon">⚙️</span>;
const LogoutIcon = () => <span className="icon">🚪</span>;
const UserIcon = () => <span className="icon">👤</span>;
const NotificationIcon = () => <span className="icon">🔔</span>;

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
            {sidebarCollapsed ? '→' : '←'}
          </button>
          <h2>{sidebarCollapsed ? 'HRM' : 'HRM System'}</h2>
        </div>
        
        <div className="sidebar-menu">
          <ul>
            <li 
              className={activeMenu === 'dashboard' ? 'active' : ''} 
              onClick={() => setActiveMenu('dashboard')}
            >
              <DashboardIcon />
              {!sidebarCollapsed && <span>Dashboard</span>}
            </li>
            <li 
              className={activeMenu === 'employees' ? 'active' : ''} 
              onClick={() => setActiveMenu('employees')}
            >
              <EmployeesIcon />
              {!sidebarCollapsed && <span>Employees</span>}
            </li>
            <li 
              className={activeMenu === 'leave' ? 'active' : ''} 
              onClick={() => setActiveMenu('leave')}
            >
              <LeaveIcon />
              {!sidebarCollapsed && <span>Leave</span>}
            </li>
            <li 
              className={activeMenu === 'leaveapplication' ? 'active' : ''} 
              onClick={() => setActiveMenu('leaveapplication')}
            >
              <LeaveApplicationIcon />
              {!sidebarCollapsed && <span>Leave Application</span>}
            </li>
            <li 
              className={activeMenu === 'settings' ? 'active' : ''} 
              onClick={() => setActiveMenu('settings')}
            >
              <SettingsIcon />
              {!sidebarCollapsed && <span>Settings</span>}
            </li>
            <li onClick={handleLogout}>
              <LogoutIcon />
              {!sidebarCollapsed && <span>Logout</span>}
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="header-actions">
            <button className="notification-btn">
              <NotificationIcon />
              <span className="notification-badge">3</span>
            </button>
            <div className="user-profile">
              <UserIcon />
              <span>John Doe</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {activeMenu === 'dashboard' && (
            <div className="dashboard-content">
              <h1>Dashboard</h1>
              <div className="stats-container">
                <div className="stat-card">
                  <h3>Total Employees</h3>
                  <p className="stat-value">125</p>
                  <p className="stat-change positive">+5% from last month</p>
                </div>
                <div className="stat-card">
                  <h3>Attendance Rate</h3>
                  <p className="stat-value">92%</p>
                  <p className="stat-change positive">+2% from last month</p>
                </div>
                <div className="stat-card">
                  <h3>Pending Requests</h3>
                  <p className="stat-value">8</p>
                  <p className="stat-change negative">+3 from last week</p>
                </div>
                <div className="stat-card">
                  <h3>Upcoming Events</h3>
                  <p className="stat-value">3</p>
                  <p className="stat-change">Next: Team Meeting</p>
                </div>
              </div>
              
              <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">📝</div>
                    <div className="activity-details">
                      <p className="activity-text">Jane Smith submitted a leave request</p>
                      <p className="activity-time">2 hours ago</p>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">👤</div>
                    <div className="activity-details">
                      <p className="activity-text">New employee Michael Johnson added</p>
                      <p className="activity-time">Yesterday</p>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">📝</div>
                    <div className="activity-details">
                      <p className="activity-text">Payroll for June has been processed</p>
                      <p className="activity-time">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeMenu === 'employees' && <Employees />}
          
          {activeMenu === 'leave' && <LeaveTab />}
          
          {activeMenu === 'leaveapplication' && <LeaveApplication />}
          
          {activeMenu === 'settings' && (
            <div>
              <h1>Settings</h1>
              <p>System settings content will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;