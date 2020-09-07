import React, {useContext, useState} from "react";
import styled from "styled-components";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { string, object, ref } from 'yup';

import BasicLayout from "../../components/BasicLayout";
import { makeAPIRequest } from '../../utils/api';
import { UserContext } from "../../utils/auth";
import Button from "../../components/ui/Button";
import StatusMessage from "../../components/ui/StatusMessage";

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
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-bottom: 10px;
  
  > :nth-child(1) {
    grid-column-start: 2;
    justify-self: center;
  }
  
  > :nth-child(2) {
    justify-self: end;
  }
`;

const requiredMsg = 'This field is required.';

const signUpFormValidationSchema = object().shape({
  name: string().required(requiredMsg),
  title: string().required(requiredMsg),
  email: string().email('Please enter a valid email address.').required(requiredMsg),
  password: string().required(requiredMsg).matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
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

const BusinessEmployeeSignUpPage = ({ history, match }) => {
  const setUser = useContext(UserContext)[1];
  const [status, setStatus] = useState({status: null, message: ""});
  return (
    <BasicLayout
      title="Welcome! 🎉"
      subtitle="Create your account for lightning-fast LC processing."
    >
    <Formik
      initialValues={{
        name: '', title: '', email: '', password: '', passwordConfirm: '',
      }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        makeAPIRequest(`/business/${match.params.businessid}/register/`, "POST", values)
          .then((json) => {
            setUser({ ...json.userEmployee, business: json.usersEmployer });
            history.push(match.params.lcid ? `/lc/${match.params.lcid}` : "/business/invite");
          })
          .then(() => setSubmitting(false))
        .catch(e => {
          if (e.status === 404) {
            setStatus({status: "error", message: "This link is invalid. Double-check your email."});
            setSubmitting(false);
          }
          else {
            e.text().then(message => {
              setStatus({status: "error", message});
              setSubmitting(false);
            });
          }
        })
      }}
      validationSchema={signUpFormValidationSchema}
    >
    {({ isSubmitting }) => (
      <SignUpForm>
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
          <StatusMessage style={{marginTop: 0, overflow: "auto"}} status={status.status}>{status.message}</StatusMessage>
          <Button style={{height: "fit-content"}} showArrow disabled={isSubmitting}>
            Sign Up
          </Button>
        </FormFooter>
      </SignUpForm>
    )}
    </Formik>
    </BasicLayout>
  );
};

export default BusinessEmployeeSignUpPage;
