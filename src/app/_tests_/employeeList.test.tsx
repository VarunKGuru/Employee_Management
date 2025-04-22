import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmployeeList from '../ui/employeeList/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() => 'Guru');
  Storage.prototype.removeItem = jest.fn();
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          Id: 1,
          Name: 'John Doe',
          Email: 'john@example.com',
          Department: 'HR',
          Phone: '1234567890',
        },
      ]),
  })
) as jest.Mock;

describe('EmployeeList Component', () => {
  it('Get employee List', async () => {
    render(<EmployeeList />);
    expect(await screen.findByText('Employee Management')).toBeInTheDocument();
    expect(screen.getByText('Guru')).toBeInTheDocument();
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
  });

  it('add employee', async () => {
    render(<EmployeeList />);
    const addButtons = await screen.findAllByText('Add Employee');
    const addButton = addButtons.find(btn => btn.tagName === 'BUTTON');
    fireEvent.click(addButton!);
    expect(screen.getByRole('heading', { name: 'Add Employee' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('delete employee', async () => {
    render(<EmployeeList />);
    const employee = await screen.findByText('John Doe');
    expect(employee).toBeInTheDocument();
    const deleteButtons = screen.getAllByText('Delete');
    const deleteButton = deleteButtons[0]; // assuming first delete button is John's
    fireEvent.click(deleteButton);
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([]), 
      })
    );
  
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });


  it('logout', async () => {
    render(<EmployeeList />);
    fireEvent.click(await screen.findByText('Guru'));
    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByText('Confirm Logout')).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('Logout')[1]);
    await waitFor(() => {
      expect(localStorage.removeItem).toHaveBeenCalledWith('username');
    });
  });
});
