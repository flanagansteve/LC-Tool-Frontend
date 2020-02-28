import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

// TODO import different sized logos for performance
import logo from '../images/logo.png'

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  padding: 0 140px;
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

const StyledLoginLink = styled(NavLink)`
  margin-left: auto;
  text-decoration: none;
  color: #000;
  transition: color 0.3s;
  
  &:hover {
    color: rgb(34, 103, 255);
  }
`;

const NavLogo = styled.img.attrs({src: logo, alt: "Bountium Logo"})`
  max-height: 50px;
`

const Nav = () => {
  return (
    <StyledNav>
      <StyledNavLink to="/"><NavLogo src={logo} alt="Bountium Logo"/></StyledNavLink>
      <StyledNavLink to="/create">Create an LC</StyledNavLink>
      <StyledNavLink to="/review">Review LC Applications</StyledNavLink>
      <StyledNavLink to="/manage">Manage Live LCs</StyledNavLink>
      <StyledLoginLink to="/login">Log In</StyledLoginLink>
    </StyledNav>
  )
}

export default Nav;