import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { string, object, ref } from 'yup';

import BasicLayout from "../../components/BasicLayout";
import { makeAPIRequest } from '../../utils/api';
import { useAuthentication, UserContext } from "../../utils/auth";
import Button from "../../components/ui/Button";

const BankLCViewPage = ( {match} ) => {
  useAuthentication(`/bank/lcs/${match.params.lcid}`);
  const [user] = useContext(UserContext);
  const [lc, setLc] = useState(null);

  useEffect(() => {
    makeAPIRequest(`/lc/${match.params.lcid}/`)
      .then(json => setLc(json))
  }, [match.params.bankid])
  console.log(lc)

  return (
    <BasicLayout
      title="i dont know what to title this"
      subtitle="and SURELY dont know what to subtitle it"
    >
    {lc && <div>
      <p>the lc requested by {lc.client}</p>
    </div>}
    </BasicLayout>
  )

}

export default BankLCViewPage
