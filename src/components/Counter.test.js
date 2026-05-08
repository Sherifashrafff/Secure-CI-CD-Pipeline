import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('renders counter heading', () => {
  render(<Counter />);
  expect(screen.getByRole('heading', { name: /Counter/i })).toBeInTheDocument();
});

test('displays 0 initially', () => {
  render(<Counter />);
  expect(screen.getByLabelText(/Counter value: 0/i)).toBeInTheDocument();
});

test('increments by step 1', () => {
  render(<Counter />);
  fireEvent.click(screen.getByLabelText(/Increment by 1/i));
  expect(screen.getByLabelText(/Counter value: 1/i)).toBeInTheDocument();
});

test('decrements by step 1', () => {
  render(<Counter />);
  fireEvent.click(screen.getByLabelText(/Decrement by 1/i));
  expect(screen.getByLabelText(/Counter value: -1/i)).toBeInTheDocument();
});

test('resets counter to 0', () => {
  render(<Counter />);
  fireEvent.click(screen.getByLabelText(/Increment by 1/i));
  fireEvent.click(screen.getByLabelText(/Increment by 1/i));
  fireEvent.click(screen.getByLabelText(/Reset counter/i));
  expect(screen.getByLabelText(/Counter value: 0/i)).toBeInTheDocument();
});

test('changes step size', () => {
  render(<Counter />);
  fireEvent.click(screen.getByRole('button', { name: '10' }));
  fireEvent.click(screen.getByLabelText(/Increment by 10/i));
  expect(screen.getByLabelText(/Counter value: 10/i)).toBeInTheDocument();
});

test('jumps to custom value', () => {
  render(<Counter />);
  const input = screen.getByLabelText(/Jump to custom value/i);
  fireEvent.change(input, { target: { value: '42' } });
  fireEvent.click(screen.getByLabelText(/Set value/i));
  expect(screen.getByLabelText(/Counter value: 42/i)).toBeInTheDocument();
});
