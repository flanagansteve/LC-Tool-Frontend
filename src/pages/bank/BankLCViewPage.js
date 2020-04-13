import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { Formik, Field, Form, useField } from "formik";
import { get } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import { makeAPIRequest, postFile } from '../../utils/api';
import { useAuthentication, UserContext } from "../../utils/auth";
import LCView from "../../components/lc/LCView";
import Button from "../../components/ui/Button";

// TODO break this file up into multiple files

const TwoColumnHolder = styled.div`
  display: flex;
`

const LeftColumn = styled.div`
  flex-grow: 1;
  margin-right: 20px;
  min-width: 250px;
  max-width: 250px;
`

const RightColumn = styled.div`
  flex-grow: 6;
`

const BasicView = styled.div`
  border: 1px solid #dfdfdf;
  background-color: #fff;
  border-radius: 0 0 20px 20px;
  margin-bottom: 30px;
`

const PanelTitle = styled.h2`
  background-color: ${(props) => props.highlight ? `rgb(27, 108, 255)` : `rgb(199, 222, 255)`};
  border-bottom: 1px solid #dfdfdf;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  ${(props) => props.clickable && `
    cursor: pointer;
  `}
  ${(props) => props.highlight && `
    font-weight: 500;
    color: #fff;
  `}
`

const PanelBody = styled.div`
  padding: 15px 20px;
  line-height: 1.25;
`

const PanelTitleAlt = styled.div`
  color: rgb(27, 108, 255);
  margin-right: 5px;
`

const Panel = ({ title, children, highlight, expand, setExpand, editing, setEditing, canEdit, ...props }) => {
  const expandEnabled = [true, false].includes(expand);
  return (
    <BasicView {...props}>
      <PanelTitle highlight={highlight} clickable={expandEnabled}>
        {title}
        <div style={{ display: 'flex', alignItems: 'center' }}>
        {canEdit && (editing
          ? (
            <>
            <PanelTitleAlt>Editing</PanelTitleAlt>
            <span
              style={{fontStyle: 'italic', fontSize: '14px', color: '#555'}}
              onClick={() => setEditing(false)}
              >Cancel</span>
            </>
          )
          : <FontAwesomeIcon
            icon={faPencilAlt}
            onClick={() => setEditing(true)}
            style={{
              color: 'rgb(27, 108, 255)',
            }}
            />
        )}
        {expandEnabled &&
          <FontAwesomeIcon
            icon={expand ? faChevronDown : faChevronRight}
            onClick={() => setExpand(e => !e)}
            style={{
              color: 'rgb(27, 108, 255)',
              padding: '0 10px'
            }}
            />
        }
        </div>
      </PanelTitle>
      <PanelBody>{children}</PanelBody>
    </BasicView>
  )
}

const OrderStatusWrapper = styled.div`
  font-weight: 300;

`

const PartyDisplayMessage = styled.div`
  font-weight: 300;
  margin: 15px 0;
  text-align: center;
`

const APPROVALS_TO_STATE = {
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
}

const OrderStatusMessage = ({ stateName }) => {
  const message = APPROVALS_TO_STATE[stateName].message;
  return <div>{message}</div>
}

const OrderStatus = ({ lc, setLc, userType, stateName }) => {
  const approvals = [
    {name: 'Issuer:', value: get(lc, 'issuerApproved')},
    {name: 'Client:', value: get(lc, 'clientApproved')},
    {name: 'Beneficiary:', value: get(lc, 'beneficiaryApproved')}
  ]
  const handleClickApprove = () => {
    makeAPIRequest(`/lc/${get(lc, 'id')}/evaluate/`, 'POST', { approve: true })
      .then(json => setLc({ ...lc, [`${userType}Approved`]: true })); // TODO fix
  }
  const handleClickPayout = () => {
    makeAPIRequest(`/lc/${get(lc, 'id')}/payout/`, 'POST', { approve: true })
      .then(json => setLc({ ...lc, paidOut: true })); // TODO fix
  }
  const handleClickRequest = () => {
    makeAPIRequest(`/lc/${get(lc, 'id')}/request/`, 'POST', { approve: true })
      .then(json => setLc({ ...lc, requested: true })); // TODO fix
  }
  const handleClickDraw = () => {
    makeAPIRequest(`/lc/${get(lc, 'id')}/draw/`, 'POST', { approve: true })
      .then(json => setLc({ ...lc, drawn: true })); // TODO fix
  }
  const allApproved = approvals.every(a => a.value);
  const { paidOut, drawn, requested } = lc;
  return (
    <Panel title="Order Status" highlight>
      <OrderStatusWrapper>
      {!allApproved && APPROVALS_TO_STATE[stateName].canApprove.includes(userType) &&
        <center><Button onClick={handleClickApprove}>Approve</Button></center>}
      {allApproved && !paidOut && userType === "issuer" && <center><Button onClick={handleClickPayout} style={{marginBottom: '15px'}}>Pay Out</Button></center>}
      {allApproved && !requested && userType === "beneficiary" && <center><Button onClick={handleClickRequest} style={{marginBottom: '15px'}}>Request</Button></center>}
      {allApproved && !drawn && userType === "beneficiary" && <center><Button onClick={handleClickDraw} style={{marginBottom: '15px'}}>Draw</Button></center>}
      {allApproved && <PartyDisplayMessage style={{marginTop: '0'}}>This LC is live.</PartyDisplayMessage>}
      {allApproved && paidOut ? <PartyDisplayMessage style={{marginTop: '0'}}>This LC has been paid out.</PartyDisplayMessage>
        : drawn ? <PartyDisplayMessage style={{marginTop: '0'}}>Payment for this LC has been drawn.</PartyDisplayMessage>
        : requested ? <PartyDisplayMessage style={{marginTop: '0'}}>Payment for this LC has been requested.</PartyDisplayMessage> : null}
      <PartyDisplayMessage style={{fontWeight: '500'}}>You are the {userType}.</PartyDisplayMessage>
      {!allApproved && (
        <OrderStatusMessage stateName={stateName} />
      )}
      </OrderStatusWrapper>
    </Panel>
  );
}

const OrderNotes = ({ lc }) => {
  return (
    <Panel title="Revision Notes">
      <OrderStatusWrapper>
        {lc.latestVersionNotes}
      </OrderStatusWrapper>
    </Panel>
  )
}

const ClientInformationWrapper = styled.div`
  font-weight: 300;
  font-size: 14px;
  line-height: 1.5;
`

const HistoryOrder = styled.div`
  display: flex;
  justify-content: space-between;
`

const ClientInformation = ({ lc }) => {
  const employee = get(lc, 'taskedClientEmployees[0]');
  const client = get(lc, 'client');
  const [clientOrders, setClientOrders] = useState(null);
  useEffect(() => {
    makeAPIRequest(`/lc/by_client/${client.id}/`)
      .then(json => setClientOrders(json));
  }, [client.id])

  return (
    <Panel title="Client Information">
      <ClientInformationWrapper>
        POC: {employee.name}
        <br/>
        Email: <a href={`mailto:${employee.email}`}>{employee.email}</a>
        <h1 style={{ fontWeight: "500", margin: "15px 0"}}>Order History</h1>
        {clientOrders && clientOrders.map(order => (
          <HistoryOrder key={order.id}>
            <a href={`/bank/lc/${order.id}`}>{order.purchasedItem || `LC #${order.id}`}</a>
            {lc.paidOut ? <span>{order.dueDate}</span> : <span>{order.applicationDate}</span>}
          </HistoryOrder>
        ))}
      </ClientInformationWrapper>
    </Panel>
  );
}

const BigStatsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  > {
    flex-grow: 1;
  }

  > :last-child {
    margin-right: 40px;
  }

  border-bottom: 1px solid #cdcdcd;
`

const BigNumberTitle = styled.div`
  font-size: 14px;
  margin: 10px 0 15px;
`

const BigNumber = styled.div`
  font-weight: 600;
  font-size: 36px;
  margin-bottom: 25px;
`

const AnalysisWrapper = styled.div`
  display: flex;
  align-items: baseline;
  margin: 10px;
`

const SmallHeader = styled.div`
  font-size: 12px;
  min-width: 150px;
  margin-right: 50px;
`

const AnalysisBody = styled.div`
  font-weight: 300;
`

const Financials = ({ lc }) => {
  const client = get(lc, 'client');
  return (
    <Panel title="Financials">
      <BigStatsWrapper>
        <div>
          <BigNumberTitle>Annual Cashflow</BigNumberTitle>
          <BigNumber>
            {client.annualCashflow || "N/A"}
            <span style={{ fontWeight: "200", fontSize: "16px" }}> yearly</span>
           </BigNumber>
        </div>
        <div>
          <BigNumberTitle>Savings Available</BigNumberTitle>
          <BigNumber>{client.balanceAvailable || "N/A"}</BigNumber>
        </div>
        <div>
          <BigNumberTitle>Approved Credit</BigNumberTitle>
          <BigNumber>{client.approvedCredit || "N/A"}</BigNumber>
        </div>
      </BigStatsWrapper>
      <div>
        <AnalysisWrapper>
          <SmallHeader>Cashflow Analysis</SmallHeader>
          <AnalysisBody>
            Bountium will provide intelligent analysis and predictions to help assess letters of credit.
            <span style={{ fontStyle: "italic", fontWeight: "300", fontSize: "14px"}}>
              &nbsp;Coming soon
            </span>
          </AnalysisBody>
        </AnalysisWrapper>
        <AnalysisWrapper>
          <SmallHeader>Tolerance Analysis</SmallHeader>
          <AnalysisBody>
            Bountium will provide tools to help understand tolerance values within a letter of credit.
            <span style={{ fontStyle: "italic", fontWeight: "300", fontSize: "14px"}}>
              &nbsp;Coming soon
            </span>
          </AnalysisBody>
        </AnalysisWrapper>
      </div>
    </Panel>
  );
}

const ODColumn = styled.div`
  flex-basis: 50%;
`

const ODValue = styled.div`
  font-weight: 500;
  font-size: 24px;
  margin-bottom: 20px;
  margin-top: 5px;
`

const StyledInput = styled(Field)`
	border: none;
	background-color: #eee;
	padding: 10px;
	border-radius: 10px;
	font-size: 18px;
`

const ButtonWrapper = styled.div`
  display: flex;
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

const YesNoInput = ({ name }) => {
  const [, meta, helpers] = useField(name);
  const { value } = meta;
  const { setValue } = helpers;

  const handleClick = (val) => (e) => {
    e.preventDefault();
    setValue(val);
  }

  return (
      <ButtonWrapper>
        <StyledButton onClick={handleClick(true)} selected={value === true}>Yes</StyledButton>
        <StyledButton onClick={handleClick(false)} selected={value === false}>No</StyledButton>
      </ButtonWrapper>
  )
}

const TYPE_TO_COMPONENT = {
  text: (props) => (<StyledInput type="text" {...props}/>),
  number: (props) => (<StyledInput type="number" {...props}/>),
  date: (props) => (<StyledInput type="date" {...props}/>),
  boolean: (props) => (<YesNoInput type="text" {...props}/>),
}

const SubmitWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #cdcdcd;
  padding-bottom: 10px;
  margin-bottom: 10px;
  align-items: center;
`

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
}

const OrderDetail = ({ title, value, units, type, name, editing }) => {
  const Input = TYPE_TO_COMPONENT[type];
  return (
  <>
    <SmallHeader>{title}</SmallHeader>
    <ODValue>
      {editing && type ? <Input name={name}/> : (value || "N/A")}
      {units && <span style={{ fontWeight: "200", fontSize: "16px" }}> {units}</span>}
    </ODValue>
  </>
  )
}

const OrderDetails = ({ lc, refreshLc, stateName, userType }) => {
  const [showExtra, setShowExtra] = useState(false);
  const [editing, setEditing] = useState(false);
  const canEdit = APPROVALS_TO_STATE[stateName].canEdit.includes(userType);
  const details = [
    {title: "Counterparty", value: get(lc, 'beneficiary.name')}, // must edit bene separately
    {title: "Counterparty's Country", value: get(lc, 'beneficiary.country')}, // must edit bene separately
    {title: "Payment Date", value: lc.dueDate, name: 'dueDate', type: 'date'},
    {title: "Draft Presentation Date", value: lc.draftPresentationDate, name: 'draftPresentationDate', type: 'date'},
    {title: "Units of Measure", value: lc.unitsOfMeasure, type: 'text', name: 'unitsOfMeasure'},
    {title: "Units Purchased", value: lc.unitsPurchased, name: 'unitsPurchased', type: 'number'},
    {title: "Price of Purchase", value: lc.creditAmt, units: lc.currencyDenomination, name: 'creditAmt', type: 'number'},
    {title: "Credit Expiration Date", value: lc.expirationDate, name: 'expirationDate', type: 'date'},
  ];
  const extraDetails = [
    {title: "Credit Amount (Verbal)", value: lc.creditAmtVerbal, type: 'text', name: 'creditAmtVerbal'},
    {title: "Credit Delivery Means", value: lc.creditDeliveryMeans, name: 'creditDeliveryMeans', type: 'text'},
    // {title: "Party Paying Other Banks' Fees", value: lc.payingOtherBanksFees, href: }, TODO make this work
    {title: "Draft's Invoice Value", value: lc.draftsInvoiceValue, name: 'draftsInvoiceValue', units: '%', type: 'number'},
    {title: "Credit Availability", value: lc.creditAvailability, name: 'creditAvailability', type: 'text'},
    {title: "Partial Shipment Allowed", value: lc.partialShipmentAllowed === true ? "Yes" : "No", name: 'partialShipmentAllowed', type: 'boolean'},
    {title: "Transshipment Allowed", value: lc.transshipmentAllowed === true ? "Yes" : "No", name: 'transshipmentAllowed', type: 'boolean'},
    {title: "Merch Charge Location", value: lc.merchChargeLocation, type: 'text', name: 'merchChargeLocation'},
    {title: "Late Charge Date", value: lc.lateChargeDate, name: 'lateChargeDate', type: 'date'},
    {title: "Charge Transportation Location", value: lc.chargeTransportationLocation, type: 'text', name: 'chargeTransportationLocation'},
    {title: "Named Place of Destination", value: lc.namedPlaceOfDestination, type: 'text', name: 'namedPlaceOfDestination'},
    // {title: "Doc Reception Notifees", value: lc.docReceptionNotifees},
    {title: "Client Arranging Insurance", value: lc.arrangingOwnInsurance === true ? "Yes" : "No", name: 'arrangingOwnInsurance', type: 'boolean'},
    {title: "Other Instructions", value: lc.otherInstructions, type: 'text', name: 'otherInstructions'},
    {title: "Merch Description", value: lc.merchDescription, type: 'text', name: 'merchDescription'},
    {title: "Transferable", value: (lc.transferableToClient
      ? `Yes, to ${lc.client.name}`
      : (lc.transferableToBeneficiary
        ? `Yes${lc.beneficiary && `, to ${lc.beneficiary.name}`}`
        : "No")) // not editable for now
    }
  ]

  // setup initial values
  const initialValues = { latestVersionNotes: '' };
  const allDetails = ([...details, ...extraDetails]);
  console.log(allDetails)
  allDetails.forEach(d => {
    if (!d.name) return;
    switch (d.type) {
      case 'boolean':
        if (d.value.toLowerCase() === 'yes') initialValues[d.name] = true;
        else if (d.value.toLowerCase() === 'no') initialValues[d.name] = false;
        break;
      default:
        d.type && (initialValues[d.name] = d.value);
    }
  });

  return (
    <Panel title="Order Details" expand={showExtra} setExpand={setShowExtra} editing={editing} setEditing={setEditing} canEdit={canEdit}>
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        const { latestVersionNotes, ...lcValues } = values;
        const newLc = {};
        Object.entries(lcValues).forEach(pair => {
          const [k, v] = pair;
          if (v !== initialValues[k]) newLc[k] = v;
        })
        console.log(newLc)
        makeAPIRequest(`/lc/${get(lc, 'id')}/`, 'PUT', {
          lc: newLc, latestVersionNotes,
        }).then(() => {
            setSubmitting(false);
            refreshLc();
            setEditing(false);
          })
      }}
    >
    {() => (
    <Form>
      {editing && <SubmitSection />}
      <div style={{display: 'flex'}}>
        <ODColumn>
          {details.slice(0,details.length/2).map((d) =>
            <OrderDetail key={d.title} {...d} editing={editing}/>
          )}
          {showExtra && extraDetails.slice(0,extraDetails.length/2).map((d) =>
            <OrderDetail key={d.title} {...d} editing={editing}/>
          )}
        </ODColumn>
        <ODColumn>
          {details.slice(details.length/2).map((d) =>
            <OrderDetail key={d.title} {...d} editing={editing}/>
          )}
          {showExtra && extraDetails.slice(extraDetails.length/2).map((d) =>
            <OrderDetail key={d.title} {...d} editing={editing}/>
          )}
        </ODColumn>
      </div>
    </Form>
    )}
    </Formik>
    </Panel>
  );
}

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
`

const DocumentaryEntryWrapper = styled.div`
  border-bottom: 1px solid #cdcdcd;
`

const DocReqTitle = styled.div`
  font-weight: 500;
  font-size: 24px;
  margin-bottom: 20px;
  margin-top: 5px;
  display: flex;
  align-items: center;
`

const DocReqDate = styled.div`
  font-size: 14px;

`

const DocReqStatus = styled.div`
  font-size: 14px;
  font-weight: 500;
`

const ExpandedDocumentaryEntry = styled.div`
  padding-bottom: 10px;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
`

const FileUpload = styled.label`
  padding: 5px 10px;
  border: 1px solid #dcdcdc;
  max-width: 70%;
  cursor: pointer;
`

const DocumentaryEntryEvaluation = styled.div`
  display: flex;
  margin-top: 10px;

  > :not(:last-child) {
    margin-right: 10px;
  }
`

const DocumentaryRequirement = ({ documentaryRequirement: docReq, lcid, userType, status, live, refreshLc, ...props }) => {
  const { docName: title, dueDate, linkToSubmittedDoc, id, requiredValues, rejected } = docReq;
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState('');

  const uploadFile = (file) => {
    if (!file) {
      console.error('No file found.');
      return;
    }
    postFile(`/lc/${lcid}/doc_req/${id}/`, file)
      .then(() => refreshLc());
  }

  const approve = () => {
    makeAPIRequest(`/lc/${lcid}/doc_req/${id}/evaluate/`, 'POST', {
      approve: true, complaints: comments,
    })
  }

  const reject = () => {
    makeAPIRequest(`/lc/${lcid}/doc_req/${id}/evaluate/`, 'POST', {
      approve: false, complaints: comments,
    })
  }

  return (
    <DocumentaryEntryWrapper>
    <DocumentaryEntryFlex clickable onClick={() => setExpanded(e => !e)} {...props}>
      <DocReqTitle style={{ margin: "15px 0" }}>
        {title}
          <FontAwesomeIcon
            icon={expanded ? faChevronDown : faChevronRight}
            style={{color: 'rgb(27, 108, 255)', marginLeft: '10px'}}
            />
      </DocReqTitle>
      <DocReqDate>{dueDate}</DocReqDate>
      <DocReqStatus>{status}</DocReqStatus>
    </DocumentaryEntryFlex>
    {expanded && <ExpandedDocumentaryEntry>
    <DocumentaryEntryFlex>
    <div>
      Required Values: {requiredValues}
    </div>
    {
      linkToSubmittedDoc ? (
        <div>
          File: <a href={linkToSubmittedDoc}>order.pdf</a>
        </div>
      ) : live && (
        <>
        <div style={{display: 'flex', flexDirection: 'column'}}>
        <FileUpload>
            Upload File
            <input type="file" onChange={e => uploadFile(e.target.files[0])} style={{display: 'none'}}/>
        </FileUpload>
        </div>
        </>
      )
    }
    </DocumentaryEntryFlex>
    {live && userType === 'issuer' && !rejected && linkToSubmittedDoc &&
      <DocumentaryEntryEvaluation>
        <Button onClick={approve}>Approve</Button>
        <Button onClick={reject}>Reject</Button>
        <div>
          <SmallHeader>Comments</SmallHeader>
          <input type="text" value={comments} onChange={(e) => setComments(e.target.value)}/>
        </div>
      </DocumentaryEntryEvaluation>
    }
    </ExpandedDocumentaryEntry>}
    </DocumentaryEntryWrapper>
  )
}

const DocumentaryRequirements = ({ lc, userType, live, refreshLc }) => {
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
          status={d.satisfied ? "Approved" : d.linkToSubmittedDoc ? "Pending" : "Incomplete"}
          lcid={lc.id}
          live={live}
          userType={userType}
          refreshLc={refreshLc}
          key={d.docName}/>
        ) : (
          <div style={{ marginTop: "10px", fontStyle: "italic", fontWeight: "300"}}>
            There are no documentary requirements for this LC.
          </div>
        )
      }

    </Panel>
  );
}

const BankLCViewPage = ( {match} ) => {
  useAuthentication(`/bank/lcs/${match.params.lcid}`);
  const [user] = useContext(UserContext);
  const [lc, setLc] = useState(null);
  let userType = 'unknown';
  if (get(user, 'bank')) {
    userType = 'issuer';
  } else if (get(user, 'business')) {
    if (get(user, 'business.id') === get(lc, 'client.id')) userType = 'client';
    else if (get(user, 'business.id') === get(lc, 'beneficiary.id')) userType = 'beneficiary';
  }
  const live = get(lc, 'beneficiaryApproved') && get(lc, 'clientApproved') && get(lc, 'issuerApproved');
  // get state of order
  const a = {
    issuer: get(lc, 'issuerApproved'),
    client: get(lc, 'clientApproved'),
    beneficiary: get(lc, 'beneficiaryApproved')
  }
  let stateName = 'all';
  if (a.issuer === true) {
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
      stateName = 'beneficiary';
    }
  }
  // console.log(lc)

  // TODO change API to just return the new LC after we update it
  const refreshLc = () => {
    makeAPIRequest(`/lc/${match.params.lcid}/`)
      .then(json => setLc(json))
  }

  useEffect(() => {
    makeAPIRequest(`/lc/${match.params.lcid}/`)
      .then(json => setLc(json))
  }, [match.params.lcid])

  return (
    <LCView lc={lc}>
      <TwoColumnHolder>
        <LeftColumn>
          <OrderStatus lc={lc} userType={userType} setLc={setLc} live={live} stateName={stateName}/>
          {get(lc, 'latestVersionNotes') && <OrderNotes lc={lc}/>}
          <ClientInformation lc={lc}/>
        </LeftColumn>
        <RightColumn>
          {userType === 'issuer' && <Financials lc={lc}/>}
          <OrderDetails lc={lc} setLc={setLc} refreshLc={refreshLc} stateName={stateName} userType={userType}/>
          <DocumentaryRequirements lc={lc} userType={userType} live={live} refreshLc={refreshLc}/>
        </RightColumn>
      </TwoColumnHolder>
    </LCView>
  )

}

export default BankLCViewPage
