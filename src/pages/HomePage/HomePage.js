import React from "react";
import { useAuthentication } from "../../utils/auth";

const HomePage = () => {
  useAuthentication();
  return (
      <div>Hello world!</div>
  );
};

export default HomePage;
