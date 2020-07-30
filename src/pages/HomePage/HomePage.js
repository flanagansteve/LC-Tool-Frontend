import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { useAuthentication, UserContext } from "../../utils/auth";

const HomePage = () => {
  useAuthentication('/');
  const [user] = useContext(UserContext);

  return (
    user ? <Redirect to={`/${user.business ? "business" : "bank"}/lcs`}/> : <div/>
  );
};

export default HomePage;
