import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { bookService } from '../services/bookService';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const BookDetailContainer = styled.div`
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
`;

const BookDetailContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const BookDetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const BookImage = styled.div`
  width: 100%;
  height: 500px;
  background: ${props => props.$imageUrl ? `url(${props.$imageUrl})` : '#f3f4f6'};
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  color: #9ca3af;
`;

const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BookTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
`;

const BookAuthor = styled.p`
  font-size: 1.2rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const BookCategory = styled.span`
  background: #dbeafe;
  color: #1e40af;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 1rem;
`;

const BookPrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: 1rem;
`;

const BookRating = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StarRating = styled.div`
  color: #fbbf24;
  font-size: 1.2rem;
`;

const RatingText = styled.span`
  color: #6b7280;
  font-size: 1rem;
`;

const BookDescription = styled.div`
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const DescriptionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const DescriptionText = styled.p`
  color: #4b5563;
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
    }
  }
  
  &.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 2px solid #e5e7eb;
    
    &:hover {
      background: #e5e7eb;
    }
  }
`;

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await bookService.getBookById(id);
        setBook(response.data.data);
      } catch (error) {
        console.error('Error fetching book:', error);
        toast.error('Không thể tải thông tin sách');
        navigate('/books');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(book, 1);
    toast.success('Đã thêm sách vào giỏ hàng!');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    
    if (hasHalfStar) {
      stars.push('☆');
    }
    
    while (stars.length < 5) {
      stars.push('☆');
    }
    
    return stars.join('');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!book) {
    return (
      <BookDetailContainer>
        <BookDetailContent>
          <h1>Sách không tồn tại</h1>
        </BookDetailContent>
      </BookDetailContainer>
    );
  }

  return (
    <BookDetailContainer>
      <BookDetailContent>
        <BookDetailGrid>
          <BookImage $imageUrl={book.imageUrl}>
            {!book.imageUrl && '📚'}
          </BookImage>
          
          <BookInfo>
            <BookTitle>{book.title}</BookTitle>
            <BookAuthor>Tác giả: {book.author}</BookAuthor>
            <BookCategory>{book.category}</BookCategory>
            
            <BookPrice>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(book.price)}
            </BookPrice>
            
            <BookRating>
              <StarRating>{renderStars(book.rating)}</StarRating>
              <RatingText>
                {book.rating.toFixed(1)} ({book.reviewCount} đánh giá)
              </RatingText>
            </BookRating>
            
            <BookDescription>
              <DescriptionTitle>Mô tả</DescriptionTitle>
              <DescriptionText>
                {book.description || 'Chưa có mô tả cho cuốn sách này.'}
              </DescriptionText>
            </BookDescription>
            
            {book.summary && (
              <BookDescription>
                <DescriptionTitle>Tóm tắt</DescriptionTitle>
                <DescriptionText>{book.summary}</DescriptionText>
              </BookDescription>
            )}
            
            <ActionButtons>
              <Button className="primary" onClick={handleAddToCart}>
                Thêm vào giỏ hàng
              </Button>
              <Button className="secondary" onClick={() => navigate('/books')}>
                Quay lại
              </Button>
            </ActionButtons>
          </BookInfo>
        </BookDetailGrid>
      </BookDetailContent>
    </BookDetailContainer>
  );
};

export default BookDetail;
