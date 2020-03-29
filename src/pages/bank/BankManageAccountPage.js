import React, { useContext } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { string, object, ref } from 'yup';

import Button from "./Button";
import BasicLayout from "../../components/BasicLayout";
import { makeAPIRequest } from '../../utils/api';
import { useAuthentication, UserContext } from "../../utils/auth";

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

const signUpFormValidationSchema = object().shape({
  newBankName: string(),
  name: string(),
  title: string(),
  password: string().matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    "Password must have at least 8 characters, and have at least one of each of the following: " +
    "uppercase letter, lowercase letter, number, other special character (@$!%*#?&)."
  ), // wtf is this regex... idk but it works
  // source https://stackoverflow.com/questions/55451304/formik-yup-password-strength-validation-with-react
  // TODO update this to be more user friendly
  passwordConfirm: string()
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

const BankManageAccountPage = ({ history }) => {
  useAuthentication("/bank/account");
  const setUser = useContext(UserContext)[1];
  return (
    <BasicLayout title="My Account 🛠" subtitle="View and edit your user settings.">
    <Formik
      initialValues={{
        newBankName: '', name: '', title: '', password: '', passwordConfirm: '',
      }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        makeAPIRequest("/", "PUT", values)
          .then((response) => {
            const user = response["user_employee"][0];
            setUser({ ...user, userType: 'bank' });
          });
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
          <Button disabled={isSubmitting}>
            Save Update
          </Button>
        </FormFooter>
      </SignUpForm>
    )}
    </Formik>
    </BasicLayout>
  );
}

export default BankManageAccountPage;
