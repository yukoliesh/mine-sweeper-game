import React from 'react';
import PropTypes from 'prop-types';
import { CellItem } from '../Styles';

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

  // console.log("value", value);

  let className =
      "cell" +
      (value.isRevealed ? "" : " hidden") +
      (value.isMine ? " is-mine" : "") +
      (value.isFlagged ? " is-flag" : "");
  return (
    <>
      <div onClick={onCellClick} className={className} onContextMenu={cMenu}>
        {getValue()}
      </div>
    </>
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