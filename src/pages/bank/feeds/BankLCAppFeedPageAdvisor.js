import React, { useContext } from "react";
import LCFeed from "./LCFeed";
import { get } from "lodash";
import { useAuthentication, UserContext } from "../../../utils/auth";

// show banks all lc applications they are advising for
const BankLCAppFeedPage = () => {
    useAuthentication('/bank/lcs/apps');
    const [user] = useContext(UserContext);
    const bankid = get(user, ['bank', 'id']);
    return <LCFeed
        title="All LC Applications (Advising) 📝"
        url={`/lc/by_bank_advisor/${bankid}/awaiting_issuer_approval/`}
        user={user}
        switchLink={"/bank/lcs/apps/issuer"}
    />
}

export default BankLCAppFeedPage
