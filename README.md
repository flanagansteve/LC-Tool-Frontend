# Bountium Frontend

src
├── App.js <br>
├── App.test.js <br>
├── GlobalStyle.js <br>
├── components <br>
│   ├── BasicLayout.js <br>
│   ├── Nav.js <br>
│   ├── forms <br>
│   │   └── Inputs.js <br>
│   ├── lc
│   │   └── LCView.js
│   └── ui
│       ├── Button.js
│       ├── Dropdown.js
│       ├── Popup.js
│       ├── ResizableScreenDiv.js
│       ├── RouteBlockingPopup.js
│       └── StatusMessage.js
├── config.js
├── history.js
├── images
│   └── logo.png
├── index.js
├── pages
│   ├── HomePage
│   │   └── HomePage.js
│   ├── LCViewPage
│   │   ├── DocumentaryRequirements.js
│   │   ├── LCViewPage.js
│   │   ├── Panel.js
│   │   └── Pdf.js
│   ├── LoginPage
│   │   └── LoginPage.js
│   ├── bank
│   │   ├── BankEmployeeSignUpPage.js
│   │   ├── BankInvitePage.js
│   │   ├── BankLCAppPage.js
│   │   ├── BankManageAccountPage.js
│   │   ├── BankSignUpPage.js
│   │   └── feeds
│   │       ├── BankLCAppFeedPage.js
│   │       ├── BankLCFeedPage.js
│   │       ├── BankLCFeedPageByClient.js
│   │       ├── BankLiveLCFeedPage.js
│   │       └── LCFeed.js
│   └── business
│       ├── BusinessEmployeeSignUpPage.js
│       ├── BusinessInvitePage.js
│       ├── BusinessManageAccountPage.js
│       ├── BusinessSignUpPage.js
│       ├── beneficiary
│       │   └── ClaimBeneficiaryStatusPage.js
│       └── feeds
│           ├── BankDirectoryPage.js
│           ├── BeneficiaryLCFeedPage.js
│           ├── BusinessLCFeed.js
│           └── ClientLCFeedPage.js
├── setupProxy.js
├── setupTests.js
└── utils
    ├── api.js
    └── auth.js


LC Application: src/pages/bank/BankLCAppPage.js <br>

https://peaceful-journey-01245.herokuapp.com/https://hts.usitc.gov/api/search?query=${value} is the endpoint to grab the hts code/description based on search parameters (ask Rohil about server)


