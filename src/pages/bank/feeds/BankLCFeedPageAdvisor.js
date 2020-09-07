import React, { useContext } from "react";
import LCFeed from "./LCFeed";
import { get } from "lodash";
import { useAuthentication, UserContext } from "../../../utils/auth";
import BusinessLCFeed from "../../business/feeds/BusinessLCFeed";

const BankLCAppFeedPage = ({ match }) => {
    useAuthentication('/bank/lcs');
    const [user] = useContext(UserContext);
    const bankid = get(user, ['bank', 'id']);
    return <LCFeed
        title="All LC Applications and Live LCs (Advising) 📝📄"
        url={`/lc/by_bank_advisor/${bankid}/`}
        user={user}
        switchLink={"/bank/lcs/issuer"}
    />
}

export default BankLCAppFeedPage;
