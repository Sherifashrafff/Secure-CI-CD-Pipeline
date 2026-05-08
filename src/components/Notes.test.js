import { render, screen, fireEvent } from '@testing-library/react';
import Notes from './Notes';

test('renders notes heading', () => {
  render(<Notes />);
  expect(screen.getByRole('heading', { name: /Notes/i })).toBeInTheDocument();
});

test('renders default notes', () => {
  render(<Notes />);
  expect(screen.getByText(/Jenkins Pipeline Tips/i)).toBeInTheDocument();
  expect(screen.getByText(/Docker Best Practices/i)).toBeInTheDocument();
});

test('shows note form on New Note click', () => {
  render(<Notes />);
  fireEvent.click(screen.getByText(/\+ New Note/i));
  expect(screen.getByLabelText(/Note title/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Note body/i)).toBeInTheDocument();
});

test('adds a new note', () => {
  render(<Notes />);
  fireEvent.click(screen.getByText(/\+ New Note/i));
  fireEvent.change(screen.getByLabelText(/Note title/i), { target: { value: 'Test Note' } });
  fireEvent.change(screen.getByLabelText(/Note body/i), { target: { value: 'Test content' } });
  fireEvent.click(screen.getByText(/Save Note/i));
  expect(screen.getByText(/Test Note/i)).toBeInTheDocument();
});

test('deletes a note', () => {
  render(<Notes />);
  const deleteButtons = screen.getAllByLabelText(/Delete note/i);
  fireEvent.click(deleteButtons[0]);
  expect(screen.queryByText(/Jenkins Pipeline Tips/i)).not.toBeInTheDocument();
});

test('filters notes by search', () => {
  render(<Notes />);
  const searchInput = screen.getByLabelText(/Search notes/i);
  fireEvent.change(searchInput, { target: { value: 'docker' } });
  expect(screen.queryByText(/Jenkins Pipeline Tips/i)).not.toBeInTheDocument();
  expect(screen.getByText(/Docker Best Practices/i)).toBeInTheDocument();
});
