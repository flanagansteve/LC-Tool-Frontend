import React, { useEffect, useContext, useState } from 'react';
import { get } from 'lodash';
import styled from 'styled-components';

import BasicLayout from '../../../components/BasicLayout';
import { useAuthentication, UserContext } from '../../../utils/auth';
import { makeAPIRequest } from '../../../utils/api';
import Button from '../../../components/ui/Button';
import StatusMessage from '../../../components/ui/StatusMessage';

const ClaimMessage = styled.div`
  font-weight: 300;
  max-width: 600px;
  text-align: center;
  margin: auto auto 20px;
  font-size: 18px;
`

const useStatus = (init) => {
  const [status, setStatus] = useState(init || {status: null, message: ''});
  return {
    status,
    setSuccess: (msg) => setStatus({status: 'success', message: msg}),
    setError: (msg) => setStatus({status: 'error', message: msg}),
    clearStatus: () => setStatus({status: null, message: ''}),
  }
}

const ClaimBeneficiaryStatusPage = ({ match, history }) => {
  const lcid = match.params.lcid;
  useAuthentication(`/business/claimBeneficiary/${lcid}`);
  const [lc, setLc] = useState(null);
  const [user] = useContext(UserContext);
  const { status, setError, setSuccess } = useStatus();

  useEffect(() => {
    makeAPIRequest(`/lc/${lcid}/`, 'GET')
      .then(json => setLc(json));
  }, [lcid])

  const handleClick = () => {
    makeAPIRequest(`/lc/${lcid}/claim_beneficiary/`, 'POST')
      .then(() => setSuccess('Congratulations! You have claimed beneficiary status on this order.'))
      .catch(async (res) => {
        const a = await res.text();
        if (a.length > 250) setError('There was an error claiming beneficiary status.')
        else setError('There was an error claiming beneficiary status: ' + res.error)
      })
  }

  return (
    <BasicLayout
      title="Claim Beneficiary Status"
      isLoading={!(user && lc)}
    >
      <ClaimMessage>
        {`Are you a representative of ${get(user, 'business.name')}, selling ${lc && lc.purchasedItem ? `${get(lc, 'unitsPurchased')}
         ${get(lc, 'unitOfMeasure')} of ${get(lc, 'purchasedItem')} ` : ''}to ${get(lc, 'client.name')}${lc && lc.dueDate ? 
         `, due by ${get(lc, 'dueDate')}` : ''}?`}
      </ClaimMessage>
      <center><Button onClick={handleClick}>Yes, Claim Beneficiary Status</Button></center>
      {status.status && <StatusMessage status={status.status}>{status.message}</StatusMessage>}
    </BasicLayout>
  )
}

export default ClaimBeneficiaryStatusPage;
