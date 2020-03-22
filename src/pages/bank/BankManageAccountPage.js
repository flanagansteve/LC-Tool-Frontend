import React from 'react';

import BasicLayout from "../../components/BasicLayout";
import { useAuthentication } from '../../utils/auth';

const BankManageAccountPage = () => {
  useAuthentication("/bank/account");
  return <BasicLayout title="Manage Account 🛠" />;
}

export default BankManageAccountPage;