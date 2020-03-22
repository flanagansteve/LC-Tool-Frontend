import React from 'react';

import BasicLayout from "../../components/BasicLayout";
import { useAuthentication, UserContext } from '../../utils/auth';
import { useContext } from 'react';

const BankInvitePage = () => {
  useAuthentication('/bank/invite');
  const [user] = useContext(UserContext);
  return <BasicLayout title={`Welcome, ${user.name} 🚀`} subtitle="Invite your team to the platform." />;
}

export default BankInvitePage;