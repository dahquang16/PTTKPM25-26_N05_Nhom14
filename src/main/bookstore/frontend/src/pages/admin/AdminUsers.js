import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import styled from 'styled-components';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

const AdminUsersContainer = styled.div`
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
`;

const AdminUsersContent = styled.div`
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

const UsersTable = styled.div`
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

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const UserEmail = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
`;

const UserRole = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  
  &.ADMIN {
    background: #fef3c7;
    color: #92400e;
  }
  
  &.CUSTOMER {
    background: #dbeafe;
    color: #1e40af;
  }
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
  
  &:disabled {
    background: #f9fafb;
    color: #6b7280;
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

const Select = styled.select`
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

const AdminUsers = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users...');
        const response = await userService.getUsers({ page: 0, size: 100 });
        console.log('Users response:', response.data);
        
        if (response.data && response.data.data && response.data.data.content) {
          setUsers(response.data.data.content);
          toast.success(`Đã tải ${response.data.data.content.length} người dùng`);
        } else {
          console.error('Invalid response structure:', response.data);
          toast.error('Cấu trúc dữ liệu không hợp lệ');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Không thể tải danh sách người dùng';
        toast.error(`Lỗi: ${errorMessage}`);
        
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin()) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditForm(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await userService.updateUser(editingUser.id, editingUser);
      setUsers(users.map(user => 
        user.id === editingUser.id ? updatedUser.data.data : user
      ));
      setShowEditForm(false);
      setEditingUser(null);
      toast.success('Cập nhật thông tin người dùng thành công');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin người dùng');
    }
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditingUser(null);
  };

  const handleInputChange = (field, value) => {
    setEditingUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await userService.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        toast.success('Xóa người dùng thành công');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Có lỗi xảy ra khi xóa người dùng');
      }
    }
  };

  if (!isAdmin()) {
    return (
      <AdminUsersContainer>
        <AdminUsersContent>
          <h1>Bạn không có quyền truy cập trang này</h1>
        </AdminUsersContent>
      </AdminUsersContainer>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AdminUsersContainer>
      <AdminUsersContent>
        <PageHeader>
          <PageTitle>Quản lý người dùng</PageTitle>
        </PageHeader>

        {users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <h3>Không có dữ liệu người dùng</h3>
            <p>Vui lòng kiểm tra kết nối backend hoặc thử lại sau.</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{ 
                padding: '0.5rem 1rem', 
                background: '#3b82f6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Tải lại
            </button>
          </div>
        ) : (
          <UsersTable>
            <TableHeader>
              <div>Avatar</div>
              <div>Thông tin</div>
              <div>Số điện thoại</div>
              <div>Địa chỉ</div>
              <div>Vai trò</div>
              <div>Thao tác</div>
            </TableHeader>
            
            {users.map(user => (
              <TableRow key={user.id}>
                <UserAvatar>
                  {user.name.charAt(0).toUpperCase()}
                </UserAvatar>
                
                <UserInfo>
                  <UserName>{user.name}</UserName>
                  <UserEmail>{user.email}</UserEmail>
                </UserInfo>
                
                <div>{user.phone}</div>
                
                <div>{user.address || 'Chưa cập nhật'}</div>
                
                <UserRole className={user.role}>
                  {user.role === 'ADMIN' ? 'Quản trị' : 'Khách hàng'}
                </UserRole>
                
                <ActionButtons>
                  <ActionButton 
                    className="edit"
                    onClick={() => handleEditUser(user)}
                  >
                    Sửa
                  </ActionButton>
                  <ActionButton 
                    className="delete"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Xóa
                  </ActionButton>
                </ActionButtons>
              </TableRow>
            ))}
          </UsersTable>
        )}
      </AdminUsersContent>
      
      {showEditForm && editingUser && (
        <EditForm>
          <EditFormContent>
            <FormTitle>Chỉnh sửa thông tin người dùng</FormTitle>
            <form onSubmit={handleSaveUser}>
              <FormGroup>
                <Label>Họ và tên</Label>
                <Input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editingUser.email}
                  disabled
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Số điện thoại</Label>
                <Input
                  type="tel"
                  value={editingUser.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Địa chỉ</Label>
                <TextArea
                  value={editingUser.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Nhập địa chỉ"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Vai trò</Label>
                <Select
                  value={editingUser.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                >
                  <option value="CUSTOMER">Khách hàng</option>
                  <option value="ADMIN">Quản trị</option>
                </Select>
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
    </AdminUsersContainer>
  );
};

export default AdminUsers;
