import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CartButton from '@/features/cart/CartButton';

describe('CartButton Component', () => {
  it('renders button with shopping bag icon and accessible aria-label', () => {
    const handleClick = vi.fn();
    render(<CartButton onClick={handleClick} totalUnits={0} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label');
  });

  it('does not display badge when totalUnits is 0', () => {
    const handleClick = vi.fn();
    render(<CartButton onClick={handleClick} totalUnits={0} />);

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('displays unit badge when totalUnits > 0', () => {
    const handleClick = vi.fn();
    render(<CartButton onClick={handleClick} totalUnits={5} />);

    const badge = screen.getByText('5');
    expect(badge).toBeInTheDocument();
  });

  it('triggers onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<CartButton onClick={handleClick} totalUnits={2} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('triggers bump animation on unit changes and cleans up timer', () => {
    vi.useFakeTimers();
    const handleClick = vi.fn();
    const { rerender } = render(<CartButton onClick={handleClick} totalUnits={1} />);

    rerender(<CartButton onClick={handleClick} totalUnits={2} />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('animate-cart-bump');

    act(() => {
      vi.advanceTimersByTime(350);
    });
    vi.useRealTimers();
  });
});
