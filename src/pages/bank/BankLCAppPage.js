import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field } from 'formik';

import BasicLayout from '../../components/BasicLayout';
import { makeAPIRequest } from '../../utils/api';

const InputWrapper = styled.div`
  max-width: 700px;
  margin: 10px auto;
  padding: 15px 25px;
  border-radius: 10px;
  border: 1px solid #cdcdcd;

  &:hover {
    border: 1px solid rgb(27, 108, 255);
  }
  transition: border 0.3s;
  background-color: #fff;
`

const QuestionText = styled.h3`
  font-size: 14px;
  font-weight: 300;
`

const StyledFormInput = styled(Field)`
  padding: 10px 0 5px;
  min-width: 100%;
  font-size: 16px;
  border: none;
  border-bottom: 1px solid #cdcdcd;
`;

const BasicInput = ({ question, children }) => {
  return (
    <InputWrapper>
      <QuestionText>{question.questionText}</QuestionText>
      {children}
    </InputWrapper>
  )
}

const TextInput = ({ question }) => {
  return (
    <BasicInput question={question}>
      <StyledFormInput type="text" name={question.key}/>
    </BasicInput>
  );
};

const TYPE_TO_COMPONENT = {
  text: TextInput,
  decimal: TextInput,
  number: TextInput,
  boolean: TextInput,
  radio: TextInput,
  date: TextInput,
  checkbox: TextInput,
  array_of_objs: TextInput,
};

const TYPE_TO_DEFAULT = {
  text: "",
  decimal: 0,
  number: 0,
  boolean: false,
  radio: [],
  date: (new Date()).getTime(),
  checkbox: [],
  array_of_objs: [],
}

const BankLCAppPage = ({ match }) => {
  const [lcApp, setLCApp] = useState(null);
  useEffect(() => {
    makeAPIRequest(`/bank/${match.params.bankid}/digital_app/`)
      .then(json => setLCApp(json))
  }, [match.params.bankid])
console.log(lcApp)

  const initialValues = {};

  if (lcApp) {
    lcApp.forEach(q => initialValues[q.key] = TYPE_TO_DEFAULT[q.type])
  }

  return (
    <BasicLayout title={`LC Application`} loading={lcApp}>
    {lcApp && (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        console.log(values)
        setSubmitting(false);
      }}
    >
    {({ isSubmitting }) => (
      <Form>
      {lcApp && lcApp.map(question => {
        const Component = TYPE_TO_COMPONENT[question.type];
        return <Component key={question.id} question={question} />;
      })}
      </Form>
    )}
      </Formik>

    )}
    </BasicLayout>
  )
}

export default BankLCAppPage;