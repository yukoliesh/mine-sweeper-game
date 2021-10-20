import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// What to test
// Do you see the remanining mines number in the header
// Do you see the game status in the header
// Can you see a flag when you use the right click
// When the cell has is-mine, and you click, the game should be over.

describe("Mine Sweeper tests", () => {
  test('renders Header of the game', () => {
    render(<App />);
    const headerTextElement = screen.getByText('Click a cell to start');
    const headerRemainingMine = screen.getByText('Remaining mines: 10');
    expect(headerTextElement).toBeInTheDocument();
    expect(headerRemainingMine).toBeInTheDocument();
  });
  test('renders 64 Cells', () => {
    const { container } = render(<App />);
    expect(container.getElementsByClassName('hidden').length).toBe(64);
  });
  test('renders a flag when you use right click', () => {
    const { getAllByTestId, container, getByText } = render(<App />);
    fireEvent.contextMenu(getAllByTestId('cellItem')[0]);
    expect(getByText('🚩')).toBeInTheDocument();

    const headerRemainingMines = screen.getByText('Remaining mines: 9');
    expect(headerRemainingMines).toBeInTheDocument();
  });
  test('renders a mine when you select the cell', () => {
    const { getAllByTestId, container, getByText, querySelectorAll } = render(<App />);
    expect(container.getElementsByClassName('is-mine').length).toBe(10);

    fireEvent.click(getAllByTestId('mine-cell')[0]);
    expect(getByText('You Lost.')).toBeInTheDocument();
  });
  
})

