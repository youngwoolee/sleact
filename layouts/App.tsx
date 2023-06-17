import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';
const LogIn = loadable(() => import('@pages/LogIn'));
const Channel = loadable(() => import('@pages/Channel'));
const SignUp = loadable(() => import('@pages/SignUp'));

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="login" />
      <Route path="/login" component={LogIn} />
      <Route path={'/signup'} component={SignUp} />
      <Route path={'/workspace/channel'} component={Channel} />
    </Switch>
  );
};

export default App;
