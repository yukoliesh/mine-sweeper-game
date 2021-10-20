import React from 'react';
import PropTypes from 'prop-types';

const Cell = ({ onCellClick, value, cMenu }) => {
  const getValue = () => {
    if(!value.isRevealed){
      return value.isFlagged ? "🚩" : null;
    }
    if(value.isBomb){
      return "💣";
    }
    if(value.neighbor === 0){
      return null;
    }
    return value.neighbor;
  }

  let className =
      "cell" +
      (value.isRevealed ? "" : " hidden") +
      (value.isBomb ? " is-bomb" : "") +
      (value.isFlagged ? " is-flag" : "");

  return (
    <div onClick={onCellClick} className={className} onContextMenu={cMenu} data-testid={value.isBomb ? "bomb-cell" : "cellItem"}>
      {getValue()}
    </div>
  )
};

Cell.propTypes = {
  value: PropTypes.object,
  onCellClick: PropTypes.func,
  cMenu: PropTypes.func
}

export default Cell;