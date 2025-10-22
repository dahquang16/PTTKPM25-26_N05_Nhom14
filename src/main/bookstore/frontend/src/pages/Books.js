import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { bookService } from '../services/bookService';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';

const BooksContainer = styled.div`
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
`;

const BooksContent = styled.div`
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
  margin-bottom: 1rem;
`;

const PageSubtitle = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
`;

const FiltersSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
`;

const FilterInput = styled.input`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const FilterButton = styled.button`
  padding: 0.75rem 1.5rem;
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

const ResultsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ResultsCount = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
`;

const SortSelect = styled.select`
  padding: 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    border-color: #3b82f6;
    color: #3b82f6;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.active {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1rem;
  }
`;

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filter states
  const [filters, setFilters] = useState({
    title: searchParams.get('search') || '',
    author: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'id',
    sortDir: 'asc'
  });

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          size: 12,
          sortBy: filters.sortBy,
          sortDir: filters.sortDir
        };

        if (filters.title) params.title = filters.title;
        if (filters.author) params.author = filters.author;
        if (filters.category) params.category = filters.category;
        if (filters.minPrice) params.minPrice = parseFloat(filters.minPrice);
        if (filters.maxPrice) params.maxPrice = parseFloat(filters.maxPrice);

        const response = await bookService.getBooks(params);
        const data = response.data.data;
        
        setBooks(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(0);
  };

  const handleApplyFilters = () => {
    setCurrentPage(0);
    // Update URL params
    const newParams = new URLSearchParams();
    if (filters.title) newParams.set('search', filters.title);
    if (filters.author) newParams.set('author', filters.author);
    if (filters.category) newParams.set('category', filters.category);
    if (filters.minPrice) newParams.set('minPrice', filters.minPrice);
    if (filters.maxPrice) newParams.set('maxPrice', filters.maxPrice);
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setFilters({
      title: '',
      author: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'id',
      sortDir: 'asc'
    });
    setCurrentPage(0);
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationButton
          key={i}
          className={i === currentPage ? 'active' : ''}
          onClick={() => handlePageChange(i)}
        >
          {i + 1}
        </PaginationButton>
      );
    }

    return (
      <Pagination>
        <PaginationButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Trước
        </PaginationButton>
        {pages}
        <PaginationButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Sau
        </PaginationButton>
      </Pagination>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <BooksContainer>
      <BooksContent>
        <PageHeader>
          <PageTitle>Danh mục sách</PageTitle>
          <PageSubtitle>
            Khám phá bộ sưu tập sách đa dạng của chúng tôi
          </PageSubtitle>
        </PageHeader>

        <FiltersSection>
          <FiltersGrid>
            <FilterGroup>
              <FilterLabel>Tên sách</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Nhập tên sách..."
                value={filters.title}
                onChange={(e) => handleFilterChange('title', e.target.value)}
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Tác giả</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Nhập tên tác giả..."
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Thể loại</FilterLabel>
              <FilterSelect
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">Tất cả thể loại</option>
                <option value="Fiction">Tiểu thuyết</option>
                <option value="Romance">Lãng mạn</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Science Fiction">Khoa học viễn tưởng</option>
                <option value="Programming">Lập trình</option>
              </FilterSelect>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Giá từ</FilterLabel>
              <FilterInput
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Giá đến</FilterLabel>
              <FilterInput
                type="number"
                placeholder="1000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Sắp xếp theo</FilterLabel>
              <FilterSelect
                value={`${filters.sortBy}-${filters.sortDir}`}
                onChange={(e) => {
                  const [sortBy, sortDir] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortDir', sortDir);
                }}
              >
                <option value="id-asc">Mặc định</option>
                <option value="title-asc">Tên A-Z</option>
                <option value="title-desc">Tên Z-A</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
                <option value="rating-desc">Đánh giá cao nhất</option>
              </FilterSelect>
            </FilterGroup>
          </FiltersGrid>
          
          <FilterButtons>
            <FilterButton className="secondary" onClick={handleClearFilters}>
              Xóa bộ lọc
            </FilterButton>
            <FilterButton className="primary" onClick={handleApplyFilters}>
              Áp dụng bộ lọc
            </FilterButton>
          </FilterButtons>
        </FiltersSection>

        <ResultsSection>
          <ResultsCount>
            Hiển thị {books.length} trong tổng số {totalElements} sách
          </ResultsCount>
        </ResultsSection>

        {books.length === 0 ? (
          <NoResults>
            <h3>Không tìm thấy sách nào</h3>
            <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </NoResults>
        ) : (
          <>
            <BooksGrid>
              {books.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </BooksGrid>
            
            {totalPages > 1 && renderPagination()}
          </>
        )}
      </BooksContent>
    </BooksContainer>
  );
};

export default Books;


