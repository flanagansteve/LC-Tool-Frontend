import React from "react";

const BankEmployeeSignUpPage = ({ match }) => {
  return <div>{match.params.bankid}</div>;
};

export default BankEmployeeSignUpPage;