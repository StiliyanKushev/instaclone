// IMPORT STYLES
import styles from './HomeView.module.css';

// IMPORT REACT RELATED
import { ReactCookieProps, withCookies } from 'react-cookie';
import React, { ComponentType, FormEvent } from 'react';
import { Button, Container, Divider, Form, Grid, Header, Image, Segment } from 'semantic-ui-react';

// IMPORT REDUX RELATED
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { AppActions } from '../../actions/types/actions';
import { UPLOAD_POST } from '../../actions/postActions';
import { ThunkDispatch } from 'redux-thunk';
import { bindActionCreators } from 'redux';
import { GET_SUGGESTED_USERS, RESET_POST_UPLOADED } from '../../actions/userActions';
import { AppState, ReduxProps } from '../../reducers';

// IMPORT VALIDATION
import { validatePostCreate } from '../../validators/post';
import { IValidationResult, IValidationResultErrors } from '../../types/form-validation';

// IMPORT OTHER
import $ from 'jquery';
import _ from 'lodash';
import { settings } from '../../settings';
import FullViewPost from '../FullViewPost/FullViewPost'
import PostsPartial from '../../shared/PostsPartial/PostsPartial';
import UsersList from '../../shared/UsersList/UsersList';
import UserRow from '../../shared/UserRow/UserRow';

type IProps = ReduxProps & DispatchProps & ReactCookieProps;

export interface IHomeState {
    postDescription: string,
    errors: IValidationResultErrors,
}

class HomeView extends React.Component<IProps, IHomeState>{
    state: IHomeState = {postDescription: '', errors: {}}
    
    private formData: FormData = new FormData();

    public componentDidMount() {
        $('#global-file-input').change((e: any) => {
            let file = e.target.files[0];

            if (file) {
                //attach file to formData
                let formData = new FormData();
                formData.append('image', file);
                this.formData = formData;
            }

            $('#global-file-input').val('');
        });

        // simple fetch for the suggested users
        if(this.props.auth)
        this.props.getSuggestedUsers(this.props.auth.userId,this.props.auth.token);
    }

    public componentDidUpdate(prevProps:IProps) {
        //on props change
        if (!_.isEqual(this.props.post,prevProps.post)) {
            if (!this.props.post?.error) {
                //if it was successfull
                if (this.props.post?.isPostUploaded) {
                    toast.success(this.props.post?.messege);
                    // reset isUploaded
                    this.props.resetPostUploaded()
                }
            }
            //display backend error
            else {
                toast.error(this.props.post?.messege);
            }
        }
    }

    public componentWillUnmount() {
        $('#global-file-input').unbind('change')
    }

    private handleAddPostSubmit(e: FormEvent) {
        e.preventDefault();

        let result: IValidationResult = validatePostCreate(this.state);
        this.setState({ errors: result.errors });

        if (!this.formData.has('image')) {
            return toast.error('Please select an image for uploading.');
        }

        if (result.success) {
            this.formData.append('description', this.state.postDescription);
            this.props.uploadPost(this.formData,this.props.auth?.username || this.props.cookies?.get('username'),this.props.auth?.token || this.props.cookies?.get('token'))
            
            //empty the form data
            this.formData = new FormData();
            this.setState({postDescription:''});
        }
    }

    private handleUpload(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        $('#global-file-input').trigger('click');
    }

    public render() {
        return (
            <div className='view-container'>
                {
                    this.props.user?.usersListToggled && <UsersList lowerDim={this.props.post?.fullViewToggled} fetchFunction={this.props.user?.currentUsersFetchFunction}/>
                }
                {
                    this.props.post?.fullViewToggled && <FullViewPost postIndex={this.props.post?.fullViewPostIndex}/>
                }
                <Container>
                    <Grid id={styles.gridID} className={styles.grid}>
                        <Grid.Column id={styles.firstColumn} width='9'>
                            <Segment className={styles.uploadImageSegment}>
                                <Form onSubmit={this.handleAddPostSubmit.bind(this)} className={styles.uploadImageForm}>
                                    <Form.Field>
                                        <Button onClick={this.handleUpload} secondary>Upload</Button>
                                    </Form.Field>
                                    <Form.Field className={styles.formFieldDesktop}>
                                        <Form.Input iconPosition='left' icon='rocketchat' type='text' placeholder='Description'
                                            onChange={e => { this.setState({ postDescription: e.target.value }) }}
                                            error={this.state.errors.postDescription}
                                            value={this.state.postDescription}
                                        ></Form.Input>
                                    </Form.Field>
                                    <Button loading={this.props.post?.isPostLoading} type='submit' primary>Add Post</Button>
                                </Form>
                            </Segment>
                            <Segment className={styles.uploadImageSegmentMobile}>
                                <Form onSubmit={this.handleAddPostSubmit.bind(this)} className={styles.uploadImageFormMobile}>
                                    <Form.Field className={styles.buttonsFormMobile}>
                                        <Button onClick={this.handleUpload} secondary>Upload</Button>
                                        <Button loading={this.props.post?.isPostLoading} type='submit' primary>Add Post</Button>
                                    </Form.Field>
                                    <Form.Field>
                                        <Form.Input iconPosition='left' icon='rocketchat' type='text' placeholder='Description'
                                        onChange={e => { this.setState({ postDescription: e.target.value }) }}
                                        error={this.state.errors.postDescription}
                                        value={this.state.postDescription}></Form.Input>
                                    </Form.Field>
                                </Form>
                            </Segment>
                            <PostsPartial token={this.props.auth?.token || this.props.cookies?.get('token')}></PostsPartial>
                        </Grid.Column>
                        <Grid.Column className={styles.secondColumn} width='5'>
                            <div className={`${styles.fixedDiv} ui fixed top sticky`}>
                                <Segment className={styles.profileSegment}>
                                    <Image className={styles.profileImage} circular size='tiny' src={`${settings.BASE_URL}/feed/photo/user/${this.props.auth?.username}`}></Image>
                                    <Header className={styles.profileUsername} size='small'>{this.props.auth?.username}</Header>
                                </Segment>
                                <Divider className={styles.profileDivider} horizontal><Header disabled size='small'>Suggested</Header></Divider>
                                <Segment>
                                    {
                                        this.props.user?.suggestedUsers.map((user,index) => (
                                            <UserRow indexSuggested={index} key={user.id} username={user.username} userId={user.id} />
                                        ))
                                    }
                                </Segment>
                            </div>
                        </Grid.Column>
                    </Grid>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState): ReduxProps => ({
    auth: state.auth,
    post: state.post,
    user: state.user
})

interface DispatchProps {
    uploadPost: (form:FormData,username:string,token:string) => void,
    getSuggestedUsers: (userId:string,token:string) => void,
    resetPostUploaded: () => void,
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    uploadPost: bindActionCreators(UPLOAD_POST, dispatch),
    getSuggestedUsers: bindActionCreators(GET_SUGGESTED_USERS,dispatch),
    resetPostUploaded: bindActionCreators(RESET_POST_UPLOADED,dispatch)
})

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(HomeView as ComponentType<IProps>));