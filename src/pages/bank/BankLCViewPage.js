import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";

import { makeAPIRequest } from '../../utils/api';
import { useAuthentication, UserContext } from "../../utils/auth";
import LCView from "../../components/lc/LCView";

const TwoColumnHolder = styled.div`
  display: flex;
`

const LeftColumn = styled.div`
  flex-grow: 1;
  margin-right: 20px;
  min-width: 250px;
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
  ${(props) => props.highlight && `
    font-weight: 500;
    color: #fff;
  `}
`

const PanelBody = styled.div`
  padding: 15px 20px;
  line-height: 1.25;
`

const Panel = ({ title, children, highlight, ...props }) => {
  return (
    <BasicView {...props}>
      <PanelTitle highlight={highlight}>{title}</PanelTitle>
      <PanelBody>{children}</PanelBody>
    </BasicView>
  )
}

const OrderStatus = () => {
  return (
    <Panel title="Order Status" highlight>Seller has redlined.</Panel>
  );
}

const AdditionalInformationWrapper = styled.div`
  font-weight: 300;
  font-size: 14px;
`

const AdditionalInformation = () => {
  return (
    <Panel title="Additional Information">
      <AdditionalInformationWrapper>
        Order ID: 82197429
        <br/>
        POC: Dwight Schrute
        <br/>
        Restrictions: None
      </AdditionalInformationWrapper>
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

const AnalysisTitle = styled.div`
  font-size: 12px;
  min-width: 150px;
  margin-right: 50px;
`

const AnalysisBody = styled.div`
  font-weight: 300;
`

const Creditworthiness = () => {
  return (
    <Panel title="Creditworthiness">
      <BigStatsWrapper>
        <div>
          <BigNumberTitle>Annual Cashflow</BigNumberTitle>
          <BigNumber>$40,000 <span style={{ fontWeight: "200", fontSize: "16px" }}>yearly</span></BigNumber>
        </div>
        <div>
          <BigNumberTitle>Savings Available</BigNumberTitle>
          <BigNumber>$200,000</BigNumber>
        </div>
        <div>
          <BigNumberTitle>Tolerance</BigNumberTitle>
          <BigNumber>3%</BigNumber>
        </div>
      </BigStatsWrapper>
      <div>
        <AnalysisWrapper>
          <AnalysisTitle>Cashflow Analysis</AnalysisTitle>
          <AnalysisBody>Buyers with a comparable annual cashflow have a 2.4% chance of defaulting on a transaction of $60,000.</AnalysisBody>
        </AnalysisWrapper>
        <AnalysisWrapper>
          <AnalysisTitle>Tolerance Analysis</AnalysisTitle>
          <AnalysisBody>The buyer can tolerate 3% variance in final quality of goods.</AnalysisBody>
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

const OrderDetails = () => {
  return (
    <Panel title="Order Details">
      <div style={{display: 'flex'}}>
        <ODColumn>
          <AnalysisTitle>Counterparty</AnalysisTitle>
          <ODValue>Chinese Wholesale Paper</ODValue>
          <AnalysisTitle>Counterparty's Country</AnalysisTitle>
          <ODValue>China</ODValue>
          <AnalysisTitle>Payment Date</AnalysisTitle>
          <ODValue>February 02, 2020</ODValue>
        </ODColumn>
        <ODColumn>
          <AnalysisTitle>Units of Purchase</AnalysisTitle>
          <ODValue>Reams</ODValue>
          <AnalysisTitle>Quantity of Purchase</AnalysisTitle>
          <ODValue>10,000</ODValue>
          <AnalysisTitle>Price of Purchase</AnalysisTitle>
          <ODValue>$60,000</ODValue>
        </ODColumn>
      </div>
    </Panel>
  );
}

const DocumentaryEntryWrapper = styled.div`
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

  ${props => props.border && `
    border-bottom: 1px solid #cdcdcd;
  `}
`

const DocReqTitle = ODValue;

const DocReqDate = styled.div`
  font-size: 14px;

`

const DocReqStatus = styled.div`
  font-size: 14px;
  font-weight: 500;
`

const DocumentaryRequirement = ({ title, dueDate, status }) => {
  return (
    <DocumentaryEntryWrapper border>
      <DocReqTitle style={{ margin: "15px 0" }}>{title}</DocReqTitle>
      <DocReqDate>{dueDate}</DocReqDate>
      <DocReqStatus>{status}</DocReqStatus>
    </DocumentaryEntryWrapper>
  )
}

const DocumentaryRequirements = () => {
  const docReqs = [
    {
      title: 'Commercial Invoice',
      dueDate: '02/15/20',
      status: 'Incomplete',
    },
    {
      title: 'Airway Bill',
      dueDate: '02/15/20',
      status: 'Incomplete',
    }
  ]
  return (
    <Panel title="Documentary Requirements">
      <DocumentaryEntryWrapper>
        <AnalysisTitle style={{margin: "0"}}>Document Title</AnalysisTitle>
        <AnalysisTitle style={{margin: "0"}}>Recieve By</AnalysisTitle>
        <AnalysisTitle style={{margin: "0"}}>Status</AnalysisTitle>
      </DocumentaryEntryWrapper>
      {docReqs.map(d => 
        <DocumentaryRequirement title={d.title} dueDate={d.dueDate} status={d.status} key={d.title}/>
        )}
    </Panel>
  );
}

const BankLCViewPage = ( {match} ) => {
  useAuthentication(`/bank/lcs/${match.params.lcid}`);
  const [user] = useContext(UserContext);
  const [lc, setLc] = useState(null);

  useEffect(() => {
    makeAPIRequest(`/lc/${match.params.lcid}/`)
      .then(json => setLc(json))
  }, [match.params.lcid])
  console.log(lc)

  return (
    <LCView lc={lc}>
      <TwoColumnHolder>
        <LeftColumn>
          <OrderStatus/>
          <AdditionalInformation/>
        </LeftColumn>
        <RightColumn>
          <Creditworthiness/>
          <OrderDetails/>
          <DocumentaryRequirements/>
        </RightColumn>
      </TwoColumnHolder>
    </LCView>
  )

}

export default BankLCViewPage
