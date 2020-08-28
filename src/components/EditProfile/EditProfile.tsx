// IMPORT STYLES
import styles from './EditProfile.module.css';

// IMPORT REACT RELATED
import { withCookies, ReactCookieProps } from 'react-cookie';
import React, { FormEvent, ComponentType } from 'react';
import { Dimmer, Segment, Button, Icon, Form } from 'semantic-ui-react';

// IMPORT REDUX RELATED
import { connect } from 'react-redux';
import { AppActions } from '../../actions/types/actions';
import { ThunkDispatch } from 'redux-thunk';
import { EDIT_PROFILE_AUTH } from '../../actions/authActions';
import { bindActionCreators } from 'redux';
import { ReduxProps, AppState } from '../../reducers';

// IMPORT VALIDATION
import { validateEditProfile } from '../../validators/auth';
import { IValidationResult, IValidationResultErrors } from '../../types/form-validation';

// IMPORT OTHER
import { toast } from 'react-toastify';
import { IPost } from '../../shared/PostsPartial/PostsPartial';
import { CALL_FIX_POST_AFTER_UPDATE } from '../../actions/postActions';

interface IParentProps {
    handleClose: Function
}

type IProps = IParentProps & ReduxProps & DispatchProps & ReactCookieProps;

export interface IEditProfileState{
    email:string,
    username:string,
    password:string,
    errors:IValidationResultErrors
}

class EditProfile extends React.Component<IProps,IEditProfileState> {
    initialState:IEditProfileState = { password:'', email:this.props.auth?.email || '', username:this.props.auth?.username || '', errors: {}}
    state:IEditProfileState = Object.assign(this.initialState,this.state)

    private handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let result: IValidationResult = validateEditProfile(this.state);
        this.setState({errors:result.errors});
        
        if(result.success){
            this.props.editProfile(this.state,this.props.auth?.email || this.props.cookies?.get('email'),this.props.auth?.token || this.props.cookies?.get('token'));

            // compare initial state's usernames
            if(this.initialState.username !== this.state.username && this.props.post){

                // fix usernames for every post in the home view that is from this user
                let fixedPosts : [{index:number,post:IPost}] = [] as any;

                for(let i = 0; i < this.props.post.homePosts.length;i++){
                    let post = this.props.post.homePosts[i];

                    if(post.creator.id === this.props.auth?.userId && post.creator.username !== this.state.username){
                        post.creator.username = this.state.username;
                        fixedPosts.push({index:i,post:post});
                    }
                }

                // give the result to redux to update the homeposts in store
                this.props.fixHomePostUsernames(fixedPosts);
            }
        }
    }

    public componentDidUpdate(prevProps:IProps){
        //on props change
        if(this.props.auth !== prevProps.auth){
            if(!this.props.auth?.error){
                //if it was successfull
                if(this.props.auth?.isProfileEdited){
                    toast.success(this.props.auth.messege);

                    //save new data in cookies
                    this.props.cookies?.set('email',this.props.auth.email);
                    this.props.cookies?.set('username',this.props.auth.username);

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

                    <Form onSubmit={this.handleSubmit.bind(this)} id='edit-profile'>
                        <br />
                        <Form.Field>
                            <Form.Input
                                value={this.state.email}
                                error={this.state.errors.email}
                                onChange={e => { this.setState({ email: e.target.value }) }}
                                placeholder='Email' 
                                type='email' 
                                autoComplete='on' />
                            <Form.Input
                                value={this.state.username}
                                error={this.state.errors.username}
                                onChange={e => { this.setState({ username: e.target.value }) }} 
                                placeholder='Username' 
                                type='text' 
                                autoComplete='on' />
                        </Form.Field>
                        <Form.Field>
                            <Form.Input
                                error={this.state.errors.password}
                                onChange={e => { this.setState({ password: e.target.value }) }} 
                                placeholder='Confirm Password' 
                                type='password' 
                                autoComplete='on' />
                        </Form.Field>
                    </Form>
                    <br />
                    <Button loading={this.props.auth?.isLoading} form='edit-profile' type='submit' fluid primary>Update Profile</Button>
                    <br />
                </Segment>
            </Dimmer>
        );
    }
}

const mapStateToProps = (state:AppState):ReduxProps => ({
    auth:state.auth,
    post:state.post,
})

interface DispatchProps {
    editProfile: (state:IEditProfileState,email:string,token:string) => void,
    fixHomePostUsernames: (arr:[{index:number,post:IPost}]) => void
}

const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,AppActions>):DispatchProps => ({
    editProfile:bindActionCreators(EDIT_PROFILE_AUTH,dispatch),
    fixHomePostUsernames:bindActionCreators(CALL_FIX_POST_AFTER_UPDATE,dispatch),

})

export default withCookies(connect(mapStateToProps,mapDispatchToProps)(EditProfile as ComponentType<IProps>));