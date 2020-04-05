import React from "react";
import styled from "styled-components";
import MoonLoader from "react-spinners/MoonLoader";
import { css } from "@emotion/core";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Margin = styled.div`
  margin: 40px auto;
  max-width: 1000px;
`;

const TitleWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid #cdcdcd;
  padding: 10px 0;
  font-size: 24px;
`

const LCTitle = styled(Link)`
  margin-right: 15px;
  font-weight: 500;
  text-decoration: none;
  color: #000;
`

const Subtitle = styled.h2`
  font-weight: 200;
`;

const Content = styled.div`
  margin: 40px 0 0;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #454545;
  margin: 20px 0;
  display: block;
`

const LCView = ({ lc, children }) => {
  return (
    <Margin>
      <StyledLink to="/">
        <FontAwesomeIcon icon={faArrowLeft} color="rgb(27, 108, 255)" style={{ paddingRight: "10px"}} /> 
        Back to LCs
      </StyledLink>
        {!lc ? (
          <MoonLoader
            size={45}
            color={"rgb(27, 108, 255)"}
            loading={true}
            css={css`
              margin: 0 auto;
            `}
          />
        ) : (
          <>
      <TitleWrapper>
      {lc.client &&
          <LCTitle to={`/bank/lcs/client/${lc.client.id}`}>{lc.client.name}</LCTitle>
      }
        <Subtitle>{`LC #${lc.id}`}</Subtitle>
      </TitleWrapper>
      <Content>
          {children}
      </Content>
      </>
        )}
    </Margin>
  );
};

export default LCView;
