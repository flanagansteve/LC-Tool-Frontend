import React, { useContext } from "react";
import LCFeed from "./LCFeed";
import { get } from "lodash";
import { useAuthentication, UserContext } from "../../../utils/auth";


// Shows Bank all Live LCs they are Advising for
const BankLiveLCFeedPageAdvisor = () => {
    useAuthentication('/bank/lcs/live');
    const [user] = useContext(UserContext);
    const bankid = get(user, ['bank', 'id']);
    return <LCFeed
        title="All Live LCs (Advising) 📄"
        url={`/lc/by_bank_advisor/${bankid}/live/`}
        user={user}
        switchLink={"/bank/lcs/live/issuer"}
        currentlyOnAdvising
    />
}

export default BankLiveLCFeedPageAdvisor;
