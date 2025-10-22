import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import styled from 'styled-components';
import LoadingSpinner from '../components/LoadingSpinner';

const OrdersContainer = styled.div`
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
`;

const OrdersContent = styled.div`
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

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const OrderHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OrderId = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
`;

const OrderDate = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
`;

const OrderStatus = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  
  &.PENDING {
    background: #fef3c7;
    color: #92400e;
  }
  
  &.CONFIRMED {
    background: #dbeafe;
    color: #1e40af;
  }
  
  &.SHIPPED {
    background: #d1fae5;
    color: #065f46;
  }
  
  &.DELIVERED {
    background: #dcfce7;
    color: #166534;
  }
  
  &.CANCELLED {
    background: #fee2e2;
    color: #991b1b;
  }
`;

const OrderTotal = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #059669;
`;

const OrderItems = styled.div`
  padding: 1.5rem;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.div`
  width: 60px;
  height: 80px;
  background: ${props => props.$imageUrl ? `url(${props.$imageUrl})` : '#f3f4f6'};
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #9ca3af;
  flex-shrink: 0;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const ItemQuantity = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: #059669;
`;

const EmptyOrders = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #374151;
  }
  
  p {
    margin-bottom: 2rem;
  }
`;

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        const response = await orderService.getOrdersByUser(user.id, 0, 50);
        setOrders(response.data.data.content);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthenticated]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      SHIPPED: 'Đang giao',
      DELIVERED: 'Đã giao',
      CANCELLED: 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  if (!isAuthenticated) {
    return (
      <OrdersContainer>
        <OrdersContent>
          <h1>Vui lòng đăng nhập để xem đơn hàng</h1>
        </OrdersContent>
      </OrdersContainer>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (orders.length === 0) {
    return (
      <OrdersContainer>
        <OrdersContent>
          <PageHeader>
            <PageTitle>Đơn hàng của tôi</PageTitle>
          </PageHeader>
          
          <EmptyOrders>
            <h3>Chưa có đơn hàng nào</h3>
            <p>Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!</p>
          </EmptyOrders>
        </OrdersContent>
      </OrdersContainer>
    );
  }

  return (
    <OrdersContainer>
      <OrdersContent>
        <PageHeader>
          <PageTitle>Đơn hàng của tôi</PageTitle>
        </PageHeader>
        
        <OrdersList>
          {orders.map(order => (
            <OrderCard key={order.id}>
              <OrderHeader>
                <OrderInfo>
                  <OrderId>Đơn hàng #{order.id}</OrderId>
                  <OrderDate>{formatDate(order.createdAt)}</OrderDate>
                </OrderInfo>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <OrderStatus className={order.status}>
                    {getStatusText(order.status)}
                  </OrderStatus>
                  <OrderTotal>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(order.totalAmount)}
                  </OrderTotal>
                </div>
              </OrderHeader>
              
              <OrderItems>
                {order.orderItems.map(item => (
                  <OrderItem key={item.id}>
                    <ItemImage $imageUrl={item.bookImageUrl}>
                      {!item.bookImageUrl && '📚'}
                    </ItemImage>
                    
                    <ItemInfo>
                      <ItemTitle>{item.bookTitle}</ItemTitle>
                      <ItemQuantity>Số lượng: {item.quantity}</ItemQuantity>
                    </ItemInfo>
                    
                    <ItemPrice>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(item.price)}
                    </ItemPrice>
                  </OrderItem>
                ))}
              </OrderItems>
            </OrderCard>
          ))}
        </OrdersList>
      </OrdersContent>
    </OrdersContainer>
  );
};

export default Orders;
