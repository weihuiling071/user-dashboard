import React from 'react';
// Mock react-router-dom navigation before importing the component so imports
// inside the component receive the mocked implementation.
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import UserForm from '../components/UserForm';
import { User } from 'container/shared';

describe('UserForm', () => {
  const mockUser: User = {
    id: 1,
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    phone: '123-456-7890',
    website: 'test.com',
    company: {
      name: 'Test Company',
    },
    address: {
      city: 'Test City',
    },
  };

  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user form with initial values', async () => {
    await act(async () => {
      try {
        render(<UserForm user={mockUser} onSave={mockOnSave} />);
      } catch (err) {
        // Log the underlying error(s) for debugging
        // eslint-disable-next-line no-console
        console.error('Render error:', err);
        throw err;
      }
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123-456-7890')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Company')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test City')).toBeInTheDocument();
    });
  });

  it('calls onSave when form is submitted', async () => {
    await act(async () => {
      render(<UserForm user={mockUser} onSave={mockOnSave} />);
    });

    const submitButton = screen.getByText('Save');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
