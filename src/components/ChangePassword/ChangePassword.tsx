// IMPORT STYLES
import styles from './ChangePassword.module.css';

// IMPORT REACT RELATED
import { withCookies, ReactCookieProps } from 'react-cookie';
import React, { FormEvent, ComponentType } from 'react';
import { Dimmer, Segment, Button, Icon, Form } from 'semantic-ui-react';

// IMPORT REDUX RELATED
import { connect } from 'react-redux';
import { AppActions } from '../../actions/types/actions';
import { ThunkDispatch } from 'redux-thunk';
import {bindActionCreators} from 'redux';
import {CHANGE_PASSWORD_AUTH} from '../../actions/authActions';
import { ReduxProps, AppState } from '../../reducers';

// IMPORT VALIDATION
import { validateChangePassword } from '../../validators/auth';
import { IValidationResult, IValidationResultErrors } from '../../types/form-validation';

// IMPORT OTHER
import { toast } from 'react-toastify';

interface IParentProps {
    handleClose: Function
}

type IProps = IParentProps & ReduxProps & DispatchProps & ReactCookieProps;

export interface IChangePasswordState{
    currentPassword:string,
    newPassword:string,
    repeatNewPassword:string,
    errors:IValidationResultErrors
}

class ChangePassword extends React.Component<IProps,IChangePasswordState> {
    state:IChangePasswordState = { currentPassword: '', newPassword: '', repeatNewPassword: '', errors: {}}

    private handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let result: IValidationResult = validateChangePassword(this.state);
        this.setState({errors:result.errors});
        
        if(result.success){
            this.props.changePassword(this.state,this.props.cookies?.get('email'));
        }
    }

    public componentDidUpdate(prevProps:IProps){
        //on props change
        if(this.props.auth !== prevProps.auth){
            if(!this.props.auth?.error){
                //if it was successfull
                if(this.props.auth?.isPasswordChanged){
                    toast.success(this.props.auth.messege);

                    //close menu
                    this.props.handleClose();
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
            <Dimmer active>
                <Segment size='tiny'>
                    <Icon onClick={this.props.handleClose} className={styles.closeIcon} color='black' size='big' name='close'></Icon>

                    <Form onSubmit={this.handleSubmit.bind(this)} id='change-password'>
                        <br />
                        <Form.Field>
                            <Form.Input
                                error={this.state.errors.currentPassword}
                                onChange={e => { this.setState({ currentPassword: e.target.value }) }}
                                placeholder='Current Password' 
                                type='password' 
                                autoComplete='on' />
                            <Form.Input
                                error={this.state.errors.newPassword}
                                onChange={e => { this.setState({ newPassword: e.target.value }) }} 
                                placeholder='New Password' 
                                type='password' 
                                autoComplete='on' />
                            <Form.Input 
                                error={this.state.errors.repeatNewPassword}
                                onChange={e => { this.setState({ repeatNewPassword: e.target.value }) }}
                                placeholder='Repeat Password' 
                                type='password' 
                                autoComplete='on' />
                        </Form.Field>
                    </Form>
                    <br />
                    <Button loading={this.props.auth?.isLoading} form='change-password' type='submit' fluid primary>Change password</Button>
                    <br />
                </Segment>
            </Dimmer>
        );
    }
}

const mapStateToProps = (state:AppState):ReduxProps => ({
    auth:state.auth
})

interface DispatchProps {
    changePassword: (state:IChangePasswordState,email:string) => void,
}

const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,AppActions>):DispatchProps => ({
    changePassword:bindActionCreators(CHANGE_PASSWORD_AUTH,dispatch),
})

export default withCookies(connect(mapStateToProps,mapDispatchToProps)(ChangePassword as ComponentType<IProps>));