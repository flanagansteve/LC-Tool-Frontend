import React, { useState, useEffect } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';

import BasicLayout from '../../components/BasicLayout'
import { makeAPIRequest } from '../../utils/api';

const BasicInput = ({ question }) => {

}

const TextInput = ({ question }) => <div>{question.questionText}</div>;

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

  return (
    <BasicLayout title={`LC Application`} loading={lcApp}>
    {lcApp && (
    <Formik
      initialValues={lcApp.map(q => TYPE_TO_DEFAULT[q.type])}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        console.log(values)
        setSubmitting(false);
      }}
      validationSchema={{}}
    >
    {({ isSubmitting }) => (
      <>
      {lcApp && lcApp.map(question => {
        const Component = TYPE_TO_COMPONENT[question.type];
        return <Component key={question.id} question={question} />;
      })}
      </>
    )}
      </Formik>

    )}
    </BasicLayout>
  )
}

export default BankLCAppPage;