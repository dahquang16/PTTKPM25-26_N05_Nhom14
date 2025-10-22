import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookService } from '../../services/bookService';
import styled from 'styled-components';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

const AdminBooksContainer = styled.div`
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
`;

const AdminBooksContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
`;

const AddBookButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const BooksTable = styled.div`
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

const BookImage = styled.div`
  width: 50px;
  height: 60px;
  background: ${props => props.$imageUrl ? `url(${props.$imageUrl})` : '#f3f4f6'};
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #9ca3af;
`;

const BookTitle = styled.div`
  font-weight: 500;
  color: #1e293b;
  line-height: 1.4;
`;

const BookAuthor = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
`;

const BookPrice = styled.div`
  font-weight: 600;
  color: #059669;
`;

const BookStock = styled.div`
  color: #374151;
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
  
  &.edit {
    background: #dbeafe;
    color: #1e40af;
    
    &:hover {
      background: #bfdbfe;
    }
  }
  
  &.delete {
    background: #fee2e2;
    color: #991b1b;
    
    &:hover {
      background: #fecaca;
    }
  }
`;

const EditForm = styled.div`
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

const EditFormContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const FormTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: #1e293b;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  
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
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const SaveButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: #2563eb;
  }
`;

const CancelButton = styled.button`
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: #4b5563;
  }
`;

const AdminBooks = () => {
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    description: '',
    summary: '',
    price: 0,
    imageUrl: '',
    category: '',
    stockQuantity: 0
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookService.getBooks({ page: 0, size: 100 });
        setBooks(response.data.data.content);
      } catch (error) {
        console.error('Error fetching books:', error);
        toast.error('Không thể tải danh sách sách');
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin()) {
      fetchBooks();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cuốn sách này?')) {
      try {
        await bookService.deleteBook(bookId);
        setBooks(books.filter(book => book.id !== bookId));
        toast.success('Xóa sách thành công');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Có lỗi xảy ra khi xóa sách');
      }
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowEditForm(true);
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    try {
      const updatedBook = await bookService.updateBook(editingBook.id, editingBook);
      setBooks(books.map(book => 
        book.id === editingBook.id ? updatedBook.data.data : book
      ));
      setShowEditForm(false);
      setEditingBook(null);
      toast.success('Cập nhật sách thành công');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Có lỗi xảy ra khi cập nhật sách');
    }
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditingBook(null);
  };

  const handleInputChange = (field, value) => {
    setEditingBook(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddBook = () => {
    setShowAddForm(true);
    setNewBook({
      title: '',
      author: '',
      publisher: '',
      isbn: '',
      description: '',
      summary: '',
      price: 0,
      imageUrl: '',
      category: '',
      stockQuantity: 0
    });
  };

  const handleSaveNewBook = async (e) => {
    e.preventDefault();
    try {
      const createdBook = await bookService.createBook(newBook);
      setBooks([...books, createdBook.data.data]);
      setShowAddForm(false);
      setNewBook({
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        description: '',
        summary: '',
        price: 0,
        imageUrl: '',
        category: '',
        stockQuantity: 0
      });
      toast.success('Thêm sách thành công');
    } catch (error) {
      console.error('Create error:', error);
      toast.error('Có lỗi xảy ra khi thêm sách');
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewBook({
      title: '',
      author: '',
      publisher: '',
      isbn: '',
      description: '',
      summary: '',
      price: 0,
      imageUrl: '',
      category: '',
      stockQuantity: 0
    });
  };

  const handleNewBookInputChange = (field, value) => {
    setNewBook(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isAdmin()) {
    return (
      <AdminBooksContainer>
        <AdminBooksContent>
          <h1>Bạn không có quyền truy cập trang này</h1>
        </AdminBooksContent>
      </AdminBooksContainer>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AdminBooksContainer>
      <AdminBooksContent>
        <PageHeader>
          <PageTitle>Quản lý sách</PageTitle>
          <AddBookButton onClick={handleAddBook}>Thêm sách mới</AddBookButton>
        </PageHeader>

        <BooksTable>
          <TableHeader>
            <div>Ảnh</div>
            <div>Tên sách</div>
            <div>Tác giả</div>
            <div>Giá</div>
            <div>Tồn kho</div>
            <div>Thao tác</div>
          </TableHeader>
          
          {books.map(book => (
            <TableRow key={book.id}>
              <BookImage $imageUrl={book.imageUrl}>
                {!book.imageUrl && '📚'}
              </BookImage>
              
              <div>
                <BookTitle>{book.title}</BookTitle>
                <BookAuthor>{book.author}</BookAuthor>
              </div>
              
              <div>{book.author}</div>
              
              <BookPrice>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(book.price)}
              </BookPrice>
              
              <BookStock>{book.stockQuantity}</BookStock>
              
              <ActionButtons>
                <ActionButton 
                  className="edit"
                  onClick={() => handleEditBook(book)}
                >
                  Sửa
                </ActionButton>
                <ActionButton 
                  className="delete"
                  onClick={() => handleDeleteBook(book.id)}
                >
                  Xóa
                </ActionButton>
              </ActionButtons>
            </TableRow>
          ))}
        </BooksTable>
      </AdminBooksContent>
      
      {showEditForm && editingBook && (
        <EditForm>
          <EditFormContent>
            <FormTitle>Chỉnh sửa sách</FormTitle>
            <form onSubmit={handleSaveBook}>
              <FormGroup>
                <Label>Tên sách</Label>
                <Input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Tác giả</Label>
                <Input
                  type="text"
                  value={editingBook.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Nhà xuất bản</Label>
                <Input
                  type="text"
                  value={editingBook.publisher}
                  onChange={(e) => handleInputChange('publisher', e.target.value)}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>ISBN</Label>
                <Input
                  type="text"
                  value={editingBook.isbn}
                  onChange={(e) => handleInputChange('isbn', e.target.value)}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Giá (VND)</Label>
                <Input
                  type="number"
                  step="1000"
                  value={editingBook.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Số lượng tồn kho</Label>
                <Input
                  type="number"
                  value={editingBook.stockQuantity}
                  onChange={(e) => handleInputChange('stockQuantity', parseInt(e.target.value))}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Mô tả</Label>
                <TextArea
                  value={editingBook.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>URL ảnh</Label>
                <Input
                  type="url"
                  value={editingBook.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                />
              </FormGroup>
              
              <ButtonGroup>
                <CancelButton type="button" onClick={handleCancelEdit}>
                  Hủy
                </CancelButton>
                <SaveButton type="submit">
                  Lưu
                </SaveButton>
              </ButtonGroup>
            </form>
          </EditFormContent>
        </EditForm>
      )}

      {showAddForm && (
        <EditForm>
          <EditFormContent>
            <FormTitle>Thêm sách mới</FormTitle>
            <form onSubmit={handleSaveNewBook}>
              <FormGroup>
                <Label>Tên sách</Label>
                <Input
                  type="text"
                  value={newBook.title}
                  onChange={(e) => handleNewBookInputChange('title', e.target.value)}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Tác giả</Label>
                <Input
                  type="text"
                  value={newBook.author}
                  onChange={(e) => handleNewBookInputChange('author', e.target.value)}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Nhà xuất bản</Label>
                <Input
                  type="text"
                  value={newBook.publisher}
                  onChange={(e) => handleNewBookInputChange('publisher', e.target.value)}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>ISBN</Label>
                <Input
                  type="text"
                  value={newBook.isbn}
                  onChange={(e) => handleNewBookInputChange('isbn', e.target.value)}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Thể loại</Label>
                <Input
                  type="text"
                  value={newBook.category}
                  onChange={(e) => handleNewBookInputChange('category', e.target.value)}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Giá (VND)</Label>
                <Input
                  type="number"
                  step="1000"
                  value={newBook.price}
                  onChange={(e) => handleNewBookInputChange('price', parseFloat(e.target.value))}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Số lượng tồn kho</Label>
                <Input
                  type="number"
                  value={newBook.stockQuantity}
                  onChange={(e) => handleNewBookInputChange('stockQuantity', parseInt(e.target.value))}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Mô tả</Label>
                <TextArea
                  value={newBook.description}
                  onChange={(e) => handleNewBookInputChange('description', e.target.value)}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Tóm tắt</Label>
                <TextArea
                  value={newBook.summary}
                  onChange={(e) => handleNewBookInputChange('summary', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>URL ảnh</Label>
                <Input
                  type="url"
                  value={newBook.imageUrl}
                  onChange={(e) => handleNewBookInputChange('imageUrl', e.target.value)}
                />
              </FormGroup>
              
              <ButtonGroup>
                <CancelButton type="button" onClick={handleCancelAdd}>
                  Hủy
                </CancelButton>
                <SaveButton type="submit">
                  Thêm sách
                </SaveButton>
              </ButtonGroup>
            </form>
          </EditFormContent>
        </EditForm>
      )}
    </AdminBooksContainer>
  );
};

export default AdminBooks;
