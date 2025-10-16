import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: #0f172a;
  color: #94a3b8;
  padding: 1.5rem 0;
  margin-top: 4rem;
  text-align: center;
  border-top: 1px solid #334155;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      &copy; 2025 Nhóm 14 — Tất cả quyền được bảo lưu.
    </FooterContainer>
  );
};

export default Footer;
