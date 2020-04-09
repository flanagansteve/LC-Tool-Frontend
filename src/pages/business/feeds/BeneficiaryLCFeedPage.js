import React, { useState, useContext, useEffect } from "react";
import BusinessLCFeed from "./BusinessLCFeed";
import { useAuthentication, UserContext } from "../../../utils/auth";
import { makeAPIRequest } from "../../../utils/api";
import { get } from 'lodash'

const BeneficiaryLCFeedPage = ({ match }) => {
  useAuthentication(`/business/lcs/beneficiary/`);
  const [user] = useContext(UserContext);
  const businessid = get(user, ['business', 'id']);
  const businessname = get(user, ['business', 'name']);

  const title = `All LCs for which ${businessname} is the named beneficiary`
  return <BusinessLCFeed
    title={title}
    url={`/lc/by_beneficiary/${businessid}/`}
    user={user}
    hideSearch
    />
}

export default BeneficiaryLCFeedPage
