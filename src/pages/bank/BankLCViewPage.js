import React, { useContext, useState, useEffect } from "react";
// import styled from "styled-components";

import { makeAPIRequest } from '../../utils/api';
import { useAuthentication, UserContext } from "../../utils/auth";
import LCView from "../../components/lc/LCView";

const BankLCViewPage = ( {match} ) => {
  useAuthentication(`/bank/lcs/${match.params.lcid}`);
  const [user] = useContext(UserContext);
  const [lc, setLc] = useState(null);

  useEffect(() => {
    makeAPIRequest(`/lc/${match.params.lcid}/`)
      .then(json => setLc(json))
  }, [match.params.lcid])
  console.log(lc)

  return (
    <LCView lc={lc}>
    {lc && <div>
      <p>the lc requested by {lc.client.name} and {user && user.name}</p>
    </div>}
    </LCView>
  )

}

export default BankLCViewPage
