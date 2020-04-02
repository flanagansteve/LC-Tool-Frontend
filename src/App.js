import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import GlobalStyle, { CSSReset } from './GlobalStyle'
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import Nav from './components/Nav';
import BankSignUpPage from './pages/bank/BankSignUpPage';
import BankInvitePage from './pages/bank/BankInvitePage';
import BankManageAccountPage from './pages/bank/BankManageAccountPage';
import BankLCFeedPage from './pages/bank/BankLCFeedPage';
import BankLCViewPage from './pages/bank/BankLCFeedPage';
import BankEmployeeSignUpPage from './pages/bank/BankEmployeeSignUpPage';
import BankLCAppPage from './pages/bank/BankLCAppPage';
import { UserContext } from './utils/auth';

// TODO It seems like having the presentational nav in this mostly-container
//      component is poor separation of concerns. Look into this.
function App() {
  const [user, setUser] = useState(null);
  // const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <Router>
        <CSSReset />
        <GlobalStyle />
        <Nav user={user} setUser={setUser} />
        <Switch>
          <Route path="/create" />
          <Route path="/review" />
          <Route path="/manage" />
          <Route path="/bank/register/:bankid" component={BankEmployeeSignUpPage} />
          <Route path="/bank/register" component={BankSignUpPage} />
          <Route path="/bank/invite" component={BankInvitePage} />
          <Route path="/bank/account" component={BankManageAccountPage} />
          <Route path="/bank/lcs/:lcid" component={BankLCViewPage} />
          <Route path="/bank/lcs" component={BankLCFeedPage} />
          <Route path="/bank/:bankid/application" component={BankLCAppPage} />
          <Route path="/login" component={LoginPage}/>
          <Route path="/" component={HomePage} />
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
