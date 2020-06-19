import React, { createRef, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import $ from 'jquery';

import styles from './RegisterView.module.css';
import selfie1 from '../../assets/selfie1.png';
import selfie2 from '../../assets/selfie2.png';
import selfie3 from '../../assets/selfie3.png';

import {validateRegister} from '../../validators/auth';
import {IRegisterState as IState, IAuthResponse} from '../../interfaces/auth';
import { IValidationResult } from '../../interfaces/validation';

import { Image, Grid, Header, Form, Button, Segment, Icon, Divider, Ref } from 'semantic-ui-react';
import { register } from '../../handlers/auth';

class RegisterView extends React.Component<any,IState> {
    state:IState = {email:'',username:'',password:'',r_password:'',errors:{}}

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

    private async handleSubmit(e:FormEvent<HTMLFormElement>){
        e.preventDefault();

        let result:IValidationResult = validateRegister(this.state);
        this.setState({errors:result.errors});

        if(result.success){
            let response:IAuthResponse = await register(this.state);
            if(response.success){
                toast.success(response.messege);
            }
            else{
                toast.error(response.messege);
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
                                        placeholder="Username" />
                                </Form.Field>
                                <Form.Field>
                                    <Form.Input
                                        onChange={e => {this.setState({email:e.target.value.toLowerCase()})}} 
                                        error={this.state.errors.email}
                                        icon='mail'
                                        iconPosition='left'
                                        type='email'
                                        placeholder="Email" />
                                </Form.Field>
                                <Form.Field>
                                    <Form.Input
                                        onChange={e => {this.setState({password:e.target.value})}}
                                        error={this.state.errors.password}
                                        icon='key'
                                        iconPosition='left'
                                        type='password' 
                                        placeholder="Password" />
                                </Form.Field>
                                <Form.Field>
                                    <Form.Input
                                        onChange={e => {this.setState({r_password:e.target.value})}}
                                        error={this.state.errors.r_password}
                                        icon='key'
                                        iconPosition='left'
                                        type='password' 
                                        placeholder="Repeat Password" />
                                </Form.Field>
                            </Form>
                        </Segment>

                        <Button form='register-form' type='submit' fluid color="twitter">Register</Button>

                        <div className="ui message">
                            Already a user? <Link to='/login'>Login In</Link>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}


export default RegisterView;