import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { get } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useAuthentication, UserContext } from "../../../utils/auth";

import BasicLayout from "../../../components/BasicLayout";
import { makeAPIRequest } from '../../../utils/api';

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
    border: 1px solid rgb(27, 108, 255);
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

const BankListEntry = ({ bank }) => {
  return (
      <StyledLink to={`/bank/${bank.id}/application`}>
      <ListEntryWrapper>
        <ListEntryField>{bank.name}</ListEntryField>
      </ListEntryWrapper>
      </StyledLink>
  )
}

// The only different between this and the bank lc feed
// is setting business id based on the user's business field
// + addition of link to client or bene view
// This could almost certainly be abstracted
const BankDirectory = ({ title, user, url, hideSearch }) => {
  const [banks, setBanks] = useState(null);
  const [shownBanks, setShownBanks] = useState(null);

  const businessid = get(user, ['business', 'id']);

  useEffect(() => {
    if (!businessid) return;
    makeAPIRequest(url)
      .then(json => {
        setBanks(json);
        setShownBanks(json);
      });
  }, [businessid, url]);

  return (
    <BasicLayout
      title={title}
      isLoading={!shownBanks}
    >
    {/* "Heading" of the feed - delete if you think it unnecessary*/}
    <div>
      {!hideSearch && <Filter banks={banks} setShownBanks={setShownBanks} />}
      <ListEntryWrapper header>
        <ListEntryField>Bank</ListEntryField>
      </ListEntryWrapper>
    </div>
    {(shownBanks && (shownBanks.length > 0 ? (
      <div>
    {shownBanks.map(bank => <BankListEntry bank={bank} key={bank.id}/>)}
    </div>
    ) : (<center style={{ marginTop: '30px', fontStyle: 'italic', color: '#888' }}>No banks found.</center>)))}
    </BasicLayout>
  )

}

const BankDirectoryPage = ({ match }) => {
  useAuthentication(`/banks/`);
  const [user] = useContext(UserContext);

  const title = `Find the perfect bank for your LC needs!`
  return <BankDirectory
    title={title}
    url={`/bank/`}
    user={user}
    />
}

export default BankDirectoryPage;
