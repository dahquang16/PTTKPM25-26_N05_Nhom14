import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';

const CartContainer = styled.div`
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
`;

const CartContent = styled.div`
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

const CartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CartItem = styled.div`
  display: flex;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.div`
  width: 100px;
  height: 120px;
  background: ${props => props.$imageUrl ? `url(${props.$imageUrl})` : '#f3f4f6'};
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #9ca3af;
  margin-right: 1rem;
  flex-shrink: 0;
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ItemTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const ItemAuthor = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ItemPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: 1rem;
`;

const ItemControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  background: #f3f4f6;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #e5e7eb;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 0.5rem;
  border: none;
  text-align: center;
  font-weight: 500;
  
  &:focus {
    outline: none;
  }
`;

const RemoveButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #dc2626;
  }
`;

const CartSummary = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 2rem;
`;

const SummaryTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  &.total {
    font-weight: 700;
    font-size: 1.1rem;
    color: #1e293b;
    border-top: 1px solid #e5e7eb;
    padding-top: 0.5rem;
    margin-top: 1rem;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CheckoutForm = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const PaymentMethodGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PaymentOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  
  &:hover {
    border-color: #3b82f6;
  }
  
  input[type="radio"] {
    margin: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 1rem;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #4b5563;
  }
`;

const EmptyCart = styled.div`
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

const ContinueShoppingButton = styled(Link)`
  display: inline-block;
  background: #3b82f6;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #2563eb;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    paymentMethod: 'COD' // COD = Cash on Delivery
  });

  const handleQuantityChange = (bookId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(bookId);
    } else {
      updateQuantity(bookId, newQuantity);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setCheckoutData(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thanh toán');
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }

    if (!showCheckoutForm) {
      setShowCheckoutForm(true);
      return;
    }

    // Validate form
    if (!checkoutData.fullName || !checkoutData.phone || !checkoutData.address) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    setLoading(true);
    
    try {
      const orderData = {
        userId: user.id,
        shippingAddress: checkoutData.address,
        shippingPhone: checkoutData.phone,
        paymentMethod: checkoutData.paymentMethod === 'COD' ? 'CASH_ON_DELIVERY' : 'CREDIT_CARD',
        notes: `Tên người nhận: ${checkoutData.fullName}`,
        orderItems: cartItems.map(item => ({
          bookId: item.id,
          quantity: item.quantity,
          price: parseFloat(item.price)
        }))
      };

      console.log('Sending order data:', orderData); // Debug log

      const response = await orderService.createOrder(orderData);
      console.log('Order response:', response.data); // Debug log
      
      if (response.data.success) {
        toast.success('Đặt hàng thành công!');
        clearCart();
        setShowCheckoutForm(false);
        navigate('/orders');
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra khi đặt hàng');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đặt hàng';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <CartContainer>
        <CartContent>
          <PageHeader>
            <PageTitle>Giỏ hàng</PageTitle>
          </PageHeader>
          
          <EmptyCart>
            <h3>Giỏ hàng trống</h3>
            <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <ContinueShoppingButton to="/books">
              Tiếp tục mua sắm
            </ContinueShoppingButton>
          </EmptyCart>
        </CartContent>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartContent>
        <PageHeader>
          <PageTitle>Giỏ hàng</PageTitle>
        </PageHeader>
        
        <CartGrid>
          <CartItems>
            {cartItems.map(item => (
              <CartItem key={item.id}>
                <ItemImage $imageUrl={item.imageUrl}>
                  {!item.imageUrl && '📚'}
                </ItemImage>
                
                <ItemInfo>
                  <div>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemAuthor>Tác giả: {item.author}</ItemAuthor>
                    <ItemPrice>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(item.price)}
                    </ItemPrice>
                  </div>
                  
                  <ItemControls>
                    <QuantityControl>
                      <QuantityButton
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </QuantityButton>
                      <QuantityInput
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                        min="1"
                      />
                      <QuantityButton
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </QuantityButton>
                    </QuantityControl>
                    
                    <RemoveButton onClick={() => removeFromCart(item.id)}>
                      Xóa
                    </RemoveButton>
                  </ItemControls>
                </ItemInfo>
              </CartItem>
            ))}
          </CartItems>
          
          {showCheckoutForm && (
            <CheckoutForm>
              <FormTitle>Thông tin giao hàng</FormTitle>
              
              <FormGroup>
                <Label htmlFor="fullName">Họ và tên người nhận *</Label>
                <Input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={checkoutData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={checkoutData.phone}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="address">Địa chỉ giao hàng *</Label>
                <TextArea
                  id="address"
                  name="address"
                  value={checkoutData.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ chi tiết..."
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Phương thức thanh toán</Label>
                <PaymentMethodGroup>
                  <PaymentOption>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={checkoutData.paymentMethod === 'COD'}
                      onChange={() => handlePaymentMethodChange('COD')}
                    />
                    <div>
                      <div>💰 Thanh toán khi nhận hàng</div>
                      <small>Thanh toán bằng tiền mặt khi nhận hàng</small>
                    </div>
                  </PaymentOption>
                  
                  <PaymentOption>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CARD"
                      checked={checkoutData.paymentMethod === 'CARD'}
                      onChange={() => handlePaymentMethodChange('CARD')}
                    />
                    <div>
                      <div>💳 Thanh toán thẻ</div>
                      <small>Thanh toán bằng thẻ tín dụng/ghi nợ</small>
                    </div>
                  </PaymentOption>
                </PaymentMethodGroup>
              </FormGroup>
              
              <ButtonGroup>
                <SecondaryButton onClick={() => setShowCheckoutForm(false)}>
                  Quay lại
                </SecondaryButton>
                <CheckoutButton onClick={handleCheckout} disabled={loading}>
                  {loading && <LoadingSpinner />}
                  {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                </CheckoutButton>
              </ButtonGroup>
            </CheckoutForm>
          )}
          
          <CartSummary>
            <SummaryTitle>Tóm tắt đơn hàng</SummaryTitle>
            
            <SummaryRow>
              <span>Tạm tính:</span>
              <span>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(getCartTotal())}
              </span>
            </SummaryRow>
            
            <SummaryRow>
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </SummaryRow>
            
            <SummaryRow className="total">
              <span>Tổng cộng:</span>
              <span>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(getCartTotal())}
              </span>
            </SummaryRow>
            
            <CheckoutButton onClick={handleCheckout} disabled={loading}>
              {loading && <LoadingSpinner />}
              {loading ? 'Đang xử lý...' : (showCheckoutForm ? 'Xác nhận đặt hàng' : 'Tiến hành thanh toán')}
            </CheckoutButton>
          </CartSummary>
        </CartGrid>
      </CartContent>
    </CartContainer>
  );
};

export default Cart;
