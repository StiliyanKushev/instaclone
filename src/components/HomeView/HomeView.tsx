import React, { ComponentType, FormEvent } from 'react';
import { Container, Grid, Segment, Button, Header, Image, Divider, Form } from 'semantic-ui-react';

import styles from './HomeView.module.css';
import defaultUserImage from '../../assets/avatar.jpg';
import { connect } from 'react-redux';
import { ReduxProps, AppState } from '../../reducers';
import { settings } from '../../settings';

import {bindActionCreators} from 'redux';
import _ from 'lodash';
import $ from 'jquery';
import { IValidationResultErrors, IValidationResult } from '../../types/form-validation';
import { validatePostCreate } from '../../validators/post';
import { toast } from 'react-toastify';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../actions/types/actions';
import { UPLOAD_POST } from '../../actions/postActions';
import { ReactCookieProps, withCookies } from 'react-cookie';

type IProps = ReduxProps & DispatchProps & ReactCookieProps;

export interface IHomeState {
    postDescription: string,
    errors: IValidationResultErrors
}

class HomeView extends React.Component<IProps, IHomeState>{
    state: IHomeState = { postDescription: '', errors: {} }
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
    }

    public componentDidUpdate(prevProps:IProps) {
        //on props change
        if (!_.isEqual(this.props.post,prevProps.post)) {
            if (!this.props.post?.error) {
                //if it was successfull
                if (this.props.post?.isPostUploaded) {
                    toast.success(this.props.post?.messege);
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
                <Container>
                    <Grid>
                        <Grid.Column id={styles.firstColumn} width='10'>
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
                        </Grid.Column>
                        <Grid.Column className={styles.secondColumn} width='5'>
                            <Segment className={styles.profileSegment}>
                                <Image className={styles.profileImage} circular size='tiny' src={`${settings.BASE_URL}/feed/photo/user/${this.props.auth?.username}`}></Image>
                                <Header className={styles.profileUsername} size='small'>{this.props.auth?.username}</Header>
                            </Segment>
                            <Divider className={styles.profileDivider} horizontal><Header disabled size='small'>Suggested</Header></Divider>
                            <Segment>
                                <Segment className={styles.profileSegmentInternal}>
                                    <Image className={styles.verySmallImg} circular size='tiny' src={defaultUserImage}></Image>
                                    <Header className={styles.profileUsernameSmall} size='tiny'>randomtodo</Header>
                                    <Button primary size='tiny'>Folllow</Button>
                                </Segment>

                                {/* TODO REMOVE THESE AND MAKE IT FROM BACKEND */}
                                <Segment className={styles.profileSegmentInternal}>
                                    <Image className={styles.verySmallImg} circular size='tiny' src={defaultUserImage}></Image>
                                    <Header className={styles.profileUsernameSmall} size='tiny'>randomtodo</Header>
                                    <Button primary size='tiny'>Folllow</Button>
                                </Segment>
                                <Segment className={styles.profileSegmentInternal}>
                                    <Image className={styles.verySmallImg} circular size='tiny' src={defaultUserImage}></Image>
                                    <Header className={styles.profileUsernameSmall} size='tiny'>randomtodo</Header>
                                    <Button primary size='tiny'>Folllow</Button>
                                </Segment>
                                <Segment className={styles.profileSegmentInternal}>
                                    <Image className={styles.verySmallImg} circular size='tiny' src={defaultUserImage}></Image>
                                    <Header className={styles.profileUsernameSmall} size='tiny'>randomtodo</Header>
                                    <Button primary size='tiny'>Folllow</Button>
                                </Segment>
                                <Segment className={styles.profileSegmentInternal}>
                                    <Image className={styles.verySmallImg} circular size='tiny' src={defaultUserImage}></Image>
                                    <Header className={styles.profileUsernameSmall} size='tiny'>randomtodo</Header>
                                    <Button primary size='tiny'>Folllow</Button>
                                </Segment>
                            </Segment>
                        </Grid.Column>
                    </Grid>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState): ReduxProps => ({
    auth: state.auth,
    post: state.post
})

interface DispatchProps {
    uploadPost: (form:FormData,username:string,token:string) => void,
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    uploadPost: bindActionCreators(UPLOAD_POST, dispatch),
})


export default withCookies(connect(mapStateToProps, mapDispatchToProps)(HomeView as ComponentType<IProps>));