import React, {useContext, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import {Field, Form, Formik, useField, useFormikContext} from "formik";
import _, {get} from "lodash";
import moment from "moment";

import {makeAPIRequest} from '../../utils/api';
import {useAuthentication, UserContext} from "../../utils/auth";
import LCView from "../../components/lc/LCView";
import Button from "../../components/ui/Button";
import DocumentaryRequirements from './DocumentaryRequirements';
import Panel from './Panel';
import config from '../../config';
import {Modal} from "../../components/ui/Modal";
import ComplianceChecks from "./ComplianceChecks";
import { Link } from "react-router-dom";
import {faChevronDown, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

// TODO break this file up into multiple files

const disabledBackgroundColor = `#c3c1c3`;
const disabledColor = `black`;

const TwoColumnHolder = styled.div`
  display: flex;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #000;
  line-height: 1.25;
`

const LeftColumn = styled.div`
  flex-grow: 1;
  margin-right: 20px;
  min-width: 250px;
  max-width: 250px;
`;

const AdvisorTitle = styled.div`
  max-width: 700px;
  margin: 5px auto 20px;
  margin: 5px auto 20px;
  display: flex;
  align-items: center;
  ${props => props.clickable && `cursor: pointer;`}
`;
const  ExpandedAdvisor = styled.div`
  padding-bottom: 10px;
  font-size: 12px;
  line-height: 1.5;
`;



const RightColumn = styled.div`
  flex-grow: 6;
`;

const OrderStatusWrapper = styled.div`
  font-weight: 300;
`;

const PartyDisplayMessage = styled.div`
  font-weight: 300;
  margin: 15px 0;
  text-align: center;
`;

const APPROVALS_TO_STATE = {
  issuerRejected: {
    message: "LC Application has been rejected by the issuer.",
    canEdit: [],
    canApprove: []
  },
  client: {
    message: "LC Application has been submitted and is waiting on issuer review.",
    canEdit: ['issuer'],
    canApprove: ['issuer'],
  },
  clientIssuer: {
    message: "LC has been sent to beneficiary and is awaiting approval or proposed changes.",
    canEdit: ['beneficiary'],
    canApprove: ['beneficiary'],
  },
  // clientBene is not possible
  bene: {
    message: "LC has been resubmitted to issuer with beneficiary redlining and is awaiting their approval.",
    canEdit: ['issuer'],
    canApprove: ['issuer'],
  },
  issuer: {
    message: "LC has been resent to client with issuer edits and is awaiting client approval.",
    canEdit: ['client'],
    canApprove: ['client'],
  },
  issuerBene: {
    message: "LC has been resent to client with issuer and beneficiary edits and is awaiting client approval.",
    canEdit: ['client'],
    canApprove: ['client'],
  },
};

const OrderStatusMessage = ({stateName}) => {
  const message = APPROVALS_TO_STATE[stateName].message;
  return <div>{message}</div>
};

const OrderStatus = ({lc, setLc, userType, stateName, setModal, totalCredit}) => {
  const approvals = [
    {name: 'Issuer:', value: get(lc, 'issuerApproved')},
    {name: 'Client:', value: get(lc, 'clientApproved')},
    {name: 'Beneficiary:', value: get(lc, 'beneficiaryApproved')}
  ];
  const handleClickApprove = async () => {
    const approvedCreditAmt = lc.client.approvedCredit.filter(
      model => model.bank.id === lc.issuer.id)[0]?.approvedCreditAmt;
    if (userType === "issuer" && (!approvedCreditAmt || parseFloat(totalCredit) +
      parseFloat(lc.creditAmt) - parseFloat(lc.cashSecure) > parseFloat(approvedCreditAmt))) {
      setModal("creditOverflowApprove");
    } else {
      makeAPIRequest(`/lc/${get(lc, 'id')}/evaluate/`, 'POST', {approve: true})
      .then(json => setLc({...lc, [`${userType}Approved`]: true}));
    } // TODO fix
  };
  const handleClickPayout = () => {
    makeAPIRequest(`/lc/${get(lc, 'id')}/payout/`, 'POST', {approve: true})
    .then(json => setLc({...lc, paidOut: true})); // TODO fix
  };
  const handleClickRequest = () => {
    makeAPIRequest(`/lc/${get(lc, 'id')}/request/`, 'POST', {approve: true})
    .then(json => setLc({...lc, requested: true})); // TODO fix
  };
  const handleClickDraw = () => {
    makeAPIRequest(`/lc/${get(lc, 'id')}/draw/`, 'POST', {approve: true})
    .then(json => setLc({...lc, drawn: true})); // TODO fix
  };
  const allApproved = approvals.every(a => a.value);
  const {paidOut, drawn, requested} = lc;
  return (
    <Panel title="Order Status" highlight>
      <OrderStatusWrapper>
        {!allApproved && APPROVALS_TO_STATE[stateName].canApprove.includes(userType) &&
        <center><Button onClick={handleClickApprove}>Approve</Button></center>}
        {allApproved && !paidOut && userType === "issuer" &&
        <center><Button onClick={handleClickPayout}
                        style={{marginBottom: '15px'}}>Pay Out</Button></center>}
        {allApproved && !requested && userType === "beneficiary" &&
        <center><Button onClick={handleClickRequest} style={{marginBottom: '15px'}}>Request</Button></center>}
        {allApproved && !drawn && userType === "beneficiary" &&
        <center><Button onClick={handleClickDraw} style={{marginBottom: '15px'}}>Draw</Button></center>}
        {allApproved && <PartyDisplayMessage style={{marginTop: '0'}}>This LC is live.</PartyDisplayMessage>}
        {allApproved && paidOut ? <PartyDisplayMessage style={{marginTop: '0'}}>This LC has been paid
            out.</PartyDisplayMessage>
          : drawn ? <PartyDisplayMessage style={{marginTop: '0'}}>Payment for this LC has been
              drawn.</PartyDisplayMessage>
            : requested ? <PartyDisplayMessage style={{marginTop: '0'}}>Payment for this LC has been
              requested.</PartyDisplayMessage> : null}
        <PartyDisplayMessage style={{fontWeight: '500'}}>You are the {userType}.</PartyDisplayMessage>
        {!allApproved && (
          <OrderStatusMessage stateName={stateName}/>
        )}
      </OrderStatusWrapper>
    </Panel>
  );
};

const OrderNotes = ({lc}) => {
  return (
    <Panel title="Revision Notes">
      <OrderStatusWrapper>
        {lc.latestVersionNotes}
      </OrderStatusWrapper>
    </Panel>
  )
};

const ClientInformationWrapper = styled.div`
  font-weight: 300;
  font-size: 14px;
  line-height: 1.5;
`;

const HistoryOrder = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BankInfo = ({bank}) => {
  console.log(bank);
  return (
      <ExpandedAdvisor>
        <p>address-</p>
        <p style = {{paddingLeft: 20}}>{bank.address}</p>
        <p>email-</p>
        <p style = {{paddingLeft: 20}}>{bank.email}</p>
        <p>country-</p>
        <p style = {{paddingLeft: 20}}>{bank.country}</p>
      </ExpandedAdvisor>
  )
}

const AdvisingBank = ({lc}) => {
  const advisingBank = get(lc, 'advisingBank');
  const [expanded, setExpanded] = useState(false);


  return (
      <Panel title="Advising Banks">
        <ClientInformationWrapper>
          <AdvisorTitle style={{margin: "15px 0 0 0"}} clickable
                       onClick={() => setExpanded((e) => !e)}>
            {advisingBank ?
                <a href={`/bank/profile/${advisingBank.id}`}>{advisingBank.name}</a>
                : <p>None</p>}
            <FontAwesomeIcon
                icon={expanded ? faChevronDown : faChevronRight}
                style={{color: config.accentColor, marginLeft: "10px"}}
            />
          </AdvisorTitle>
          {expanded && advisingBank && <BankInfo bank={advisingBank} />}
        </ClientInformationWrapper>
      </Panel>
  )
}

const IssuerBank = ({lc}) => {
  const issuer = get(lc, 'issuer');
  const [expanded, setExpanded] = useState(false);

  return (
      <Panel title="Issuing Bank">
        <ClientInformationWrapper>
          {/*{advisingBank ?*/}
          {/*      <a href={`/bank/profile/${advisingBank.id}`}>{advisingBank.name}</a>*/}
          {/*    : <p>None</p>}*/}
          <AdvisorTitle style={{margin: "15px 0 0 0"}} clickable
                        onClick={() => setExpanded((e) => !e)}>
            {issuer ?
                <a href={`/bank/profile/${issuer.id}`}>{issuer.name}</a>
                : <p>None</p>}
          </AdvisorTitle>
         <BankInfo bank={issuer} />
        </ClientInformationWrapper>
      </Panel>
  )
}

const ClientInformation = ({lc}) => {
  console.log(lc);
  const employee = get(lc, 'taskedClientEmployees[0]');
  const client = get(lc, 'client');
  const [clientOrders, setClientOrders] = useState(null);
  useEffect(() => {
    makeAPIRequest(`/lc/by_client/${client.id}/`)
    .then(json => setClientOrders(json));
  }, [client.id]);

  return (
    <Panel title="Client Information">
      <ClientInformationWrapper>
        POC: {employee.name}
        <br/>
        Email: <a href={`mailto:${employee.email}`}>{employee.email}</a>
        <h1 style={{fontWeight: "500", margin: "15px 0"}}>Order History</h1>
        {clientOrders && clientOrders.map(order => (
          <HistoryOrder key={order.id}>
            <a href={`/lc/${order.id}`}>{order.purchasedItem || `LC #${order.id}`}</a>
            {lc.paidOut ? <span>{order.dueDate}</span> : <span>{order.applicationDate}</span>}
          </HistoryOrder>
        ))}
      </ClientInformationWrapper>
    </Panel>
  );
};

const BigStatsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  > {
    flex-grow: 1;
  }

  border-bottom: 1px solid #cdcdcd;
`;

const BigNumberTitle = styled.div`
  font-size: 14px;
  margin: 10px 0 15px;
`;

const BigNumber = styled.div`
  font-weight: 600;
  font-size: 30px;
  margin-bottom: 25px;
`;

const AnalysisWrapper = styled.div`
  display: flex;
  align-items: baseline;
  margin: 10px;
`;

const SmallHeader = styled.div`
  font-size: 12px;
  min-width: 150px;
  margin-right: 50px;
`;

const AnalysisBody = styled.div`
  font-weight: ${props => props.error === undefined ? 300 : 400};
  ${props => props.error && "color: red;"}
  ${props => props.error === false && "color: #00a031;"}
`;

const AnalysisDetail = styled.span`
  font-style: italic;
  font-weight: 300;
  font-size: 14px;
  color: red;
  text-decoration: underline;
  opacity: .6;
  cursor: pointer;
  &:hover {
    opacity: 1;
    ${props => props.pop && "font-size: 15px;"}
  }
`;

const Subtitle = styled.div`
  margin-top: 15px;
  color: #555353;
  font-style: italic;
  font-size: 14px;
  font-weight: 300;
`;

const Financials = ({lc, setModal, totalCredit}) => {
  let creditOverflow = false;
  const approvedCreditAmt = lc.client.approvedCredit.filter(
    model => model.bank.id === lc.issuer.id)[0]?.approvedCreditAmt;
  const lcCredit = lc.issuerApproved ? 0 : parseFloat(lc.creditAmt) - parseFloat(lc.cashSecure);
  if (!approvedCreditAmt || parseFloat(totalCredit) +
    lcCredit > parseFloat(approvedCreditAmt)) {
    creditOverflow = true;
  }
  const client = get(lc, 'client');
  return (
    <Panel title="Financials">
      <BigStatsWrapper>
        <div style={{paddingRight: 30, width: "max-content"}}>
          <BigNumberTitle>Annual Cashflow</BigNumberTitle>
          <BigNumber>
            {client.annualCashflow || "N/A"}
            <span style={{fontWeight: "200", fontSize: "16px"}}> yearly</span>
          </BigNumber>
        </div>
        <div style={{paddingRight: 30}}>
          <BigNumberTitle>Savings Available</BigNumberTitle>
          <BigNumber>{client.balanceAvailable || "N/A"}</BigNumber>
        </div>
        <div>
          <BigNumberTitle>Approved Credit</BigNumberTitle>
          <BigNumber>{client.approvedCredit.filter(model => model.bank.id === lc.issuer.id)[0]?.approvedCreditAmt
          || "N/A"}</BigNumber>
        </div>
      </BigStatsWrapper>
      <div>
        <AnalysisWrapper>
          <SmallHeader>Credit Analysis</SmallHeader>
          <AnalysisBody error={creditOverflow}>
            {creditOverflow ? "There is a credit overflow."
              : "Approving this LC will not exceed the current approved credit limit."}
            {creditOverflow && <span>&nbsp;</span>}
            {creditOverflow && <AnalysisDetail onClick={() => setModal("creditOverflow")}>
              Click here for details
            </AnalysisDetail>}
          </AnalysisBody>
        </AnalysisWrapper>
        <AnalysisWrapper>
          <SmallHeader>Tolerance Analysis</SmallHeader>
          <AnalysisBody>
            Bountium will provide tools to help understand tolerance values within a letter of credit.
            <span style={{fontStyle: "italic", fontWeight: "300", fontSize: "14px"}}>
              &nbsp;Coming soon
            </span>
          </AnalysisBody>
        </AnalysisWrapper>
      </div>
    </Panel>
  );
};

const ODColumn = styled.div`
  flex-basis: 50%;
`;

const ODValue = styled.div`
  font-weight: 500;
  font-size: 24px;
  margin-bottom: 20px;
  margin-top: 5px;
`;

const StyledInput = styled(Field)`
	border: none;
	background-color: #eee;
	padding: 10px;
	border-radius: 10px;
	font-size: 18px;
`;

const StyledPopupInput = styled.input`
  padding: 10px 0 5px;
  flex: 1;
  font-size: 16px;
  border: none;
  border-bottom: ${props => props.disabled ? `0px` : `1px solid #cdcdcd`};
  background-color: ${props => props.disabled ? disabledBackgroundColor : `#fff`};
  color: ${props => props.disabled ? disabledColor : `#000`};
`;

const ButtonWrapper = styled.div`
  display: flex;
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
  margin: ${props => props.nested ? `0px` : `10px 0;`}
  max-width: 45%;
  display: flex;
  align-items: center;
`;

const YesNoInput = ({name}) => {
  const [, meta, helpers] = useField(name);
  const {value} = meta;
  const {setValue} = helpers;

  const handleClick = (val) => (e) => {
    e.preventDefault();
    setValue(val);
  };

  return (
    <ButtonWrapper>
      <StyledButton onClick={handleClick(true)} selected={value === true}>Yes</StyledButton>
      <StyledButton onClick={handleClick(false)} selected={value === false}>No</StyledButton>
    </ButtonWrapper>
  )
};

const TYPE_TO_COMPONENT = {
  text: (props) => (<StyledInput type="text" {...props}/>),
  number: (props) => (<StyledInput type="number" {...props}/>),
  date: (props) => (<StyledInput type="date" {...props}/>),
  boolean: (props) => (<YesNoInput type="text" {...props}/>),
};

const SubmitWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #cdcdcd;
  padding-bottom: 10px;
  margin-bottom: 10px;
  align-items: center;
`;

const SubmitSection = () => {
  return (
    <SubmitWrapper>
      <ODColumn>
        <Button type="submit">Submit Revisions</Button>
      </ODColumn>
      <ODColumn>
        <SmallHeader style={{marginBottom: '5px'}}>Revision Comments</SmallHeader>
        <Field name="latestVersionNotes" type="text"/>
      </ODColumn>
    </SubmitWrapper>
  )
};

const OrderDetail = ({title, value, units, type, name, editing, error, errorClicked}) => {
  const Input = TYPE_TO_COMPONENT[type];
  return (
    <>
      <SmallHeader>{title}</SmallHeader>
      <ODValue>
        {editing && type ? <Input name={name} id={name}/> : (value || "N/A")}
        {units && <span style={{fontWeight: "200", fontSize: "16px"}}> {units}</span>}
        {error && <span>&nbsp;</span>}
        {error && <AnalysisDetail pop onClick={errorClicked} style={{opacity: 1}}>{error}</AnalysisDetail>}
      </ODValue>
    </>
  )
};

const OrderDetails = ({lc, refreshLc, stateName, userType, live, modal, setModal, totalCredit}) => {
  const [showExtra, setShowExtra] = useState(false);
  const [editing, setEditing] = useState(false);
  const canEdit = !live && APPROVALS_TO_STATE[stateName].canEdit.includes(userType);
  const details = [
    {title: "Counterparty", value: get(lc, 'beneficiary.name')}, // must edit bene separately
    {title: "Counterparty's Country", value: get(lc, 'beneficiary.country')}, // must edit bene separately
    {title: "Latest Permissible Charge Date", value: lc.lateChargeDate, name: 'lateChargeDate', type: 'date'},
    {title: "Draft Presentation Date", value: lc.draftPresentationDate, name: 'draftPresentationDate', type: 'date'},
    {title: "Unit of Measure", value: lc.unitOfMeasure, type: 'text', name: 'unitOfMeasure'},
    {title: "Units Purchased", value: lc.unitsPurchased, name: 'unitsPurchased', type: 'number'},
    {
      title: "Price of Purchase",
      value: lc.creditAmt,
      units: lc.currencyDenomination,
      name: 'creditAmt',
      type: 'number'
    },
    {title: "Credit Expiration Date", value: lc.expirationDate, name: 'expirationDate', type: 'date'},
    {title: "Cash Secure Amount", value: lc.cashSecure, type: 'number', name: 'cashSecure'},
    {title: "Credit Amount (Verbal)", value: lc.creditAmtVerbal, type: 'text', name: 'creditAmtVerbal'}
  ];
  const extraDetails = [
    {title: "Credit Delivery Means", value: lc.creditDeliveryMeans, name: 'creditDeliveryMeans', type: 'text'},
    // {title: "Party Paying Other Banks' Fees", value: lc.payingOtherBanksFees, href: }, TODO make this work
    {
      title: "Draft's Invoice Value",
      value: lc.draftsInvoiceValue,
      name: 'draftsInvoiceValue',
      units: '%',
      type: 'number'
    },
    {title: "Credit Availability", value: lc.creditAvailability, name: 'creditAvailability', type: 'text'},
    {
      title: "Partial Shipment Allowed",
      value: lc.partialShipmentAllowed === true ? "Yes" : "No",
      name: 'partialShipmentAllowed',
      type: 'boolean'
    },
    {
      title: "Transshipment Allowed",
      value: lc.transshipmentAllowed === true ? "Yes" : "No",
      name: 'transshipmentAllowed',
      type: 'boolean'
    },
    {title: "Merch Charge Location", value: lc.merchChargeLocation, type: 'text', name: 'merchChargeLocation'},
    {
      title: "Charge Transportation Location",
      value: lc.chargeTransportationLocation,
      type: 'text',
      name: 'chargeTransportationLocation'
    },
    {
      title: "Named Place of Destination",
      value: lc.namedPlaceOfDestination,
      type: 'text',
      name: 'namedPlaceOfDestination'
    },
    // {title: "Doc Reception Notifees", value: lc.docReceptionNotifees},
    {
      title: "Client Arranging Insurance",
      value: lc.arrangingOwnInsurance === true ? "Yes" : "No",
      name: 'arrangingOwnInsurance',
      type: 'boolean'
    },
    {title: "Other Instructions", value: lc.otherInstructions, type: 'text', name: 'otherInstructions'},
    {title: "Merch Description", value: lc.merchDescription, type: 'text', name: 'merchDescription'},
    {
      title: "Transferable", value: (lc.transferableToClient
        ? `Yes, to ${lc.client.name}`
        : (lc.transferableToBeneficiary
          ? `Yes${lc.beneficiary && `, to ${lc.beneficiary.name}`}`
          : "No")) // not editable for now
    }
  ];

  // setup initial values
  const initialValues = {latestVersionNotes: ''};
  const allDetails = ([...details, ...extraDetails]);
  allDetails.forEach(d => {
    if (!d.name) {
      return;
    }
    switch (d.type) {
      case 'boolean':
        if (d.value.toLowerCase() === 'yes') {
          initialValues[d.name] = true;
        } else if (d.value.toLowerCase() === 'no') {
          initialValues[d.name] = false;
        }
        break;
      default:
        d.type && (initialValues[d.name] = d.value);
    }
  });

  return (
    <Panel title="Order Details" expand={showExtra} setExpand={setShowExtra} editing={editing} setEditing={setEditing}
           canEdit={canEdit}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, {setSubmitting}) => {
          setSubmitting(true);
          const {latestVersionNotes, ...lcValues} = values;
          const newLc = {};
          Object.entries(lcValues).forEach(pair => {
            const [k, v] = pair;
            if (v !== initialValues[k]) {
              newLc[k] = v;
            }
          });
          makeAPIRequest(`/lc/${get(lc, 'id')}/`, 'PUT', {
            lc: newLc, latestVersionNotes,
          }).then(() => {
            setSubmitting(false);
            refreshLc();
            setEditing(false);
          })
        }}
      >
        {() => (<div>
              {userType === "issuer" || userType === "client" ?
            <CreditOverflowPopup
              setModal={setModal} modal={modal} setEditing={setEditing}
              lc={lc} refreshLc={refreshLc} totalCredit={totalCredit}/>: null}
            <Form>
              {editing && <SubmitSection/>}
              <div style={{display: 'flex'}}>
                <ODColumn>
                  {details.slice(0, details.length / 2).map((d) =>
                    <OrderDetail key={d.title} {...d} editing={editing}/>
                  )}
                  {showExtra && extraDetails.slice(0, extraDetails.length / 2).map((d) =>
                    <OrderDetail key={d.title} {...d} editing={editing}/>
                  )}
                </ODColumn>
                <ODColumn>
                  {details.slice(details.length / 2).map((d) =>
                    <OrderDetail key={d.title} {...d} editing={editing}/>
                  )}
                  {showExtra && extraDetails.slice(extraDetails.length / 2).map((d) =>
                    <OrderDetail key={d.title} {...d} editing={editing}/>
                  )}
                </ODColumn>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </Panel>
  );
};

const scrollToAndHighlight = (questionKey) => {
  const selector = `[id="${questionKey}"]`;
  let parentElement = document.querySelector(selector);
  const originalBackgroundColor = window.getComputedStyle(parentElement).backgroundColor;
  const changeQuestionBackgroundTemp = () => {
    parentElement.animate({backgroundColor: ["lightblue", originalBackgroundColor]}, 1000);
  };
  let scrollTimeout;
  const scrollHandler = () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      window.removeEventListener("scroll", scrollHandler);
      changeQuestionBackgroundTemp();
      parentElement.focus();
    }, 20);
  };
  window.addEventListener("scroll", scrollHandler);
  parentElement.scrollIntoView({behavior: "smooth", block: "center"});
};

const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const CreditOverflowPopup = ({lc, modal, setModal, refreshLc, setEditing, totalCredit}) => {
  const [selectedButtonIndices, setSelectedButtonIndex] = useState({0: true, 1: false});
  const prevSelectedButtonIndices = usePrevious(selectedButtonIndices);
  const approvedCredit = lc.client.approvedCredit.filter(model => model.bank.id === lc.issuer.id)[0]?.approvedCreditAmt
    || 0;
  const minimumIncrease = (parseFloat(totalCredit) + parseFloat(lc.creditAmt) - parseFloat(lc.cashSecure) - parseFloat(
    approvedCredit)).toString();
  const [increaseApprovedCreditValue, setIncreaseApprovedCreditValue] = useState(minimumIncrease);
  const [requestMoreCashValue, setRequestMoreCashValue] = useState(minimumIncrease);
  const [error, setError] = useState("");
  const [submissionAttempts, setSubmissionAttempts] = useState(0);
  const increaseApprovedCreditRef = useRef(null);
  const requestMoreCashRef = useRef(null);
  const {setFieldValue, values} = useFormikContext();
  const overflow = -(parseFloat(approvedCredit) - parseFloat(totalCredit) -
    parseFloat(lc.creditAmt) + parseFloat(lc.cashSecure));

  useEffect(() => {
    handleError();
  }, [increaseApprovedCreditValue, requestMoreCashValue]);

  useEffect(() => {
    if (!_.isEqual(selectedButtonIndices, prevSelectedButtonIndices)) {
      handleError();
      if (selectedButtonIndices[0] && selectedButtonIndices[1]) {
        if (prevSelectedButtonIndices[0]) {
          requestMoreCashRef.current && requestMoreCashRef.current.focus();
        } else if (prevSelectedButtonIndices[1]) {
          increaseApprovedCreditRef.current && increaseApprovedCreditRef.current.focus();
        }
      } else if (selectedButtonIndices[0]) {
        increaseApprovedCreditRef.current && increaseApprovedCreditRef.current.focus();
      } else if (selectedButtonIndices[1]) {
        requestMoreCashRef.current && requestMoreCashRef.current.focus();
      }
    }
  });

  const handleError = () => {
    if (selectedButtonIndices[0] && selectedButtonIndices[1] && parseFloat(increaseApprovedCreditValue) + parseFloat(
      requestMoreCashValue) < parseFloat(minimumIncrease)) {
      setError(`The minimum approved credit plus cash secured amount must be at least ${minimumIncrease}`);
      return true;
    } else if (selectedButtonIndices[0] && !selectedButtonIndices[1] && parseFloat(increaseApprovedCreditValue)
      < parseFloat(minimumIncrease)) {
      setError(`The minimum approved credit plus cash secured amount must be at least ${minimumIncrease}`);
      return true;
    } else if (selectedButtonIndices[1] && !selectedButtonIndices[0] && parseFloat(requestMoreCashValue) < parseFloat(
      minimumIncrease)) {
      setError(`The minimum approved credit plus cash secured amount must be at least ${minimumIncrease}`);
      return true;
    } else if (!selectedButtonIndices[0] && !selectedButtonIndices[1]) {
      setError(`The minimum approved credit plus cash secured amount must be at least ${minimumIncrease}`);
      return true;
    }
    setError("");
    return false;
  };

  const onSelect = async () => {
    setSubmissionAttempts(submissionAttempts + 1);
    const error = handleError();
    if (!error && selectedButtonIndices[0]) {
      await makeAPIRequest(`/bank/${lc.issuer.id}/business/${lc.client.id}/approved_credit/`, "PUT",
        {approvedCreditAmt: parseFloat(increaseApprovedCreditValue) + parseFloat(approvedCredit)});
      if (modal === "creditOverflowApprove" && !selectedButtonIndices[1]) {
        await makeAPIRequest(`/lc/${get(lc, 'id')}/evaluate/`, 'POST', {approve: true});
      }
      refreshLc();
      setModal(false);
    }
    if (!error && selectedButtonIndices[1]) {
      await setEditing(true);
      await setModal(false);
      setFieldValue("cashSecure", parseFloat(requestMoreCashValue) + parseFloat(lc.cashSecure));
      setFieldValue("latestVersionNotes",
        `Please increase cash secured amount.${values.latestVersionNotes && " " + values.latestVersionNotes}`);
      scrollToAndHighlight("cashSecure");
    }
  };

  return (
    <Modal containerStyle={{width: "55%"}} show={modal === "creditOverflow" || modal === "creditOverflowApprove"}
           title={"Credit Overflow"} error={submissionAttempts > 0 && error} onCancel={() => setModal(false)}
           selectDisabled={submissionAttempts > 0 && error} onSelect={onSelect}
           selectButton={modal === "creditOverflowApprove" && selectedButtonIndices[0] && !selectedButtonIndices[1]
           ? "Select and Approve" : "Select"}>
      <div>
        Approving this LC will exceed the current approved credit ({approvedCredit}) for {get(lc,
        "client.name")} by {overflow}.
        <Subtitle>Check all that apply.</Subtitle>
        <div style={{flexDirection: "row", display: "flex", paddingTop: 20, paddingBottom: 20}}>
          <StyledButton
            nested style={{width: 230, justifyContent: "center"}}
            onClick={() => setSelectedButtonIndex({...selectedButtonIndices, 0: !selectedButtonIndices[0]})}
            selected={selectedButtonIndices[0]}>
            Increase Approved Credit By</StyledButton>
          <StyledPopupInput
            ref={increaseApprovedCreditRef} value={increaseApprovedCreditValue} type={"number"}
            onChange={({target}) => setIncreaseApprovedCreditValue(target.value)}
            style={{marginLeft: 10, visibility: selectedButtonIndices[0] ? "visible" : "hidden"}}/>
        </div>
        <div style={{flexDirection: "row", display: "flex", paddingBottom: 20}}>
          <StyledButton
            nested style={{width: 230, justifyContent: "center"}}
            onClick={() => setSelectedButtonIndex({...selectedButtonIndices, 1: !selectedButtonIndices[1]})}
            selected={selectedButtonIndices[1]}>
            Request More Secured Cash</StyledButton>
          <StyledPopupInput
            ref={requestMoreCashRef} value={requestMoreCashValue} type={"number"}
            onChange={({target}) => setRequestMoreCashValue(target.value)}
            style={{marginLeft: 10, visibility: selectedButtonIndices[1] ? "visible" : "hidden"}}/>
        </div>
      </div>
    </Modal>
  )
};

const StyledFormInput = styled.textarea`
  margin-top: 10px;
  padding: 10px 0 5px;
  min-height: 100px;
  font-size: 16px;
  border: none;
  border-bottom: 1px solid #cdcdcd;
`;

const Comments = ({lc, setLc, comments, userType}) => {
  const [modal, setModal] = useState(false);
  const [response, setResponse] = useState("");

  const onRespond = () => {
    makeAPIRequest(`/lc/${get(lc, 'id')}/`, 'PUT', {
      lc: {},
      comment: {action: "responded to the issuer", message: response}
    }).then(data => setLc(data.updatedLc));
    setModal(false);
  };

  // TODO this should be a backend thing
  comments = comments.filter(comment => comment[userType + "Viewable"]);
  return (
    <Panel title={"Comments"}>
      <Modal selectButton={"Respond"} show={modal} onCancel={() => setModal(false)}
             title={"Respond to Comment"} onSelect={onRespond}>
        <div>
          On {moment(modal.date).format("dddd, MMMM Do YYYY [at] h:mm a")}, {userType === modal.authorType ? "you"
          : `the ${modal.authorType}`} {modal.action}:
          <div style={{paddingTop: 5, fontStyle: "italic", color: "#808080"}}>
            "{modal.message}"
          </div>
        </div>
        <div style={{paddingTop: 40}}>Response:</div>
        <StyledFormInput value={response} onChange={({target}) => setResponse(target.value)}/>
      </Modal>
      {comments?.length ?
        comments.map((comment, commentIndex) =>
          <div style={commentIndex > 0 ? {paddingTop: 40} : null} key={comment.id}>
            On {moment(comment.date).format("dddd, MMMM Do YYYY [at] h:mm a")}, {userType === comment.authorType ? "you"
            : `the ${comment.authorType}`} {comment.action}:
            <div style={{paddingTop: 5, fontStyle: "italic", color: "#808080"}}>
              "{comment.message}"
            </div>
            {comment.respondable === userType &&
            <div style={{textAlign: "end"}}>
              <Button onClick={() => setModal(comment)}>Respond</Button>
            </div>}
          </div>
        )
        : "No comments to show."}
    </Panel>
  )
};

const LCViewPage = ({match}) => {
  useAuthentication(`/bank/lcs/${match.params.lcid}`);
  const [user] = useContext(UserContext);
  const [modal, setModal] = useState("");
  const [lc, setLc] = useState(null);
  const [totalCredit, setTotalCredit] = useState();
  let userType = 'unknown';
  if (get(user, 'bank.id') === get(lc, 'issuer.id')) {
    userType = 'issuer';
  } if (get(user, 'bank.id') === get(lc, 'advisingBank.id')) {
    userType = 'advisor';
  } else if (get(user, 'business')) {
    if (get(user, 'business.id') === get(lc, 'client.id')) {
      userType = 'client';
    } else if (get(user, 'business.id') === get(lc, 'beneficiary.id')) {
      userType = 'beneficiary';
    }
  }

  const live = get(lc, 'beneficiaryApproved') && get(lc, 'clientApproved') && get(lc, 'issuerApproved');
  // get state of order
  const a = {
    issuer: get(lc, 'issuerApproved'),
    client: get(lc, 'clientApproved'),
    beneficiary: get(lc, 'beneficiaryApproved'),
    issuerRejected: get(lc, 'ofacBankApproval') === 'rejected' || get(lc, 'sanctionBankApproval') === 'rejected'
  };
  let stateName = 'all';
  if (a.issuerRejected) {
    stateName = 'issuerRejected';
  } else if (a.issuer === true) {
    if (a.client === true) {
      stateName = 'clientIssuer';
    } else if (a.beneficiary === true) {
      stateName = 'issuerBene';
    } else {
      stateName = 'issuer';
    }
  } else if (a.client === true) {
    if (!a.beneficiary && !a.issuer) {
      stateName = 'client';
    }
  } else if (a.beneficiary === true) {
    if (!a.client && !a.issuer) {
      stateName = 'bene';
    }
  }

  // TODO change API to just return the new LC after we update it
  const refreshLc = () => {
    makeAPIRequest(`/lc/${match.params.lcid}/`)
    .then(json => userType === "issuer" ? makeAPIRequest(`/lc/total_credit/${json.client.id}/`).then(totalCredit => {
      setTotalCredit(totalCredit);
      setLc(json)
    }) : setLc(json));
  };

  useEffect(() => {
    if (user) {
      refreshLc();
    }
  }, [match.params.lcid, user?.id]);

  return (
    <LCView lc={lc} userType = {userType}>
      <TwoColumnHolder>
        <LeftColumn>
          <OrderStatus lc={lc} totalCredit={totalCredit} userType={userType} setLc={setLc} live={live}
                       stateName={stateName} setModal={setModal}/>
          {get(lc, 'latestVersionNotes') && <OrderNotes lc={lc}/>}
          <ClientInformation lc={lc}/>
          <AdvisingBank lc={lc} />
          {userType === 'issuer' ? null : <IssuerBank lc={lc} />}
          <Comments lc={lc} setLc={setLc} comments={lc?.comments} userType={userType}/>
        </LeftColumn>
        <RightColumn>
          {userType === 'issuer' && <Financials lc={lc} totalCredit={totalCredit} setModal={setModal}/>}
          <OrderDetails lc={lc} setLc={setLc} refreshLc={refreshLc} stateName={stateName}
                        userType={userType} live={live} modal={modal} setModal={setModal} totalCredit={totalCredit}/>
          {userType === 'issuer' && <ComplianceChecks lc={lc} userType={userType} live={live} setLc={setLc}/>}
          <DocumentaryRequirements lc={lc} userType={userType} live={live} refreshLc={refreshLc}/>
        </RightColumn>
      </TwoColumnHolder>
    </LCView>
  )

};

export default LCViewPage;
