import React, {useContext} from "react";
import styled from "styled-components";
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {string, object, ref} from 'yup';

import BasicLayout from "../../components/BasicLayout";
import {makeAPIRequest} from '../../utils/api';
import {UserContext} from "../../utils/auth";
import Button from "../../components/ui/Button";
import {Link} from "react-router-dom";

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

const requiredMsg = 'This field is required.';

const signUpFormValidationSchema = object().shape({
    newBusinessName: string().required(requiredMsg),
    newBusinessAddress: string().required(requiredMsg),
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

const FormInput = ({title, type, name}) => {
    return (
        <FormInputWrapper>
            <FormInputTitle>{title}</FormInputTitle>
            <StyledFormInput type={type} name={name}/>
            <StyledErrorMessage name={name} component="div"/>
        </FormInputWrapper>
    );
};

const BusinessSignUpPage = ({history}) => {
    const setUser = useContext(UserContext)[1];
    return (
        <BasicLayout
            title="Welcome! ????"
            subtitle={
                <>
                    Get your team up & running with lightning-fast LC processing.
                    <br/><br/>
                    <span style={{fontStyle: 'italic'}}>Not a business? </span>
                    <Link to="/bank/register">Register as a bank</Link>
                </>
            }
        >
            <Formik
                initialValues={{
                    newBusinessName: '',
                    newBusinessAddress: '',
                    name: '',
                    title: '',
                    email: '',
                    password: '',
                    passwordConfirm: '',
                }}
                onSubmit={(values, {setSubmitting}) => {
                    setSubmitting(true);
                    makeAPIRequest("/business/", "POST", values)
                        .then((json) => {
                            setUser({...json.userEmployee, business: json.usersEmployer});
                            history.push("/business/invite");
                        })
                        .then(() => setSubmitting(false));
                }}
                validationSchema={signUpFormValidationSchema}
            >
                {({isSubmitting}) => (
                    <SignUpForm>
                        <FormInput
                            title="Business Name"
                            name="newBusinessName"
                            type="text"
                        />
                        <FormInput
                            title="Business Address"
                            name="newBusinessAddress"
                            type="text"
                        />

                        <FormInput
                            title="Business Country"
                            name="newBusinessCountry"
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
                            <Button showArrow disabled={isSubmitting}>
                                Sign Up
                            </Button>
                        </FormFooter>
                    </SignUpForm>
                )}
            </Formik>
        </BasicLayout>
    );
};

export default BusinessSignUpPage;
