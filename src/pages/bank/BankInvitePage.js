import React from 'react';

import BasicLayout from "../../components/BasicLayout";
import { useAuthentication } from '../../utils/auth';

const BankInvitePage = () => {
  useAuthentication('/bank/invite');
  return <BasicLayout title="Invite your team 🚀"/>;
}

export default BankInvitePage;