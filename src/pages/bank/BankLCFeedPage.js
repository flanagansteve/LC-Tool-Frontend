import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { string, object, ref } from 'yup';

import BasicLayout from "../../components/BasicLayout";
import { makeAPIRequest } from '../../utils/api';
import { useAuthentication, UserContext } from "../../utils/auth";
import Button from "../../components/ui/Button";

const renderLc = (lc) => {
  {/*NOTE:due_date and credit_amt will only be available for DigitalLCs*/}
  return (
    <a href={`/bank/lcs/${lc.id}`}>
      <ul>
        <li>{lc.client}</li>
        <li>{lc.beneficiary}</li>
        <li>{lc.application_date}</li>
        <li>{lc.due_date}</li>
        <li>{lc.credit_amt}</li>
      </ul>
    </a>
  )
}

const BankLCFeedPage = ( {match} ) => {
  useAuthentication('/bank/lcs');
  const [user] = useContext(UserContext);
  const [lcs, setLcs] = useState(null);

  useEffect(() => {
    makeAPIRequest(`/lc/by_bank/${user.bank}/`)
      .then(json => setLcs(json))
  }, [match.params.bankid])
  console.log(lcs)
  console.log(user)

  return (
    <BasicLayout
      title="Let's get to work!"
      subtitle="Find the LC you need below."
    >
    {/* "Heading" of the feed - delete if you think it unnecessary*/}
    <div>
      <ul>
        <li>Client</li>
        <li>Beneficiary</li>
        <li>Applied</li>
        <li>Due</li>
        <li>Transaction Size</li>
      </ul>
    </div>
    {(lcs && user) && <div>
    {lcs.map(lc => renderLc(lc))}
    </div>}
    </BasicLayout>
  )

}

export default BankLCFeedPage
