import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, useField } from 'formik';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";

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

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 15px;
  flex-wrap: wrap;

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
  margin: 10px 0;
  max-width: 45%;
  display: flex;
  align-items: center;
`

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

const YesNoInput = ({ question }) => {
  const [, meta, helpers] = useField(question.key);
  const { value } = meta;
  const { setValue } = helpers;

  const handleClick = (val) => (e) => {
    e.preventDefault();
    setValue(val);
  }

  return (
    <BasicInput question={question}>
      <ButtonWrapper style={{ justifyContent: 'center' }}>
        <StyledButton onClick={handleClick(true)} selected={value === true}>Yes</StyledButton>
        <StyledButton onClick={handleClick(false)} selected={value === false}>No</StyledButton>
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
  const handleClick = (val) => (e) => {
    e.preventDefault();
    setValue(val);
  }
  return (
    <BasicInput question={question}>
    <AllRadiosWrapper>
      <ButtonWrapper>
    {options && options.map((opt) => (
        <StyledButton onClick={handleClick(opt)} selected={value === opt} key={opt}>{opt}</StyledButton>
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

const CheckboxInput = ({ question }) => {
  const options = JSON.parse(question.options);
  const [, meta, helpers] = useField(question.key);
  const { value } = meta;
  const { setValue } = helpers;
  const handleClick = (val) => (e) => {
    e.preventDefault();
    const i = value.indexOf(val);
    if (i !== -1) {
      setValue(value.slice(0, i).concat(value.slice(i + 1)));
    } else {
      setValue(value.concat([val]));
    }
  }

  return (
    <BasicInput question={question}>
    <AllCheckboxesWrapper>
      <ButtonWrapper>
    {options && options.map((opt) => (
        <StyledButton onClick={handleClick(opt)} selected={value.indexOf(opt) !== -1} key={opt}>
        {value.indexOf(opt) !== -1 && <FontAwesomeIcon icon={faCheckSquare} style={{ marginRight: '10px' }}/>}
        {opt}
        </StyledButton>
    ))}
      </ButtonWrapper>
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
  boolean: null,
  radio: null,
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
      <div style={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
      <Button disabled={isSubmitting} type="submit">Submit LC App</Button>
      </div>
      </Form>
    )}
      </Formik>

    )}
    </BasicLayout>
  )
}

export default BankLCAppPage;