import React, {useState, useContext, useEffect, Fragment} from "react";
import LCFeed from "./LCFeed";
import { useAuthentication, UserContext } from "../../../utils/auth";
import { makeAPIRequest } from "../../../utils/api";
import BasicLayout from "../../../components/BasicLayout";
import {get} from "lodash";
import {Modal} from "../../../components/ui/Modal";
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
    const [modal, setModal] = useState(false);

        useEffect(() => {
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

    const Reject = () => {
        makeAPIRequest(`/business/${employee.employee.id}/${bank_id}/Unauthorized/`, 'PUT')
            .then(json => {
                setIndex(1);
                window.location.reload(true);
            }).catch((error) => {console.log(error)})
    }

    //  Authorize the employee submitting the LC
    const Authorize = () => {
        makeAPIRequest(`/business/${employee.employee.id}/${bank_id}/Authorized/`, 'PUT')
            .then(json => {
                setIndex(0);
                window.location.reload(true);
            }).catch((error) => {console.log(error)})
    }

    return (
        <Fragment>
            <ListEntryWrapper>
                <ListEntryField>{employee.employee.name}</ListEntryField>
                <ListEntryField>{employee.employee.email}</ListEntryField>
                <ListEntryField>
               <StyledButton style = {{float: "left"}} selected={options[index] === "Authorized"} onClick={Authorize}>Authorize</StyledButton>
                    <StyledButton selected={options[index] === "Unauthorized"} onClick={() => {
                        if (options[index] !== "Unauthorized"){
                            setModal(true)
                        }
                    }}>Reject</StyledButton>
                </ListEntryField>
            </ListEntryWrapper>

            <Modal containerStyle={{width: "55%"}} show={modal === true}
                   title={"Unauthorize Employee"}
                   onCancel={() => setModal(false)}
                   onSelect={Reject}
                   selectButton={"Yes"}>
                <div>
                    Are you sure you want to unauthorize {employee.employee.name}? This will affect every other Letter of Credit they have applied for.
                </div>
            </Modal>
        </Fragment>
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
        makeAPIRequest(`/business/${client.id}/${bank_id}/authorized_employees/`).then(json => {
            setEmployees(json)
        })
    }, [client, bank_id])


    return (
        <BasicLayout
            title={"Authorized Employees"}
            isLoading={!employees}
            style = {{display: "inline"}}
            >
            {/* "Heading" of the feed - delete if you think it unnecessary*/}
            <div>
                <ListEntryWrapper header>
                    <ListEntryField>Employee</ListEntryField>
                    <ListEntryField>Email</ListEntryField>
                    <ListEntryField>Authorized</ListEntryField>
                </ListEntryWrapper>
            </div>
                    {employees.map(employee => <LCListEntry toChange = {toChange} setChange={setChange} employee={employee} setEmployees = {setEmployees} bank_id={bank_id} key={employee.email} edit={edit}/>)}

            {employees.length === 0 ? <center style={{ marginTop: '30px', fontStyle: 'italic', color: '#888' }}>This Business has no Employees</center> : null}
        </BasicLayout>
    )
}

const AdvisorClientFeed = ({match}) => {
    useAuthentication(`/bank/lcs/client/${match.params.clientid}`);
    const [user] = useContext(UserContext);
    const [client, setClient] = useState(null);
    useEffect(() => {
        makeAPIRequest(`/business/${match.params.clientid}/`)
            .then(json => setClient(json))
    }, [match.params.clientid])


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
        clientPage
        currentlyOnIssuer
        // switchLink={}
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
