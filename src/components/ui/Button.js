import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const StyledButton = styled.button`
  background-color: ${(props) => props.unselected ? `#fff`:`rgb(27, 108, 255)`};
  color: ${(props) => props.unselected ? `rgb(27, 108, 255)`:`#fff`};
  border-radius: 5px;
  padding: 10px;
  border: 1px solid rgb(27, 108, 255);
  font-size: 16px;
  cursor: pointer;
`

const Button = ({ children, showArrow, arrowStyle, ...props }) => {
  return (
    <StyledButton {...props}>
      {children}
      {showArrow && (
        <FontAwesomeIcon
          icon={faArrowRight}
          size="lg"
          color="#fff"
          style={{ marginLeft: "10px", ...arrowStyle }}
        />
      )}
    </StyledButton>
  );
}

export default Button;