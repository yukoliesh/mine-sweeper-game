import styled, { css }  from 'styled-components';

export const RestartButton = styled.button`
  width: 100%;
  max-width: 400px;
  margin-top: 12px;
  padding: 12px;
  color: var(--color-blue-01, #023450);
  background-color: var(--color-yellow, #FFC834);
  border-radius: 10px;
  cursor: pointer;
  font-size: 28px;
  font-weight: 600;
`;

const displayflex = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AlertWrapper = styled.div`
  ${displayflex}  
  background-color: #0006;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow: auto;
  top: 0;
  bottom: 0;
  left: 0;
`;
export const AlertMessageCont = styled.div`
  z-index: 2;
  align-self: center;
  width: 30%;
  height: 25%;
  background-color: #fff;
  border-radius: 5px;
  padding: 24px;
  box-shadow: 3px 3px 3px 3px var(--color-black-lowOpacity);
  border: solid 1px var(--color-black-lowOpacity);
`;

export const AlertHeaderWrapper = styled.header`
  ${displayflex}  
  flex-wrap: nowrap;
  justify-content: flex-end;
  padding-bottom: 8px;
`;

export const AlertMessage = styled.div`
  padding: 24px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
`;

export const CloseIconButton = styled.a`
  font-size: 24px;
  color: var(--color-black-midOpacity);
  display: inherit;
  cursor: pointer;
  text-decoration: none;
`;
export const CloseButton = styled.button`
  display: inherit;
  padding: 0.8em 2em;
  font-size: 16px;
  font-weight: 600;
  border: solid 1px #fff;
  border-radius: 5px;
  background-color: var(--color-grey-light, #e0e0e0);
  color: var(--color-black-midOpacity);
  margin: auto;
  cursor: pointer;
`;