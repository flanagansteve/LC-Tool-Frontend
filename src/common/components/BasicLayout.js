import React from 'react';
import styled from 'styled-components';

const Margin = styled.div`
  margin: 80px auto 40px;
  max-width: 1000px;
`

const Title = styled.h1`
  border-bottom: 1px solid #cdcdcd;
  padding: 10px 0;
  font-size: 24px;
`

const Content = styled.div`
  margin: 40px 0 0;
`

const BasicLayout = ({ title, children }) => {
  return (
    <Margin>
      <Title>{title}</Title>
      <Content>{children}</Content>
    </Margin>
  );
}

export default BasicLayout;