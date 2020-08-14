# Bountium Frontend

src <br>
├── App.js <br>
├── App.test.js <br>
├── GlobalStyle.js <br>
├── components: Contains all the UI Components that are reused throughout the Front End <br>
    ├── BasicLayout.js <br>
    ├── Nav.js <br>
    ├── forms <br>
        └── Inputs.js <br>
    ├── lc <br>
        └── LCView.js <br>
    └── ui <br>
        ├── Button.js <br>
        ├── Dropdown.js <br>
        ├── Popup.js <br>
        ├── ResizableScreenDiv.js <br>
        ├── RouteBlockingPopup.js <br>
        └── StatusMessage.js <br>
├── config.js <br>
├── history.js <br>
├── images <br>
    └── logo.png <br>
├── index.js <br>
├── pages : the page displayed for Businesses and Banks<br> 
    ├── HomePage <br>
        └── HomePage.js <br>
    ├── LCViewPage <br>
        ├── DocumentaryRequirements.js : Displays the Documentary Requirements on the LCViewPage <br>
        ├── LCViewPage.js Page that displays all the specifics of a selected LC <br>
        ├── Panel.js <br>
        └── Pdf.js <br>
    ├── LoginPage <br>
        └── LoginPage.js : Logging into LC Tool <br>
    ├── bank <br>
        Sign up Page for Banks
        ├── BankEmployeeSignUpPage.js <br>
        ├── BankInvitePage.js <br>
        ├── BankLCAppPage.js <br>
        ├── BankManageAccountPage.js <br>
        ├── BankSignUpPage.js <br> 
        └── feeds <br>
            Displays for Bank Viewing LCs and Clients (this structure is a bit outdated as there are a few additional pages)
            ├── AdvisorLCFeedPage.js <br>
            ├── BankClientFeedPage.js <br>
            ├── BankLCAppFeedPage.js <br>
            ├── BankLCAppFeedPageAdvisor.js <br>
            ├── BankLCFeedPage.js <br>
            ├── BankLCFeedPageAdvisor.js <br>
            ├── BankLCFeedPageByClient.js <br>
            ├── BankLiveLCFeedPage.js <br>
            ├── BankLiveLCFeedPageAdvisor.js <br>
            ├── ClientFeed.js <br>
            └── LCFeed.js <br>
            └── ManageClientFeed.js <br>
 
    └── business <br>
        ├── BusinessEmployeeSignUpPage.js <br>
        ├── BusinessInvitePage.js <br>
        ├── BusinessManageAccountPage.js <br>
        ├── BusinessSignUpPage.js <br>
        ├── beneficiary <br>
        │   └── ClaimBeneficiaryStatusPage.js <br>
        └── feeds <br>
            ├── BankDirectoryPage.js <br>
            ├── BeneficiaryLCFeedPage.js <br>
            ├── BusinessLCFeed.js <br>
            └── ClientLCFeedPage.js <br>
├── setupProxy.js <br>
├── setupTests.js <br>
└── utils <br>
    ├── api.js <br>
    └── auth.js <br>







LC Application: src/pages/bank/BankLCAppPage.js <br>

https://peaceful-journey-01245.herokuapp.com/https://hts.usitc.gov/api/search?query=${value} is the endpoint to grab the hts code/description based on search parameters (ask Rohil about server)


