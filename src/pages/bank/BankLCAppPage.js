import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, useField } from 'formik';

import BasicLayout from '../../components/BasicLayout';
import { makeAPIRequest } from '../../utils/api';
import Button from "../../components/ui/Button";

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
  line-height: 1.25;
`

const Asterisk = styled.span`
  color: #dc3545;
  font-size: 16px;
`

const StyledFormInput = styled(Field)`
  margin-top: 10px;
  padding: 10px 0 5px;
  min-width: 100%;
  font-size: 16px;
  border: none;
  border-bottom: 1px solid #cdcdcd;
`;

const BasicInput = ({ question, children }) => {
  return (
    <InputWrapper>
      <QuestionText>{question.questionText}{question.required ? (<Asterisk> *</Asterisk>) : null}</QuestionText>
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

const NumberInput = ({ question }) => {
  return (
    <BasicInput question={question}>
      <StyledFormInput type="number" name={question.key}/>
    </BasicInput>
  )
}

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;

  > :not(:last-child) {
    margin-right: 20px;
  }
`

const StyledButton = styled.button`
  background-color: ${(props) => props.selected ? `rgb(27, 108, 255)` : `#fff`};
  border-radius: 5px;
  padding: 5px 10px;
  color: ${(props) => props.selected ? `#fff` : `rgb(27, 108, 255)`};
  border: 1px solid rgb(27, 108, 255);
  font-size: 16px;
  cursor: pointer;
`

const YesNoInput = ({ question }) => {
  const [, meta, helpers] = useField(question.key);
  const { value } = meta;
  const { setValue } = helpers;

  return (
    <BasicInput question={question}>
      <ButtonWrapper>
        <StyledButton onClick={() => setValue(true)} selected={value}>Yes</StyledButton>
        <StyledButton onClick={() => setValue(false)} selected={!value}>No</StyledButton>
      </ButtonWrapper>
    </BasicInput>
  )
}

const AllRadiosWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const RadioInput = ({ question }) => {
  const options = JSON.parse(question.options);
  const [, meta, helpers] = useField(question.key);
  const { value } = meta;
  const { setValue } = helpers;
  return (
    <BasicInput question={question}>
    <AllRadiosWrapper>
      <ButtonWrapper>
    {options && options.map((opt) => (
        <StyledButton onClick={() => setValue(opt)} selected={value === opt} key={opt}>{opt}</StyledButton>
    ))}
      </ButtonWrapper>
    </AllRadiosWrapper>
    </BasicInput>
  )
}

const DateInput = ({ question }) => {
  return (
    <BasicInput question={question}>
      <StyledFormInput type="date" name={question.key}/>
    </BasicInput>
  )
}

const AllCheckboxesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const CheckboxWrapper = styled.div`
  display: flex;
  margin: 25px 20px 10px;
  align-items: center;
  flex-basis: auto;
  line-height: 1.25;

  > :not(:last-child) {
    margin-right: 10px;
  }
`

const CheckboxInput = ({ question }) => {
  const options = JSON.parse(question.options);

  return (
    <BasicInput question={question}>
    <AllCheckboxesWrapper>
    {options && options.map((opt, i) => (
      <CheckboxWrapper key={opt}>
      <input type="checkbox"/>
      <span style={{ fontSize: "14px" }}>{opt}</span>
      </CheckboxWrapper>
    ))}
    </AllCheckboxesWrapper>
    </BasicInput>
  )
}

const TYPE_TO_COMPONENT = {
  text: TextInput,
  decimal: NumberInput,
  number: NumberInput,
  boolean: YesNoInput,
  radio: RadioInput,
  date: DateInput,
  checkbox: CheckboxInput,
  array_of_objs: TextInput,
};

const TYPE_TO_DEFAULT = {
  text: "",
  decimal: 0,
  number: 0,
  boolean: false,
  radio: "",
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
console.log(lcApp && lcApp.map(l => l.type))

  const initialValues = {};

  if (lcApp) {
    lcApp.forEach(q => initialValues[q.key] = TYPE_TO_DEFAULT[q.type])
  }

  return (
    <BasicLayout title={`LC Application`} subtitle={(<span><Asterisk>*</Asterisk> denotes required field.</span>)} isLoading={!lcApp}>
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
      <Button showArrow disabled={isSubmitting} type="submit">Submit LC App</Button>
      </Form>
    )}
      </Formik>

    )}
    </BasicLayout>
  )
}

export default BankLCAppPage;