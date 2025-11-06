import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserListPage from '../pages/UserListPage';
import { UserContext } from 'container/shared';
import { BrowserRouter } from 'react-router-dom';

// Mock the antd components
jest.mock('antd', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Input: {
    Search: ({ onChange, placeholder }: { onChange: (e: any) => void; placeholder: string }) => (
      <input type="text" onChange={onChange} placeholder={placeholder} data-testid="search-input" />
    ),
  },
  Row: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Col: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Spin: () => <div data-testid="loading-spinner">Loading...</div>,
}));

// Mock the UserTable component
jest.mock('../components/userTable', () => {
  return {
    __esModule: true,
    default: ({ users, onSelect }: { users: any[]; onSelect: (user: any) => void }) => (
      <div data-testid="user-table">
        {users.map((user) => (
          <div key={user.id} onClick={() => onSelect(user)}>
            {user.name}
          </div>
        ))}
      </div>
    ),
  };
});

// mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('UserListPage Component', () => {
  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
    },
    {
      id: 2,
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane@example.com',
    },
  ];


  const renderUserListPage = (loading = false) => {
    return render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            users: mockUsers,
            loading,
            setSelectedUser: jest.fn(),
          }}
        >
          <UserListPage />
        </UserContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading spinner when loading', () => {
    renderUserListPage(true);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders search input and user table when not loading', () => {
    renderUserListPage();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('user-table')).toBeInTheDocument();
  });

  it('filters users based on search query', async () => {
    renderUserListPage();
    const searchInput = screen.getByTestId('search-input');

    fireEvent.change(searchInput, { target: { value: 'john' } });

    // Wait for debounce
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('navigates to user details when user is selected', () => {
    renderUserListPage();
    fireEvent.click(screen.getByText('John Doe'));

    expect(mockNavigate).toHaveBeenCalledWith('/user/1');
  });
});
