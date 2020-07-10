import React, {useState, useContext, useEffect, Fragment} from "react";
import LCFeed from "./LCFeed";
import { useAuthentication, UserContext } from "../../../utils/auth";
import { makeAPIRequest } from "../../../utils/api";
import BasicLayout from "../../../components/BasicLayout";
import {get} from "lodash";
import {faEdit, faSearch} from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/ui/Button";
import {Dropdown} from "../../../components/ui/Dropdown";

import { Link } from "react-router-dom";
import styled from "styled-components";
import config from '../../../config';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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


export const LCListEntry = ({setChange, toChange, employee, setEmployees, bank_id, edit}) => {
    const options = ['Authorized', 'Unauthorized'];
    const [index, setIndex] = useState(null);

        useEffect(() => {
            console.log("dropdown use effect")
        for (let changeItem of toChange) {
            if (changeItem.id === employee.employee.id) {
                setIndex(options.indexOf(changeItem.authField));
                return;
            }
        }
        // otherwise check the employee value that was already passed in
        for (let authItem of employee.employee.authorizedBanks) {
            if (authItem.bank.id === bank_id) {
                setIndex(options.indexOf(authItem.status));
                return;
            }
        }
            setIndex(1);
    }, [setIndex, toChange, index]);


    const handleChange = (item) => {
        for (let changeItem of toChange) {
            // check if it has already been changed once and should just change
            if (changeItem.id === employee.employee.id) {
                changeItem.authField = item;
                let newList = toChange;
                setChange(newList);
                setIndex(options.indexOf(item));
                return;
            }
        }
        // otherwise add it to the change list
        let newList = toChange;
        newList.push({id: employee.employee.id, authField: item});
        setChange(newList);
        setIndex(options.indexOf(item));
        return;
    }

    return (
            <ListEntryWrapper>
                <ListEntryField>{employee.employee.name}</ListEntryField>
                <ListEntryField>{employee.employee.email}</ListEntryField>
                <ListEntryField>{edit ?
                    <Dropdown items={options} onChange={item => handleChange(item)}
                              selectedIndex={index}/>
                              : options[index]}</ListEntryField>
            </ListEntryWrapper>
    )
}

// const Financials = ({client}) => {
//     const [cashFlow, setCashFlow] = useState(parseFloat(client.annualCashflow).toFixed(2));
//    const  [balanceAvailable, setBalanceAvailable] = useState(parseFloat(client.balanceAvailable).toFixed(2));
//
//     console.log(client);
//     return (
//         <BasicLayout
//             title={"Financials"}
//             isLoading={!client}
//             style = {{display: "inline"}}>
//             {/* "Heading" of the feed - delete if you think it unnecessary*/}
//
//             <ListEntryWrapper>
//                 <ListEntryField>Annual Cash Flow </ListEntryField>
//                 <ListEntryField>${cashFlow}</ListEntryField>
//             </ListEntryWrapper>
//             <ListEntryWrapper>
//                 <ListEntryField>Balance Avaialable</ListEntryField>
//                 <ListEntryField>${balanceAvailable}</ListEntryField>
//             </ListEntryWrapper>
//
//         </BasicLayout>
//     )
//
// }
const AuthorizedEmployees = ({client, user}) => {
    const [employees, setEmployees] = useState([]);
    const [edit, setEdit] = useState(false);
    const bank_id = get(user, ['bank', 'id']);
    const [toChange, setChange] = useState([]);

    useEffect(() => {
        console.log("authorized use effect")
        makeAPIRequest(`/business/${client.id}/${bank_id}/authorized_employees/`).then(json => {
            setEmployees(json)
        })
    }, [client.id, bank_id])

    // have a refresh with an await with the fetch... and then reset the change in the LCListEntry

    function handleSave() {
        for (let changeItem of toChange) {
            makeAPIRequest(`/business/${changeItem.id}/${bank_id}/${changeItem.authField}/`, 'PUT')
                .then(json => {
                }).catch((error) => {console.log(error)})
        }
        window.location.reload(false);
        // setEdit(false);
        // setChange([]);
    }

    return (
        <BasicLayout
            title={"Authorized Employees"}
            isLoading={!employees}
            style = {{display: "inline"}}>
            {/* "Heading" of the feed - delete if you think it unnecessary*/}
            <div>
                <ListEntryWrapper header>
                    <ListEntryField>Employee</ListEntryField>
                    <ListEntryField>Email</ListEntryField>
                    <ListEntryField>Authorized</ListEntryField>
                    {edit ? <div style = {{position: "relative"}}>
                           <Button onClick={() => handleSave()}style = {{margin: 10}}>Save</Button>
                            <Button onClick={() => {
                                setEdit(false)
                                setChange([]);
                            }}>Cancel</Button></div> :
                    <FontAwesomeIcon icon={faEdit} onClick={() => setEdit(true)}  style={{ padding: "0 10px", cursor: "pointer"}} />}

                </ListEntryWrapper>
            </div>
                    {employees.map(employee => <LCListEntry toChange = {toChange} setChange={setChange} employee={employee} setEmployees = {setEmployees} bank_id={bank_id} key={employee.email} edit={edit}/>)}

            {employees.length === 0 ? <center style={{ marginTop: '30px', fontStyle: 'italic', color: '#888' }}>This Business has no Employees</center> : null}
        </BasicLayout>
    )
}

const ManageClientFeed = ({ match }) => {
    useAuthentication(`/bank/lcs/client/${match.params.clientid}`);
    const [user] = useContext(UserContext);
    const [client, setClient] = useState(null);
    useEffect(() => {
        makeAPIRequest(`/business/${match.params.clientid}/`)
            .then(json => setClient(json))
    }, [match.params.clientid])
    const title = client ? `All LCs for ${client.name}` : `All LCs for Client #${match.params.clientid}`;
    return (
    <Fragment>
    <LCFeed
        title={title}
        url={`/lc/by_client/${match.params.clientid}/`}
        user={user}
        hideSearch
    />
        {client ?
            <AuthorizedEmployees
                client={client}
                user={user}
            /> : null}
        {/*{client ? <Financials client = {client} /> : null}*/}

    </Fragment>
    )
}

export default ManageClientFeed
