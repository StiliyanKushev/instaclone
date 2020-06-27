import React, { Suspense, ComponentType } from 'react';
import {ToastContainer} from 'react-toastify';
import { CookiesProvider } from 'react-cookie';
import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { connect } from 'react-redux';
import { AppState, ReduxProps } from './reducers';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CustomRoute, { CustomRouteProps } from './shared/CustomRoute';

// IMPORT SOME GENERAL COMPONENTS
import LoadingView from './shared/LoadingView';
import NavMenu from './shared/NavMenu/NavMenu';
import Error404 from './shared/Error404';

// IMPORT ALL VIEWS
const LoginView = React.lazy(() => import('./components/LoginView/LoginView'));
const RegisterView = React.lazy(() => import('./components/RegisterView/RegisterView'));
const UserView = React.lazy(() => import('./components/UserView/UserView'));

/** TODO START */
const HomeView = () => {
  return (<p>Home View TODO</p>);
}
/** TODO END */

type IProps = ReduxProps & OtherReduxProps;

class App extends React.Component<IProps,any> {
  //acts like a computed property
  get isLogged(){
    return this.props.auth?.isLogged || false;
  }

  private privateOnly:CustomRouteProps = {
    condition: this.isLogged,
    redirectPath: '/login'
  }
  
  private publicOnly:CustomRouteProps = {
    condition:!this.isLogged,
    redirectPath: '/'
  }

  shouldComponentUpdate(nextProps:IProps){
    if(this.props.isAuthFinished !== nextProps.isAuthFinished && nextProps.isAuthFinished){
      return true;
    }
    else{
      return false;
    }
  }

  render(){
    return (
      <Suspense fallback={<LoadingView/>}>
        <CookiesProvider>
          <Router>
            <ToastContainer />
            <header>
              <NavMenu />
            </header>
            <main>
              <Switch>
                <CustomRoute exact path='/' component={HomeView} condition={this.isLogged} redirectPath="/login"/>
                <CustomRoute exact path='/login' component={LoginView} {...this.publicOnly}/>
                <CustomRoute exact path='/register' component={RegisterView} {...this.publicOnly}/>

                <CustomRoute exact path='/profile' component={UserView} {...this.privateOnly}/>

                <Route exact path='*' component={Error404}/>
              </Switch>
            </main>
          </Router>
        </CookiesProvider>
      </Suspense>
    );
  }
}

interface OtherReduxProps {
  isAuthFinished?: boolean
}

const mapStateToProps = (state:AppState):ReduxProps & OtherReduxProps => ({
  auth:state.auth,
  isAuthFinished:state.auth.isAuthFinished
})

export default connect(mapStateToProps,null)(App as ComponentType<IProps>);