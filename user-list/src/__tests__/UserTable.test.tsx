import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserTable from '../components/userTable';
import { User } from 'container/shared';

// Mock the antd components
jest.mock('antd', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
  Table: ({ dataSource, columns }: { dataSource: any[]; columns: any[] }) => (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((record) => (
          <tr key={record.id}>
            {columns.map((col) => (
              <td key={`${record.id}-${col.key}`}>
                {col.render ? col.render(record[col.dataIndex], record) : record[col.dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

describe('UserTable Component', () => {
  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phone: '1234567890',
      company: { name: 'Company A' },
    },
    {
      id: 2,
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane@example.com',
      phone: '0987654321',
      company: { name: 'Company B' },
    },
  ];

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with correct columns', () => {
    render(<UserTable users={mockUsers} onSelect={mockOnSelect} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
  });

  it('displays user data correctly', () => {
    render(<UserTable users={mockUsers} onSelect={mockOnSelect} />);

    mockUsers.forEach((user) => {
      expect(screen.getByText(user.name)).toBeInTheDocument();
      expect(screen.getByText(user.username)).toBeInTheDocument();
      expect(screen.getByText(user.email)).toBeInTheDocument();
      expect(screen.getByText(user.phone)).toBeInTheDocument();
      expect(screen.getByText(user.company.name)).toBeInTheDocument();
    });
  });

  it('calls onSelect when View Details button is clicked', () => {
    render(<UserTable users={mockUsers} onSelect={mockOnSelect} />);

    const viewDetailsButtons = screen.getAllByText('View');
    fireEvent.click(viewDetailsButtons[0]);

    expect(mockOnSelect).toHaveBeenCalledWith(mockUsers[0]);
  });
});
