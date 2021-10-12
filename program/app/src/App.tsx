import { FC } from "react";
import WalletContext from "./WalletContext";
import Header from "./Header";
import Craft from "./Craft";
import Mine from "./Mine";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export const App: FC = () => {
  return (
    <WalletContext>
      <Router>
        <Header />
        <Switch>
          <Route path="/craft">
            <Craft />
          </Route>
          <Route path="/mine">
            <Mine />
          </Route>
        </Switch>
      </Router>
    </WalletContext>
  );
};

export default App;
