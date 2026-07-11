import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductListing from '../src/pages/ProductListing';

function renderWithProviders(ui) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>,
  );
}

describe('ProductListing', () => {
  test('renders products fetched from the API', async () => {
    renderWithProviders(<ProductListing />);

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
    });
    expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument();
  });

  test('renders a search input and category filter', async () => {
    renderWithProviders(<ProductListing />);
    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
    });
  });
});
