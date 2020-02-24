import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  padding: 0 120px;
  background-color: #fff;
  min-height: 80px;
  font-size: 14px;
`;

const StyledNavLink = styled(NavLink)`
  color: rgb(138, 138, 138);
  margin-right: 40px;
  text-decoration: none;
  &.active {
    color: #000;
  }
`;

const Bountium = styled.span`
  font-size: 48px;
  font-weight: 600;
  color: rgb(34, 103, 255);
  margin-right: 50px;
  text-decoration: none;
`

const Nav = () => {
  return (
    <StyledNav>
      <StyledNavLink to="/"><Bountium>B</Bountium></StyledNavLink>
      <StyledNavLink to="/create">Create an LC</StyledNavLink>
      <StyledNavLink to="/review">Review LC Applications</StyledNavLink>
      <StyledNavLink to="/manage">Manage Live LCs</StyledNavLink>
    </StyledNav>
  )
}

export default Nav;