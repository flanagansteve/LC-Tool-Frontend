import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import GlobalStyle, { CSSReset } from './GlobalStyle'
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import Nav from './components/Nav';
import { UserContext } from './utils/auth';
import BankSignUpPage from './pages/bank/BankSignUpPage';
import BankInvitePage from './pages/bank/BankInvitePage';
import BankManageAccountPage from './pages/bank/BankManageAccountPage';
import BankLCAppFeedPage from './pages/bank/feeds/BankLCAppFeedPage';
import BankLiveLCFeedPage from './pages/bank/feeds/BankLiveLCFeedPage';
import BankLCFeedPage from './pages/bank/feeds/BankLCFeedPage';
import BankLCFeedPageByClient from './pages/bank/feeds/BankLCFeedPageByClient';
import BankLCViewPage from './pages/bank/BankLCViewPage';
import BankEmployeeSignUpPage from './pages/bank/BankEmployeeSignUpPage';
import BankLCAppPage from './pages/bank/BankLCAppPage';
import BusinessSignUpPage from './pages/business/BusinessSignUpPage';
import BusinessInvitePage from './pages/business/BusinessInvitePage';
import BusinessManageAccountPage from './pages/business/BusinessManageAccountPage';
import BusinessEmployeeSignUpPage from './pages/business/BusinessEmployeeSignUpPage';
import ClaimBeneficiaryStatusPage from './pages/business/beneficiary/ClaimBeneficiaryStatusPage';
import ClientLCFeedPage from './pages/business/feeds/ClientLCFeedPage';
import BeneficiaryLCFeedPage from './pages/business/feeds/BeneficiaryLCFeedPage';

// TODO It seems like having the presentational nav in this mostly-container
//      component is poor separation of concerns. Look into this.
function App() {
  const [user, setUser] = useState(null);
  // const [user, setUser] = useState(null);
  // TODO:
  //<Route path="/business/lcs/:lcid" component={BusinessLCViewPage} />
  //<Route path="/business/lcs" component={BusinessLCFeedPage} />

  return (
    <UserContext.Provider value={[user, setUser]}>
      <Router>
        <CSSReset />
        <GlobalStyle />
        <Nav user={user} setUser={setUser} />
        <Switch>
          <Route path="/create" />
          <Route path="/manage" />
          <Route path="/bank/register/:bankid" component={BankEmployeeSignUpPage} />
          <Route path="/bank/register" component={BankSignUpPage} />
          <Route path="/bank/invite" component={BankInvitePage} />
          <Route path="/bank/account" component={BankManageAccountPage} />
          <Route path="/bank/lc/:lcid" component={BankLCViewPage} />
          <Route path="/bank/lcs/client/:clientid" component={BankLCFeedPageByClient} />
          <Route path="/bank/lcs/live" component={BankLiveLCFeedPage} />
          <Route path="/bank/lcs/apps" component={BankLCAppFeedPage} />
          <Route path="/bank/lcs" component={BankLCFeedPage} />
          <Route path="/bank/:bankid/application" component={BankLCAppPage} />
          <Route path="/business/register/:businessid" component={BusinessEmployeeSignUpPage} />
          <Route path="/business/register" component={BusinessSignUpPage} />
          <Route path="/business/invite" component={BusinessInvitePage} />
          <Route path="/business/account" component={BusinessManageAccountPage} />
          <Route path="/business/claimBeneficiary/:lcid" component={ClaimBeneficiaryStatusPage} />
          <Route path="/business/lcs/client/" component={ClientLCFeedPage} />
          <Route path="/business/lcs/beneficiary/" component={BeneficiaryLCFeedPage} />
          <Route path="/business/lcs/" component={ClientLCFeedPage} />
          <Route path="/login" component={LoginPage}/>
          <Route path="/" component={HomePage} />
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
