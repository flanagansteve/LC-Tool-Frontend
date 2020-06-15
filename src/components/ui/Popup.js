import React, {useEffect} from "react";
import styled from "styled-components";
import Button from "./Button";
import config from "../../config";

const Modal = styled.div`
  position: fixed;
  display: flex;
  width: 100%;
  height: 100%;
  left: 0%;
  top: 0%;
  z-index: 2;
  background-color: rgba(211, 211, 211, 0.5);
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  background-color: white;
  opacity: 100%;
  padding: 20px;
  max-width: 80%;
  max-height: 80%;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 26px;
  padding-bottom: 15px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ActionButton = styled(Button)`
  margin: 5px;
  min-width: 72px;
`;

const CancelButton = styled(ActionButton)`
  color: ${config.accentColor};
  background-color: transparent;
  min-width: 72px;
`;

const Error = styled.span`
  display: inline-flex;
  align-items: center;
  color: red;
  font-style: italic;
  padding-right: 20px;
`;

export const Popup = ({show, title, children, onCancel, onSelect, containerStyle,
  onShow, error, selectDisabled, selectButton = "Select", cancelButton = "Cancel"}) => {

  useEffect(() => {
    const scrollTop = show ? `-${document.documentElement.scrollTop}px` : -parseInt(document.body.style.top);
    document.body.style.position = show ? "fixed" : "";
    document.body.style.width = show ? "100%" : "";
    document.body.style.overflowY = show ? "scroll" : "";
    if (show) document.body.style.top = scrollTop;
    else {
      document.body.style.top = "";
      if (!isNaN(scrollTop)) document.documentElement.scrollTop = scrollTop;
    }
    show && onShow && onShow();
    return () => {
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      const resetScroll = -parseInt(document.body.style.top);
      if (!isNaN(resetScroll)) document.documentElement.scrollTop = resetScroll;
      document.body.style.top = "";
    }
  }, [show]);

  return (
      show &&
      <Modal onClick={() => onCancel()}>
        <Container style={containerStyle} onClick={event => event.stopPropagation()}>
          <Title>{title}</Title>
          {children}
          <ButtonWrapper>
            <Error>{error}</Error>
            <CancelButton type={"button"} onClick={onCancel}>{cancelButton}</CancelButton>
            <ActionButton type={"button"} disabled={selectDisabled} onClick={onSelect}>{selectButton}</ActionButton>
          </ButtonWrapper>
        </Container>
      </Modal>
  )
};
