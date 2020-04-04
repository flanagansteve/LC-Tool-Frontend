import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { get } from "lodash";

import BasicLayout from "../../components/BasicLayout";
import { makeAPIRequest } from '../../utils/api';
import { useAuthentication, UserContext } from "../../utils/auth";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #000;
  line-height: 1.25;
`

const ListEntryField = styled.li`
  flex-grow: 1;
  flex-basis: 20%;
`

const ListEntryWrapper = styled.ul`
  display: flex;
  margin: 10px auto;
  padding: 15px 25px;
  border: 1px solid #cdcdcd;
  font-weight: 500;
  align-items: center;

  ${(props) => !props.header && `
  font-weight: 400;
  &:hover {
    border: 1px solid rgb(27, 108, 255);
  }`}
  transition: border 0.3s;
  background-color: #fff;
`

const LCListEntry = ({ lc }) => {
  // NOTE: due_date and credit_amt will only be available for DigitalLCs
  console.log(lc)
  return (
      <StyledLink to={`/bank/lcs/${lc.id}`}>
      <ListEntryWrapper>
        <ListEntryField>{lc.client.name}</ListEntryField>
        <ListEntryField>{lc.beneficiary || "Unknown"}</ListEntryField>
        <ListEntryField>{lc.applicationDate}</ListEntryField>
        <ListEntryField>{lc.dueDate || "N/A"}</ListEntryField>
        <ListEntryField>{lc.creditAmt || "N/A"}</ListEntryField>
      </ListEntryWrapper>
      </StyledLink>
  )
}

const BankLCFeedPage = () => {
  useAuthentication('/bank/lcs');
  const [user] = useContext(UserContext);
  const [lcs, setLcs] = useState(null);
  const bankid = get(user, ['bank', 'id']);

  useEffect(() => {
    if (!bankid) return;
    makeAPIRequest(`/lc/by_bank/${bankid}/`)
      .then(json => setLcs(json));
  }, [bankid]);

  return (
    <BasicLayout
      title="View All LCs 📝"
      isLoading={!lcs}
    >
    {/* "Heading" of the feed - delete if you think it unnecessary*/}
    <div>
      <ListEntryWrapper header>
        <ListEntryField>Client</ListEntryField>
        <ListEntryField>Beneficiary</ListEntryField>
        <ListEntryField>Applied</ListEntryField>
        <ListEntryField>Due</ListEntryField>
        <ListEntryField>Transaction Size</ListEntryField>
      </ListEntryWrapper>
    </div>
    {(lcs && (lcs.length > 0 ? (
      <div>
    {lcs.map(lc => <LCListEntry lc={lc} key={lc.id}/>)}
    </div>
    ) : (<center style={{ marginTop: '30px', fontStyle: 'italic', color: '#888' }}>You don't have any LCs yet.</center>)))}
    </BasicLayout>
  )

}

export default BankLCFeedPage
