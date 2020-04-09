import React from "react";
import styled from "styled-components";
import MoonLoader from "react-spinners/MoonLoader";
import { css } from "@emotion/core";

const Margin = styled.div`
  margin: 80px auto 40px;
  max-width: 1000px;
`;

const Title = styled.h1`
  border-bottom: 1px solid #cdcdcd;
  padding: 10px 0;
  font-size: 24px;
`;

const Subtitle = styled.h2`
  margin-top: 40px;
  text-align: center;
  color: #555;
`;

const RightAlignedLink = styled.a`
  float : right;
  padding: 10px 0;
  color: #00d;
  line-height: 1.25;
`;

const Content = styled.div`
  margin: 40px 0 0;
`;

const BasicLayoutWithLink = ({ title, subtitle, link, linktext, isLoading, children }) => {
  return (
    <Margin>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {link && <RightAlignedLink href={link}>{linktext}</RightAlignedLink>}
      <Content>
        {isLoading ? (
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

export default BasicLayoutWithLink;
