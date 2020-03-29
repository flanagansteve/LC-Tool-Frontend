import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';

import Button from '../../components/ui/Button';
import BasicLayout from "../../components/BasicLayout";
import { useAuthentication, UserContext } from '../../utils/auth';
import { makeAPIRequest } from '../../utils/api';
import styled from 'styled-components';
import { useState } from 'react';

const StyledForm = styled(Form)`
  display: flex;
  max-width: 800px;
  min-width: 400px;
  margin: auto;
  justify-content: center;
  > :not(:last-child) {
    margin-right: 10px;
  }
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const validationSchema = object().shape({
  email: string().email('Please enter a valid email address.').required('Please enter an email address.'),
});

const StatusMessage = styled.div`
  ${props => props.status && `
    padding: 10px;
  `}
  border-radius: 5px;
  max-width: 400px;
  overflow: scroll;
  margin: 40px auto auto;
  background-color: ${props => props.status === `error` ? `#dc3545` : `#4bb759`};
  color: #fff;
`

const StyledField = styled(Field)`
  border-radius: 5px;
  border: 1px solid #cdcdcd;
  font-size: 18px;
  padding-left: 10px;
`

const ErrorMessageWrapper = styled.div`
  margin: auto;
  max-width: 400px;
  color: #dc3545;
  margin-top: 10px;
`

const ButtonHolder = styled.div`
  display: flex;
  justify-content: flex-end;
`

const BankInvitePage = ({ history }) => {
  useAuthentication('/bank/invite');
  const [user] = useContext(UserContext);
  const [status, setStatus] = useState({ status: null, message: ""});
  return (
    <BasicLayout 
      title={`Welcome${(user ? ', ' + user.name : '')} 🚀`}
      subtitle="Enter your teammates' emails to invite them to the platform."
    >
      <Formik
        initialValues={{ email: '' }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          console.log(user)
          makeAPIRequest(`/bank/${user.bank.id}/invite_teammate`, "POST", { "inviteeEmail": values.email }, true)
            .then((response) => {
              if (response.status === 200) setStatus({ 
                status: "success",
                message: `Invite sent to ${values.email}!`
              });
              else setStatus({
                status: "error",
                message: `Error inviting ${values.email}.`
              })
            });
          setSubmitting(false);
        }}
        validationSchema={validationSchema}
      >
      {({ isSubmitting }) => (
        <FormWrapper>
        <StyledForm>
          <StyledField type="email" name="email"/>
          <Button type="submit">{isSubmitting ? 'Sending...' : 'Send'}</Button>
        </StyledForm>
        <ErrorMessageWrapper>
          <ErrorMessage name="email"/>
        </ErrorMessageWrapper>
        </FormWrapper>
      )}
      </Formik>
        {status.status && (<StatusMessage status={status.status}>{status.message}</StatusMessage>)}

    <ButtonHolder>
      <Button showArrow onClick={() => history.push("/bank/createApp")}>
        Next
      </Button>
    </ButtonHolder>
    </BasicLayout>
  );
}

export default BankInvitePage;