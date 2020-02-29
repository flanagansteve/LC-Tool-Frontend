import React from "react";
import { useAuthentication } from "../utils/auth";

const HomePage = () => {
  useAuthentication();
  return (
    <body>
      <div>Hello world!</div>
    </body>
  );
};

export default HomePage;
