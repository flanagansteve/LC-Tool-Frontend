import React, { useContext } from "react";
import LCFeed from "./LCFeed";
import { get } from "lodash";
import { useAuthentication, UserContext } from "../../../utils/auth";
import BusinessLCFeed from "../../business/feeds/BusinessLCFeed";

// show banks ALL LCs they are issuing for
const BankLCAppFeedPage = ({ match }) => {
  useAuthentication('/bank/lcs');
  const [user] = useContext(UserContext);
  const bankid = get(user, ['bank', 'id']);
  return <LCFeed 
    title="All LC Applications and Live LCs (Issuing) 📝📄"
    url={`/lc/by_bank/${bankid}/`}
    user={user}
    currentlyOnIssuer
    switchLink={"/bank/lcs/advisor"}
  />
}

export default BankLCAppFeedPage
