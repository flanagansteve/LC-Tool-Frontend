import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Formik, Form, Field } from 'formik';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import BasicLayout from "../components/BasicLayout";
import { logIn } from "../utils/api";

const SignUpForm = styled(Form)`
  background-color: #fff;
  padding: 10px 20px;
  border: 1px solid #e5e4e2;
  border-radius: 25px;
`;

const FormInputWrapper = styled.div`
  margin: 20px 10px 40px;
`;

const FormInputTitle = styled.h3`
  font-size: 14px;
  color: #555;
`;

const StyledFormInput = styled(Field)`
  font-size: 18px;
  padding: 10px 0 5px;
  min-width: 100%;
  border: none;
  border-bottom: 1px solid #cdcdcd;
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
`;

// TODO revisit styles? not super happy with how this looks
// also it says "Log In" 3 times on this page... we get it
const SignUpButton = styled.button`
  cursor: pointer;
  transition: color 0.3s;
  font-size: 14px;
  border: none;
  background-color: #fff;

  &:hover {
    color: rgb(34, 103, 255);
  }
`;

const FormInput = ({ title, type, name }) => {
  return (
    <FormInputWrapper>
      <FormInputTitle>{title}</FormInputTitle>
      <StyledFormInput type={type} name={name}/>
    </FormInputWrapper>
  );
};

const LoginPage = () => {
  const history = useHistory();
  const clickLogIn = () => {
    logIn().then(() => history.push("/"));
  };
  return (
    <BasicLayout 
      title="Welcome! 🎉"
      subtitle="Get your team up & running with lightning-fast LC processing."
    >
    <Formik
      initialValues={{
        bankName: '', name: '', title: '', email: '', password: '', passwordConfirm: '',
      }}
    >
    {({ isSubmitting }) => (
      <SignUpForm>
      <FormInput
          title="Bank Name"
          name="bankName"
          type="text"
        />
        <FormInput
          title="Your Name"
          name="name"
          type="text"
        />
        <FormInput
          title="Your Title"
          name="title"
          type="text"
        />
        <FormInput
          title="Email"
          name="email"
          type="email"
        />
        <FormInput
          title="Password"
          name="password"
          type="password"
        />
        <FormInput
          title="Confirm Password"
          name="passwordConfirm"
          type="password"
        />
        <FormFooter>
          <SignUpButton onClick={clickLogIn} disabled={isSubmitting}>
            Sign Up
            <FontAwesomeIcon
              icon={faArrowRight}
              size="lg"
              color="rgb(34, 103, 255)"
              style={{ marginLeft: "10px" }}
            />
          </SignUpButton>
        </FormFooter>
      </SignUpForm>

    )}
    </Formik>
    </BasicLayout>
  );
};

export default LoginPage;
