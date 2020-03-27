import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';

import BasicLayout from "../../components/BasicLayout";
import { useAuthentication, UserContext } from '../../utils/auth';
import { makeAPIRequest } from '../../utils/api';
import styled from 'styled-components';
import { useState } from 'react';

const StyledForm = styled(Form)`
  display: flex;
  max-width: 800px;
  margin: auto;
`;

const validationSchema = object().shape({
  email: string().email('Please enter a valid email address.').required('Please enter an email address.'),
});

const StatusMessage = styled.div`
  ${props => props.status && `
    padding: 10px 10px;
  `}
  border-radius: 5px;
  background-color: ${props => props.status === `error` ? `#dc3545` : `#4bb759`};
  color: #fff;
`

const BankInvitePage = () => {
  useAuthentication('/bank/invite');
  const [user] = useContext(UserContext);
  const [status, setStatus] = useState({ status: null, message: ""});
  return (
    <BasicLayout title={`Welcome${', ' + (user ? user.name : '')} 🚀`} subtitle="Invite your team to the platform.">
      <Formik
        initialValues={{ email: '' }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          makeAPIRequest(`/bank/${user.bank.id}/invite_teammate`, "POST", { "inviteeEmail": values.email })
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
        <StyledForm>
          <Field type="email" name="email"/>
          <ErrorMessage name="email"/>
          {status && (<StatusMessage status={status.status}>{status.message}</StatusMessage>)}
          <button type="submit">send email</button>
        </StyledForm>
      )}
      </Formik>
    </BasicLayout>
  );
}

export default BankInvitePage;