import React, { useContext } from "react";
import LCFeed from "./LCFeed";
import { get } from "lodash";
import { useAuthentication, UserContext } from "../../../utils/auth";

const BankLCAppFeedPage = ({ match }) => {
  console.log(match)
  useAuthentication('/bank/lcs');
  const [user] = useContext(UserContext);
  const bankid = get(user, ['bank', 'id']);
  return <LCFeed 
    title="All LC Applications and Live LCs 📝📄" 
    url={`/lc/by_bank/${bankid}/`}
    user={user}
    />
}

export default BankLCAppFeedPage