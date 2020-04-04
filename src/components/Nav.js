import React, { useState, useRef } from "react";
import styled from "styled-components";
import { NavLink, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { get } from "lodash";

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

const StyledProfileLink = styled.a`
  text-decoration: none;
  color: #000;
  transition: color 0.3s;
  cursor: pointer;

  &:hover {
    color: rgb(34, 103, 255);
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileLinkWrapper = styled.button`
  padding: 5px 10px;
  border: 1px solid #fff;
  border-radius: 5px;
  background-color: #fff;
  font-size: 14px;
  &:hover {
    border: 1px solid rgb(27, 108, 255);
  }
  transition: border 0.3s;
  ${props => props.show && `border: 1px solid rgb(27, 108, 255);`}
`;

const DropDownWrapper = styled.div`
  background-color: #fff;
  min-width: 200px;
  border-radius: 5px;
  border: 1px solid #cdcdcd;
  font-size: 14px;
  padding: 10px;
  opacity: 0;
  transition: opacity 0.3s;
  position: absolute;
  top: 60px;
  right: 50px;
  ${props => props.show && `opacity: 1;`}
`;

const DropDownHeader = styled.div`
  color: rgb(27, 108, 255);
  font-size: 16px;
  margin-bottom: 10px;
  :not(:first-child) {
    margin-top: 10px;
  }
`;

const DropDownLink = styled.div`
  margin: 5px;
  color: #000;
  text-decoration: none;
  border: none;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const DropDownNavLink = styled(NavLink)`
  margin: 5px;
  color: #000;
  text-decoration: none;
  border: none;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const ProfileDropDown = ({ user, setUser, show }) => {
  const history = useHistory();
  return (
    <DropDownWrapper show={show}>
      <DropDownHeader>{get(user, ["name"])}</DropDownHeader>
      <DropDownLink>View LC Application</DropDownLink>
      <DropDownLink>View Bank Profile</DropDownLink>
      <DropDownHeader>{get(user, ["bank", "name"])}</DropDownHeader>
      <DropDownNavLink to="/bank/account">View Profile</DropDownNavLink>
      <DropDownLink
        onClick={() => {
          logOut(setUser)
            .then(() => history.push("/login"))
            .catch(err => console.log(err));
        }}
      >
        Log Out
      </DropDownLink>
    </DropDownWrapper>
  );
};

const LoginSection = ({ user, setUser }) => {
  const [showingDropdown, setShowingDropdown] = useState(false);
  const wrapperEl = useRef(null);
  return (
    <LoginMenu>
      {user ? (
        <ProfileWrapper>
          <ProfileLinkWrapper
            onClick={e => {
              e.preventDefault();
              setShowingDropdown(true);
              wrapperEl.current.focus();
            }}
            ref={wrapperEl}
            show={showingDropdown}
            onBlur={() => setShowingDropdown(false)}
          >
            <StyledProfileLink>
              {user.name}
              <FontAwesomeIcon
                icon={faUserCircle}
                style={{ marginLeft: "10px", fontSize: "16px" }}
              />
            </StyledProfileLink>
          </ProfileLinkWrapper>
          <ProfileDropDown
            user={user}
            setUser={setUser}
            show={showingDropdown}
          />
        </ProfileWrapper>
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
      <StyledNavLink to="/bank/lcs">Review LC Applications</StyledNavLink>
      <StyledNavLink to="/manage">Manage Live LCs</StyledNavLink>
      <LoginSection user={user} setUser={setUser} />
    </StyledNav>
  );
};

export default Nav;
