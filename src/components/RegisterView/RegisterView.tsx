import React, { createRef, FormEvent, ComponentType } from 'react';
import { withCookies, ReactCookieProps } from 'react-cookie';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import { toast } from 'react-toastify';
import $ from 'jquery';

import styles from './RegisterView.module.css';
import selfie1 from '../../assets/selfie1.png';
import selfie2 from '../../assets/selfie2.png';
import selfie3 from '../../assets/selfie3.png';

import {validateRegister} from '../../validators/auth';
import { IValidationResult, IValidationResultErrors } from '../../types/form-validation';

import { Image, Grid, Header, Form, Button, Segment, Icon, Divider, Ref } from 'semantic-ui-react';

import { ReduxProps, AppState } from '../../reducers';
import { saveUser } from '../../handlers/serializationData';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../actions/types/actions';
import { FINISH_AUTH, REGISTER_AUTH } from '../../actions/authActions';

type IProps = ReduxProps & DispatchProps & ReactCookieProps & RouteComponentProps;

export interface IRegisterState{
    username:string,
    email:string,
    password:string,
    r_password:string,
    errors:IValidationResultErrors
}

class RegisterView extends React.Component<IProps,IRegisterState> {
    state:IRegisterState = {email:'',username:'',password:'',r_password:'',errors:{}}

    private s1 = createRef<HTMLImageElement>();
    private s2 = createRef<HTMLImageElement>();
    private s3 = createRef<HTMLImageElement>();

    private imageInterval: NodeJS.Timeout = setInterval(this.intervalHandler.bind(this)(),10000);

    private intervalHandler(){
        let arr: Array<HTMLImageElement> = [];
        let currentIndex = 0;
    
        const evaluate = () => {
            //fill the array properly after the html is loaded
            if(arr.length === 0 && this.s1.current && this.s2.current && this.s3.current){
                arr = [this.s1.current,this.s2.current,this.s3.current];
            }
            
            $(arr[currentIndex++]).hide();
            currentIndex = currentIndex === arr.length ? 0 : currentIndex;
            $(arr[currentIndex]).show();
        };

        return evaluate;
    }

    public componentDidMount(){
        //hide all images but the first one
        if(this.s1.current && this.s2.current && this.s3.current){
            let [s2,s3] = [this.s2.current,this.s3.current];
            $(s2).hide();
            $(s3).hide();
        }
    }

    public componentWillUnmount(){
        clearInterval(this.imageInterval);
    }

    private handleSubmit(e:FormEvent<HTMLFormElement>){
        e.preventDefault();

        let result:IValidationResult = validateRegister(this.state);
        this.setState({errors:result.errors});

        if(result.success){
            this.props.register(this.state);
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
                    saveUser(this.props.auth.email,this.props.auth.username,this.props.auth.token);

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

    public render() {
        return (
            <Grid className={styles.grid} stackable centered>
                <Grid.Row className={styles.gridRow}>
                    <Grid.Column className={styles.image} verticalAlign="middle" width="5">
                        <Ref innerRef={this.s1}>
                            <Image  src={selfie1} size="large"></Image>
                        </Ref>
                        <Ref innerRef={this.s2}>
                            <Image  src={selfie2} size="large"></Image>
                        </Ref>
                        <Ref innerRef={this.s3}>
                            <Image  src={selfie3} size="large"></Image>
                        </Ref>
                    </Grid.Column>
                    <Grid.Column verticalAlign="middle" width="8">
                        <Header className={`logo-text ${styles.header}`} as="h1">Instaclone</Header>

                        <Segment>
                            <Button fluid size='small' color='facebook'><Icon name='facebook' />Facebook login</Button>
                            <Divider horizontal>
                            Or
                            </Divider>

                            <Form id='register-form' onSubmit={this.handleSubmit.bind(this)}>
                                <Form.Field>
                                    <Form.Input 
                                        onChange={e => {this.setState({username:e.target.value})}}
                                        error={this.state.errors.username}
                                        icon='user'
                                        iconPosition='left'
                                        type='text'
                                        autoComplete='on'
                                        placeholder="Username" />
                                </Form.Field>
                                <Form.Field>
                                    <Form.Input
                                        onChange={e => {this.setState({email:e.target.value.toLowerCase()})}} 
                                        error={this.state.errors.email}
                                        icon='mail'
                                        iconPosition='left'
                                        type='email'
                                        autoComplete='on'
                                        placeholder="Email" />
                                </Form.Field>
                                <Form.Field>
                                    <Form.Input
                                        onChange={e => {this.setState({password:e.target.value})}}
                                        error={this.state.errors.password}
                                        icon='key'
                                        iconPosition='left'
                                        type='password' 
                                        autoComplete="on"
                                        placeholder="Password" />
                                </Form.Field>
                                <Form.Field>
                                    <Form.Input
                                        onChange={e => {this.setState({r_password:e.target.value})}}
                                        error={this.state.errors.r_password}
                                        icon='key'
                                        iconPosition='left'
                                        type='password'
                                        autoComplete="on" 
                                        placeholder="Repeat Password" />
                                </Form.Field>
                            </Form>
                        </Segment>

                        <Button loading={this.props.auth?.isLoading} form='register-form' type='submit' fluid color="twitter">Register</Button>

                        <div className="ui message">
                            Already a user? <Link to='/login'>Login In</Link>
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
    register: (state:IRegisterState) => void,
    finishAuth: () => void
}

const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,AppActions>):DispatchProps => ({
    register:bindActionCreators(REGISTER_AUTH,dispatch),
    finishAuth:bindActionCreators(FINISH_AUTH,dispatch)
})

export default withRouter(withCookies(connect(mapStateToProps,mapDispatchToProps)(RegisterView as ComponentType<IProps>)));