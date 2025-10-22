import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import styled from 'styled-components';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

const AdminOrdersContainer = styled.div`
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
`;

const AdminOrdersContent = styled.div`
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
`;

const OrdersTable = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f9fafb;
  }
`;

const OrderId = styled.div`
  font-weight: 600;
  color: #1e293b;
`;

const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CustomerName = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const CustomerEmail = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
`;

const OrderDate = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
`;

const OrderStatus = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
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
  font-weight: 600;
  color: #059669;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  
  &.view {
    background: #dbeafe;
    color: #1e40af;
    
    &:hover {
      background: #bfdbfe;
    }
  }
  
  &.update {
    background: #d1fae5;
    color: #065f46;
    
    &:hover {
      background: #a7f3d0;
    }
  }
`;

const OrderDetailModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const OrderDetailContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const OrderDetailTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: #1e293b;
`;

const OrderInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: #374151;
`;

const InfoValue = styled.span`
  color: #6b7280;
`;

const OrderItems = styled.div`
  margin-bottom: 1.5rem;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const ItemDetails = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: #059669;
`;

const CloseButton = styled.button`
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  
  &:hover {
    background: #4b5563;
  }
`;

const AdminOrders = () => {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getAllOrders({ page: 0, size: 100 });
        setOrders(response.data.data.content);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Không thể tải danh sách đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin()) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Cập nhật trạng thái đơn hàng thành công');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  const handleViewOrder = async (orderId) => {
    try {
      const response = await orderService.getOrderById(orderId);
      setSelectedOrder(response.data.data);
      setShowOrderDetail(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Không thể tải chi tiết đơn hàng');
    }
  };

  const handleCloseOrderDetail = () => {
    setShowOrderDetail(false);
    setSelectedOrder(null);
  };

  if (!isAdmin()) {
    return (
      <AdminOrdersContainer>
        <AdminOrdersContent>
          <h1>Bạn không có quyền truy cập trang này</h1>
        </AdminOrdersContent>
      </AdminOrdersContainer>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AdminOrdersContainer>
      <AdminOrdersContent>
        <PageHeader>
          <PageTitle>Quản lý đơn hàng</PageTitle>
        </PageHeader>

        <OrdersTable>
          <TableHeader>
            <div>Mã đơn</div>
            <div>Khách hàng</div>
            <div>Ngày đặt</div>
            <div>Trạng thái</div>
            <div>Tổng tiền</div>
            <div>Thao tác</div>
          </TableHeader>
          
          {orders.map(order => (
            <TableRow key={order.id}>
              <OrderId>#{order.id}</OrderId>
              
              <CustomerInfo>
                <CustomerName>{order.userName}</CustomerName>
                <CustomerEmail>{order.userEmail}</CustomerEmail>
              </CustomerInfo>
              
              <OrderDate>{formatDate(order.createdAt)}</OrderDate>
              
              <OrderStatus className={order.status}>
                {getStatusText(order.status)}
              </OrderStatus>
              
              <OrderTotal>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(order.totalAmount)}
              </OrderTotal>
              
              <ActionButtons>
                <ActionButton 
                  className="view"
                  onClick={() => handleViewOrder(order.id)}
                >
                  Xem
                </ActionButton>
                <ActionButton 
                  className="update"
                  onClick={() => {
                    const newStatus = order.status === 'PENDING' ? 'CONFIRMED' : 
                                    order.status === 'CONFIRMED' ? 'SHIPPED' : 
                                    order.status === 'SHIPPED' ? 'DELIVERED' : 'DELIVERED';
                    handleUpdateStatus(order.id, newStatus);
                  }}
                >
                  Cập nhật
                </ActionButton>
              </ActionButtons>
            </TableRow>
          ))}
        </OrdersTable>
      </AdminOrdersContent>
      
      {showOrderDetail && selectedOrder && (
        <OrderDetailModal>
          <OrderDetailContent>
            <OrderDetailTitle>Chi tiết đơn hàng #{selectedOrder.id}</OrderDetailTitle>
            
            <OrderInfo>
              <InfoRow>
                <InfoLabel>Khách hàng:</InfoLabel>
                <InfoValue>{selectedOrder.userName}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Email:</InfoLabel>
                <InfoValue>{selectedOrder.userEmail}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Địa chỉ giao hàng:</InfoLabel>
                <InfoValue>{selectedOrder.shippingAddress}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Số điện thoại:</InfoLabel>
                <InfoValue>{selectedOrder.shippingPhone}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Phương thức thanh toán:</InfoLabel>
                <InfoValue>{selectedOrder.paymentMethod}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Trạng thái:</InfoLabel>
                <InfoValue>{getStatusText(selectedOrder.status)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Ngày đặt:</InfoLabel>
                <InfoValue>{formatDate(selectedOrder.createdAt)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Tổng tiền:</InfoLabel>
                <InfoValue>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(selectedOrder.totalAmount)}
                </InfoValue>
              </InfoRow>
            </OrderInfo>
            
            <OrderItems>
              <h3>Danh sách sản phẩm:</h3>
              {selectedOrder.orderItems && selectedOrder.orderItems.map((item, index) => (
                <OrderItem key={index}>
                  <ItemInfo>
                    <ItemName>{item.bookTitle}</ItemName>
                    <ItemDetails>
                      Tác giả: {item.bookAuthor} | Số lượng: {item.quantity}
                    </ItemDetails>
                  </ItemInfo>
                  <ItemPrice>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(item.price * item.quantity)}
                  </ItemPrice>
                </OrderItem>
              ))}
            </OrderItems>
            
            <CloseButton onClick={handleCloseOrderDetail}>
              Đóng
            </CloseButton>
          </OrderDetailContent>
        </OrderDetailModal>
      )}
    </AdminOrdersContainer>
  );
};

export default AdminOrders;
