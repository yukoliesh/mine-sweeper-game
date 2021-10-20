import React from 'react';
import PropTypes from 'prop-types';
import { AlertWrapper, AlertMessageCont, AlertHeaderWrapper, CloseIconButton, CloseButton, AlertMessage } from '../style';

const Alert = ({ message, onCloseClick }) => {


  return (
    <AlertWrapper data-testid="alertBox">
      <AlertMessageCont>
        <AlertHeaderWrapper>
          <CloseIconButton href="#" onClick={onCloseClick}>x</CloseIconButton> 
        </AlertHeaderWrapper>
        <AlertMessage>
          {message}
        </AlertMessage>
        <CloseButton onClick={onCloseClick}>Close</CloseButton>
      </AlertMessageCont>
    </AlertWrapper>
  )
}

Alert.propTypes = {
  message: PropTypes.string,
  onCloseClick: PropTypes.func
}

export default Alert;