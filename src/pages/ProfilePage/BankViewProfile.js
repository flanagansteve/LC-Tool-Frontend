import React, {useContext, useEffect, useState} from "react";
import BasicLayout from "../../components/BasicLayout";
import {useAuthentication, UserContext} from "../../utils/auth";
import styled from "styled-components";
import {makeAPIRequest} from "../../utils/api";

const BankViewProfile = ({match}) => {
    const [bank, setBank] = useState(null);
    const [user] = useContext(UserContext);
    useAuthentication("/bank/account");


    const Header = styled.h3`
  padding: 30px 0;
  font-size: 20px;
`;
    // TODO change API to just return the new LC after we update it
    const refreshLc = () => {
        makeAPIRequest(`/bank/${match.params.bankid}/`)
            .then(json => setBank(json))
    };

    useEffect(() => {
        if (user) {
            refreshLc();
        }
    }, [match.params.bankid, user?.id]);


    if (bank && user) {
        return (
            <BasicLayout title={bank.name} isLoading={!user}>
                <div style={{
                    backgroundColor: "#fff",
                    padding: "10px 20px",
                    border: "1px solid #e5e4e2",
                    borderRadius: "25px"
                }}>
                    {/*<Header>Bank : {user.bank.name}</Header>*/}
                    <Header>Address : {bank.address}</Header>
                    <Header>POC : {bank.email}</Header>
                    {bank.website ? <Header>Website: <a href={bank.website}>{bank.website}</a> </Header> : null}

                </div>
            </BasicLayout>
        )
    }
    // not done Loading return spinner
    else {
        return (
            <div>
            </div>
        )
    }
}
export default BankViewProfile;
