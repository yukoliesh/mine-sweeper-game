import React from 'react';
import Board from './component/Board';

const App = () => {

  const state = {
    height: 8,
    width: 8,
    bombs: 10
  }

  return (
    <div className="game">
      <Board height={state.height} width={state.width} bombs={state.bombs} />
    </div>
  );
}

export default App;
