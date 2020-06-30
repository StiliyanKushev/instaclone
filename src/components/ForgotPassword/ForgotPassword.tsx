import React, { ComponentType, FormEvent } from 'react';
import { Segment, Icon, Header, Form, Button, Divider } from 'semantic-ui-react';

import styles from './ForgotPassword.module.css';
import {RESET_FORGOTTEN_PASSWORD_AUTH} from '../../actions/authActions';
import {bindActionCreators} from 'redux';
import { IValidationResultErrors, IValidationResult } from '../../types/form-validation';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { ReduxProps, AppState } from '../../reducers';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../actions/types/actions';
import { validateForgotPassword } from '../../validators/auth';
import { toast } from 'react-toastify';

export interface IForgotPasswordState{
    email:string,
    errors:IValidationResultErrors
}

type IProps = ReduxProps & DispatchProps & RouteComponentProps;

class ForgotPassword extends React.Component<IProps,IForgotPasswordState> {
    state:IForgotPasswordState = {email: this.props.auth?.email || '',errors:{}}
    
    private handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault();

        let result: IValidationResult = validateForgotPassword(this.state);
        this.setState({errors:result.errors});

        if(result.success){
            this.props.resetForgottenPassword(this.state);
        }
    }

    public componentDidUpdate(prevProps:IProps){
        //on props change
        if(this.props.auth !== prevProps.auth){
            if(!this.props.auth?.error){
                //if it was successfull
                if(this.props.auth?.isPasswordReseted){
                    toast.success(this.props.auth.messege);
                }
            }
            //display backend error
            else{
                toast.error(this.props.auth.messege);
            }
        }
    }
    
    public render() {
        return (
            <div className={styles.container}>
                <div>
                    <Segment textAlign='center' attached='top'>
                        <Icon name='lock' size='huge' circular></Icon>
                        <Header as='h1' size='medium'>Trouble Logging In?</Header>
                        <Header as='h2' disabled size='tiny'>Enter your email and we'll send you a new password.</Header>
                        <Form id='forgot-password' onSubmit={this.handleSubmit.bind(this)}>
                            <Form.Field>
                                <Form.Input
                                    onChange={e => {this.setState({email:e.target.value})}}
                                    error={this.state.errors.email}
                                    icon='user'
                                    iconPosition='left'
                                    type='email'
                                    autoComplete='on'
                                    placeholder="Email" 
                                ></Form.Input>
                                <Button loading={this.props.auth?.isLoading} form='forgot-password' fluid primary>Send password</Button>
                            </Form.Field>
                            <Divider horizontal>OR</Divider>
                            <Button onClick={() => this.props.history.push('/register')} fluid secondary>Create new account</Button>
                        </Form>
                    </Segment>
                    <Segment textAlign='center' attached='bottom'>
                        <Button onClick={() => this.props.history.push('/login')} fluid>Back to Login</Button>
                    </Segment>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state:AppState):ReduxProps => ({
    auth:state.auth
})

interface DispatchProps {
    resetForgottenPassword: (state:IForgotPasswordState) => void,
}

const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,AppActions>):DispatchProps => ({
    resetForgottenPassword:bindActionCreators(RESET_FORGOTTEN_PASSWORD_AUTH,dispatch),
})

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ForgotPassword as ComponentType<IProps>));