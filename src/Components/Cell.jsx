import React from 'react';
import PropTypes from 'prop-types';

const Cell = ({ onCellClick, value, cMenu }) => {
  const getValue = () => {
    if(!value.isRevealed){
      return value.isFlagged ? "🚩" : null;
    }
    if(value.isMine){
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
      (value.isMine ? " is-mine" : "") +
      (value.isFlagged ? " is-flag" : "");

  return (
    <div onClick={onCellClick} className={className} onContextMenu={cMenu} data-testid={value.isMine ? "mine-cell" : "cellItem"}>
      {getValue()}
    </div>
  )
};

const cellItemShape = {
  isRevealed: PropTypes.bool,
  isMine: PropTypes.bool,
  isFlagged: PropTypes.bool
}

Cell.propTypes = {
  value: PropTypes.objectOf(PropTypes.shape(cellItemShape)),
  onCellClick: PropTypes.func,
  cMenu: PropTypes.func
}

export default Cell;