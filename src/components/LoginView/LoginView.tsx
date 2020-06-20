import React, { FormEvent } from 'react';
import { withCookies, ReactCookieProps } from 'react-cookie';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import styles from './LoginView.module.css';
import SideImage from '../../assets/image-login.png';

import {ILoginState as IState, IAuthResponse} from '../../interfaces/auth';
import { IValidationResult } from '../../interfaces/validation';
import { validateLogin } from '../../validators/auth';

import { Image, Grid, Header, Form, Button, Segment, Icon, Divider } from 'semantic-ui-react';
import { login } from '../../handlers/auth';

class LoginView extends React.Component<ReactCookieProps,IState>{
    state:IState = {email:'',password:'',errors:{}}

    private async handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault();

        let result: IValidationResult = validateLogin(this.state);
        this.setState({errors:result.errors});

        if(result.success){
            let response: IAuthResponse = await login(this.state);
            if(response.success){
                //save user data
                this.props.cookies?.set('username',response.user.username);
                this.props.cookies?.set('token',response.token);
                this.props.cookies?.set('isLogged',true);

                toast.success(response.messege);
            }
            else{
                toast.error(response.messege);
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
                                    placeholder="Email" />
                            </Form.Field>
                            <Form.Field>
                                <Form.Input
                                    error={this.state.errors.password}
                                    onChange={e => {this.setState({password:e.target.value})}}
                                    icon='key'
                                    iconPosition='left'
                                    type='password'
                                    placeholder="Password" />
                            </Form.Field>

                            <Segment>
                            <Button form='login-form' type='submit' fluid color="twitter">Login</Button>
                                    <Divider horizontal>
                                        Or
                                    </Divider>
                                    <Button fluid size='mini' color='facebook'><Icon name='facebook'/>Facebook login</Button>
                            </Segment>


                            <Segment>
                                <a className={styles.forgotPass} href='#'>Forgot password?</a>
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

export default withCookies(LoginView);