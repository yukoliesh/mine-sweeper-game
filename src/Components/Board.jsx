import React from 'react';
import PropTypes from 'prop-types';
import { RestartButton } from '../styles';
import Cell from './Cell';
import Alert from './Alert';
import '../css/styles.css';

const Board = ({ height, width, mines }) => {

  const [mineCount, setMineCount] = React.useState(0);
  const [gameStatus, setGameStatus] = React.useState("Click a cell to Start");
  const [boardData, setBoardData] = React.useState([]);
  const [initData, setInitData] = React.useState([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

   // Get random number 
  const getRandomNumber = React.useCallback((dimension) => {
    return Math.floor(Math.random() * 1000 + 1) % dimension;;
  },[]);

  // Look for neighboring cells and returns them
  const traverseBoard = React.useCallback((x, y, data) => {
    const el = [];

    // up
    if(x > 0){
      el.push(data[x - 1][y]);
    }

    // down
    if(x < height - 1){
      el.push(data[x + 1][y]);
    }

    // left
    if(y > 0){
      el.push(data[x][y - 1]);
    }

    // right
    if(y < width - 1){
      el.push(data[x][y + 1]);
    }

    // top left
    if(x > 0 && y > 0){
      el.push(data[x - 1][y - 1]);
    }

    // top right
    if(x > 0 && y < width -1){
      el.push(data[x - 1][y + 1]);
    }

    // bottom right
    if(x < height - 1 && y < width - 1){
      el.push(data[x + 1][y + 1]);
    }

    // bottom left
    if(x < height - 1 && y > 0){
      el.push(data[x + 1][y - 1]);
    }

    return el;
  },[height, width]);

  React.useEffect(() => {
    const createEmptyArray = (height, width) => {
       let data = [];
        for(let i = 0; i < height; i++){
          data.push([]);
          for(let j = 0; j < width; j++){
            data[i][j] = {
              x: i,
              y: j,
              isMine: false,
              neighbor: 0,
              isRevealed: false,
              isEmpty: false,
              isFlagged: false
            }
          }
        }
        return data;
    }

    // Allocating Mines on the game board
    const allocateMines = (data, height, width, mines) => {
      let randomX,
        randomY,
        minesAllocated = 0;

        while(minesAllocated < mines){
          randomX = getRandomNumber(width);
          randomY = getRandomNumber(height);
          if(!data[randomX][randomY].isMine){
            data[randomX][randomY].isMine = true;
            minesAllocated++;
          }
        }
        return data;
    }

    // Get number of neighboring mines for each board cell
    const getNeighbors = (data, height, width) => {
      let updatedData = data;

      for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
          if(data[i][j].isMine !== true){
            let mine = 0;
            const area = traverseBoard(data[i][j].x, data[i][j].y, data);
            area.map((value) => {
              if(value.isMine){
                mine++;
              }
              return value;
            });
            if(mine === 0){
              updatedData[i][j].isEmpty = true;
            }
            updatedData[i][j].neighbor = mine;
          }
        }
      }
      return updatedData;
    }
    const initBoardData = (height, width, mines) => {
      let data = createEmptyArray(height, width);
      data = allocateMines(data, height, width, mines);
      data = getNeighbors(data, height, width);
      setInitData(data);
      return data;
    }

    setMineCount(mines);
    setGameStatus("Click a cell to start");
    setBoardData(initBoardData(height, width, mines));

  }, [height, width, mines, getRandomNumber, traverseBoard]);

  const onResetClick = () => {
      setMineCount(mines);
      setGameStatus('Click a cell to start');
      setBoardData(initData);
    }

  // Get Mines
  const getMines = (data) => {
    let mineArray = [];
    data.map((datarow) => {
      datarow.map((dataitem) => {
        if(dataitem.isMine){
          mineArray.push(dataitem);
        }
      })
    });
    setBoardData(mineArray);
    return mineArray;
  }

  // Get Hidden Cells
  const getHidden = (data) => {
    let hiddenArray = [];

    data.map((datarow) => {
      datarow.map((dataitem) => {
          if(!dataitem.isRevealed){
            hiddenArray.push(dataitem);
          }
      })
    });
    return hiddenArray;
  }

  // Get Flags
  const getFlags = (data) => {
    let flagArray =[];
    data.map((datarow) => {
      datarow.map((dataitem) => {
        if(dataitem.isFlagged) {
          flagArray.push(dataitem);
        }
      })
    });
    return flagArray;
  }

  // reveals the whole board
  const revealBoard = () => {
    let updatedData = boardData;
    updatedData.map((datarow) => {
      datarow.map((dataitem) => {
        dataitem.isRevealed = true;
      })
    });
    setBoardData(updatedData);
  }

  // reveal logic for empty cell
  const revealEmpty = (x, y, data) => {
    let area = traverseBoard(x, y, data);
    area.map((value) => {
      if (
        !value.isFlagged &&
        !value.isRevealed &&
        (value.isEmpty || !value.isMine)
      ) {
        data[value.x][value.y].isRevealed = true;
        if(value.isEmpty){
          revealEmpty(value.x, value.y, data);
        }
      }
    });
    return data;
  }

  const handleCellClick = (x, y) => {
    setGameStatus('Game in Progress');
     // if it's revealed, return true
    if(boardData[x][y].isRevealed || boardData[x][y].isFlagged){
      return null;
    }
    
    // check mine. if it's true, it's game over
    if(boardData[x][y].isMine){
      setGameStatus('You Lost.');
      revealBoard();
      setShowAlert(true);
      setAlertMessage("Game Over");
    }

    let updatedData = boardData;
    updatedData[x][y].isFlagged = false;
    updatedData[x][y].isRevealed = true;

    if(updatedData[x][y].isEmpty){
      updatedData = revealEmpty(x, y, updatedData);
    }

    if(getHidden(updatedData).length === mines){
      setGameStatus('You Win!');
      setMineCount(0);
      revealBoard();
      setShowAlert(true);
      setAlertMessage("You Win!");
    }

    setBoardData(updatedData);
    setMineCount(mines - getFlags(updatedData).length);

  }

  // Right click menu 
  const handleContextMenu = (e, x, y) => {
    e.preventDefault();

    setGameStatus('Game in Progress');

    let updatedData = boardData;
    let mines = mineCount;

    if(updatedData[x][y].isRevealed) return ;
    if(updatedData[x][y].isFlagged){
      updatedData[x][y].isFlagged = false;
      mines++;
    } else {
      updatedData[x][y].isFlagged = true;
      mines--;
    }

    if(mines === 0){
      const mineArray = getMines(updatedData);
      const FlagArray = getFlags(updatedData);
      if(JSON.stringify(mineArray) === JSON.stringify(FlagArray)){
        setMineCount(0);
        setGameStatus('You Win!');
        revealBoard();
        setShowAlert(true);
        setAlertMessage("You Win!");
      }
    }

    setBoardData(updatedData);
    setMineCount(mines);
  }

  const onCloseAlertClick = () => {
    setShowAlert(false);
  }

  return (
    <>
      <div className="board">
        <header className="game-info">
          <span className="info">
            Remaining mines: {mineCount}
          </span>
          <h1>{gameStatus}</h1>
        </header>
        {boardData.map(rowData => (
          rowData.map(item => (
            <div key={item.x * rowData.length + item.y}>
            <Cell 
              onCellClick={() => handleCellClick(item.x, item.y)} 
              cMenu={(e) => handleContextMenu(e, item.x, item.y)} value={item} 
              />
            </div>
          ))
        ))}
        <footer>
          <RestartButton type="button" onClick={onResetClick}>Restart</RestartButton>
        </footer>
      </div>
      {showAlert && (
        <Alert message={alertMessage} onCloseClick={onCloseAlertClick} />
      )}
    </>
  )
}

Board.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  mines: PropTypes.number
}

export default Board;