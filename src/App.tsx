import React, { Fragment } from 'react';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

import LoginView from './components/LoginView/LoginView';
import RegisterView from './components/RegisterView/RegisterView';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CustomRoute, { CustomRouteProps } from './shared/PrivateRoute';


/** TODO START */
const isLogged = true;
const HomeView = () => {
  return (<p>Home View TODO</p>);
}
/** TODO END */

const privateOnly:CustomRouteProps = {
  condition: isLogged,
  redirectPath: '/login'
}

const publicOnly:CustomRouteProps = {
  condition:isLogged,
  redirectPath: '/'
}

function App() {
  return (
    <Router>
      <ToastContainer />
      <main>
        <Switch>
          <CustomRoute exact path='/' component={HomeView} condition={isLogged} redirectPath="/login"/>
          <CustomRoute exact path='/login' component={LoginView} {...publicOnly}/>
          <CustomRoute exact path='/register' component={RegisterView} {...publicOnly}/>
        </Switch>
      </main>
    </Router>
  );
}

export default App;