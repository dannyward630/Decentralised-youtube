import React from 'react';
import styled from 'styled-components';
import { 
  FaHome, FaYoutube, FaFilm, FaTv, 
  FaPlayCircle, FaGamepad, FaChild 
} from 'react-icons/fa';

// إزالة استيرادات MUI غير الضرورية
// إبقاء: import { Divider } from '@mui/material';

const SidebarContainer = styled.aside`
  width: 240px;
  background-color: #212121;
  color: white;
  height: calc(100vh - 60px);
  position: fixed;
  top: 60px;
  left: 0;
  overflow-y: auto;
  padding-top: 20px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 24px;
  color: white;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #383838;
  }
  
  svg {
    font-size: 20px;
    width: 24px;
    text-align: center;
  }
`;

const WindowsNotification = styled.div`
  background-color: #202020;
  margin: 16px;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #ff0000;
  font-size: 12px;
  color: #aaa;
  
  p {
    margin: 4px 0;
  }
  
  strong {
    color: #fff;
    font-weight: bold;
  }
`;

const Sidebar = ({ open, handleLogin, handleLogout, user }) => {
  const menuItems = [
    { text: 'Home', icon: <FaHome /> },
    { text: 'YouTube', icon: <FaYoutube /> },
    { text: 'Movies', icon: <FaFilm /> },
    { text: 'TV Shows', icon: <FaTv /> },
    { text: 'Anime', icon: <FaPlayCircle /> },
    { text: 'Entertainment', icon: <FaGamepad /> },
    { text: 'Kids', icon: <FaChild /> },
  ];

  return (
    <SidebarContainer style={{ display: open ? 'block' : 'none' }}>
      {menuItems.map((item) => (
        <MenuItem key={item.text}>
          {item.icon}
          <span>{item.text}</span>
        </MenuItem>
      ))}
      
      {/* إشعار Windows كما في الصورة */}
      <WindowsNotification>
        <p><strong>Activate Windows</strong></p>
        <p>Go to Settings to activate Windows.</p>
      </WindowsNotification>
      
      {/* إزالة قسم معلومات المستخدم (سيضاف في مكان آخر) */}
      {/* <UserInfo>...</UserInfo> */}
    </SidebarContainer>
  );
};

export default Sidebar;