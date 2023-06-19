import React, { CSSProperties, FC, PropsWithChildren, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './styles';

interface Props {
  show: boolean;
  onCloseModal: (e: any) => void;
  style: CSSProperties;
  closeButton?: boolean;
}
const Menu: FC<PropsWithChildren<Props> > = ({children, style, show, onCloseModal, closeButton}) => {
  const stopPropagation = useCallback((e: any)=> {
    e.stopPropagation(); //이벤트 버블링 막기
  },[]);

  if(!show) return null;
  
  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};
Menu.defaultProps ={
  closeButton: true,
}

export default Menu;
