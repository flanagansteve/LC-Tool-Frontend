import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import BasicLayout from "../../components/BasicLayout";
import { logIn } from "../../utils/api";

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
const LogInButton = styled.span`
  cursor: pointer;
  transition: color 0.3s;
  margin: 10px 5px;

  &:hover {
    color: rgb(34, 103, 255);
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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const history = useHistory();
  const clickLogIn = () => {
    logIn(email, password)
      .then(() => history.push("/"))
      .catch(() => {
        setError("❕ We can't seem to log you in right now.");
      });
  };
  return (
    <BasicLayout title="Log In">
      <LoginForm>
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
        />
        <HelpEmail>
          
        </HelpEmail>
        <FormFooter>
        <LoginErrorMessage showError={error}>
          {error}
        </LoginErrorMessage>
          <LogInButton onClick={clickLogIn}>
            Log In
            <FontAwesomeIcon
              icon={faArrowRight}
              size="lg"
              color="rgb(34, 103, 255)"
              style={{ marginLeft: "10px" }}
            />
          </LogInButton>
        </FormFooter>
      </LoginForm>
    </BasicLayout>
  );
};

export default LoginPage;
