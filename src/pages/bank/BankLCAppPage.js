import React, {useContext, useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import _ from 'lodash'
import {Field, Form, Formik, useField, useFormikContext} from 'formik';
import {array, boolean, date, number, object, string} from 'yup';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckSquare, faTimes, faTrash} from "@fortawesome/free-solid-svg-icons";

import BasicLayout from '../../components/BasicLayout';
import {makeAPIRequest, objectToCamelCase, objectToSnakeCase} from '../../utils/api';
import Button from "../../components/ui/Button";
import StatusMessage from "../../components/ui/StatusMessage";
import {useAuthentication, UserContext} from '../../utils/auth';

import config from '../../config';
import {Dropdown, SearchableSelect, SearchableSelectHTS} from "../../components/ui/Dropdown";
import {Modal} from "../../components/ui/Modal";
import {ResizableScreenDiv} from "../../components/ui/ResizableScreenDiv";
import {RouteBlockingModal} from "../../components/ui/RouteBlockingModal";
import Checkbox from '@material-ui/core/Checkbox';

const disabledBackgroundColor = `#c3c1c3`;
const disabledColor = `black`;

const InputWrapper = styled.div`
  max-width: 700px;
  margin: 10px auto;
  padding: 15px 25px;
  border-radius: 10px;
  border: 1px solid #cdcdcd;
  transition: border 0.3s;
  background-color: ${props => props.disabled ? disabledBackgroundColor : `#fff`};

  ${props => !props.disabled && `&:hover {
    border: 1px solid ${config.accentColor};
  }`}
`;

const QuestionText = styled.h3`
  font-size: 14px;
  font-weight: 300;
  line-height: 1.25;
  color: ${props => props.disabled ? disabledColor : `#000`};
`;

const ClickableText = styled.span`
  color: blue;
  cursor: pointer;
  &:hover {
    color: #1772fb;
  }
`;

const Subtitle = styled.div`
  margin-top: 15px;
  color: #555353;
  font-style: italic;
  font-size: 14px;
  font-weight: 300;
`;

const SectionSubtitle = styled.div`
  color: #555353;
  font-style: italic;
  font-size: 14px;
  font-weight: 300;
`;

const Asterisk = styled.span`
  color: #dc3545;
  font-size: 16px;
`;

const StyledFormInput = styled(Field)`
  margin-top: 10px;
  padding: 10px 0 5px;
  min-width: 100%;
  font-size: 16px;
  border: none;
  border-bottom: ${props => props.disabled ? `0px` : `1px solid #cdcdcd`};
  background-color: ${props => props.disabled ? disabledBackgroundColor : `#fff`};
  color: ${props => props.disabled ? disabledColor : `#000`};
`;

const StyledInput = styled.input`
  padding: 10px 0 5px;
  flex: 1;
  font-size: 16px;
  border: none;
  border-bottom: ${props => props.disabled ? `0px` : `1px solid #cdcdcd`};
  background-color: ${props => props.disabled ? disabledBackgroundColor : `#fff`};
  color: ${props => props.disabled ? disabledColor : `#000`};
`;

const StyledDiv = styled.div`
  padding: 10px 0 5px;
  flex: 1;
  height: 18px;
  border: none;
  background-color: ${props => props.disabled ? disabledBackgroundColor : `#fff`};
  color: ${props => props.disabled ? disabledColor : `#000`};
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 15px;
  flex-wrap: wrap;

  > :not(:last-child) {
    margin-right: 20px;
  }
`;

const NestedButtonWrapper = styled.div`
  padding-left: 10px;
  flex: 1;
  display: flex;

  > :not(:last-child) {
    margin-right: 20px;
  }
`;

const ButtonVerticalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 95%;
  > :first-child {
    border-top: thin solid ${config.accentColor};
  }
`;

const StyledButton = styled.button`
  background-color: ${(props) => props.selected ? config.accentColor : props.disabled ? disabledBackgroundColor
  : `#fff`};
  border-radius: 5px;
  padding: 5px 10px;
  color: ${(props) => props.selected ? `#fff` : props.disabled ? disabledColor : config.accentColor};
  border: 1px solid ${props => props.disabled ? disabledColor : config.accentColor};
  font-size: 16px;
  ${props => !props.disabled && `cursor: pointer;`}
  margin: ${props => props.nested ? `0px` : `10px 0;`}
  ${props => !props.fitWidth && `max-width: 45%;`}
  display: flex;
  align-items: center;
`;

const StyledSection = styled.button`
  background-color: ${(props) => props.selected ? config.accentColor : `#fff`};
  border-radius: 1px;
  padding: 10px 10px;
  color: ${(props) => props.selected ? `#fff` : config.accentColor};
  font-size: 16px;
  cursor: pointer;
  text-align: left;
  width: 100%;
  border-width: thin;
  border-style: solid;
  border-color: ${config.accentColor};
  border-top: none;
`;

const scrollToAndHighlight = (questionKey) => {
  const selector = `[id="${questionKey}"]`;
  let parentElement = document.querySelector(selector);
  const originalBackgroundColor = window.getComputedStyle(parentElement).backgroundColor;
  const changeQuestionBackgroundTemp = () => {
    parentElement.animate({backgroundColor: ["lightblue", originalBackgroundColor]}, 1000);
  };

  // if the element is on the screen
  if (window.scrollY <= parentElement.offsetTop && window.scrollY + document.documentElement.clientHeight >=
    parentElement.offsetTop + parentElement.offsetHeight) {
    changeQuestionBackgroundTemp();
  } else {
    let scrollTimeout;
    const scrollHandler = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        window.removeEventListener("scroll", scrollHandler);
        changeQuestionBackgroundTemp()
      }, 20);
    };
    window.addEventListener("scroll", scrollHandler);
    parentElement.scrollIntoView({behavior: "smooth", block: "nearest"});
  }
};

const BasicInput = ({question, children, subtitle}) => {
  const [, meta] = useField(question.key);
  const {error, touched} = meta;
  return (
    <InputWrapper id={question.key} disabled={question.disabledTooltip}>
      <QuestionText disabled={question.disabledTooltip}>{question.questionText}{question.required ? (
        <Asterisk> *</Asterisk>) : null}</QuestionText>
      {!question.disabledTooltip && subtitle && <Subtitle>{subtitle}</Subtitle>}
      {question.disabledTooltip && <Subtitle onClick={() => scrollToAndHighlight(
        question.disabledTooltip.parentKey)}>{question.disabledTooltip.text}</Subtitle>}
      {error && touched && <Subtitle style={{color: '#dc3545'}}>{typeof error !== 'object' ? error : null}</Subtitle>}
      {children}
    </InputWrapper>
  )
};

const TextInput = ({question, status, setStatus, lcApp, setAppliedTemplate, appliedTemplate}) => {
  return (
    <BasicInput question={question} disabled={question.disabledTooltip}>
      <SuggestTemplates question={question} status={status} appliedTemplate={appliedTemplate} lcApp={lcApp}
                        setStatus={setStatus} setAppliedTemplate={setAppliedTemplate}/>
      {!question.disabledTooltip && <StyledFormInput type="text" name={question.key}/>}
    </BasicInput>
  );
};

const DropdownInput = ({question}) => {
  const [, meta, helpers] = useField(question.key);
  const {value} = meta;
  const {setValue} = helpers;

  return (
    <BasicInput question={question}>
      <Dropdown items={question.options} onChange={item => setValue(item)}
                selectedIndex={question.options.indexOf(value)}/>
    </BasicInput>
  )
};

const NumberInput = ({question}) => {
  return (
    <BasicInput question={question} disabled={question.disabledTooltip}>
      {!question.disabledTooltip && <StyledFormInput type="number" name={question.key}/>}
    </BasicInput>
  )
};

const YesNoInput = ({question}) => {
  const [, meta, helpers] = useField(question.key);
  const {value} = meta;
  const {setValue} = helpers;

  const handleClick = (val) => (e) => {
    e.preventDefault();
    setValue(val);
  };

  return (
    <BasicInput question={question} disabled={question.disabledTooltip}>
      {!question.disabledTooltip && <ButtonWrapper style={{justifyContent: 'center'}}>
        <StyledButton onClick={handleClick(true)} selected={value === true}>Yes</StyledButton>
        <StyledButton onClick={handleClick(false)} selected={value === false}>No</StyledButton>
      </ButtonWrapper>}
    </BasicInput>
  )
};

const MultipleChoiceOtherInput = ({question}) => {
  const [, meta, helpers] = useField(question.key);
  const {handleChange} = useFormikContext();
  const {value} = meta;
  const {setValue} = helpers;

  const onSelect = (item) => {
  };

  const options = question.options.map((item, itemIndex) => ({id: itemIndex, name: item}))

  return (
    <BasicInput question={question} disabled={question.disabledTooltip}>
      <SearchableSelect questionKey={question.key} items={options}
      handleChange={handleChange} onSelect={onSelect}/>
    </BasicInput>
  )
};

const HTSInput = ({question}) => {
  const {handleChange, setFieldValue} = useFormikContext();
  const [, meta, helpers] = useField(question.key);
  const {value} = meta;
  const {setValue} = helpers;
  const [suggested, setSuggested] = useState([]);
  const beneficiaryAutocompleteTimeout = useRef(null);
  const [useSuggest, setUseSuggest] = useState(true);

  useEffect(() => {
    searchHTSCodes();
  }, [value]);

  async function searchHTSCodes() {
    if (value && value.length > 1 && useSuggest === true) {
      clearTimeout(beneficiaryAutocompleteTimeout.current);
      const timeoutId = setTimeout(() =>
        fetch(`https://peaceful-journey-01245.herokuapp.com/https://hts.usitc.gov/api/search?query=${value}`, {

          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          return response.json()
        }).then((json) => {
          setSuggested(json.results);
        }).catch(() => {
          setSuggested([]);
        }), 400);
      beneficiaryAutocompleteTimeout.current = timeoutId;
    }
  }

  const onSelect = async (hts, description) => {
    await setFieldValue("hts_code", hts);
    await setValue(description);
  };

  const inputComponent =
    <SearchableSelectHTS
      onSelect={onSelect}
      items={suggested}
      questionKey={question.key}
      handleChange={handleChange}
    />;

  return (
    <BasicInput question={question} disabled={question.disabledTooltip}>
      <AllCheckboxesWrapper>
        <Checkbox
          style={{color: config.accentColor}}
          checked={useSuggest}
          onChange={() => {
            setUseSuggest(!useSuggest);
            searchHTSCodes();
          }}
          name="suggestCheck"
        />
        <QuestionText style={{paddingTop: 10}}>Suggest an HTS classification</QuestionText>
      </AllCheckboxesWrapper>
      {useSuggest === true ? inputComponent : <StyledFormInput type="text" name={question.key}/>}
    </BasicInput>
  );
};

const AllRadiosWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const RadioInput = ({question}) => {
  const options = question.options;
  const [, meta, helpers] = useField(question.key);
  const {value} = meta;
  const {setValue} = helpers;
  const handleClick = (val) => (e) => {
    e.preventDefault();
    setValue(val);
  };
  return (
    <BasicInput question={question} disabled={question.disabledTooltip}>
      {!question.disabledTooltip && <AllRadiosWrapper>
        <ButtonWrapper>
          {options && options.map((opt) => (
            <StyledButton onClick={handleClick(opt)} selected={value === opt} key={opt}>{opt}</StyledButton>
          ))}
        </ButtonWrapper>
      </AllRadiosWrapper>}
    </BasicInput>
  )
};

const DateInput = ({question}) => {
  return (
    <BasicInput question={question} disabled={question.disabledTooltip}>
      {!question.disabledTooltip && <StyledFormInput type="date" name={question.key}/>}
    </BasicInput>
  )
};

const AllCheckboxesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const CheckboxInput = ({question}) => {
  const options = question.options;
  const [, meta, helpers] = useField(question.key);
  const {value} = meta;
  const {setValue} = helpers;
  const handleClick = (val) => (e) => {
    e.preventDefault();
    const i = value.indexOf(val);
    if (i !== -1) {
      setValue(value.slice(0, i).concat(value.slice(i + 1)));
    } else {
      setValue(value.concat([val]));
    }
  };

  return (
    <BasicInput disabled={question.disabledTooltip} question={question} subtitle="Check all that apply.">
      {!question.disabledTooltip && <AllCheckboxesWrapper>
        <ButtonWrapper>
          {options && options.map((opt) => (
            <StyledButton disabled={question.disabledTooltip} onClick={handleClick(opt)}
                          selected={value.indexOf(opt) !== -1} key={opt}>
              {value.indexOf(opt) !== -1 && <FontAwesomeIcon icon={faCheckSquare} style={{marginRight: '10px'}}/>}
              {opt}
            </StyledButton>
          ))}
        </ButtonWrapper>
      </AllCheckboxesWrapper>}
    </BasicInput>
  )
};

const DocReqFieldWrapper = styled.div`
  padding-top: 10px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #cdcdcd;
  ${props => props.disabled && `background-color: ${disabledBackgroundColor};`}
  > :first-child {
    width: 130px;
    font-weight: 300;
    border-right: 1px solid #cdcdcd;
    padding: 10px 10px 5px;
    text-align: right;
  }
`;

const StyledDocReqField = styled(Field)`
  padding: 10px 10px 5px;
  font-size: 16px;
  border: none;
  flex: 1;
  width: calc(100% - 130px);
  line-height: 1em;
  color: #000;
  background-color: ${props => props.disabled ? disabledBackgroundColor : '#fff'};
`;

const StyledDocReqDiv = styled.div`
  padding: 10px 10px 5px;
  font-size: 16px;
  border: none;
  flex: 1;
  width: calc(100% - 130px);
  line-height: 1em;
  color: #000;
  background-color: #fff;
  word-break: break-word;
`;

const DocReqTitle = styled.h3`
  text-transform: uppercase;
  font-weight: 300;
  letter-spacing: .1em;
  ${props => props.disabled && `color: ${disabledColor};`}
`;

const CommonNestedTypeComponent = ({question, keyName}) => {
  const componentMap = {
    text: <StyledDocReqField type={"text"} disabled={question.disabled === "True" || question.disabledTooltip}
                             name={keyName}/>,
    number: <StyledDocReqField type={"number"} disabled={question.disabled === "True" || question.disabledTooltip}
                               name={keyName}/>,
    decimal: <StyledDocReqField type={"number"} disabled={question.disabled === "True" || question.disabledTooltip}
                                name={keyName}/>,
    date: <StyledDocReqField type={"date"} disabled={question.disabled === "True" || question.disabledTooltip}
                             name={keyName}/>,
  };
  return componentMap[question.type];
};

const ObjectNestedTypeComponent = ({question, value, setValue}) => {
  const componentMap = {
    boolean: <NestedButtonWrapper>
      <StyledButton nested={true} type={"button"} disabled={question.disabled === "True"}
                    onClick={() => setValue({...value, [question.key]: true})}
                    selected={value[question.key] === true}>Yes</StyledButton>
      <StyledButton nested={true} type={"button"} disabled={question.disabled === "True"}
                    onClick={() => setValue({...value, [question.key]: false})}
                    selected={value[question.key] === false}>No</StyledButton>
    </NestedButtonWrapper>,
  };
  return componentMap[question.type];
};

const ObjectInput = ({question, status, setStatus, lcApp, setAppliedTemplate, appliedTemplate, bankId}) => {
  const [, meta, helpers] = useField(question.key);
  const {value} = meta;
  const {setValue} = helpers;

  return (
    <BasicInput question={question}>
      {!question.disabledTooltip && question.children.map(child => {
        const keyName = `${question.key}.${child.key}`;
        let inputComponent = CommonNestedTypeComponent({question: child, keyName}) ||
          ObjectNestedTypeComponent({question: child, value, setValue});
        if (keyName === "beneficiary.name") {
          inputComponent =
            <BeneficiaryNameInput parent={question} child={child} status={status} setStatus={setStatus} lcApp={lcApp}
                                  setAppliedTemplate={setAppliedTemplate} appliedTemplate={appliedTemplate}/>;
        } else if (keyName === "advising_bank.name") {
          inputComponent = <AdvisingBankInput parent={question} child={child} bankId={bankId}/>;
        }
        return (
          <DocReqFieldWrapper key={keyName} disabled={child.disabledTooltip}>
            <span>{child.questionText}{child.required && !child.disabledTooltip ? <Asterisk> *</Asterisk> : null}</span>
            {inputComponent}
          </DocReqFieldWrapper>
        )
      })}
    </BasicInput>
  )
};

const AdvisingBankInput = ({parent, child, bankId}) => {
  const {handleChange} = useFormikContext();
  const [, meta, helpers] = useField(parent.key);
  const {value} = meta;
  const {setValue} = helpers;
  const autocompleteTimeout = useRef(null);
  const [suggested, setSuggested] = useState([]);

  const keyName = `${parent.key}.${child.key}`;

  useEffect(() => {
    clearTimeout(autocompleteTimeout.current);
    const timeoutId = setTimeout(() =>
      makeAPIRequest(`/bank/autocomplete/?string=${value.name}&exclude_ids=[${bankId}]`)
      .then(suggested => setSuggested(suggested)), 400);
    autocompleteTimeout.current = timeoutId;
  }, [value]);

  return (
    <SearchableSelect
      onSelect={item => setValue(
        {...value, name: item.name, address: item.address, country: item.country, email: item.email})}
      items={suggested}
      questionKey={keyName}
      handleChange={handleChange}
    />
  )
};

const BeneficiaryNameInput = ({parent, child, status, setStatus, lcApp, setAppliedTemplate, appliedTemplate}) => {
  const autocompleteTimeout = useRef(null);
  const [suggested, setSuggested] = useState([]);
  const {handleChange} = useFormikContext();
  const [, meta, helpers] = useField(parent.key);
  const {value} = meta;
  const {setValue} = helpers;

  const keyName = `${parent.key}.${child.key}`;

  const onBeneficiarySelect = async item => {
    setValue({name: item.name, address: item.address, country: item.country})
  };

  useEffect(() => {
    clearTimeout(autocompleteTimeout.current);
    const timeoutId = setTimeout(() =>
      makeAPIRequest(`/business/autocomplete/?string=${value.name}`)
      .then(suggested => setSuggested(suggested)), 400);
    autocompleteTimeout.current = timeoutId;
  }, [value.name]);

  return (
    <React.Fragment>
      <SuggestTemplates question={parent} keyName={keyName} status={status} appliedTemplate={appliedTemplate}
                        lcApp={lcApp} setStatus={setStatus} setAppliedTemplate={setAppliedTemplate}/>
      <SearchableSelect
        onSelect={onBeneficiarySelect}
        items={suggested}
        questionKey={keyName}
        handleChange={handleChange}
      />
    </React.Fragment>
  )
};

const SuggestTemplates = ({question, keyName = question.key, status, setStatus, lcApp, setAppliedTemplate, appliedTemplate}) => {
  const {values, setValues, initialValues} = useFormikContext();
  const autofillTemplateTimeout = useRef();
  const [, meta] = useField(question.key);
  const {value} = meta;

  useEffect(() => {
    if (status.status !== "success" && !appliedTemplate && (keyName === "beneficiary.name" || keyName
      === "purchased_item" || keyName === "applicant.country" || keyName === "advising_bank")) {
      clearTimeout(autofillTemplateTimeout.current);
      const timeoutId = setTimeout(() => {
        const params = {};
        if (values.beneficiary.name) {
          params.beneficiary_name = values.beneficiary.name;
        }
        if (values.purchased_item) {
          params.purchased_item = values.purchased_item;
        }
        const paramString = Object.entries(params).map(([key, value]) => `${key}=${value}`).join("&");
        if (paramString) {
          makeAPIRequest(`/lc/digital_app_templates/?${paramString}`).then(result => {
            if (result.length) {
              const Component = (
                <div>
                  <div style={{display: "flex"}}>
                    <span style={{flex: 1}}/>
                    <StyledIcon onClick={() => setStatus({status: null, message: ""})}
                                icon={faTimes} style={{color: "black"}}/>
                  </div>
                  <div style={{color: "black"}}>Load Template with Similar Answers:</div>
                  <div style={{paddingTop: 10}}>
                    {result.map(template => (
                      <div key={template.id} style={{paddingTop: 5}}>
                        <ClickableText onClick={async () => {
                          setStatus({status: null, message: ""});
                          await loadTemplateAnswers({
                            lcApp,
                            selectedTemplate: template,
                            values,
                            initialValues,
                            setValues,
                            setAppliedTemplate,
                            setStatus
                          });
                        }}>
                          {template.templateName}
                        </ClickableText></div>
                    ))}
                  </div>
                </div>
              );
              setStatus({status: "info", message: Component});
            } else {
              setStatus({status: null, message: ""});
            }
          });
        }
      }, 500);
      autofillTemplateTimeout.current = timeoutId;
    }
  }, [value]);

  return null;
};

const ArrayNestedTypeComponent = ({question, parentQuestion, value, setValue, valueIndex, options}) => {
  const keyName = `${parentQuestion.key}[${valueIndex}].${question.key}`;
  const curVal = value[valueIndex][question.key];
  const componentMap = {
    boolean: <NestedButtonWrapper>
      <StyledButton nested={true} type={"button"} disabled={question.disabled === "True"}
                    onClick={() => setValue(value.map((valObj, curInd) =>
                      curInd === valueIndex ? {...valObj, [question.key]: true} : valObj))}
                    selected={curVal}>Yes</StyledButton>
      <StyledButton nested={true} type={"button"} disabled={question.disabled === "True"}
                    onClick={() => setValue(value.map((valObj, curInd) =>
                      curInd === valueIndex ? {...valObj, [question.key]: false} : valObj))}
                    selected={curVal}>No</StyledButton>
    </NestedButtonWrapper>,
    radio: !question.options && (valueIndex < value.length - 1 || options.length === 1) ?
      <StyledDocReqDiv>{curVal}</StyledDocReqDiv> :
      <Dropdown selectedIndex={options.indexOf(curVal)} items={options}
                onChange={selected => setValue(value.map((valObj, curInd) =>
                  curInd === valueIndex ? {...valObj, [question.key]: selected} : valObj))}/>
  };
  return componentMap[question.type];
};

const StyledIcon = styled(FontAwesomeIcon)`
  &:hover {
    cursor: pointer;
  }
`;

const DocReqInput = ({question}) => {
  const [, meta, helpers] = useField(question.key);
  const {value} = meta;
  const {setValue} = helpers;

  const addDocument = () => {
    const addition = {};
    question.children.forEach(child => {
      addition[child.key] = TYPE_TO_DEFAULT[child.type];
      if (child.type === "radio") {
        addition[child.key] = getOptions(child, true)[0];
      }
    });
    setValue([...value, addition]);
  };

  const removeDocument = indexToRemove => {
    setValue(value.filter((valObj, curInd) => curInd !== indexToRemove));
  };

  const getOptions = (childQuestion, includeLast) => {
    if (childQuestion.options) {
      return childQuestion.options;
    } else if (question.options) {
      const valueOptionsSet = new Set(value.filter((valObj, curInd) => includeLast ||
        curInd < value.length - 1).map(valObj => valObj[childQuestion.key]));
      return question.options.filter(option => !valueOptionsSet.has(option));
    } else {
      return null;
    }
  };

  const name = question.settings?.name;

  return (
    <BasicInput question={question}>
      {!question.disabledTooltip && value.map((obj, i) => {
        return (
          <div style={{margin: "20px"}} key={i}>
            <DocReqTitle>{name ? name : "Documentary Requirement"} #{i + 1} <StyledIcon icon={faTrash}
                                                                                        onClick={() => removeDocument(
                                                                                          i)}/></DocReqTitle>
            {question.children.map(child => {
              const keyName = `${question.key}[${i}].${child.key}`;
              return (
                <DocReqFieldWrapper key={keyName}>
                  <span>{child.questionText}{child.required ? <Asterisk> *</Asterisk> : null}</span>
                  {CommonNestedTypeComponent({question: child, keyName}) ||
                  ArrayNestedTypeComponent({
                    question: child,
                    parentQuestion: question,
                    value,
                    setValue,
                    valueIndex: i,
                    options: getOptions(child)
                  })}
                </DocReqFieldWrapper>)
            })}
          </div>
        )
      })}
      {!question.disabledTooltip && <center style={{marginTop: '25px'}}>
        <StyledButton disabled={question.options && question.options.length === value.length} type={"button"}
                      onClick={addDocument}>Add {name ? name : "Documentary Requirement"}</StyledButton>
      </center>}
    </BasicInput>
  )
};

const contains = (option, answer) => {
  if (option === "*") {
    return answer.length;
  } else if (answer && Array.isArray(answer)) {
    return answer.some(piece => _.isEqual(piece, option));
  } else {
    return option === answer;
  }
};

const markDisabled = async ({questions, values, setLCApp, validateForm}) => {
  let changed = false;
  const questionsCopy = questions.map(q => ({...q}));
  questionsCopy.forEach(q => {
    q.children.filter(childQ => childQ.disabled && childQ.disabled !== "True").forEach(childQ => {
      const dependency = JSON.parse(childQ.disabled);
      for (let option of dependency.answer) {
        if (contains(option, values[q.key][dependency.key])) {
          changed = changed || !childQ.disabledTooltip;
          childQ.disabledTooltip = true;
          return;
        }
      }
      if (childQ.disabledTooltip) {
        childQ.disabledTooltip = undefined;
        changed = true;
      }
    });
    if (q.disabled) {
      const dependency = JSON.parse(q.disabled);
      for (let option of dependency.answer) {
        if (contains(option, values[dependency.key])) {
          const parentQuestion = questions.find(potential => potential.key === dependency.key);
          changed = changed || !q.disabledTooltip;
          const message = (<span style={{color: "#58595A"}}>This question is redundant based on your earlier
        answer to <ClickableText>'{parentQuestion.questionText}'</ClickableText></span>);
          q.disabledTooltip = {text: message, parentKey: parentQuestion.key};
          return;
        }
      }
      if (q.disabledTooltip) {
        q.disabledTooltip = undefined;
        changed = true;
      }
    }
  });
  if (changed) {
    await setLCApp([...questionsCopy]);
    validateForm();
  }
};

const findAndSetSectionsError = ({questions, errors, touched, setSectionsError}) => {
  const erroredQuestions = questions.filter(q => errors[q.key]);
  const erroredAndTouchedSections = erroredQuestions.filter(q => touched[q.key]).map(q => q.section);
  setSectionsError(new Set(erroredAndTouchedSections));
};

const scrollToFirstErrorOnSection = ({questions, errors, selectedSection}) => {
  const erroredQuestions = questions.filter(q => errors[q.key]);
  const erroredQuestionsOnSelectedSection = erroredQuestions.filter(q => q.section === selectedSection?.text);
  if (erroredQuestionsOnSelectedSection.length) {
    const selector = `[id="${erroredQuestionsOnSelectedSection[0].key}"]`;
    let errorElement = document.querySelector(selector);
    errorElement.scrollIntoView({behavior: "smooth"});
  } else {
    window.scrollTo({top: 0, behavior: "smooth"});
  }
};


const ErrorFocus = (props) => {
  let {isSubmitting, errors, touched, questions, selectedSection, setTouched, values} = props;

  const prevErrors = usePrevious(errors);
  const prevTouched = usePrevious(touched);
  const prevValues = usePrevious(values);
  const prevSelectedSection = usePrevious(selectedSection);
  const prevIsSubmitting = usePrevious(isSubmitting);

  const keyToEffect = {
    scroll: scrollToFirstErrorOnSection,
    sectionsErrors: findAndSetSectionsError,
    markDisabled: markDisabled
  };

  useEffect(() => {
    const effects = new Set();
    if (!_.isEqual(selectedSection, prevSelectedSection)) {
      touched = {...touched};
      questions.forEach(q => {
        if (q.section === prevSelectedSection?.text) {
          touched[q.key] = true;
        }
      });
      setTouched(touched);
      effects.add("scroll");
    }
    if (!_.isEqual(errors, prevErrors) || !_.isEqual(touched, prevTouched)) {
      effects.add("sectionsErrors");
    }
    if (!_.isEqual(values, prevValues)) {
      effects.add("markDisabled");
    }
    if (isSubmitting && !prevIsSubmitting) {
      effects.add("sectionsErrors");
      effects.add("scroll");
    }
    effects.forEach(effect => keyToEffect[effect](props));
  });

  return null;
};

const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// map type of question to the component
const TYPE_TO_COMPONENT = {
  text: TextInput,
  decimal: NumberInput,
  number: NumberInput,
  boolean: YesNoInput,
  hts: HTSInput,
  radio: RadioInput,
  date: DateInput,
  checkbox: CheckboxInput,
  object: ObjectInput,
  array_of_objs: DocReqInput,
  dropdown: DropdownInput,
  multiple_choice_with_other: MultipleChoiceOtherInput
};

const createDefault = question => {
  let initial = question.initialValue;
  if (question.type === "object") {
    initial = initial || {};
    question.children.forEach(child => {
      initial[child.key] = child.initialValue || TYPE_TO_DEFAULT[child.type];
    });
  } else if (!initial) {
    initial = TYPE_TO_DEFAULT[question.type];
  }
  return initial;
};

const TYPE_TO_DEFAULT = {
  text: "",
  decimal: 0,
  number: 0,
  boolean: null,
  hts: "",
  radio: null,
  date: (new Date()).toISOString().slice(0, 10),
  checkbox: [],
  object: {},
  array_of_objs: [],
  dropdown: "",
  multiple_choice_with_other: ""
};

const REQUIRED_FIELD_MSG = "This field is required.";
const REQUIRED_SECTION_MSG = "Missing required fields";


const TYPE_TO_VALIDATION_SCHEMA = {
  text: string(),
  decimal: number(),
  number: number(),
  boolean: boolean().nullable(),
  hts: string(),
  radio: string().nullable(),
  date: date(),
  checkbox: array().of(string()),
  dropdown: string(),
  multiple_choice_with_other: string()
};

const createChildrenShape = question => {
  const shape = {};
  question.children.forEach(child => {
    shape[child.key] = child.required && !child.disabledTooltip ?
      TYPE_TO_VALIDATION_SCHEMA[child.type].required(REQUIRED_FIELD_MSG) :
      TYPE_TO_VALIDATION_SCHEMA[child.type];
  });
  return shape;
};

const createValidationSchema = question => {
  let schema = TYPE_TO_VALIDATION_SCHEMA[question.type];
  if (question.type === 'object') {
    schema = object().shape(createChildrenShape(question));
  } else if (question.type === 'array_of_objs') {
    schema = array().of(object().shape(createChildrenShape(question)));
  }
  if (question.required && !question.disabledTooltip) {
    schema = schema.required(REQUIRED_FIELD_MSG);
  }
  return schema;
};

const loadTemplateAnswers = async ({lcApp, selectedTemplate, values, initialValues, setValues, setAppliedTemplate, setStatus}) => {
  const questionType = {};
  lcApp.forEach(q => questionType[q.key] = q.type);
  const template = await makeAPIRequest(`/lc/digital_app_templates/${selectedTemplate.id}/`, "GET");
  values = {...values};
  for (let [key, value] of Object.entries(template)) {
    const questionKey = _.snakeCase(key);
    if (questionType[questionKey] === "object" ||
      questionType[questionKey] === "array_of_objs" ||
      questionType[questionKey] === "checkbox") {
      value = JSON.parse(value);
    }
    if (initialValues[questionKey] !== undefined && !_.isEmpty(value)) {
      values[questionKey] = value;
    }
    template[key] = value;
  }
  setStatus({status: "success", message: "Successfully loaded application"});
  setTimeout(() => setStatus({status: null, message: ""}), 2500);
  setValues(values);
  setAppliedTemplate(template);
};

const LoadTemplate = ({lcApp, setModal, initialValues, setAppliedTemplate, setStatus, setValues, values}) => {
  const [selectedTemplate, setSelectedTemplate] = useState();
  const [lcTemplates, setLCTemplates] = useState();

  useEffect(() => {
    const fetchTemplates = async () => {
      setLCTemplates(await makeAPIRequest("/lc/digital_app_templates/", "GET"));
    };
    fetchTemplates();
  }, []);

  return (
    <Modal show={true} title={"Load Application Template"} onCancel={() => setModal(null)}
           onSelect={async () => {
             setModal(null);
             if (!selectedTemplate) {
               return;
             }
             await loadTemplateAnswers(
               {lcApp, selectedTemplate, values, initialValues, setValues, setAppliedTemplate, setStatus});
           }}
    >
      {lcTemplates && !lcTemplates.length && <div style={{paddingBottom: 20, color: "gray", fontStyle: "italic"}}>No
        Saved Templates</div>}
      {lcTemplates && <div style={{
        flex: 1,
        display: "grid",
        gridAutoRows: "1fr",
        overflowY: "auto",
        gridTemplateColumns: "repeat(3, 1fr)"
      }}>
        {lcTemplates.map(template => <StyledButton type={"button"} fitWidth={true}
                                                   selected={template.id === selectedTemplate?.id}
                                                   onClick={() => setSelectedTemplate(template)}
                                                   key={template.id}
                                                   style={{margin: "10px"}}>{template.templateName}</StyledButton>)}
      </div>}
    </Modal>
  )
};

const SaveTemplate = ({setModal, values, lcApp, appliedTemplate, setStatus, setAppliedTemplate}) => {
  const [newTemplateValue, setNewTemplateValue] = useState("");
  const [selectedSaveButton, setSelectedSaveButton] = useState(0);
  const [saveTemplateError, setSaveTemplateError] = useState("");
  const [submitCount, setSubmitCount] = useState(0);
  const [templateNameSet, setTemplateNameSet] = useState();
  const [integrityError, setIntegrityError] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      setTemplateNameSet(
        new Set((await makeAPIRequest("/lc/digital_app_templates/", "GET")).map(template => template.templateName)));
    };
    fetchTemplates();
  }, []);

  useEffect(() => {
    appliedTemplate && setSelectedSaveButton(1);
  }, [appliedTemplate?.id]);

  return (
    <Modal show={true} title={"Save Application Template"} containerStyle={{width: "60%"}} selectButton={"Save"}
           onCancel={() => setModal(null)} error={submitCount > 0 && saveTemplateError}
           selectDisabled={submitCount && saveTemplateError}
           onShow={() => {
             const fields = [];
             if (values.beneficiary?.name) {
               fields.push(values.beneficiary.name.trim());
             }
             if (values["purchased_item"]) {
               fields.push(values["purchased_item"].trim());
             }
             setNewTemplateValue(fields.join(", "));
           }}
           onSelect={async () => {
             setSubmitCount(submitCount + 1);
             const overwrite = selectedSaveButton === 1;
             if (!overwrite && !newTemplateValue) {
               setSaveTemplateError("Please input a valid template name");
               return;
             }
             const fields = {template_name: overwrite ? appliedTemplate.templateName : newTemplateValue.trim()};
             lcApp.forEach(q => fields[q.key] =
               (q.type === "object" || q.type === "array_of_objs" || q.type === "checkbox") ?
                 JSON.stringify(values[q.key]) : values[q.key]);
             const res = await makeAPIRequest(`/lc/digital_app_templates/${overwrite ? `${appliedTemplate.id}/` : ""}`,
               overwrite ? "PUT" : "POST", fields, true);
             let text = await res.text();
             if (res.status !== 200) {
               if (res.status >= 500) {
                 text = "Unknown server error. Please contact steve@bountium.org.";
               } else {
                 setIntegrityError(text);
               }
               setSaveTemplateError(text);
             } else {
               setModal(null);
               const questionType = {};
               lcApp.forEach(q => questionType[q.key] = q.type);
               const createdTemplate = JSON.parse(text)[overwrite ? "updated_lc_template" : "created_lc_template"];
               for (let [key, value] of Object.entries(createdTemplate)) {
                 if (questionType[key] === "object" ||
                   questionType[key] === "array_of_objs" ||
                   questionType[key] === "checkbox") {
                   value = JSON.parse(value);
                 }
                 createdTemplate[key] = value;
               }
               setAppliedTemplate(objectToCamelCase(createdTemplate));
               setStatus({status: "success", message: "Successfully saved application"});
               setTimeout(() => setStatus({status: null, message: ""}), 2500);
             }
           }}
    >
      <div>
        {appliedTemplate && <div style={{flexDirection: "row", display: "flex", paddingBottom: 20}}>
          <StyledButton selected={selectedSaveButton === 1} nested type={"button"}
                        onClick={() => {
                          setSelectedSaveButton(1);
                          setSaveTemplateError("");
                        }}
                        style={{width: 160, justifyContent: "center"}}>
            Overwrite</StyledButton>
          <StyledDiv style={{flex: 1, marginLeft: 10, visibility: selectedSaveButton === 1 ? "visible" : "hidden"}}>
            {appliedTemplate.templateName}</StyledDiv>
        </div>}
        <div style={{flexDirection: "row", display: "flex"}}>
          <StyledButton selected={selectedSaveButton === 0} nested type={"button"}
                        onClick={async () => {
                          await setSelectedSaveButton(0);
                          if (!newTemplateValue) {
                            await setSaveTemplateError("Please input a valid template name");
                          } else if (templateNameSet.has(newTemplateValue)) {
                            await setSaveTemplateError(integrityError);
                          } else {
                            await setSaveTemplateError("");
                          }
                          document.querySelector("#newTemplateInput").focus();
                        }}
                        style={{width: 160, justifyContent: "center"}}>
            New</StyledButton>
          <StyledInput style={{flex: 1, marginLeft: 10, visibility: selectedSaveButton === 0 ? "visible" : "hidden"}}
                       type={"text"} value={newTemplateValue} id={"newTemplateInput"}
                       onChange={({target}) => {
                         let text = target.value;
                         setNewTemplateValue(text);
                         text = text.trim();
                         if (!text) {
                           setSaveTemplateError("Please input a valid template name");
                         } else if (templateNameSet.has(text)) {
                           setSaveTemplateError(integrityError);
                         } else {
                           setSaveTemplateError("");
                         }
                       }}/>
        </div>
      </div>
    </Modal>
  )
};

const unsavedChanges = ({values, template, initialValues, submitCount}) => {
  if (submitCount) {
    return false;
  }
  if (!template) {
    return !_.isEqual(values, initialValues);
  }
  for (let [templateField, templateValue] of Object.entries(template)) {
    templateField = _.snakeCase(templateField);
    templateValue = objectToSnakeCase(templateValue);
    if (values[templateField] !== undefined && emptyAndChanged(values[templateField], templateValue) && !_.isEqual(
      values[templateField], templateValue)) {
      return true;
    }
  }
  return false;
};

const emptyAndChanged = (currentValue, templateValue) => {
  return currentValue || templateValue || currentValue === false || templateValue === false;
};

const Refresh = ({appliedTemplate}) => {
  const {values, initialValues, submitCount} = useFormikContext();
  useEffect(() => {
    if (unsavedChanges({values, template: appliedTemplate, initialValues, submitCount})) {
      window.onbeforeunload = () => "You have unsaved changes. Are you sure you want to leave without saving?";
    } else {
      window.onbeforeunload = undefined;
    }
    return () => window.onbeforeunload = undefined;
  });
  return null;
};

const BankLCAppPage = ({match}) => {
  const persistedLcApp = JSON.parse(localStorage.getItem(`lc/${match.params.bankid}`));
  const [user] = useContext(UserContext);
  const [lcApp, setLCApp] = useState(null);
  const [status, setStatus] = useState({status: null, message: ""});
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
  const [sections, setSections] = useState(null);
  let [initialValues, setInitialValues] = useState({});
  const [modal, setModal] = useState(null);
  const [appliedTemplate, setAppliedTemplate] = useState(null);
  useAuthentication(`/bank/${match.params.bankid}/application`);
  useEffect(() => {
    if (user && match.params.bankid) {
      makeAPIRequest(`/bank/${match.params.bankid}/digital_app/`)
      .then(json => {
        const sectionSet = new Set();
        json.forEach(q => {
          sectionSet.add(q.section);
          if (q.options) {
            q.options = JSON.parse(q.options);
          }
          if (q.settings) {
            q.settings = JSON.parse(q.settings);
          }
          q.children.forEach(child => {
            if (child.options) {
              child.options = JSON.parse(child.options);
            }
            if (child.settings) {
              child.settings = JSON.parse(child.settings);
            }
          });
        });
        const sections = [];
        if (persistedLcApp) {
          initialValues = persistedLcApp;
        } else {
          json.forEach(q => {
            if (user && q.key === 'applicant') {
              initialValues[q.key] = {
                name: user.business.name,
                address: user.business.address,
                country: user.business.country
              };
            } else {
              initialValues[q.key] = createDefault(q);
            }
          });
        }
        sectionSet.forEach(
          section => sections.push({text: section, error: false}));
        setSections(sections);
        setSelectedSectionIndex(0);
        setInitialValues(initialValues);

        setLCApp(json);
      })
    }
  }, [match.params.bankid, user]);

  let validationSchema = null;

  if (lcApp) {
    const schemaObj = {};
    lcApp.forEach(q => {
      schemaObj[q.key] = createValidationSchema(q);
    });
    validationSchema = object().shape(schemaObj);
  }
  console.log(lcApp);

  return <BasicLayout
    title={`LC Application ✏️`} isLoading={!lcApp} status={status} marginStyle={{marginBottom: 0, marginTop: 10}}>
    {lcApp && lcApp.length === 0 && <p>This Bank is not set up yet to be an issuer</p>}
    {lcApp && lcApp.length > 0 &&  (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, {setSubmitting}) => {
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
            let text = await res.text();
            if (res.status === 200) {
              localStorage.removeItem(`lc/${match.params.bankid}`);
              setStatus({
                message:
                  <div>
                    <div style={{display: "flex"}}>
                      <span style={{flex: 1}}/>
                      <StyledIcon onClick={() => setStatus({status: null, message: ""})}
                                  icon={faTimes} style={{color: "black"}}/>
                    </div>
                    <div>Your LC app has been sent in! The bank will get back to you ASAP.</div>
                    <div style={{paddingTop: 25}}>
                      <ClickableText onClick={() => {
                        setStatus({status: null, message: ""});
                        setModal("saveTemplate");
                      }}>
                        Click here
                      </ClickableText> to save your submitted application.
                    </div>
                  </div>,
                status: "success"
              });
            } else {
              if (text.length > 250) {
                text = "Unknown server error. Please contact steve@bountium.org.";
              }
              localStorage.setItem(`lc/${match.params.bankid}`, JSON.stringify(values));
              setStatus({status: "error", message: `Error submitting form: ${text}`});
            }
          });
          setSubmitting(false);
        }}
      >
        {({isSubmitting, errors, touched, setTouched, values, validateForm, setValues, handleSubmit, submitCount}) => (
          <div style={{display: "flex", paddingBottom: 40}}>
            <RouteBlockingModal when={unsavedChanges({values, template: appliedTemplate, initialValues, submitCount})}/>
            <Refresh appliedTemplate={appliedTemplate}/>
            {modal === "loadTemplate" && <LoadTemplate
              initialValues={initialValues} lcApp={lcApp}
              setAppliedTemplate={setAppliedTemplate} setModal={setModal}
              setStatus={setStatus}
              setValues={setValues} values={values}
            />}
            {modal === "saveTemplate" && <SaveTemplate
              values={values} setStatus={setStatus} setAppliedTemplate={setAppliedTemplate}
              setModal={setModal} lcApp={lcApp} appliedTemplate={appliedTemplate}
            />}
            <ErrorFocus
              values={values} errors={errors} touched={touched} isSubmitting={isSubmitting} setLCApp={setLCApp}
              setTouched={setTouched}
              selectedSection={sections[selectedSectionIndex]} questions={lcApp} validateForm={validateForm}
              setSectionsError={(erroredSectionSet => {
                const sectionsErrors = sections.map(section => section.error);
                sections.forEach(section => {
                  section.error = erroredSectionSet.has(section.text)
                });
                !_.isEqual(sections.map(section => section.error), sectionsErrors) && setSections([...sections]);
              })}/>
            <ResizableScreenDiv
              style={{width: "30%", position: "sticky", top: 0, display: "flex", flexDirection: "column"}}>
              <div style={{flex: 1}}>
                <div style={{display: "flex", flexDirection: "row"}}>
                  <StyledButton type={"button"} style={{marginRight: "10px"}} fitWidth={true} onClick={() => {
                    setModal("loadTemplate");
                  }}>Load Template</StyledButton>
                  <StyledButton type={"button"} style={{marginLeft: 10, marginRight: 15}} fitWidth={true}
                                onClick={() => setModal("saveTemplate")}>
                    Save As Template</StyledButton>
                </div>
                <ButtonVerticalWrapper>
                  {sections.map((section, index) => (<StyledSection
                    type="button"
                    onClick={() => setSelectedSectionIndex(index)}
                    style={{whiteSpace: "pre"}}
                    key={section.text}
                    selected={index === selectedSectionIndex}>
                    {section.text}
                    {section.error && <SectionSubtitle
                      style={{color: '#dc3545'}}>{REQUIRED_SECTION_MSG}</SectionSubtitle>}
                  </StyledSection>))}
                </ButtonVerticalWrapper>
                <div style={{display: "flex", marginTop: "20px", width: "95%"}}>
                  <Button disabled={isSubmitting} onClick={handleSubmit}>Submit LC App</Button>
                </div>
              </div>
              <div style={{flex: 1}}/>
              {status.status && <StatusMessage style={{overflowY: "auto", flexGrow: 0, marginTop: 20}}
                                               status={status.status}>{status.message}</StatusMessage>}
            </ResizableScreenDiv>
            <Form style={{width: "70%"}}>
              <div>
                {lcApp && lcApp.filter(question => sections[selectedSectionIndex].text === question.section).map(
                  question => {
                    const Component = TYPE_TO_COMPONENT[question.type];
                    return <Component
                      key={question.id} question={question} status={status} setStatus={setStatus} lcApp={lcApp}
                      setAppliedTemplate={setAppliedTemplate} appliedTemplate={appliedTemplate}
                      bankId={match.params.bankid}/>;
                  })}
                <div style={{display: "flex", marginLeft: "150px", marginRight: "150px"}}>
                  <Button
                    style={{flex: 1, marginRight: "50px"}}
                    disabled={selectedSectionIndex === 0}
                    onClick={() => setSelectedSectionIndex(selectedSectionIndex - 1)}
                    type="button">Previous Section</Button>
                  <Button
                    style={{flex: 1, marginLeft: "50px"}}
                    onClick={selectedSectionIndex < sections.length - 1 ? () => setSelectedSectionIndex(
                      selectedSectionIndex + 1) : null}
                    type={selectedSectionIndex === sections.length - 1 ? "submit" : "button"}>
                    {selectedSectionIndex === sections.length - 1 ? "Submit LC App" : "Next Section"}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        )}
      </Formik>

    )}
  </BasicLayout>
};

export default BankLCAppPage;
