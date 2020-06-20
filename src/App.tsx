import React, { Fragment, Suspense } from 'react';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CustomRoute, { CustomRouteProps } from './shared/PrivateRoute';

// IMPORT SOME GENERAL COMPONENTS
import LoadingView from './shared/LoadingView';
import NavMenu from './components/NavMenu/NavMenu';

// IMPORT ALL VIEWS
const LoginView = React.lazy(() => import('./components/LoginView/LoginView'));
const RegisterView = React.lazy(() => import('./components/RegisterView/RegisterView'));


/** TODO START */
const isLogged = true;
const HomeView = () => {
  return (<p>Home View TODO</p>);
}
/** TODO END */

const privateOnly:CustomRouteProps = {
  condition: !isLogged,
  redirectPath: '/login'
}

const publicOnly:CustomRouteProps = {
  condition:!isLogged,
  redirectPath: '/'
}

function App() {
  return (
    <Suspense fallback={<LoadingView/>}>
      <Router>
        <ToastContainer />
        <header>
          <NavMenu />
        </header>
        <main>
          <Switch>
            <CustomRoute exact path='/' component={HomeView} condition={isLogged} redirectPath="/login"/>
            <CustomRoute exact path='/login' component={LoginView} {...publicOnly}/>
            <CustomRoute exact path='/register' component={RegisterView} {...publicOnly}/>
          </Switch>
        </main>
      </Router>
    </Suspense>
  );
}

export default App;