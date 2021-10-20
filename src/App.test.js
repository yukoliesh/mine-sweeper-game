import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// What to test
// Do you see the remanining bombs number in the header
// Do you see the game status in the header
// Can you see a flag when you use the context menu
// When the cell has is-bomb, and you click, the game should be over.

describe("Mine Sweeper tests", () => {
  test('renders Header of the game', () => {
    render(<App />);
    const headerTextElement = screen.getByText('Click a cell to start');
    const headerRemainingBomb = screen.getByText('Remaining bombs: 10');
    expect(headerTextElement).toBeInTheDocument();
    expect(headerRemainingBomb).toBeInTheDocument();
  });
  test('renders 64 Cells', () => {
    const { container } = render(<App />);
    expect(container.getElementsByClassName('hidden').length).toBe(64);
  });
  test('renders a flag when you use the context menu', () => {
    const { getAllByTestId, getByText } = render(<App />);
    fireEvent.contextMenu(getAllByTestId('cellItem')[0]);
    expect(getByText('🚩')).toBeInTheDocument();

    const headerRemainingBombs = screen.getByText('Remaining bombs: 9');
    expect(headerRemainingBombs).toBeInTheDocument();
  });
  test('renders a bomb when you select the cell', () => {
    const { getAllByTestId, container, getByText } = render(<App />);
    expect(container.getElementsByClassName('is-bomb').length).toBe(10);

    fireEvent.click(getAllByTestId('bomb-cell')[0]);
    expect(getByText('You Lost.')).toBeInTheDocument();
  });
  
})

