import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import GlobalStyle, { CSSReset } from './GlobalStyle'
import HomePage from './HomePage/HomePage';
import LoginPage from './LoginPage/LoginPage';
import Nav from './components/Nav';
import BankSignUpPage from './BankSignUpPage/BankSignUpPage';
import BankInvitePage from './BankSignUpPage/BankInvitePage';
import { UserContext } from './utils/auth';


// TODO It seems like having the presentational nav in this mostly-container
//      component is poor separation of concerns. Look into this.
function App() {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={[user, setUser]}>
      <Router>
        <CSSReset />
        <GlobalStyle />
        <Nav />
        <Switch>
          <Route path="/create" />
          <Route path="/review" />
          <Route path="/manage" />
          <Route path="/bank/register">
            <BankSignUpPage />
          </Route>
          <Route path="/bank/invite">
            <BankInvitePage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
