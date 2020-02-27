import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

import BasicLayout from '../common/components/BasicLayout';
import { logIn } from '../common/utils/api';

const LoginForm = styled.form`
  background-color: #fff;
  padding: 10px 20px;
  border: 1px solid #E5E4E2;
  border-radius: 25px;
`

const FormInputWrapper = styled.div`
  margin: 20px 10px 40px;
`

const FormInputTitle = styled.h3`
  font-size: 14px;
`

const StyledFormInput = styled.input`
  font-size: 18px;
  padding: 10px 0 5px;
  min-width: 100px;
  border: none;
  border-bottom: 1px solid #cdcdcd;
`

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
`

// TODO revisit styles? not super happy with how this looks
// also it says "Log In" 3 times on this page... we get it
const LogInButton = styled.span`
  cursor: pointer;
  transition: color 0.3s;
  
  &:hover {
    color: rgb(34, 103, 255);
  }
`

const FormInput = ({ title, value, type, onChange }) => {
  return (
    <FormInputWrapper>
    <FormInputTitle>{title}</FormInputTitle>
    <StyledFormInput type={type} value={value} onChange={onChange}/>
    </FormInputWrapper>
  )
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const clickLogIn = () => {
    logIn().then(() => history.push("/"));
  }
  return (
    <BasicLayout title="Log In">
      <LoginForm>
        <FormInput title="Email" type="text" value={email} onChange={e => setEmail(e.target.value)}></FormInput>
        <FormInput title="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}></FormInput>
        <FormFooter>
          <LogInButton onClick={clickLogIn}>
            Log In<FontAwesomeIcon icon={faArrowRight} size="lg" color="rgb(34, 103, 255)" style={{marginLeft: "10px"}}/>
           </LogInButton>
        </FormFooter>
      </LoginForm>
    </BasicLayout>
  );
};

export default LoginPage