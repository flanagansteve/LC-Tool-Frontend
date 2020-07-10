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

// const Filter = ({ lcs, setShownLcs }) => {
//     const [filter, setFilter] = useState(null);
//     useDebouncedEffect(() => {
//         if (filter === null) return;
//         setShownLcs(lcs.filter(lc => lc.client.name.toLowerCase().includes(filter.toLowerCase())));
//     }, [filter, lcs], 200)
//     return (
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//             <SearchWrapper>
//                 <FontAwesomeIcon icon={faSearch}  style={{ padding: "0 10px"}} />
//                 <Search type="text" onChange={(e) => setFilter(e.target.value)} />
//             </SearchWrapper>
//             <span style={{ fontStyle: 'italic', marginLeft: '10px', fontWeight: 300, color: '#454545' }}>Start typing to filter by client</span>
//         </div>
//     )
// }

export const LCListEntry = ({ client }) => {
    // NOTE: due_date and credit_amt will only be available for DigitalLCs
    return (
        <StyledLink to={`/bank/client/${client.id}`}>
            <ListEntryWrapper>
                <ListEntryField>{client.name}</ListEntryField>
                <ListEntryField>{get(client, 'country') || "Unknown"}</ListEntryField>
            </ListEntryWrapper>
        </StyledLink>
    )
}

const ClientFeed = ({ title, user, url, hideSearch }) => {
    const [clients, setClients] = useState(null);
    const [shownClients, setShownClients] = useState(null);
    const bankid = get(user, ['bank', 'id']);

    useEffect(() => {
        console.log(url);
        if (!bankid) return;
        makeAPIRequest(url)
            .then(json => {
                console.log(json);
                setClients(json);
                setShownClients(json);
            });
    }, [bankid, url]);

    return (
        <BasicLayout
            title={title}
            isLoading={!shownClients}
        >
            {/* "Heading" of the feed - delete if you think it unnecessary*/}
            <div>
                {/*{!hideSearch && <Filter lcs={clients} setShownLcs={setShownClients} />}*/}
                <ListEntryWrapper header>
                    <ListEntryField>Client</ListEntryField>
                    <ListEntryField>Country</ListEntryField>
                </ListEntryWrapper>
            </div>
            {(shownClients && (shownClients.length > 0 ? (
                <div>
                    {shownClients.map(client => <LCListEntry client={client} key={client.id}/>)}
                </div>
            ) : (<center style={{ marginTop: '30px', fontStyle: 'italic', color: '#888' }}>You don't have any Clients yet.</center>)))}
        </BasicLayout>
    )

}

export default ClientFeed;