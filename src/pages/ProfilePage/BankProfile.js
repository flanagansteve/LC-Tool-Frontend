import React, {useContext} from "react";
import BasicLayout from "../../components/BasicLayout";
import {useAuthentication, UserContext} from "../../utils/auth";
import styled from "styled-components";

const BankProfile = () => {
    useAuthentication("/bank/account");
    const [user, setUser] = useContext(UserContext);

    const Header = styled.h3`
  padding: 30px 0;
  font-size: 20px;
`;


    if (user) {
        return (
            <BasicLayout title={user.bank.name} isLoading={!user}>
                <div style={{
                    backgroundColor: "#fff",
                    padding: "10px 20px",
                    border: "1px solid #e5e4e2",
                    borderRadius: "25px"
                }}>
                    {/*<Header>Bank : {user.bank.name}</Header>*/}
                    <Header>Address : {user.bank.address}</Header>
                    <Header>POC : {user.bank.email}</Header>
                    {user.bank.website ? <Header>Website: <a href={user.bank.website}>{user.bank.website}</a> </Header> : null}

                </div>
            </BasicLayout>
        )
    }

    // not done Loading
    else {
        return (
            <div>

            </div>
        )
    }
}
export default BankProfile;
