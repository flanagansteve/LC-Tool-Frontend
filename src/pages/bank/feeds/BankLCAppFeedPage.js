import React, { useContext } from "react";
import LCFeed from "./LCFeed";
import { get } from "lodash";
import { useAuthentication, UserContext } from "../../../utils/auth";

const BankLCAppFeedPage = () => {
  useAuthentication('/bank/lcs/apps');
  const [user] = useContext(UserContext);
  const bankid = get(user, ['bank', 'id']);
  return <LCFeed 
    title="All LC Applications 📝" 
    url={`/lc/by_bank/${bankid}/awaiting_issuer_approval/`}
    user={user}
    />
}

export default BankLCAppFeedPage
