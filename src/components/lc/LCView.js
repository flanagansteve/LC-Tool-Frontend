import React from "react";
import styled from "styled-components";
import MoonLoader from "react-spinners/MoonLoader";
import { css } from "@emotion/core";

const Margin = styled.div`
  margin: 80px auto 40px;
  max-width: 1000px;
`;

const TitleWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid #cdcdcd;
  padding: 10px 0;
  font-size: 24px;
`

const Subtitle = styled.h2`
  font-weight: 300;
`;

const Content = styled.div`
  margin: 40px 0 0;
`;

const LCView = ({ lc, children }) => {
  return (
    <Margin>
      <TitleWrapper>
        <span>{lc ? lc.client.name : "LC"}</span>
        <Subtitle>{`${"Paper Order"} — ${1234}`}</Subtitle>
      </TitleWrapper>
      <Content>
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
          children
        )}
      </Content>
    </Margin>
  );
};

export default LCView;
