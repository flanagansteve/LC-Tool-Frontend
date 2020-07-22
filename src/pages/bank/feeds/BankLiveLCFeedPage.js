import React, { useContext } from "react";
import LCFeed from "./LCFeed";
import { get } from "lodash";
import { useAuthentication, UserContext } from "../../../utils/auth";



const BankLCAppFeedPage = () => {
  useAuthentication('/bank/lcs/live');
  const [user] = useContext(UserContext);
  const bankid = get(user, ['bank', 'id']);
  return <LCFeed 
    title="All Live LCs (Issuing) 📄"
    url={`/lc/by_bank/${bankid}/live/`}
    user={user}
    switchLink={"/bank/lcs/live/advisor"}
    currentlyOnIssuer
    />
}

export default BankLCAppFeedPage
