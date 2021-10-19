import React from 'react';
import Board from './Components/Board';

function App() {

  const state = {
    height: 8,
    width: 8,
    mines: 10
  }

  return (
    <div className="game">
      <Board height={state.height} width={state.width} mines={state.mines} />
    </div>
  );
}

export default App;
