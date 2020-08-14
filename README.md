# Bountium Frontend

src <br>
├── App.js : Information about React Routes <br>
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
    ├── LCViewPage : Pages that display the specifics of an LC <br>
        ├── DocumentaryRequirements.js : Displays the Documentary Requirements on the LCViewPage <br>
        ├── LCViewPage.js <br>
        ├── Panel.js <br>
        └── Pdf.js <br>
    ├── LoginPage <br>
        └── LoginPage.js : Logging into LC Tool <br>
    ├── bank <br>
        Sign up Page for Banks and their Employeess <br>
        ├── BankEmployeeSignUpPage.js <br>
        ├── BankInvitePage.js <br>
        ├── BankLCAppPage.js : Application for Business Applying for LC <br>
        ├── BankManageAccountPage.js <br>
        ├── BankSignUpPage.js <br> 
        └── feeds <br>
            General Displays for Bank Viewing LCs and Clients <br>
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
            └── LCFeed.js : Component for viewing all the LCs as cards <br>
            └── ManageClientFeed.js <br>
 
    └── business <br>
        sign up pages for businesses and their employees <br>
        ├── BusinessEmployeeSignUpPage.js <br>
        ├── BusinessInvitePage.js <br>
        ├── BusinessManageAccountPage.js <br>
        ├── BusinessSignUpPage.js <br>
        ├── beneficiary <br>
        │   └── ClaimBeneficiaryStatusPage.js <br>
        └── feeds:  <br> 
            ├── BankDirectoryPage.js <br>
            ├── BeneficiaryLCFeedPage.js <br>
            ├── BusinessLCFeed.js <br>
            └── ClientLCFeedPage.js <br>
├── setupProxy.js <br>
├── setupTests.js <br>
└── utils <br>
    ├── api.js <br>
    └── auth.js <br>


FAQ: <br>

in src/pages/bank/BankLCAppPage.js: <br>

https://peaceful-journey-01245.herokuapp.com/https://hts.usitc.gov/api/search?query=${value} is the endpoint to grab the hts code/description based on search parameters from the government server (ask Rohil about heroku server details/credentials) <br>

Forms Using Formik API (visit [](https://formik.org/)) for more details <br>


