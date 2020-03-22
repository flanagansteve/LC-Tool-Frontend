import React from "react";
import styled from "styled-components";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { string, object, ref } from 'yup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import BasicLayout from "../../components/BasicLayout";
import { makeAPIRequest } from '../../utils/api';

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

const StyledErrorMessage = styled(ErrorMessage)`
  font-size: 12px;
  color: #f00;
  margin-top: 5px;
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

const requiredMsg = 'This field is required.';

const signUpFormValidationSchema = object().shape({
  newBankName: string().required(requiredMsg),
  name: string().required(requiredMsg),
  title: string().required(requiredMsg),
  email: string().email('Please enter a valid email address.').required(requiredMsg),
  password: string().required(requiredMsg).matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    "Password must have at least 8 characters, and have at least one of each of the following: " +
    "uppercase letter, lowercase letter, number, other special character (@$!%*#?&)."
  ), // wtf is this regex... idk but it works
  // source https://stackoverflow.com/questions/55451304/formik-yup-password-strength-validation-with-react
  // TODO update this to be more user friendly
  passwordConfirm: string().required(requiredMsg)
    .oneOf([ref('password')], "Passwords do not match."),
});

const FormInput = ({ title, type, name }) => {
  return (
    <FormInputWrapper>
      <FormInputTitle>{title}</FormInputTitle>
      <StyledFormInput type={type} name={name}/>
      <StyledErrorMessage name={name} component="div"/>
    </FormInputWrapper>
  );
};

const BankSignUpPage = () => {
  return (
    <BasicLayout 
      title="Welcome! 🎉"
      subtitle="Get your team up & running with lightning-fast LC processing."
    >
    <Formik
      initialValues={{
        newBankName: '', name: '', title: '', email: '', password: '', passwordConfirm: '',
      }}
      onSubmit={(values, { setSubmitting }) => {
        makeAPIRequest("/bank/", "POST", values);
        setSubmitting(false);
      }}
      validationSchema={signUpFormValidationSchema}
    >
    {({ isSubmitting }) => (
      <SignUpForm>
      <FormInput
          title="Bank Name"
          name="newBankName"
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
          type="text"
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
          <SignUpButton disabled={isSubmitting}>
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

export default BankSignUpPage;
