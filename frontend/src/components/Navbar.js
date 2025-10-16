import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #1d4ed8;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  position: relative;
  &:hover {
    color: #93c5fd;
  }
  &.active::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    right: 0;
    height: 2px;
    background: white;
  }
`;

const CartIcon = styled.div`
  position: relative;
  cursor: pointer;
  .cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ef4444;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 1001;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 12px 16px;
  color: #374151;
  text-decoration: none;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f3f4f6;
  }
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const cartItemsCount = getCartItemsCount();

  return (
    <NavbarContainer>
      <NavContent>
        <Logo to="/">
          Nhóm 14
        </Logo>
        
        <NavLinks $isOpen={isMenuOpen}>
          <NavLink 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            Trang chủ
          </NavLink>
          <NavLink 
            to="/books" 
            className={location.pathname === '/books' ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            Sách
          </NavLink>
          
          {user && (
            <>
              <NavLink 
                to="/orders" 
                className={location.pathname === '/orders' ? 'active' : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                Đơn hàng
              </NavLink>
              {isAdmin() && (
                <NavLink 
                  to="/admin" 
                  className={location.pathname.startsWith('/admin') ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Quản trị
                </NavLink>
              )}
            </>
          )}
          
          <CartIcon onClick={() => navigate('/cart')}>
            🛒
            {cartItemsCount > 0 && (
              <span className="cart-count">{cartItemsCount}</span>
            )}
          </CartIcon>
        </NavLinks>
        
        <UserMenu>
          {user ? (
            <>
              <span onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                👤 {user.name}
              </span>
              <UserDropdown $isOpen={isUserMenuOpen}>
                <DropdownItem to="/profile" onClick={() => setIsUserMenuOpen(false)}>
                  Thông tin cá nhân
                </DropdownItem>
                <DropdownItem to="/orders" onClick={() => setIsUserMenuOpen(false)}>
                  Đơn hàng của tôi
                </DropdownItem>
                <DropdownItem as="button" onClick={handleLogout}>
                  Đăng xuất
                </DropdownItem>
              </UserDropdown>
            </>
          ) : (
            <>
              <NavLink to="/login">Đăng nhập</NavLink>
              <NavLink to="/register">Đăng ký</NavLink>
            </>
          )}
        </UserMenu>
        
        <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </MobileMenuButton>
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar;
