import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import MoonLoader from "react-spinners/MoonLoader";
import StatusMessage from "./ui/StatusMessage";
import { css } from "@emotion/core";

import config from '../config';

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

const RightAlignedLink = styled(NavLink)`
  float : right;
  padding: 10px 0;
  color: #00d;
  line-height: 1.25;
`;

const Content = styled.div`
  margin: 40px 0 0;
`;

const Status = styled.div`
  position: sticky;
  bottom: 0;
`;

const BasicLayout = ({ title, subtitle, link, linktext, isLoading, children,
  marginStyle, statusComponent }) => {
  return (
    <Margin style={marginStyle}>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {link && <RightAlignedLink to={link}>{linktext}</RightAlignedLink>}
      <Content>
        {isLoading ? (
          <MoonLoader
            size={45}
            color={config.accentColor}
            loading={true}
            css={css`
              margin: 0 auto;
            `}
          />
        ) : (
          children
        )}
      </Content>
      <Status>
        {statusComponent}
      </Status>
    </Margin>
  );
};

export default BasicLayout;
