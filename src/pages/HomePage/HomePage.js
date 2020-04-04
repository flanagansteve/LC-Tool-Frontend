import React from "react";
import { Redirect } from "react-router-dom";
import { useAuthentication } from "../../utils/auth";

const HomePage = () => {
  useAuthentication('/');
  return (
    <Redirect to="/bank/lcs"/>
  );
};

export default HomePage;
