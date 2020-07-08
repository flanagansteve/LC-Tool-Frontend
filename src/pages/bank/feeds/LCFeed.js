import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { get } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import BasicLayout from "../../../components/BasicLayout";
import { makeAPIRequest } from '../../../utils/api';
import config from '../../../config';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #000;
  line-height: 1.25;
`

const ListEntryField = styled.li`
  flex-grow: 1;
  flex-basis: 20%;
  padding-left: 10px;
  padding-right: 10px;
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
    border: 1px solid ${config.accentColor};
  }`}
  transition: border 0.3s;
  background-color: #fff;
`

const useDebouncedEffect = (callback, parameters, delay) => {
  const currentTimeout = useRef(null);

  useEffect(() => {
    if (currentTimeout.current !== null) {
      clearTimeout(currentTimeout.current);
    }
    currentTimeout.current = setTimeout(callback, delay);
    /* eslint-disable-next-line */
  }, parameters);
};

const Search = styled.input`
  font-size: 16px;
  padding: 5px 10px 5px 0;
  border: none;
`

const SearchWrapper = styled.div`
  background-color: #fff;
  border: 1px solid #cdcdcd;
`

const Filter = ({ lcs, setShownLcs }) => {
  const [filter, setFilter] = useState(null);
  useDebouncedEffect(() => {
    if (filter === null) return;
    setShownLcs(lcs.filter(lc => lc.client.name.toLowerCase().includes(filter.toLowerCase())));
  }, [filter, lcs], 200)
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
    <SearchWrapper>
    <FontAwesomeIcon icon={faSearch}  style={{ padding: "0 10px"}} />
      <Search type="text" onChange={(e) => setFilter(e.target.value)} />
    </SearchWrapper>
      <span style={{ fontStyle: 'italic', marginLeft: '10px', fontWeight: 300, color: '#454545' }}>Start typing to filter by client</span>
    </div>
  )
}

const LCListEntry = ({ lc }) => {
  // NOTE: due_date and credit_amt will only be available for DigitalLCs
  return (
      <StyledLink to={`/lc/${lc.id}`}>
      <ListEntryWrapper>
        <ListEntryField>{get(lc, 'client.name') || "Unknown"}</ListEntryField>
        <ListEntryField>{get(lc, 'beneficiary.name') || "Unknown"}</ListEntryField>
        <ListEntryField>{lc.applicationDate}</ListEntryField>
        <ListEntryField>{lc.draftPresentationDate || "N/A"}</ListEntryField>
        <ListEntryField>{lc.creditAmt || "N/A"}</ListEntryField>
      </ListEntryWrapper>
      </StyledLink>
  )
}

const LCFeed = ({ title, user, url, hideSearch }) => {
  const [lcs, setLcs] = useState(null);
  const [shownLcs, setShownLcs] = useState(null);
  const bankid = get(user, ['bank', 'id']);

  useEffect(() => {
    if (!bankid) return;
    makeAPIRequest(url)
      .then(json => {
        setLcs(json);
        setShownLcs(json);
      });
  }, [bankid, url]);

  return (
    <BasicLayout
      title={title}
      isLoading={!shownLcs}
    >
    {/* "Heading" of the feed - delete if you think it unnecessary*/}
    <div>
      {!hideSearch && <Filter lcs={lcs} setShownLcs={setShownLcs} />}
      <ListEntryWrapper header>
        <ListEntryField>Client</ListEntryField>
        <ListEntryField>Beneficiary</ListEntryField>
        <ListEntryField>Applied</ListEntryField>
        <ListEntryField>Drafts Due</ListEntryField>
        <ListEntryField>Transaction Size</ListEntryField>
      </ListEntryWrapper>
    </div>
    {(shownLcs && (shownLcs.length > 0 ? (
      <div>
    {shownLcs.map(lc => <LCListEntry lc={lc} key={lc.id}/>)}
    </div>
    ) : (<center style={{ marginTop: '30px', fontStyle: 'italic', color: '#888' }}>You don't have any LCs yet.</center>)))}
    </BasicLayout>
  )

}

export default LCFeed;
