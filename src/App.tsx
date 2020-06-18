import React, { Fragment } from 'react';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

import LoginView from './components/LoginView/LoginView';
import RegisterView from './components/RegisterView/RegisterView';

function App() {
  return (
      <Fragment>
        <ToastContainer />
        <LoginView />
        {/* <RegisterView /> */}
      </Fragment>
  );
}

export default App;
