import React from 'react';
import { render, screen } from '@testing-library/react';
import { AccessGate } from '@/components/gates/AccessGate';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Mock the auth store to simulate hydration
vi.mock('@/store/auth', () => ({
  useAuthStore: (selector: (state: any) => any) => selector({
    isHydrated: true,
  }),
}));

// 2. Mock useAccess
const mockCanAccess = vi.fn();
vi.mock('@/lib/useAccess', () => ({
  useAccess: () => ({
    canAccess: mockCanAccess,
    isLoading: false,
  }),
}));

describe('AccessGate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when user has access', () => {
    mockCanAccess.mockReturnValue(true);

    render(
      <AccessGate accessTier="EXCLUSIVE" itemId="test-1">
        <div data-testid="secret-content">Secret Test Content</div>
      </AccessGate>
    );

    expect(screen.getByTestId('secret-content')).toBeInTheDocument();
    expect(screen.queryByText('Content Locked')).not.toBeInTheDocument();
  });

  it('renders lock screen and Purchase Now button for EXCLUSIVE tier when no access', () => {
    mockCanAccess.mockReturnValue(false);

    render(
      <AccessGate accessTier="EXCLUSIVE" itemId="test-1">
        <div data-testid="secret-content">Secret Test Content</div>
      </AccessGate>
    );

    // The content is rendered but blurred out in the DOM
    expect(screen.getByTestId('secret-content')).toBeInTheDocument();
    
    // Check for Lock screen elements
    expect(screen.getByText('Content Locked')).toBeInTheDocument();
    expect(screen.getByText('This is exclusive content. You need to purchase it to access.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Purchase Now/i })).toHaveAttribute('href', '/checkout?item=test-1');
  });

  it('renders lock screen and Upgrade to PRO button for PRO tier when no access', () => {
    mockCanAccess.mockReturnValue(false);

    render(
      <AccessGate accessTier="PRO" itemId="test-1">
        <div>Secret Content</div>
      </AccessGate>
    );

    expect(screen.getByText('You need an active PRO subscription to access this content.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Upgrade to PRO/i })).toHaveAttribute('href', '/pricing');
  });
});
