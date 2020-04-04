import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, useField } from 'formik';
import { object, string, number, boolean, array, date } from 'yup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";

import BasicLayout from '../../components/BasicLayout';
import { makeAPIRequest } from '../../utils/api';
import Button from "../../components/ui/Button";
import StatusMessage from "../../components/ui/StatusMessage";
import { useAuthentication } from '../../utils/auth';

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

const Subtitle = styled.div`
  margin-top: 15px;
  color: #555353;
  font-style: italic;
  font-size: 14px;
  font-weight: 300;
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


const BasicInput = ({ question, children, subtitle }) => {
  const [, meta] = useField(question.key);
  const { error, touched } = meta;
  return (
    <InputWrapper>
      <QuestionText>{question.questionText}{question.required ? (<Asterisk> *</Asterisk>) : null}</QuestionText>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {error && touched && <Subtitle style={{color: '#dc3545'}}>{typeof error !== 'object' ? error : null}</Subtitle>}
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
    <BasicInput question={question} subtitle="Check all that apply.">
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

const DocReqFieldWrapper = styled.div`
  margin: 10px 0;
  display: flex;
  align-items: center;
  > :first-child {
    flex-basis: 200px;
    font-weight: 300;
    border-bottom: 1px solid #cdcdcd;
    border-right: 1px solid #cdcdcd;
    padding: 10px 10px 5px;
    text-align: right;
  }
`

const StyledDocReqField = styled(Field)`
  padding: 10px 10px 5px;
  font-size: 16px;
  border: none;
  border-bottom: 1px solid #cdcdcd;
  flex-grow: 1;
  line-height: 1em;
`;

const DocReqTitle = styled.h3`
  text-transform: uppercase;
  font-weight: 300;
  letter-spacing: .1em;
`

const DocReqInput = ({ question }) => {
  const [, meta, helpers] = useField(question.key);
  const { value } = meta;
  const { setValue } = helpers;

  const handleClick = (e) => {
    e.preventDefault();
    setValue([...value, { docName: '', dueDate: (new Date()).toISOString(), requiredValues: ''}])
  }

  return (
    <BasicInput question={question}>
      {value.map((docReq, i) => (
        <div style={{margin: "20px"}} key={i}>
          <DocReqTitle>Documentary Requirement #{i+1}</DocReqTitle>
          <DocReqFieldWrapper>
          <span>Name: </span>
            <StyledDocReqField type="text" name={`${question.key}[${i}].docName`}/>
          </DocReqFieldWrapper>
          <DocReqFieldWrapper>
          <span>Due Date: </span>
          <StyledDocReqField type="date" name={`${question.key}[${i}].dueDate`}/>
          </DocReqFieldWrapper>
          <DocReqFieldWrapper>
          <span>Required Values: </span>
          <StyledDocReqField type="text" name={`${question.key}[${i}].requiredValues`}/>
          </DocReqFieldWrapper>
        </div>
      ))}
      <center style={{ marginTop: '25px'}}>
        <StyledButton onClick={handleClick}>Add Documentary Requirement</StyledButton>
      </center>
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
  array_of_objs: DocReqInput,
};

const TYPE_TO_DEFAULT = {
  text: "",
  decimal: 0,
  number: 0,
  boolean: null,
  radio: null,
  date: (new Date()).toISOString(),
  checkbox: [],
  array_of_objs: [],
}

const REQUIRED_MSG = "This field is required.";

const TYPE_TO_VALIDATION_SCHEMA = {
  text: string(),
  decimal: number(),
  number: number(),
  boolean: boolean().nullable(),
  radio: string().nullable(),
  date: date(),
  checkbox: array().of(string()),
  array_of_objs: array().of(object().shape({
    docName: string().required(REQUIRED_MSG),
    requiredValues: string().required(REQUIRED_MSG),
    dueDate: date().required(REQUIRED_MSG),
  })),
}

const BankLCAppPage = ({ match }) => {
  const [lcApp, setLCApp] = useState(null);
  const persistedLcApp = JSON.parse(localStorage.getItem(`lc/${match.params.bankid}`));
  const [error, setError] = useState(null);
  useAuthentication(`/bank/${match.params.bankid}/application`);
  useEffect(() => {
    makeAPIRequest(`/bank/${match.params.bankid}/digital_app/`)
      .then(json => setLCApp(json))
  }, [match.params.bankid])

  let initialValues = {};
  let validationSchema = null;

  if (lcApp) {
    const schemaObj = {};
    if (persistedLcApp) {
      initialValues = persistedLcApp;
    } else {
      lcApp.forEach(q => {
        initialValues[q.key] = TYPE_TO_DEFAULT[q.type];
      });
    }
      lcApp.forEach(q => {
        schemaObj[q.key] = TYPE_TO_VALIDATION_SCHEMA[q.type];
        if (q.required) {
          schemaObj[q.key] = schemaObj[q.key].required(REQUIRED_MSG);
        }
      });
    validationSchema = object().shape(schemaObj);
  }

  return (
    <BasicLayout title={`LC Application`} subtitle={(<span><Asterisk>*</Asterisk> denotes required field.</span>)} isLoading={!lcApp}>
    {lcApp && (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        const app = {};
        Object.entries(values).forEach((kv) => {
          const [key, value] = kv;
          if (value === null) {
          } else {
            app[key] = value;
          }
        });
        makeAPIRequest(`/lc/by_bank/${match.params.bankid}/`, 'POST', app, true)
          .then(async res => {
            if (res.status === 200) {
              localStorage.removeItem(`lc/${match.params.bankid}`);
            } else {
              localStorage.setItem(`lc/${match.params.bankid}`, JSON.stringify(values))
              const text = await res.text();
              setError(`Error submitting form: ${text}`);
            }
            })
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
      {error && <StatusMessage status={"error"}>{error}</StatusMessage>}
      </Form>
    )}
      </Formik>

    )}
    </BasicLayout>
  )
}

export default BankLCAppPage;