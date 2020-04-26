import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { get } from "lodash";

import BasicLayout from "../../components/BasicLayout";
import { logIn } from "../../utils/api";
import { UserContext } from "../../utils/auth";
import config from '../../config';

const LoginForm = styled.form`
  background-color: #fff;
  padding: 10px 20px;
  border: 1px solid #e5e4e2;
  border-radius: 25px;
`;

const LoginErrorMessage = styled.div`
  ${props => props.showError && `
    padding: 10px 10px;
  `}
  border-radius: 5px;
  background-color: #dc3545;
  color: #fff;
`

const HelpEmail = styled.a`
  font-size: 14px;
  font-style: italic;
  margin: 0 10px 10px;
`

const FormInputWrapper = styled.div`
  margin: 20px 10px 40px;
`;

const FormInputTitle = styled.h3`
  font-size: 14px;
  color: #555;
`;

const StyledFormInput = styled.input`
  font-size: 18px;
  padding: 10px 0 5px;
  min-width: 100px;
  border: none;
  border-bottom: 1px solid #cdcdcd;
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

// TODO revisit styles? not super happy with how this looks
// also it says "Log In" 3 times on this page... we get it
const LogInButton = styled.button`
  cursor: pointer;
  transition: color 0.3s;
  margin: 10px 5px;
  border: none;
  font-size: 16px;
  background-color: #fff;

  &:hover {
    color: ${config.accentColor};
  }
`;

const FormInput = ({ title, value, type, onChange }) => {
  return (
    <FormInputWrapper>
      <FormInputTitle>
        {title}
        {type === "password" && (<HelpEmail href="mailto:support@bountium.com"> Need help?</HelpEmail>)}
      </FormInputTitle>
      <StyledFormInput type={type} value={value} onChange={onChange} />
    </FormInputWrapper>
  );
};

const LoginPage = ({ history, location }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const setUser = useContext(UserContext)[1];
  const nextRoute = get(location, "state.nextRoute");
  const clickLogIn = (e) => {
    e.preventDefault();
    logIn(email, password)
      .then((json) => setUser(json))
      .then(() => history.push(nextRoute || "/"))
      .catch(() => {
        setError("❕ We can't seem to log you in right now.");
      });
  };
  return (
    <BasicLayout title="Log In">
      <LoginForm onSubmit={clickLogIn}>
        <FormInput
          title="Email"
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <FormInput
          title="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKey
        />
        <HelpEmail>
          New Here? <Link to="/bank/register">Create Account</Link>
        </HelpEmail>
        <FormFooter>
        <LoginErrorMessage showError={error}>
          {error}
        </LoginErrorMessage>
          <LogInButton type="submit">
            Log In
            <FontAwesomeIcon
              icon={faArrowRight}
              size="lg"
              color={config.accentColor}
              style={{ marginLeft: "10px" }}
            />
          </LogInButton>
        </FormFooter>
      </LoginForm>
    </BasicLayout>
  );
};

export default LoginPage;
