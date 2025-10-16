import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const BookImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${props => props.$imageUrl ? `url(${props.$imageUrl})` : '#f3f4f6'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #9ca3af;
`;

const BookInfo = styled.div`
  padding: 1rem;
`;

const BookTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BookAuthor = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const BookCategory = styled.span`
  background: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: inline-block;
`;

const BookPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: 1rem;
`;

const BookRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #6b7280;
`;

const StarRating = styled.div`
  color: #fbbf24;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  }
  
  &.secondary {
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  }
`;

const BookCard = ({ book }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book, 1);
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

  return (
    <Card>
      <Link to={`/books/${book.id}`} style={{ textDecoration: 'none' }}>
        <BookImage $imageUrl={book.imageUrl}>
          {!book.imageUrl && 'hình ảnh sách'}
        </BookImage>
        
        <BookInfo>
          <BookTitle>{book.title}</BookTitle>
          <BookAuthor>Tác giả: {book.author}</BookAuthor>
          <BookCategory>{book.category}</BookCategory>
          
          <BookPrice>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            })}
          </BookPrice>
          
          <BookRating>
            <StarRating>{renderStars(book.rating)}</StarRating>
            <span>({book.reviewCount} đánh giá)</span>
          </BookRating>
          
          <ActionButtons>
            <Button 
              className="primary" 
              onClick={handleAddToCart}
            >
              Thêm vào giỏ
            </Button>
            <Button className="secondary">
              Chi tiết
            </Button>
          </ActionButtons>
        </BookInfo>
      </Link>
    </Card>
  );
};

export default BookCard;
