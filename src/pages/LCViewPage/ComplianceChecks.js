import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {get} from "lodash";

import {makeAPIRequest} from '../../utils/api';
import Panel from './Panel';
import config from "../../config";
import AnimateHeight from "react-animate-height";
import {Modal} from "../../components/ui/Modal";

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
  margin-top: 5px;
  margin-bottom: 10px;
  color: ${props => props.error ? "red" : "#555353"};
  font-style: italic;
  font-size: 14px;
  font-weight: 300;
`;

const Asterisk = styled.span`
  color: #dc3545;
  font-size: 16px;
`;

const StyledFormInput = styled.textarea`
  margin-top: 10px;
  padding: 10px 0 5px;
  min-height: 100px;
  font-size: 16px;
  border: none;
  border-bottom: 1px solid #cdcdcd;
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
  margin: 10px 0;
  display: flex;
  align-items: center;
`;

const DocumentaryEntryFlex = styled.div`
  display: flex;
  align-items: baseline;
  > :nth-child(1) {
    min-width: 55%;
  }
  > :nth-child(2) {
    min-width: 30%;
  }
  > :nth-child(3) {
    min-width: 15%;
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
  margin: 5px auto 20px;
  display: flex;
  align-items: center;
  ${props => props.clickable && `cursor: pointer;`}
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
  width: 75%;
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

const RequestClarificationModal = ({lc, initialReason, modal, setModal, field, setLc, client, beneficiary}) => {
  const [comment, setComment] = useState(initialReason);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (modal === "requestClarification") {
      textAreaRef.current.focus();
    }
  }, [modal]);

  const onRequest = () => {
    makeAPIRequest(`/lc/${get(lc, 'id')}/`, 'PUT', {
      lc: {[field]: "requested"},
      comment: {action: "requested clarification on the beneficiary", message: comment},
      holdStatus: true
    }).then(data => setLc(data.updatedLc));
    setModal("");
  };

  return (
    <Modal selectButton={"Confirm"} show={modal === "requestClarification"} onCancel={() => setModal("")}
           title={"Request Clarification"} onSelect={onRequest}>
      <div>Request {client?.name} to provide more information about {beneficiary?.name}?</div>
      <div style={{paddingTop: 40}}>Comment:</div>
      <StyledFormInput ref={textAreaRef} value={comment} onChange={({target}) => setComment(target.value)}/>
    </Modal>
  )
};

const RejectionModal = ({lc, initialReason, modal, setModal, field, setLc}) => {
  const [rejectionReason, setRejectionReason] = useState(initialReason);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (modal === "reject") {
      textAreaRef.current.focus();
    }
  }, [modal]);

  const onReject = () => {
    makeAPIRequest(`/lc/${get(lc, 'id')}/`, 'PUT', {
      lc: {[field]: "rejected"},
      comment: {action: "rejected the LC", message: rejectionReason},
      holdStatus: true
    }).then(data => setLc(data.updatedLc));
    setModal("");
  };

  return (
    <Modal selectButton={"Reject"} show={modal === "reject"} onCancel={() => setModal("")} title={"Confirm Rejection"}
           onSelect={onReject}>
      <div>Are you sure you want to reject this LC? Doing so will cause all changes to be permanently halted.</div>
      <div style={{paddingTop: 40}}>Notes:</div>
      <StyledFormInput ref={textAreaRef} value={rejectionReason}
                       onChange={({target}) => setRejectionReason(target.value)}/>
    </Modal>
  )
};

const titleCase = string => {
  const exceptions = new Set(
    ["and", "as", "but", "for", "if", "nor", "or", "so", "yet", "a", "an",
      "the", "as", "at", "by", "for", "in", "of", "off", "on", "per", "to",
      "up", "via"]);

  const allCaps = new Set(["s.a.", "sa"]);

  const capitalizeFirstLetter = (word, wordIndex) => {
    word = word.toLowerCase();
    if (allCaps.has(word)) {
      return word.toUpperCase();
    } else if (!wordIndex || !exceptions.has(word)) {
      return word.charAt(0).toUpperCase() + word.substring(1);
    } else {
      return word;
    }
  };

  return string.split(" ").map((substr, ind) => capitalizeFirstLetter(substr, ind)).join(" ");
};

const SanctionInfo = ({sanction}) => {

  const handleRightClick = event => {
    event.preventDefault();
    window.open(`https://www.google.com/search?q=${sanction.name}`);
  };

  const addressToString = address => {
    const fields = [];
    address.address && fields.push(address.address);
    address.addressGroup && fields.push(address.addressGroup);
    address.country && fields.push(address.country);
    return fields.join(", ");
  };

  return (
    <div style={{paddingBottom: 20, paddingLeft: 20}}>
      <div style={{fontSize: 19, width: "70%"}} title={"Right click to search"}
           onContextMenu={handleRightClick}>{titleCase(sanction.name)}</div>
      {sanction.aliases.length > 0 && <div style={{paddingLeft: 40, paddingTop: 5}}>
        Aliases:
        <div style={{paddingLeft: 40}}>
          {sanction.aliases.map(alias => <div style={{paddingTop: 3}} key={alias.id}>{titleCase(alias.name)}</div>)}
        </div>
      </div>}
      {sanction.addresses.length > 0 && <div style={{paddingLeft: 40, paddingTop: 5}}>
        Addresses:
        <div style={{paddingLeft: 40}}>
          {sanction.addresses.map(
            address => <div style={{paddingTop: 3}} key={address.id}>{addressToString(address)}</div>)}
        </div>
      </div>}
    </div>
  )
};

const ComplianceCheck = ({
  lc, setLc, title, initialRequestComment, initialRejectionReason, error, errorMessage, children, status, type
}) => {
  const [expanded, setExpanded] = useState(false);
  const [modal, setModal] = useState("");

  let field;
  if (type === "company") {
    field = "ofacBankApproval"
  } else if (type === "country") {
    field = "sanctionBankApproval";
  } else if (type === "license") {
    field = "importLicenseApproval";
  } else if (type === "boycott") {
    field = "boycottLanguageStatus";
  } else if (type === "believablePrice") {
    field = "believablePriceOfGoodsStatus";
  }
  else if (type === "dueAuthorization") {
    field = "dueAuthorization";
  }

  const onWaiveClick = () => {
    makeAPIRequest(`/lc/${get(lc, 'id')}/`, 'PUT', {
      lc: {[field]: "accepted"},
      holdStatus: true
    }).then(data => setLc(data.updatedLc));
  };

  return (
    <DocumentaryEntryWrapper>
      <RejectionModal modal={modal} setModal={setModal} initialReason={initialRejectionReason}
                      field={field} setLc={setLc} lc={lc}/>
      <RequestClarificationModal lc={lc} modal={modal} setModal={setModal} initialReason={initialRequestComment}
                                 setLc={setLc} client={lc?.client} field={field}
                                 beneficiary={lc?.beneficiary}/>
      <DocumentaryEntryFlex>
        <div>
          <DocReqTitle style={{margin: "15px 0 0 0"}} clickable
                       onClick={() => setExpanded((e) => !e)}>
            {title}
            <FontAwesomeIcon
              icon={expanded ? faChevronDown : faChevronRight}
              style={{color: config.accentColor, marginLeft: "10px"}}
            />
          </DocReqTitle>
          <Subtitle error={error} style={{paddingLeft: 10}}>
            {error && errorMessage}
          </Subtitle>
        </div>
        <ButtonWrapper style={{position: "relative"}}>
          <StyledButton selected={status === "Accepted"} onClick={onWaiveClick}>{field === 'dueAuthorization' ? 'Authorize' : 'Waive'}</StyledButton>
          <StyledButton selected={status === "Rejected"} onClick={() => setModal("reject")}>Reject</StyledButton>
          {expanded && <StyledButton style={{position: "absolute", top: 40}} selected={status === "Requested"}
                                     onClick={() => setModal("requestClarification")}>
            Request More Info</StyledButton>}
        </ButtonWrapper>
        <DocReqStatus>{status}</DocReqStatus>
      </DocumentaryEntryFlex>
      <AnimateHeight duration={300} height={expanded ? "auto" : 0}>
        <ExpandedDocumentaryEntry>
          {children}
        </ExpandedDocumentaryEntry>
      </AnimateHeight>
    </DocumentaryEntryWrapper>
  );
};

const CompanyOFACCheck = ({lc, setLc}) => {
  const beneficiary = get(lc, 'beneficiary.name');
  const sanctions = get(lc, 'ofacSanctions');
  const status = get(lc, "ofacBankApproval");
  return (
    <ComplianceCheck
      lc={lc}
      type={"company"}
      setLc={setLc}
      title={"OFAC Company Sanctions"}
      status={titleCase(status)}
      initialRejectionReason={`The beneficiary ${beneficiary} is on the OFAC SDN sanction list.`}
      initialRequestComment={`Our records indicate that the beneficiary ${beneficiary} is on the OFAC SDN sanction list. If this is a mistake, please provide reasoning to confirm so.`}
      error={sanctions.length > 0}
      errorMessage={`${sanctions.length > 0 ? sanctions.length : "No"} ${sanctions.length > 0 ? "potential"
        : ""} error${sanctions.length !== 1 ? "s" : ""}${sanctions.length === 0 ? " found" : ""}`}
    >
      {sanctions.length > 0 ? sanctions.map(sanction => <SanctionInfo key={sanction.id} sanction={sanction}/>) :
        <div style={{paddingLeft: 20, width: "70%"}}>Did not find any immediate sanction violations for
          company {beneficiary}.</div>}
    </ComplianceCheck>
  )
};

const CountrySanctionCheck = ({lc, setLc}) => {
  const beneficiary = get(lc, 'beneficiary.name');
  const beneficiaryCountry = get(lc, 'beneficiary.country');
  const clientCountry = get(lc, "client.country");
  const countrySanctionMessage = get(lc, "sanctionAutoMessage");
  const status = get(lc, "sanctionBankApproval");
  let message;
  if (countrySanctionMessage === null) {
    message = `Not able to check sanction violations for the country ${beneficiaryCountry}.
    Please contact steve@bountium.org if you would like for this functioniality to be extended.`;
  } else if (countrySanctionMessage === "") {
    message = `Did not find any immediate sanction errors for country ${beneficiaryCountry}.`;
  } else {
    message = <div>Paying out an LC to {beneficiaryCountry} may violate sanctions. Please click&nbsp;
      <a target="_blank" rel="noopener noreferrer" href={countrySanctionMessage}>here</a> for more information.</div>;
  }

  return (
    <ComplianceCheck
      lc={lc}
      type={"country"}
      setLc={setLc}
      title={"Country Sanctions"}
      status={titleCase(status)}
      initialRejectionReason={`The beneficiary ${beneficiary}'s country (${beneficiaryCountry}) has sanction violations with your country (${clientCountry}).`}
      initialRequestComment={`Our records indicate that the beneficiary ${beneficiary}'s country (${beneficiaryCountry}) has sanctions against your country (${clientCountry}). If this is a mistake, please provide reasoning to confirm so.`}
      error={countrySanctionMessage === null || countrySanctionMessage}
      errorMessage={countrySanctionMessage === "" ? "No errors found" : "1 potential error"}
    >
      <div style={{paddingLeft: 20, fontSize: 19, width: "70%"}}>{beneficiaryCountry}</div>
      <div style={{paddingLeft: 60, width: "70%"}}>{message}</div>
    </ComplianceCheck>
  )
};

const ImportLicenseCheck = ({lc, setLc}) => {
  const licenseSanctionMessage = get(lc, "importLicenseMessage");
  const status = get(lc, "importLicenseApproval");

  return (
    <ComplianceCheck
      lc={lc}
      type={"license"}
      setLc={setLc}
      title={"Import License/Permits"}
      status={titleCase(status)}
      initialRejectionReason={`There may an additional permit/license required for the goods marked.`}
      initialRequestComment={`Our records indicate that there are additional permits required to ship this good. If this is a mistake, please provide reasoning to confirm so.`}
      error={licenseSanctionMessage === null || licenseSanctionMessage}
      errorMessage={licenseSanctionMessage === " " ? null : "1 potential error"}
    >
      {licenseSanctionMessage?.length > 1 ? <div
          style={{paddingTop: 20, paddingLeft: 20}}>{licenseSanctionMessage}</div> :
        <div style={{paddingLeft: 20, width: "70%"}}>Did not find any immediate license/permits required for this
          transaction.</div>}
    </ComplianceCheck>
  )
};

const BoycottLanguageCheck = ({lc, setLc}) => {
  const boycotts = get(lc, 'boycottLanguage');
  const status = get(lc, 'boycottLanguageStatus');

  const boycottSourceToReadable = (source) => {
    if (source === "otherInstructions") {
      return "'Other instructions' in the LC application";
    }
  };

  const boycottToReadable = (source, boycotts) => {
    if (source === "otherInstructions") {
      const indices = [];
      boycotts.map(boycott => {
        const startIndex = lc.otherInstructions.indexOf(boycott.phrase);
        indices.push([startIndex, startIndex + boycott.phrase.length])
      });
      indices.sort((a, b) => a[0] - b[0]);
      const cmps = [<span>{lc.otherInstructions.substring(0, indices[0][0])}</span>];
      indices.forEach((indexes, index) => {
        if (index > 0) {
          cmps.push(<span>{lc.otherInstructions.substring(indices[index - 1][1], indexes[0])}</span>);
        }
        cmps.push(<span style={{fontWeight: 600}}>{lc.otherInstructions.substring(indexes[0], indexes[1])}</span>);
      });
      cmps.push(<span>{lc.otherInstructions.substring(indices[indices.length - 1][1])}</span>)
      return (
        <div style={{fontSize: 14, paddingLeft: 20, fontStyle: "italic"}}>
          "{cmps.map(cmp => cmp)}"
        </div>
      )
    }
  };

  return (
    <ComplianceCheck
      lc={lc}
      type={"boycott"}
      setLc={setLc}
      title={"Boycott Language"}
      status={titleCase(status)}
      initialRejectionReason={`There is boycott language in this LC.`}
      initialRequestComment={`Our records indicate that there is boycott language in this LC. If this is a mistake, please provide reasoning to confirm so.`}
      error={boycotts === null || Object.keys(boycotts).length > 0}
      errorMessage={`${Object.keys(boycotts).length > 0 ? Object.keys(boycotts).length : "No"} ${Object.keys(
        boycotts).length > 0 ? "potential" : ""} error${Object.keys(boycotts).length !== 1 ? "s" : ""}${Object.keys(
        boycotts).length === 0 ? " found" : ""}`}
    >
      {Object.keys(boycotts).length > 0 ?
        <div>
          <div style={{paddingLeft: 20, width: "70%", paddingBottom: 10}}>
            This LC potentially violates United States Anti-Boycott laws. Please click&nbsp;
            <a target="_blank" rel="noopener noreferrer"
               href={"https://www.bis.doc.gov/index.php/enforcement/oac"}>here</a>
            &nbsp;for more information.
          </div>
          {Object.entries(boycotts).map(([boycottSource, boycotts], boycottSourceIndex) => (
            <div style={{paddingLeft: 40}} key={boycottSourceIndex}>
              <div style={{fontSize: 19, width: "70%"}}>
                From {boycottSourceToReadable(boycottSource)}:
              </div>
              {boycottToReadable(boycottSource, boycotts)}
            </div>))}
        </div> : <div style={{paddingBottom: 20}}>No immediate boycott language found in the LC.</div>}
    </ComplianceCheck>
  )
};

const DueAuthorization = ({lc, setLc}) => {
  const employee = get(lc, 'taskedClientEmployees[0]');
  const issuer = get(lc, "issuer");
  const initialRejectReason = "This employee is not Authorized"
  const initialRequestComment = "Please provide proof of Authorization that this employee can represent an LC for this company";

  const searchStatus = (authList) => {
    for (let authItem of authList) {
      if (authItem.bank.id === issuer.id) {
        return titleCase(authItem.status);
      }
    }
    return "error";
  }

  let status = searchStatus(employee.authorizedBanks);


  return (
      <ComplianceCheck
          lc={lc}
          type={"dueAuthorization"}
          setLc={setLc}
          title={"Due Authorization"}
          status={status}
          initialRejectionReason={initialRejectReason}
          initialRequestComment={initialRequestComment}
          error={status === "Accepted" ? false : true}
          errorMessage={status !== "Accepted" && "1 potential error"}
      >
        {status === "Accepted" ? <div> {employee.name} is authorized to apply for an LC </div> : <div> {employee.name} is not authorized to apply for an LC</div>  }
      </ComplianceCheck>
  )
}

const BelievablePriceOfGoods = ({lc, setLc}) => {
  const goodsInfo = get(lc, 'goodsInfo');
  const status = get(lc, 'believablePriceOfGoodsStatus');
  const unitsPurchased = parseFloat(get(lc, 'unitsPurchased'));
  const range = goodsInfo && [Math.max(0,
    unitsPurchased * (parseFloat(goodsInfo.mean) - 2 * parseFloat(goodsInfo.standardDeviation))),
    unitsPurchased * (parseFloat(goodsInfo.mean) + 2 * parseFloat(goodsInfo.standardDeviation))];
  const credit = parseFloat(get(lc, 'creditAmt'));
  const error = range && (credit < range[0] || credit > range[1]);
  let initialRejectionReason = "";
  let initialRequestComment = "";
  let cmp = "Did not find any immediate irregularities with the price of the goods.";
  if (error && credit < range[0]) {
    initialRejectionReason = "The price of the goods is too low.";
    initialRequestComment = "Our records indicate that the price of the goods is too low. If this is a mistake, please provide reasoning to confirm so.";
    cmp = <div>The price of the goods for HTS code {goodsInfo.htsCode} (${credit}) may be too low. <a target="_blank" rel="noopener noreferrer" href={"https://comtrade.un.org/Data/"}>These records</a> indicate the range should fall somewhere between [${range[0]} - ${range[1]}].</div>
  } else if (error && credit > range[1]) {
    initialRejectionReason = "The price of the goods is too high.";
    initialRequestComment = "Our records indicate that the price of the goods is too high. If this is a mistake, please provide reasoning to confirm so.";
    cmp = <div>The price of the goods for HTS code {goodsInfo.htsCode} (${credit}) may be too high. <a target="_blank" rel="noopener noreferrer" href={"https://comtrade.un.org/Data/"}>These records</a> indicate the range should fall somewhere between [${range[0]} - ${range[1]}].</div>
  }

  const purchasedItem = get(lc, 'purchasedItem');
  const unitOfMeasure = get(lc, 'unitOfMeasure');

  return (
    <ComplianceCheck
      lc={lc}
      type={"believablePrice"}
      setLc={setLc}
      title={"Believable Price of Goods"}
      status={titleCase(status)}
      initialRejectionReason={initialRejectionReason}
      initialRequestComment={initialRequestComment}
      error={error}
      errorMessage={error && "1 potential error"}
    >
      <div style={{fontSize: 19, paddingLeft: 20, width: "70%"}}>
        {purchasedItem}: ({unitsPurchased} {unitOfMeasure}):
      </div>
      <div style={{paddingLeft: 40}}>
        {cmp}
      </div>
    </ComplianceCheck>
  )
};

const ComplianceChecks = ({lc, setLc}) => {
  return (
    <Panel title="Compliance Checks">
      <DocumentaryEntryFlex>
        <SmallHeader style={{margin: "0"}}>Type</SmallHeader>
        <SmallHeader style={{margin: "0"}}>Action</SmallHeader>
        <SmallHeader style={{margin: "0"}}>Status</SmallHeader>
      </DocumentaryEntryFlex>
      <CompanyOFACCheck lc={lc} setLc={setLc}/>
      <CountrySanctionCheck lc={lc} setLc={setLc}/>
      <ImportLicenseCheck lc={lc} setLc={setLc}/>
      <BoycottLanguageCheck lc={lc} setLc={setLc}/>
      <BelievablePriceOfGoods lc={lc} setLc={setLc}/>
      <DueAuthorization lc={lc} setLc={setLc}/>
    </Panel>
  );
};

export default ComplianceChecks;
