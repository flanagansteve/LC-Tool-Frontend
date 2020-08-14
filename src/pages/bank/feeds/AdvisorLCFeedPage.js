import React, { useContext } from "react";
import LCFeed from "./LCFeed";
import { get } from "lodash";
import { useAuthentication, UserContext } from "../../../utils/auth";
import BusinessLCFeed from "../../business/feeds/BusinessLCFeed";

// Shows banks application lcs they are advising for
const AdvisorLCFeedPage = ({ match }) => {
    useAuthentication('/bank/lcs');
    const [user] = useContext(UserContext);
    const bankid = get(user, ['bank', 'id']);
    return <LCFeed
        title="All LC Applications Advising 📝📄"
        url={`/lc/by_bank_advisor/${bankid}/`}
        user={user}
        hideSearch
    />
}

export default AdvisorLCFeedPage
