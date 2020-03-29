import React from "react";
import styled from "styled-components";
import { NavLink, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

// TODO import different sized logos for performance
import logo from "../images/logo.png";
import { logOut } from "../utils/api";

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

const LoginMenu = styled.div`
  margin-left: auto;
  display: flex;
`;

const StyledLoginLink = styled(NavLink)`
  text-decoration: none;
  color: #000;
  transition: color 0.3s;

  &:hover {
    color: rgb(34, 103, 255);
  }
`;

const StyledIconButton = styled.span`
  color: #000;
  transition: color 0.3s;
  cursor: pointer;

  &:hover {
    color: rgb(34, 103, 255);
  }
`;

const LoginSection = ({ user, setUser }) => {
  const history = useHistory();
  return (
    <LoginMenu>
      {user ? (
        <>
          {user.name}
          <StyledLoginLink to="/bank/account">
            <FontAwesomeIcon
              icon={faUserCircle}
              style={{ marginLeft: "10px", fontSize: "16px" }}
            />
          </StyledLoginLink>
          <StyledIconButton
            onClick={() => {
              logOut(setUser)
                .then(() => history.push("/login"))
                .catch(err => console.log(err));
            }}
          >
            <FontAwesomeIcon
              icon={faSignOutAlt}
              style={{ marginLeft: "10px", fontSize: "16px" }}
            />
          </StyledIconButton>
        </>
      ) : (
        <StyledLoginLink to="/login">Log In</StyledLoginLink>
      )}
    </LoginMenu>
  );
};

const NavLogo = styled.img.attrs({ src: logo, alt: "Bountium Logo" })`
  max-height: 50px;
`;

const Nav = ({ user, setUser }) => {
  return (
    <StyledNav>
      <StyledNavLink to="/">
        <NavLogo src={logo} alt="Bountium Logo" />
      </StyledNavLink>
      <StyledNavLink to="/create">Create an LC</StyledNavLink>
      <StyledNavLink to="/review">Review LC Applications</StyledNavLink>
      <StyledNavLink to="/manage">Manage Live LCs</StyledNavLink>
      <LoginSection user={user} setUser={setUser} />
    </StyledNav>
  );
};

export default Nav;
