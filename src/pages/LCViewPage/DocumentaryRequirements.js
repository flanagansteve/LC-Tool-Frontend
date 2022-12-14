import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Field, Form, Formik, useField} from 'formik';
import {array, boolean, date, number, object, string} from 'yup';
import Pdf from './Pdf';
import MoonLoader from 'react-spinners/MoonLoader'
import {css} from "@emotion/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckSquare, faChevronDown, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {camelCase, get} from "lodash";

import {makeAPIRequest, postFile} from '../../utils/api';
import Panel from './Panel';
import Button from '../../components/ui/Button';
import config from "../../config";

const ModalBackground = styled.div`
  ${props => !props.show && `display: none;`}
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  overflow: scroll;
`;

const ModalWrapper = styled.div`
  max-width: 70%;
  background-color: #fff;
  border-radius: 10px;
  margin: 10% auto;
  padding: 20px 30px;
`;

const ModalFlex = styled.div`
  display: flex;
  justify-content: space-around;
`;

const ModalLeftColumn = styled.div`
  flex-grow: 1;
  min-width: 30%;
  flex-basis: 40%;
`;

const ModalRightColumn = styled.div`
  flex-grow: 1;
  flex-basis: 50%;
`;

const ModalButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  > :not(:last-child) {
    margin-right: 10px;
  }
  margin: 20px auto 30px;
`;

const MODAL_TYPES = {CREATE: 'create', UPLOAD: 'upload'};

const Modal = ({show, docReq, hideModal, refreshLc, userType, lc}) => {
  const [type, setType] = useState(MODAL_TYPES.CREATE);
  if (docReq && docReq.type === 'generic') {
    return (
      <ModalBackground show={show}>
        <ModalWrapper>
          <UploadModal docReq={docReq} refreshLc={refreshLc} hideModal={hideModal}/>
          <div style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end'}}>
            <Button onClick={hideModal}>Close</Button>
          </div>
        </ModalWrapper>
      </ModalBackground>
    );
  }
  return (
    <ModalBackground show={show}>
      {show === "view" ? (
        <ModalWrapper>
          <ViewModal docReq={docReq}/>
          <div style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end'}}>
            <Button onClick={hideModal}>Close</Button>
          </div>
        </ModalWrapper>
      ) : docReq && (
        <ModalWrapper>
          <ModalButtonsWrapper>
            {userType !== "issuer" && <Button onClick={() => setType(MODAL_TYPES.CREATE)} unselected={type !== MODAL_TYPES.CREATE}>Create Digital
              DocReq</Button>}
            <Button onClick={() => setType(MODAL_TYPES.UPLOAD)} unselected={type !== MODAL_TYPES.UPLOAD}>Upload PDF
              DocReq</Button>
          </ModalButtonsWrapper>
          {userType === "issuer" ? <UploadModal docReq={docReq} refreshLc={refreshLc} hideModal={hideModal}/> : type === MODAL_TYPES.CREATE
            ? <CreateModal docReq={docReq} refreshLc={refreshLc} hideModal={hideModal} lc={lc}/>
            : <UploadModal docReq={docReq} refreshLc={refreshLc} hideModal={hideModal}/>
          }
          <div style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end'}}>
            <Button onClick={hideModal}>Cancel</Button>
          </div>
        </ModalWrapper>
      )}
    </ModalBackground>
  )
};

const ViewModal = ({docReq}) => {
  const lcid = docReq && docReq.lcid;
  // NULL if the docreq is not digital
  const [digitalDocReq, setDigitalDocReq] = useState(null);
  useEffect(() => {
    if (!docReq) {
      return;
    }
    makeAPIRequest(`/lc/${lcid}/doc_req/${docReq.id}/`)
    .then(data => {
      // HACK we can "guess" if there is a digital doc req if the seller name is defined
      if (data.sellerName === undefined) {
        setDigitalDocReq(null);
      } else {
        setDigitalDocReq(data);
      }
    });
  }, [docReq, lcid]);
  if (!docReq) {
    return null;
  }
  const fields = !digitalDocReq ? [] : [
    {title: "Seller Name", value: digitalDocReq.sellerName},
    {title: "Seller Address", value: digitalDocReq.sellerAddress},
    {title: "Shipping Date", value: digitalDocReq.indicatedDateOfShipment},
    {title: "Country of Export", value: digitalDocReq.countryOfExport},
    // {title: "Incoterms Of Sale", value: digitalDocReq.incotermsOfSale},
    {title: "Reason for Export", value: digitalDocReq.reasonForExport},
    {title: "Consignee Name", value: digitalDocReq.consigneeName || digitalDocReq.buyerName},
    {title: "Consignee Address", value: digitalDocReq.consigneeAddress || digitalDocReq.buyerAddress},
    {title: "Buyer Name", value: digitalDocReq.buyerName},
    {title: "Buyer Address", value: digitalDocReq.buyerAddress},
    {title: "Description of Goods", value: digitalDocReq.goodsDescription},
    {title: "Units of Measure", value: digitalDocReq.unitOfMeasure},
    {title: "Units Purchased", value: digitalDocReq.unitsPurchased},
    {title: "Price per Unit", value: digitalDocReq.unitPrice},
    {title: "Currency of Settlement", value: digitalDocReq.currency},
    {title: "Harmonized Schedule Code", value: digitalDocReq.hsCode},
    {title: "Country of Origin", value: digitalDocReq.countryOfOrigin},
  ];
  const link = docReq.linkToSubmittedDoc;
  return (
    <ModalFlex>
      {digitalDocReq && (
        <ModalLeftColumn>
          <DocReqTitle style={{marginTop: '0'}}>{docReq.docName}</DocReqTitle>
          {fields.map(field => field && (
            <div key={field.title}>
              <SmallHeader>{field.title}</SmallHeader>
              <DocReqTitle>{field.value}</DocReqTitle>
            </div>
          ))}
        </ModalLeftColumn>
      )}
      <ModalRightColumn>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <DocReqTitle style={{margin: '0'}}>PDF Preview</DocReqTitle>
          <Button style={{padding: '5px 10px'}}>
            <a href={link} style={{color: "#fff", fontSize: '14px', textDecoration: 'none'}}>Download PDF</a>
          </Button>
        </div>
        {link && <Pdf src={`/api/lc/${lcid}/doc_req/${docReq.id}/file/`}/>}
      </ModalRightColumn>
    </ModalFlex>
  )
};

const InputWrapper = styled.div`
  max-width: 700px;
  margin: 10px auto;
  padding: 15px 25px;
  border-radius: 10px;
  border: 1px solid #cdcdcd;

  &:hover {
    border: 1px solid ${config.accentColor};
  }
  transition: border 0.3s;
  background-color: #fff;
`;

const QuestionText = styled.h3`
  font-size: 14px;
  font-weight: 300;
  line-height: 1.25;
`;

const Subtitle = styled.div`
  margin-top: 15px;
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
  border-bottom: 1px solid #cdcdcd;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 15px;
  flex-wrap: wrap;

  > :not(:last-child) {
    margin-right: 20px;
  }
`;

const StyledButton = styled.button`
  background-color: ${(props) => props.selected ? config.accentColor : `#fff`};
  border-radius: 5px;
  padding: 5px 10px;
  color: ${(props) => props.selected ? `#fff` : config.accentColor};
  border: 1px solid ${config.accentColor};
  font-size: 16px;
  cursor: pointer;
  margin: 10px 0;
  max-width: 45%;
  display: flex;
  align-items: center;
`;

const BasicInput = ({question, children, subtitle}) => {
  const [, meta] = useField(question.key);
  const {error, touched} = meta;
  return (
    <InputWrapper>
      <QuestionText>{question.questionText}{question.required ? (<Asterisk> *</Asterisk>) : null}</QuestionText>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {error && touched && <Subtitle style={{color: '#dc3545'}}>{typeof error !== 'object' ? error : null}</Subtitle>}
      {children}
    </InputWrapper>
  )
};

const TextInput = ({question}) => {
  return (
    <BasicInput question={question}>
      <StyledFormInput type="text" name={question.key}/>
    </BasicInput>
  );
};

const NumberInput = ({question}) => {
  return (
    <BasicInput question={question}>
      <StyledFormInput type="number" name={question.key}/>
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
    <BasicInput question={question}>
      <ButtonWrapper style={{justifyContent: 'center'}}>
        <StyledButton onClick={handleClick(true)} selected={value === true}>Yes</StyledButton>
        <StyledButton onClick={handleClick(false)} selected={value === false}>No</StyledButton>
      </ButtonWrapper>
    </BasicInput>
  )
};

const AllRadiosWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const RadioInput = ({question}) => {
  const options = JSON.parse(question.options);
  const [, meta, helpers] = useField(question.key);
  const {value} = meta;
  const {setValue} = helpers;
  const handleClick = (val) => (e) => {
    e.preventDefault();
    setValue(val);
  };
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
};

const DateInput = ({question}) => {
  return (
    <BasicInput question={question}>
      <StyledFormInput type="date" name={question.key}/>
    </BasicInput>
  )
};

const AllCheckboxesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const CheckboxInput = ({question}) => {
  const options = JSON.parse(question.options);
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
    <BasicInput question={question} subtitle="Check all that apply.">
      <AllCheckboxesWrapper>
        <ButtonWrapper>
          {options && options.map((opt) => (
            <StyledButton onClick={handleClick(opt)} selected={value.indexOf(opt) !== -1} key={opt}>
              {value.indexOf(opt) !== -1 && <FontAwesomeIcon icon={faCheckSquare} style={{marginRight: '10px'}}/>}
              {opt}
            </StyledButton>
          ))}
        </ButtonWrapper>
      </AllCheckboxesWrapper>
    </BasicInput>
  )
};

const TYPE_TO_COMPONENT = {
  text: TextInput,
  decimal: NumberInput,
  number: NumberInput,
  boolean: YesNoInput,
  radio: RadioInput,
  date: DateInput,
  checkbox: CheckboxInput,
};

const TYPE_TO_DEFAULT = {
  text: "",
  decimal: 0,
  number: 0,
  boolean: null,
  radio: null,
  date: (new Date()).toISOString().slice(0, 10),
  checkbox: [],
};

const REQUIRED_MSG = "This field is required.";

const TYPE_TO_VALIDATION_SCHEMA = {
  text: string(),
  decimal: number(),
  number: number(),
  boolean: boolean().nullable(),
  radio: string().nullable(),
  date: date(),
  checkbox: array().of(string()),
};

const CreateModal = ({docReq, hideModal, refreshLc, lc}) => {
  const [fields, setFields] = useState([]);
  const [suggestedFields, setSuggestedFields] = useState([]);
  useEffect(() => {
    if (!docReq) {
      return undefined;
    }
    makeAPIRequest(`/lc/supported_creatable_docs/${docReq.type}/`)
    .then(d => setFields(d));
    makeAPIRequest(`/lc/${lc.id}/doc_req/${docReq.id}/autopopulate/`)
    .then(s => setSuggestedFields(s));
  }, [docReq]);
  if (!docReq) {
    return null;
  }
  const schemaObj = {};
  let initialValues = {};
  let validationSchema = null;
  fields.forEach(q => {
    Object.keys(suggestedFields).forEach(key => {
      if (camelCase(q.key) == key) {
        let initialValue = get(lc, suggestedFields[key]);
        if (initialValue && new Set(["object", "array_of_objs", "checkbox"]).has(q.type)) {
          initialValue = JSON.parse(initialValue);
        }
        initialValues[q.key] = initialValue;
      }
    });
    if (!initialValues[q.key]) {
      initialValues[q.key] = TYPE_TO_DEFAULT[q.type];
    }
  });
  fields.forEach(q => {
    schemaObj[q.key] = TYPE_TO_VALIDATION_SCHEMA[q.type];
    if (q.required) {
      schemaObj[q.key] = schemaObj[q.key].required(REQUIRED_MSG);
    }
  });
  validationSchema = object().shape(schemaObj);
  return fields.length > 0 && (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
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
        const {lcid, id} = docReq;
        makeAPIRequest(`/lc/${lcid}/doc_req/${id}/`, 'POST', app, true)
        .then(() => hideModal())
        .then(() => refreshLc())
        .then(() => setSubmitting(false));
        // .then(async res => {
        //   let text = await res.text();
        //   if (res.status === 200) {
        //     localStorage.removeItem(`lc/${match.params.bankid}`);
        //     setStatus({status: "success", message: "Your LC app has been sent in! The bank will get back to you
        // ASAP."}); } else { if (text.length > 250) text = "Unknown server error. Please contact steve@bountium.org."
        // localStorage.setItem(`lc/${match.params.bankid}`, JSON.stringify(values)) setStatus({status: "error",
        // message: `Error submitting form: ${text}`}); } })
      }}
    >
      {({isSubmitting}) => (
        isSubmitting ? <MoonLoader
          size={45}
          color={config.accentColor}
          loading={true}
          css={css`
              margin: 0 auto;
            `}
        /> : (
          <Form>
            <DocReqTitle>Create {docReq.docName}</DocReqTitle>
            {fields && fields.map(question => {
              const Component = TYPE_TO_COMPONENT[question.type];
              return <Component key={question.key} question={question}/>;
            })}
            <div style={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
              <Button disabled={isSubmitting} type="submit">Create</Button>
            </div>
          </Form>

        )
      )}
    </Formik>
  )
};

const UploadModal = ({docReq, refreshLc, hideModal}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const uploadFile = (file) => {
    if (!file) {
      console.error('No file found.');
      return;
    }
    setIsSubmitting(true);
    const {lcid, id} = docReq;
    postFile(`/lc/${lcid}/doc_req/${id}/`, file)
    .then(() => hideModal())
    .then(() => refreshLc())
    .then(() => setIsSubmitting(false));
  };

  return (
    <>
      <DocReqTitle>Upload {docReq.docName}</DocReqTitle>
      <div style={{display: "flex", flexDirection: "column", maxWidth: '700px', margin: 'auto'}}>
        {isSubmitting ? <MoonLoader
          size={45}
          color={config.accentColor}
          loading={true}
          css={css`
              margin: 0 auto;
            `}
        /> : (
          <FileUpload>
            Upload File
            <input
              type="file"
              onChange={(e) => uploadFile(e.target.files[0])}
              style={{display: "none"}}
            />
          </FileUpload>
        )}
      </div>
    </>
  );
};

const DocumentaryEntryFlex = styled.div`
  display: flex;
  align-items: center;
  > :nth-child(1) {
    min-width: 60%;
  }
  > :nth-child(2) {
    min-width: 20%;
  }
  > :nth-child(3) {
    min-width: 20%;
  }
  ${props => props.clickable && `cursor: pointer;`}
`;

const DocumentaryEntryWrapper = styled.div`
  border-bottom: 1px solid #cdcdcd;
`;

const DocReqTitle = styled.div`
  font-weight: 500;
  font-size: 24px;
  max-width: 700px;
  margin: 5px auto 20px;
  display: flex;
  align-items: center;
`;

const DocReqDate = styled.div`
  font-size: 14px;
`;

const DocReqStatus = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const ExpandedDocumentaryEntry = styled.div`
  padding-bottom: 10px;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
`;

const FileUpload = styled.label`
  padding: 5px 10px;
  border: 1px solid #dcdcdc;
  margin-right: auto;
  cursor: pointer;
`;

const DocumentaryEntryEvaluation = styled.div`
  display: flex;
  margin-top: 10px;

  > :not(:last-child) {
    margin-right: 10px;
  }
`;

const SmallHeader = styled.div`
  font-size: 12px;
  min-width: 150px;
  margin-right: 50px;
`;
// there's no link to the submitted doc
const DocumentaryRequirement = ({documentaryRequirement: docReq, beneficiarySelectedAccess, issuerSelectedAccess, lcid, userType, status, live, refreshLc, showModal, advisingAccess, ...props}) => {
  const {docName: title, dueDate, linkToSubmittedDoc, id, requiredValues, rejected} = docReq;
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState('');


  const approve = () => {
    makeAPIRequest(`/lc/${lcid}/doc_req/${id}/evaluate/`, 'POST', {
      approve: true, complaints: comments,
    }).then(() => refreshLc());
  };

  const reject = () => {
    makeAPIRequest(`/lc/${lcid}/doc_req/${id}/evaluate/`, 'POST', {
      approve: false, complaints: comments,
    }).then(() => refreshLc());
  };

  return (
    <DocumentaryEntryWrapper>
      <DocumentaryEntryFlex
        clickable
        onClick={() => setExpanded((e) => !e)}
        {...props}
      >
        <DocReqTitle style={{margin: "15px 0"}}>
          {title}
          <FontAwesomeIcon
            icon={expanded ? faChevronDown : faChevronRight}
            style={{color: config.accentColor, marginLeft: "10px"}}
          />
        </DocReqTitle>
        <DocReqDate>{dueDate}</DocReqDate>
        <DocReqStatus>{status}</DocReqStatus>
      </DocumentaryEntryFlex>
      {expanded && (
        <ExpandedDocumentaryEntry>
          <DocumentaryEntryFlex>
            <div>
              <div style={{marginRight: "30px"}}>
                Required Values: {requiredValues}
              </div>
            </div>
            <div>
              {live &&
              linkToSubmittedDoc &&
              <Button style={{marginRight: "10px", minWidth: '80px'}}
                                                     onClick={() => showModal(docReq, lcid, "view")}>View</Button>}
            </div>
            <div>
              {linkToSubmittedDoc && (
                <div>
                  File: <a href={linkToSubmittedDoc}>order.pdf</a>
                </div>
              )}
              {live &&
              status !== "Approved" &&
              (!linkToSubmittedDoc || rejected) &&
                  (userType === "issuer" || userType === "beneficiary" || (userType === 'Beneficiary-Selected Advisor' && beneficiarySelectedAccess)) && ( <Button style={{marginRight: "10px", minWidth: '80px'}}
                        onClick={() => showModal(docReq, lcid, "create")}>Create</Button>
              )}
            </div>
          </DocumentaryEntryFlex>
          {live &&
          (userType === "issuer" || (userType === "Beneficiary-Selected Advisor" && beneficiarySelectedAccess) ||
              (userType === "Nominated Bank" && issuerSelectedAccess)) &&
          status !== "Approved" &&
          !rejected &&
          linkToSubmittedDoc &&
          (
            <DocumentaryEntryEvaluation>
              <Button onClick={approve}>Approve</Button>
              <Button onClick={reject}>Reject</Button>
              <div>
                <SmallHeader>Comments</SmallHeader>
                <input
                  type="text"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
            </DocumentaryEntryEvaluation>
          )}
        </ExpandedDocumentaryEntry>
      )}
    </DocumentaryEntryWrapper>
  );
};

const useModal = () => {
  const [isModalShowing, setIsModalShowing] = useState(false);
  const [modalDocReq, setModalDocReq] = useState(null);

  return {
    showModal: (docReq, lcid, modalType) => {
      setIsModalShowing(modalType);
      setModalDocReq({...docReq, lcid});
    },
    hideModal: () => setIsModalShowing(false),
    isModalShowing,
    modalDocReq
  }
};

const DocumentaryRequirements = ({lc, userType, live, refreshLc}) => {
  const {showModal, hideModal, isModalShowing, modalDocReq} = useModal();
  const docReqs = lc.documentaryrequirementSet;
  return (
    <Panel title="Documentary Requirements">
      <DocumentaryEntryFlex>
        <SmallHeader style={{margin: "0"}}>Document Title</SmallHeader>
        <SmallHeader style={{margin: "0"}}>Recieve By</SmallHeader>
        <SmallHeader style={{margin: "0"}}>Status</SmallHeader>
      </DocumentaryEntryFlex>
      {docReqs ? docReqs.map(d =>
        <DocumentaryRequirement
          documentaryRequirement={d}
          status={d.satisfied ? "Approved" : d.rejected ? "Rejected" : d.linkToSubmittedDoc ? "Pending" : "Incomplete"}
          lcid={lc.id}
          live={live}
          userType={userType}
          advisingAccess={lc?.confirmationMeans === "Confirmation by a bank selected by the beneficiary"
          && lc?.creditExpiryLocation?.id === lc?.advisingBank?.id}
          beneficiarySelectedAccess ={lc.beneficiarySelectedDocReq}
          issuerSelectedAccess = {!lc.creditExpiryLocation}
          // creditExpiryLocation = {lc.}
          refreshLc={refreshLc}
          key={d.docName}
          showModal={showModal}
        />
      ) : (
        <div style={{marginTop: "10px", fontStyle: "italic", fontWeight: "300"}}>
          There are no documentary requirements for this LC.
        </div>
      )
      }
      <Modal show={isModalShowing} docReq={modalDocReq} hideModal={hideModal} refreshLc={refreshLc} lc={lc} userType = {userType}/>
    </Panel>
  );
};

export default DocumentaryRequirements;
