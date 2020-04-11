import React, { useContext } from "react";
import BusinessLCFeed from "./BusinessLCFeed";
import { useAuthentication, UserContext } from "../../../utils/auth";
import { get } from "lodash";

const ClientLCFeedPage = ({ match }) => {
  useAuthentication(`/business/lcs/client/`);
  const [user] = useContext(UserContext);
  const businessid = get(user, ['business', 'id']);
  const businessname = get(user, ['business', 'name']);

  const title = `All LCs ${businessname} has applied or been approved for`
  return <BusinessLCFeed
    title={title}
    url={`/lc/by_client/${businessid}/`}
    user={user}
    hideSearch
    currentlyOnClient
    />
}

export default ClientLCFeedPage
