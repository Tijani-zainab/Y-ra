import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';

describe('Navbar', () => {
  it('renders the Yára brand', () => {
    render(<Navbar />);
    expect(screen.getByText('Yára')).toBeInTheDocument();
  });
});
