import { render, screen, fireEvent } from '@testing-library/react';
import MarkdownEditor from '../components/MarkdownEditor';

describe('MarkdownEditor', () => {
  it('renders textarea and preview', () => {
    render(<MarkdownEditor />);
    expect(screen.getByPlaceholderText('Write your content in markdown...')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
  });

  it('shows markdown preview', () => {
    render(<MarkdownEditor />);
    const textarea = screen.getByPlaceholderText('Write your content in markdown...');
    fireEvent.change(textarea, { target: { value: '# Hello' } });
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
