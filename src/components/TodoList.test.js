import { render, screen, fireEvent } from '@testing-library/react';
import TodoList from './TodoList';

test('renders todo list heading', () => {
  render(<TodoList />);
  expect(screen.getByRole('heading', { name: /To-Do List/i })).toBeInTheDocument();
});

test('renders default todos', () => {
  render(<TodoList />);
  expect(screen.getByText(/Set up Jenkins pipeline/i)).toBeInTheDocument();
  expect(screen.getByText(/Write unit tests/i)).toBeInTheDocument();
});

test('adds a new todo', () => {
  render(<TodoList />);
  const input = screen.getByLabelText(/New task input/i);
  fireEvent.change(input, { target: { value: 'Deploy to production' } });
  fireEvent.click(screen.getByLabelText(/Add task/i));
  expect(screen.getByText(/Deploy to production/i)).toBeInTheDocument();
  expect(input.value).toBe('');
});

test('does not add empty todo', () => {
  render(<TodoList />);
  const before = screen.getAllByRole('listitem').length;
  fireEvent.click(screen.getByLabelText(/Add task/i));
  expect(screen.getAllByRole('listitem').length).toBe(before);
});

test('deletes a todo', () => {
  render(<TodoList />);
  const deleteBtn = screen.getAllByLabelText(/Delete task/i)[0];
  fireEvent.click(deleteBtn);
  expect(screen.queryByText(/Set up Jenkins pipeline/i)).not.toBeInTheDocument();
});

test('toggles todo completion', () => {
  render(<TodoList />);
  const checkboxes = screen.getAllByRole('checkbox');
  const activeCheckbox = checkboxes.find(cb => !cb.checked);
  if (activeCheckbox) {
    fireEvent.click(activeCheckbox);
    expect(activeCheckbox.checked).toBe(true);
  }
});

test('filter by active shows only incomplete todos', () => {
  render(<TodoList />);
  fireEvent.click(screen.getByRole('button', { name: /Active/i }));
  const items = screen.getAllByRole('listitem');
  items.forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (checkbox) expect(checkbox.checked).toBe(false);
  });
});

test('filter by completed shows only done todos', () => {
  render(<TodoList />);
  const buttons = screen.getAllByRole('button', { name: /Completed/i });
  const completedFilter = buttons.find(b => b.getAttribute('aria-pressed') !== null);
  fireEvent.click(completedFilter);
  const items = screen.getAllByRole('listitem');
  items.forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (checkbox) expect(checkbox.checked).toBe(true);
  });
});
