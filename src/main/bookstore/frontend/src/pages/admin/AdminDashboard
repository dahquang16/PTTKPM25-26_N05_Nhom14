import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookService } from '../../services/bookService';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/userService';
import styled from 'styled-components';
import LoadingSpinner from '../../components/LoadingSpinner';

const DashboardContainer = styled.div`
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
`;

const QuickActions = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const QuickActionsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ActionButton = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  text-decoration: none;
  color: #374151;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e2e8f0;
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const ActionText = styled.span`
  font-weight: 500;
  text-align: center;
`;

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksResponse, ordersResponse, usersResponse] = await Promise.all([
          bookService.getBooks({ page: 0, size: 1 }),
          orderService.getAllOrders({ page: 0, size: 1 }),
          userService.getUsers({ page: 0, size: 1 })
        ]);

        setStats({
          totalBooks: booksResponse.data.data.totalElements,
          totalOrders: ordersResponse.data.data.totalElements,
          totalUsers: usersResponse.data.data.totalElements,
          totalRevenue: 0 // Would need to calculate from orders
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin()) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  if (!isAdmin()) {
    return (
      <DashboardContainer>
        <DashboardContent>
          <h1>Bạn không có quyền truy cập trang này</h1>
        </DashboardContent>
      </DashboardContainer>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <DashboardContainer>
      <DashboardContent>
        <PageHeader>
          <PageTitle>Bảng điều khiển quản trị</PageTitle>
        </PageHeader>

        <StatsGrid>
          <StatCard>
            <StatIcon>📚</StatIcon>
            <StatValue>{stats.totalBooks}</StatValue>
            <StatLabel>Tổng số sách</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon>📦</StatIcon>
            <StatValue>{stats.totalOrders}</StatValue>
            <StatLabel>Tổng số đơn hàng</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon>👥</StatIcon>
            <StatValue>{stats.totalUsers}</StatValue>
            <StatLabel>Tổng số người dùng</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon>💰</StatIcon>
            <StatValue>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(stats.totalRevenue)}
            </StatValue>
            <StatLabel>Tổng doanh thu</StatLabel>
          </StatCard>
        </StatsGrid>

        <QuickActions>
          <QuickActionsTitle>Thao tác nhanh</QuickActionsTitle>
          <ActionsGrid>
            <ActionButton href="/admin/books">
              <ActionIcon>📚</ActionIcon>
              <ActionText>Quản lý sách</ActionText>
            </ActionButton>
            
            <ActionButton href="/admin/orders">
              <ActionIcon>📦</ActionIcon>
              <ActionText>Quản lý đơn hàng</ActionText>
            </ActionButton>
            
            <ActionButton href="/admin/users">
              <ActionIcon>👥</ActionIcon>
              <ActionText>Quản lý người dùng</ActionText>
            </ActionButton>
          </ActionsGrid>
        </QuickActions>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default AdminDashboard;
