import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navbar brand', () => {
  render(<App />);
  expect(screen.getAllByText(/My Jenkins App/i).length).toBeGreaterThan(0);
});

test('renders home page by default', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /My Jenkins App/i })).toBeInTheDocument();
});

test('renders navigation links', () => {
  render(<App />);
  const nav = screen.getByRole('navigation');
  expect(nav).toBeInTheDocument();
  expect(nav.querySelector('a[href="/todos"]')).toBeInTheDocument();
  expect(nav.querySelector('a[href="/notes"]')).toBeInTheDocument();
  expect(nav.querySelector('a[href="/counter"]')).toBeInTheDocument();
  expect(nav.querySelector('a[href="/about"]')).toBeInTheDocument();
});

test('footer shows version', () => {
  render(<App />);
  expect(screen.getByText(/Built with Jenkins CI\/CD/i)).toBeInTheDocument();
});
