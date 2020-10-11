// IMPORT STYLES
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-css/semantic.min.css';

// IMPORT REACT AND REACT SPECIFIC STUFF
import React, { ComponentType, Suspense } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { CookiesProvider } from 'react-cookie';

// IMPORT REDUX RELATED
import { connect } from 'react-redux';
import { AppState, ReduxProps } from './reducers';

// IMPORT SOME GENERAL COMPONENTS
import CustomRoute, { CustomRouteProps } from './shared/CustomRoute';
import LoadingView from './shared/LoadingView';
import NavMenu from './shared/NavMenu/NavMenu';
import Error404 from './shared/Error404';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';

// IMPORT ALL VIEWS
const HomeView = React.lazy(() => import('./components/HomeView/HomeView'));
const LoginView = React.lazy(() => import('./components/LoginView/LoginView'));
const RegisterView = React.lazy(() => import('./components/RegisterView/RegisterView'));
const UserView = React.lazy(() => import('./components/UserView/UserView'));
const PostPageView = React.lazy(() => import('./components/PostPageView/PostPageView'));
const ExploreView = React.lazy(() => import('./components/ExploreView/ExploreView'))

type IProps = ReduxProps & OtherReduxProps;

class App extends React.Component<IProps,any> {
  //acts like a computed property
  get isLogged(){
    return this.props.auth?.isLogged || false;
  }

  get privateOnly():CustomRouteProps {
    return {
      condition: this.isLogged,
      redirectPath: '/login'
    }
  }

  get publicOnly():CustomRouteProps {
    return {
      condition: !this.isLogged,
      redirectPath: '/'
    }
  }

  shouldComponentUpdate(nextProps:IProps){
    if(this.props.isAuthFinished !== nextProps.isAuthFinished){
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
            <input id='global-file-input' type="file" style={{display: 'none'}} />
            <ToastContainer />
            <header>
              <NavMenu />
            </header>
            <main>
              <Switch>
                <Route exact path='/forgot-password' component={ForgotPassword}/>
                
                <CustomRoute exact path='/' component={HomeView} condition={this.isLogged} redirectPath="/login"/>
                <CustomRoute exact path='/login' component={LoginView} {...this.publicOnly}/>
                <CustomRoute exact path='/register' component={RegisterView} {...this.publicOnly}/>

                <CustomRoute exact path='/profile/:name' component={UserView} {...this.privateOnly}/>
                <CustomRoute exact path='/post/:id' component={PostPageView} {...this.privateOnly}/>
                <CustomRoute exact path='/explore' component={ExploreView} {...this.privateOnly}/>

                <Route exact path='/404' component={Error404}/>
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