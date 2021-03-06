// IMPORT STYLES
import styles from './LoginView.module.css';
import SideImage from '../../assets/image-login.png';

// IMPORT REACT RELETED
import { withCookies, ReactCookieProps } from 'react-cookie';
import React, { FormEvent, ComponentType } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Image, Grid, Header, Form, Button, Segment } from 'semantic-ui-react';

// IMPORT REDUX RELETED
import { connect } from 'react-redux';
import { AppActions } from '../../actions/types/actions';
import { ThunkDispatch } from 'redux-thunk';
import {bindActionCreators} from 'redux';
import { AppState, ReduxProps } from '../../reducers';
import { LOGIN_AUTH, FINISH_AUTH } from '../../actions/authActions';

// IMPORT VALIDATIONS
import { validateLogin } from '../../validators/auth';
import { IValidationResult, IValidationResultErrors } from '../../types/form-validation';

// IMPORT OTHER
import { toast } from 'react-toastify';
import { saveUser } from '../../handlers/serializationData';

type IProps = ReduxProps & DispatchProps & ReactCookieProps & RouteComponentProps;

export interface ILoginState{
    email:string,
    password:string,
    errors:IValidationResultErrors
}

class LoginView extends React.Component<IProps,ILoginState>{
    state:ILoginState = {email: '',password:'',errors:{}}

    private handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault();

        let result: IValidationResult = validateLogin(this.state);
        this.setState({errors:result.errors});

        if(result.success){
            this.props.login(this.state);
        }
    }

    public componentDidUpdate(prevProps:IProps){
        //on props change
        if(this.props.auth !== prevProps.auth){
            if(!this.props.auth?.error){
                //if it was successfull
                if(this.props.auth?.isLogged){
                    toast.success(this.props.auth.messege);
                    
                    //save user in cookies
                    saveUser(this.props.auth.email,this.props.auth.username,this.props.auth.token,this.props.auth.userId);

                    //redirect to home and update app only after success msg is shown
                    this.props.history.push('/');
                    this.props.finishAuth();
                }
            }
            //display backend error
            else{
                toast.error(this.props.auth.messege);
            }
        }
    }

    public render(){
        return (
            <Grid className={styles.grid} stackable centered>
                <Grid.Row className={styles.gridRow}>
                    <Grid.Column className={styles.image} verticalAlign="middle" width="8">
                        <Image src={SideImage} size="large"></Image>
                    </Grid.Column>
                    <Grid.Column verticalAlign="middle" width="8">
                        <Header className={`logo-text ${styles.header}`} as="h1">Instaclone</Header>
                        <Form id='login-form' onSubmit={this.handleSubmit.bind(this)}>
                            <Form.Field>
                                <Form.Input
                                    onChange={e => {this.setState({email:e.target.value})}}
                                    error={this.state.errors.email}
                                    icon='user'
                                    iconPosition='left'
                                    type='email'
                                    autoComplete='on'
                                    placeholder="Email" />
                            </Form.Field>
                            <Form.Field>
                                <Form.Input
                                    error={this.state.errors.password}
                                    onChange={e => {this.setState({password:e.target.value})}}
                                    icon='key'
                                    iconPosition='left'
                                    type='password'
                                    autoComplete='on'
                                    placeholder="Password" />
                            </Form.Field>

                            <Segment>
                                <Button loading={this.props.auth?.isLoading} form='login-form' type='submit' fluid color="twitter">Login</Button>      
                            </Segment>

                            <Segment>
                                <Link to='/forgot-password'>Forgot password?</Link>
                            </Segment>
                        </Form>
                        <div className="ui message">
                            New to us? <Link to='/register'>Sign Up</Link>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

const mapStateToProps = (state:AppState):ReduxProps => ({
    auth:state.auth
})

interface DispatchProps {
    login: (state:ILoginState) => void,
    finishAuth: () => void
}

const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,AppActions>):DispatchProps => ({
    login:bindActionCreators(LOGIN_AUTH,dispatch),
    finishAuth:bindActionCreators(FINISH_AUTH,dispatch)
})

export default withRouter(withCookies(connect(mapStateToProps,mapDispatchToProps)(LoginView as ComponentType<IProps>)));