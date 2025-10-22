import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { bookService } from '../services/bookService';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';

const HomeContainer = styled.div`
  min-height: calc(100vh - 200px);
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const SearchSection = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Section = styled.section`
  padding: 4rem 0;
`;

const SectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  color: #1e293b;
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ViewAllButton = styled(Link)`
  display: inline-block;
  background: #3b82f6;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;
  margin: 0 auto;
  
  &:hover {
    background: #2563eb;
  }
`;

const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Home = () => {
  const [popularBooks, setPopularBooks] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [popularResponse, availableResponse] = await Promise.all([
          bookService.getPopularBooks(0, 8),
          bookService.getAvailableBooks(0, 8)
        ]);
        
        setPopularBooks(popularResponse.data.data.content);
        setAvailableBooks(availableResponse.data.data.content);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <HomeContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Chào mừng đến với Nhóm 14</HeroTitle>
          <HeroSubtitle>
            Khám phá thế giới tri thức với hàng ngàn cuốn sách hay
          </HeroSubtitle>
          <SearchSection>
            <SearchBar />
          </SearchSection>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionContent>
          <SectionTitle>Sách phổ biến</SectionTitle>
          <BooksGrid>
            {popularBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </BooksGrid>
          <ButtonContainer>
            <ViewAllButton to="/books?sort=rating&sortDir=desc">
              Xem tất cả sách phổ biến
            </ViewAllButton>
          </ButtonContainer>
        </SectionContent>
      </Section>

      <Section style={{ background: '#f8fafc' }}>
        <SectionContent>
          <SectionTitle>Sách có sẵn</SectionTitle>
          <BooksGrid>
            {availableBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </BooksGrid>
          <ButtonContainer>
            <ViewAllButton to="/books?available=true">
              Xem tất cả sách có sẵn
            </ViewAllButton>
          </ButtonContainer>
        </SectionContent>
      </Section>
    </HomeContainer>
  );
};

export default Home;


