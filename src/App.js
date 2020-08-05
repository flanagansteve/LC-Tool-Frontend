import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import GlobalStyle, {CSSReset} from './GlobalStyle'
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import Nav from './components/Nav';
import {UserContext} from './utils/auth';
import BankSignUpPage from './pages/bank/BankSignUpPage';
import BankInvitePage from './pages/bank/BankInvitePage';
import BankManageAccountPage from './pages/bank/BankManageAccountPage';
import BankLCAppFeedPage from './pages/bank/feeds/BankLCAppFeedPage';
import BankLiveLCFeedPage from './pages/bank/feeds/BankLiveLCFeedPage';
import BankClientFeedPage from './pages/bank/feeds/BankClientFeedPage';
import BankLCFeedPage from './pages/bank/feeds/BankLCFeedPage';
import BankLCFeedPageByClient from './pages/bank/feeds/BankLCFeedPageByClient';
import LCViewPage from './pages/LCViewPage/LCViewPage';
import BankEmployeeSignUpPage from './pages/bank/BankEmployeeSignUpPage';
import BankLCAppPage from './pages/bank/BankLCAppPage';
import BusinessSignUpPage from './pages/business/BusinessSignUpPage';
import BusinessInvitePage from './pages/business/BusinessInvitePage';
import BusinessManageAccountPage from './pages/business/BusinessManageAccountPage';
import BusinessEmployeeSignUpPage from './pages/business/BusinessEmployeeSignUpPage';
import ClaimBeneficiaryStatusPage from './pages/business/beneficiary/ClaimBeneficiaryStatusPage';
import ClientLCFeedPage from './pages/business/feeds/ClientLCFeedPage';
import BeneficiaryLCFeedPage from './pages/business/feeds/BeneficiaryLCFeedPage';
import BankDirectoryPage from './pages/business/feeds/BankDirectoryPage';
import AdvisorLCFeedPage from './pages/bank/feeds/AdvisorLCFeedPage';
import ManageClientFeed from "./pages/bank/feeds/ManageClientFeed";
import BankProfile from "./pages/ProfilePage/BankProfile";
import BusinessProfile from "./pages/ProfilePage/BusinessProfile";
import BankViewProfile from "./pages/ProfilePage/BankViewProfile";
import BankLiveLCFeedPageAdvisor from "./pages/bank/feeds/BankLiveLCFeedPageAdvisor";
import BankLCFeedPageAdvisor from "./pages/bank/feeds/BankLCFeedPageAdvisor";
import BankLCAppFeedPageAdvisor from "./pages/bank/feeds/BankLCAppFeedPageAdvisor";

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
        <CSSReset/>
        <GlobalStyle/>
        <Nav user={user} setUser={setUser}/>
        <Switch>
          <Route path="/create"/>
          <Route path="/manage"/>
          <Route path="/bank/register/:bankid/:lcid" component={BankEmployeeSignUpPage}/>
          <Route path="/bank/register/:bankid" component={BankEmployeeSignUpPage}/>
          <Route path="/bank/register" component={BankSignUpPage}/>
          <Route path="/bank/invite" render={props => user && user.business ? <Redirect to={"/business/invite"}/> :
            <BankInvitePage {...props}/>}/>
          <Route path="/bank/account" render={props => user && user.business ? <Redirect to={"/business/account"}/> :
            <BankManageAccountPage {...props}/>}/>
          <Route path="/bank/profile/:bankid" component={BankViewProfile}/>
          <Route path="/bank/profile" render={props => user && user.business ? <Redirect to={"/business/profile"}/> :
              <BankProfile {...props}/>}/>
          <Route path="/lc/:lcid" component={LCViewPage}/>
            <Route path="/bank/lcs/clients" render ={props => user && user.business ? <Redirect to={"/"}/> :
                <BankClientFeedPage {...props}/>} />
          <Route path="/bank/lcs/client/:clientid" render={props => user && user.business ? <Redirect to={"/"}/> :
            <BankLCFeedPageByClient {...props}/>}/>
          <Route path="/bank/lcs/live/advisor" render ={props => user && user.business ? <Redirect to={"/"}/> :
          <BankLiveLCFeedPageAdvisor {...props}/>}/>
          <Route path="/bank/lcs/live/issuer" render ={props => user && user.business ? <Redirect to={"/"}/> :
              <BankLiveLCFeedPage {...props}/>}/>
          <Route path="/bank/lcs/live" render={props => user && user.business ? <Redirect to={"/"}/> :
            <BankLiveLCFeedPage {...props}/>}/>
          <Route path="/bank/lcs/apps/issuer" render={props => user && user.business ? <Redirect to={"/"}/> :
              <BankLCAppFeedPage {...props}/>}/>
          <Route path="/bank/lcs/apps/advisor" render={props => user && user.business ? <Redirect to={"/"}/> :
              <BankLCAppFeedPageAdvisor {...props}/>}/>
          <Route path="/bank/lcs/apps" render={props => user && user.business ? <Redirect to={"/"}/> :
            <BankLCAppFeedPage {...props}/>}/>
          <Route path="/bank/lcs/advisor" render={props => user && user.business ? <Redirect to={"/"}/> :
              <BankLCFeedPageAdvisor {...props}/>}/>
          <Route path="/bank/lcs/issuer" render={props => user && user.business ? <Redirect to={"/"}/> :
              <BankLCFeedPage {...props}/>}/>
          <Route path="/bank/lcs" render={props => user && user.business ? <Redirect to={"/"}/> :
              <BankLCFeedPage {...props}/>}/>
          <Route path="/bank/:bankid/application"
                 render={props => user && user.bank ? <Redirect to={"/"}/> : <BankLCAppPage {...props}/>}/>
          <Route path = "/bank/client/:clientid" render ={props => user && user.business ? <Redirect to={"/"}/> :
             <ManageClientFeed {...props}/>} />
          <Route path="/business/register/:businessid/:lcid" component={BusinessEmployeeSignUpPage}/>
          <Route path="/business/register/:businessid" component={BusinessEmployeeSignUpPage}/>
          <Route path="/business/profile" render={props => user && user.bank ? <Redirect to={"/bank/profile"}/> :
              <BusinessProfile {...props}/>}/>
          <Route path="/business/register" component={BusinessSignUpPage}/>
          <Route path="/business/invite" render={props => user && user.bank ? <Redirect to={"/bank/invite"}/> :
            <BusinessInvitePage {...props}/>}/>

          <Route path="/business/account" render={props => user && user.bank ? <Redirect to={"/bank/account"}/> :
            <BusinessManageAccountPage {...props}/>}/>
          <Route path="/business/claimBeneficiary/:lcid" render={props => user && user.bank ? <Redirect to={"/"}/> :
            <ClaimBeneficiaryStatusPage {...props}/>}/>
          <Route path="/business/lcs/client/" render={props => user && user.bank ? <Redirect to={"/"}/> :
            <ClientLCFeedPage {...props}/>}/>
          <Route path="/business/lcs/beneficiary/" render={props => user && user.bank ? <Redirect to={"/"}/> :
            <BeneficiaryLCFeedPage {...props}/>}/>
          <Route path="/business/lcs/" render={props => user && user.bank ? <Redirect to={"/"}/> :
            <ClientLCFeedPage {...props}/>}/>
          <Route path="/banks" render={props => user && user.bank ? <Redirect to={"/"}/> :
            <BankDirectoryPage {...props}/>}/>
          <Route path="/login" component={LoginPage}/>
          <Route path="/" component={HomePage}/>
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
