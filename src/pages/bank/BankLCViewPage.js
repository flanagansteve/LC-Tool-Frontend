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
`

const RightColumn = styled.div`
  flex-grow: 6;
`

const BasicView = styled.div`
  border: 1px solid #dfdfdf;
  background-color: #fff;
  border-radius: 0 0 10px 10px;
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

const AdditionalInformation = () => {
  return (
    <Panel title="Additional Information">Seller has redlined.</Panel>
  );
}

const Creditworthiness = () => {
  return (
    <Panel title="Creditworthiness">Seller has redlined.</Panel>
  );
}

const OrderDetails = () => {
  return (
    <Panel title="Order Details">Seller has redlined.</Panel>
  );
}

const DocumentaryRequirements = () => {
  return (
    <Panel title="Documentary Requirements">Seller has redlined.</Panel>
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
