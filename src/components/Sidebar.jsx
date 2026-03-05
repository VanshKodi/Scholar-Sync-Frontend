import React, { useState, useEffect } from 'react';
import './sidebar.css'; // Assume the CSS above is in this file
import { request } from '../api.jsx';

// Reusing your SVG strings
const icons = {
  home: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 18h6V11l-2-2H9v9z"/><path d="M13 9v2h2"/></svg>,
  document: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>,
  user: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  settings: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  clipboard: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  chat: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  menu: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  bell: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
};
export default function Sidebar({ onSelect }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll for notifications
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const notifs = await request("/notifications");
        const unread = (notifs || []).filter(n => !n.is_read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 60000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const NavItem = ({ icon, text, id, badgeCount }) => (
    <button className="sidebar-item" onClick={() => onSelect(id)}>
      <span className="icon">{icon}</span>
      {!isCollapsed && <span className="label">{text}</span>}
      {!isCollapsed && badgeCount > 0 && (
        <span className="notif-badge">{badgeCount > 99 ? "99+" : badgeCount}</span>
      )}
    </button>
  );

  const Section = ({ title }) => (
    !isCollapsed && <div className="sidebar-section">{title}</div>
  );

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
        {icons.menu}
      </button>
      
      <nav>
        <NavItem icon={icons.home} text="Overview" id="overview" />

        <Section title="Documents" />
        <NavItem icon={icons.document} text="All Docs" id="documents" />

        <Section title="Academic" />
        <NavItem icon={icons.user} text="Attendance" id="attendance" />
        <NavItem icon={icons.settings} text="Grade" id="grade" />
        <NavItem icon={icons.settings} text="CLO" id="clo" />

        <Section title="Administration" />
        <NavItem icon={icons.clipboard} text="Join Requests" id="join-requests" />

        <Section title="Misc" />
        <NavItem icon={icons.user} text="TA-Allotment" id="ta" />
        <NavItem icon={icons.settings} text="Innovative Learning" id="innovative" />

        <Section title="ChatBot" />
        <NavItem icon={icons.chat} text="Chat with ScholarSync" id="chat" />

        <Section title="Account" />
        <NavItem 
          icon={icons.bell} 
          text="Notifications" 
          id="notifications" 
          badgeCount={unreadCount} 
        />
      </nav>
    </aside>
  );
}