import React, { useState, useContext, useEffect } from "react";
import LCFeed from "./LCFeed";
import { useAuthentication, UserContext } from "../../../utils/auth";
import { makeAPIRequest } from "../../../utils/api";


// Shows Bank All LCs for a Client
const BankLCAppFeedPage = ({ match }) => {
  useAuthentication(`/bank/lcs/client/${match.params.clientid}`);
  const [user] = useContext(UserContext);
  const [client, setClient] = useState(null);
  useEffect(() => {
    makeAPIRequest(`/business/${match.params.clientid}/`)
      .then(json => setClient(json))
  }, [match.params.clientid])
  const title = client ? `All LCs for ${client.name}` : `All LCs for Client #${match.params.clientid}`;
  return <LCFeed
    title={title}
    url={`/lc/by_client/${match.paramsclientid}/`}
    user={user}
    hideSearch
    />
}

export default BankLCAppFeedPage
