import React, { useContext } from "react";
import LCFeed from "./LCFeed";
import { get } from "lodash";
import { useAuthentication, UserContext } from "../../../utils/auth";
import ClientFeed from "./ClientFeed";

const BankClientFeedPage = () => {
    useAuthentication('/bank/lcs/live');
    const [user] = useContext(UserContext);
    const bankid = get(user, ['bank', 'id']);
    return <ClientFeed
        title="All Clients 📄"
        url={`/lc/clients_by_bank/${bankid}/`}
        user={user}
    />
}

export default BankClientFeedPage
