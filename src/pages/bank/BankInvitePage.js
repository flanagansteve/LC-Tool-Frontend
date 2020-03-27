import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';

import BasicLayout from "../../components/BasicLayout";
import { useAuthentication, UserContext } from '../../utils/auth';
import { makeAPIRequest } from '../../utils/api';
import styled from 'styled-components';

const StyledForm = styled(Form)`
  display: flex;
  max-width: 800px;
  margin: auto;
`;

const validationSchema = object().shape({
  email: string().email('Please enter a valid email address.').required('Please enter an email address.'),
});

const BankInvitePage = () => {
  useAuthentication('/bank/invite');
  const [user] = useContext(UserContext);
  return (
    <BasicLayout title={`Welcome${', ' + (user && user.name)} 🚀`} subtitle="Invite your team to the platform.">
      <Formik
        initialValues={{ email: '' }}
        onSubmit={(values, { setSubmitting }) => {
          makeAPIRequest(`/bank/${user.bank.id}/invite_teammate`, "POST", { "inviteeEmail": values.email })
            .then((response) => {
              console.log(response)
              // history.push("/bank/setupApplication");
            });
          setSubmitting(false);
        }}
        validationSchema={validationSchema}
      >
      {(formikBag) => (
        <StyledForm>
          <Field type="email" name="email"/>
          <ErrorMessage name="email"/>
          <button type="submit">send email</button>
        </StyledForm>
      )}
      </Formik>
    </BasicLayout>
  );
}

export default BankInvitePage;