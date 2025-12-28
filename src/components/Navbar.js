import React from 'react';
import styled from 'styled-components';
import { FaSearch, FaUpload, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// إزالة استيرادات MUI
// إزالة: import { AppBar, Toolbar, IconButton, Typography, InputBase, Button } from '@mui/material';
// إزالة: import MenuIcon from '@mui/icons-material/Menu';

const NavbarContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #0f0f0f;
  padding: 0 16px;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid #303030;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  color: #ff0000;
  font-size: 22px;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
  margin-left: 20px;
`;

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 600px;
  margin: 0 auto;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SearchContainer = styled.div`
  display: flex;
  width: 100%;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 16px;
  background: #121212;
  border: 1px solid #303030;
  color: white;
  font-size: 16px;
  border-radius: 2px 0 0 2px;
  outline: none;
  
  &:focus {
    border-color: #1c62b9;
  }
`;

const SearchButton = styled.button`
  background: #313131;
  border: 1px solid #303030;
  border-left: none;
  color: #aaa;
  padding: 0 20px;
  border-radius: 0 2px 2px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #383838;
  }
`;

const NavButton = styled.button`
  background: ${props => props.primary ? '#065fd4' : 'transparent'};
  color: white;
  border: ${props => props.primary ? 'none' : '1px solid #3ea6ff'};
  padding: 8px 16px;
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    background: ${props => props.primary ? '#1c62b9' : '#1b3b5e'};
  }
`;

const Navbar = ({ toggleSidebar, open, user, toggleUploadModal }) => {
  // إزالة: const drawerWidth = 240;
  // إزالة: const Search = styled.div...
  
  return (
    <NavbarContainer>
      <LeftSection>
        {/* إزالة زر القائمة (MenuIcon) كما في الصورة */}
        {/* <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton> */}
        
        <Logo>YouTube</Logo>
      </LeftSection>

      <CenterSection>
        <SearchContainer>
          <SearchInput placeholder="Search…" />
          <SearchButton>
            <FaSearch />
          </SearchButton>
        </SearchContainer>
      </CenterSection>

      <RightSection>
        <NavButton onClick={() => user ? toggleUploadModal() : alert("Please login first !!")}>
          <FaUpload />
          <span>UPLOAD</span>
        </NavButton>
        
        {user ? (
          <NavButton primary>
            <FaUser />
            <span>LOGOUT</span>
          </NavButton>
        ) : (
          <NavButton primary>
            <FaUser />
            <span>LOGIN</span>
          </NavButton>
        )}
      </RightSection>
    </NavbarContainer>
  );
};

export default Navbar;