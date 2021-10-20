import React from 'react';
import PropTypes from 'prop-types';
import { RestartButton } from '../style';
import Cell from './Cell';
import Alert from './Alert';
import '../css/styles.css';
import { getRandomNumber } from '../utils/helper';

const Board = ({ height, width, bombs }) => {
  // Look for neighboring cells and returns them
      const traverseBoard = (x, y, data) => {
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
      };

      const createEmptyArray = (height, width) => {
        let data = [];
          for(let i = 0; i < height; i++){
            data.push([]);
            for(let j = 0; j < width; j++){
              data[i][j] = {
                x: i,
                y: j,
                isBomb: false,
                neighbor: 0,
                isRevealed: false,
                isEmpty: false,
                isFlagged: false
              }
            }
          }
          return data;
      }

      // Allocating Bombs on the game board
      const allocateBombs = (data, height, width, bombs) => {
        let randomX,
          randomY,
          bombsAllocated = 0;

          while(bombsAllocated < bombs){
            randomX = getRandomNumber(width);
            randomY = getRandomNumber(height);
            if(!data[randomX][randomY].isBomb){
              data[randomX][randomY].isBomb = true;
              bombsAllocated++;
            }
          }
          return data;
      }
      // Get number of neighboring bombs for each board cell
      const getNeighbors = (data, height, width) => {
        let updatedData = data;

        for(let i = 0; i < height; i++){
          for(let j = 0; j < width; j++){
            if(data[i][j].isBomb !== true){
              let bomb = 0;
              const area = traverseBoard(data[i][j].x, data[i][j].y, data);
              area.map((value) => {
                if(value.isBomb){
                  bomb++;
                }
                return value;
              });
              if(bomb === 0){
                updatedData[i][j].isEmpty = true;
              }
              updatedData[i][j].neighbor = bomb;
            }
          }
        }
        return updatedData;
    }

    const initBoardData = (height, width, bombs) => {
      let data = createEmptyArray(height, width);
      data = allocateBombs(data, height, width, bombs);
      data = getNeighbors(data, height, width);
      return data;
    };

    const [bombCount, setBombCount] = React.useState(0);
    const [gameStatus, setGameStatus] = React.useState("Click a cell to Start");
    const [boardData, setBoardData] = React.useState(initBoardData(height, width, bombs));
    const [showAlert, setShowAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');

  // Get Bombs
  const getBombs = (data) => {
    let bombArray = [];
    data.map((datarow) => {
      datarow.map((dataitem) => {
        if(dataitem.isBomb){
          bombArray.push(dataitem);
        }
        return dataitem;
      })
      return datarow;
    });
    setBoardData(bombArray);
    return bombArray;
  }

  // Get Hidden Cells
  const getHidden = (data) => {
    let hiddenArray = [];
    data.map((datarow) => {
      datarow.map((dataitem) => {
          if(!dataitem.isRevealed){
            hiddenArray.push(dataitem);
          }
          return dataitem;
      })
      return datarow;
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
        return dataitem;
      })
      return datarow;
    });
    return flagArray;
  }

  // reveals the whole board
  const revealBoard = () => {
    let updatedData = boardData;
    updatedData.map((datarow) => {
      datarow.map((dataitem) => {
        dataitem.isRevealed = true;
        return dataitem;
      })
      return datarow;
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
        (value.isEmpty || !value.isBomb)
      ) {
        data[value.x][value.y].isRevealed = true;
        if(value.isEmpty){
          revealEmpty(value.x, value.y, data);
        }
      }
      return value;
    });
    return data;
  }

  const handleCellClick = (x, y) => {
    setGameStatus('Game in Progress');
     // Check if it's revealed, return if true
    if(boardData[x][y].isRevealed || boardData[x][y].isFlagged) return null;
    
    // check bomb. If it's true, it's game over
    if(boardData[x][y].isBomb){
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

    if(getHidden(updatedData).length === bombs){
      setGameStatus('You Win!');
      setBombCount(0);
      revealBoard();
      setShowAlert(true);
      setAlertMessage("You Win!");
    }

    setBoardData(updatedData);
    setBombCount(bombs - getFlags(updatedData).length);
  }

  // Right click for flags
  const handleContextMenu = (e, x, y) => {
    e.preventDefault();

    setGameStatus('Game in Progress');

    let updatedData = boardData;
    let bombs = bombCount;

    if(updatedData[x][y].isRevealed) return ;
    if(updatedData[x][y].isFlagged){
      updatedData[x][y].isFlagged = false;
      bombs++;
    } else {
      updatedData[x][y].isFlagged = true;
      bombs--;
    }

    if(bombs === 0){
      const bombArray = getBombs(updatedData);
      const FlagArray = getFlags(updatedData);
      if(JSON.stringify(bombArray) === JSON.stringify(FlagArray)){
        setBombCount(0);
        setGameStatus('You Win!');
        revealBoard();
        setShowAlert(true);
        setAlertMessage("You Win!");
      }
    }

    setBoardData(updatedData);
    setBombCount(bombs);
  }

  const onCloseAlertClick = () => {
    setShowAlert(false);
  }

  const onResetClick = () => {
    setBombCount(bombs);
    setGameStatus('Click a cell to start');
    setBoardData(initBoardData(height, width, bombs));
  };

  return (
    <>
      <div className="board">
        <header className="game-info">
          <span className="info">
            Remaining bombs: {bombCount}
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
  bombs: PropTypes.number
}

export default Board;