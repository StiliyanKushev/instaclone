// IMPORT STYLES
import styles from './UserView.module.css';

// IMPORT REACT RELATED
import React, { ComponentType, createRef } from 'react';
import { toast } from 'react-toastify';
import { ReactCookieProps, withCookies } from 'react-cookie';
import { Container, Grid, Item, Segment, Header, Button, Image, Menu, Ref } from 'semantic-ui-react';

// IMPORT REDUX RELATED
import { connect } from 'react-redux';
import { AppActions } from '../../actions/types/actions';
import { AppState, ReduxProps } from '../../reducers';
import { ThunkDispatch } from 'redux-thunk';
import { bindActionCreators } from 'redux';
import { UPDATE_AVATAR_USER, TOGGLE_USER_POSTS_LIST, RESET_USER_AVATAR_UPLOAD, SET_CURRENT_USER_DATA, FOLLOW_USER_PAGE, UNFOLLOW_USER_PAGE } from '../../actions/userActions';
import { IPostsListGrid } from '../../reducers/postReducer';

// IMPORT OTHER
import _ from 'lodash';
import $ from 'jquery';
import {Helmet} from "react-helmet";
import { settings } from '../../settings';
import EditProfile from '../EditProfile/EditProfile';
import UserSettings from '../UserSettings/UserSettings';
import UserPostsGrid from '../UserPostsGrid/UserPostsGrid';
import { getUserPostsRecent, getUserPostsPopular, getUserPostsSaved } from '../../handlers/user';

// IMPORT TYPES
import IGenericResponse from '../../types/response';
import { withRouter, RouteComponentProps } from 'react-router-dom';

export interface IUserData {
    posts: number,
    followers: number,
    following: number,
    isFollowing: boolean,
}

interface IRouteProps {
    match:{
        params:{
            name: string
        }
    }
}

type IProps = ReactCookieProps & ReduxProps & DispatchProps & RouteComponentProps & IRouteProps;

interface IState {
    selectionTab: string,
    settingsPopup: boolean,
    editProfilePopup: boolean,
}

class UserView extends React.Component<IProps, IState> {
    state: IState = { selectionTab: 'recent', settingsPopup: false, editProfilePopup: false }
    private userImageRef = createRef<HTMLImageElement>();

    constructor(props: IProps) {
        super(props);

        this.handleItemClick = this.handleItemClick.bind(this);
        this.handleSettingClick = this.handleSettingClick.bind(this);
        this.handleEditProfileClick = this.handleEditProfileClick.bind(this);
        this.handleCloseSettings = this.handleCloseSettings.bind(this);
        this.handleCloseEditProfile = this.handleCloseEditProfile.bind(this);
        this.handleChangeAvatar = this.handleChangeAvatar.bind(this);
        this.setupAvatarHandlerUpload = this.setupAvatarHandlerUpload.bind(this);
        this.setFetchFunction = this.setFetchFunction.bind(this);
    }

    get urlUsername(): string{
        return this.props.match.params.name;
    }

    public componentDidMount() {
        this.setupAvatarHandlerUpload()
        this.setFetchFunction(getUserPostsRecent)

        if(this.urlUsername !== this.props.auth?.username)
        this.props.setCurrentUserData(this.urlUsername,this.props.auth?.userId as string,this.props.auth?.token as string)
    }

    public componentWillUnmount() {
        $('#global-file-input').unbind('change')
    }

    public componentDidUpdate(prevProps: IProps) {
        //on props change
        if (!_.isEqual(this.props.user, prevProps.user)) {
            if (!this.props.user?.error) {
                //if it was successfull
                if (this.props.user?.isUserAvatarUpdated) {
                    toast.success(this.props.user?.messege);
                    let date = new Date();
                    let user = this.props.auth?.username;
                    $(this.userImageRef.current as HTMLImageElement).attr("src", `${settings.BASE_URL}/feed/photo/user/${user}?` + date.getTime());
                    this.props.resetAvatarUploaded();
                }
            }

            //display backend error
            else if(this.props.user?.error){
                toast.error(this.props.user?.messege);
            }
        }
    }

    private followUser(){
        this.props.followUser(this.urlUsername,this.props.auth?.userId as string,this.props.auth?.token as string)
    }

    private unfollowUser(){
        this.props.unfollowUser(this.urlUsername,this.props.auth?.userId as string,this.props.auth?.token as string)
    }

    private setFetchFunction(func: Function) {
        // toggle the posts to the first option (recent)
        this.props.togglePostsSection((startIndex: number, stopIndex: number) => {
            return func(startIndex, stopIndex, this.urlUsername, this.props.auth?.token as string);
        });
    }

    private setupAvatarHandlerUpload() {
        let user = this.urlUsername;
        let token = this.props.auth?.token || '';
        $(this.userImageRef.current as HTMLImageElement).attr('src', `${settings.BASE_URL}/feed/photo/user/${user}`);

        $('#global-file-input').change((e: any) => {
            let file = e.target.files[0];

            if (file) {
                //attach file to formData
                let formData = new FormData();
                formData.append('image', file);

                this.props.updateAvatar(formData, this.props.auth?.username || this.props.cookies?.get('username'), token);
            }

            $('#global-file-input').val('');
        });
    }

    private handleEditProfileClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.setState({ editProfilePopup: true })
    }

    private handleCloseEditProfile() {
        this.setState({ editProfilePopup: false })
    }

    private handleCloseSettings() {
        this.setState({ settingsPopup: false })
    }

    private handleItemClick(selectionTab: string) {
        if(selectionTab === this.state.selectionTab) return;

        this.setState({ selectionTab })

        switch (selectionTab) {
            case 'recent':
                this.setFetchFunction(getUserPostsRecent)
                break;

            case 'popular':
                this.setFetchFunction(getUserPostsPopular)
                break;

            case 'saved':
                this.setFetchFunction(getUserPostsSaved)
                break;

            default:
                break;
        }
    }

    private handleSettingClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.setState({ settingsPopup: true });
    }

    private handleChangeAvatar(e: React.MouseEvent<HTMLImageElement>) {
        e.preventDefault();

        if(this.urlUsername === this.props.auth?.username){
            $('#global-file-input').trigger('click');
        }
    }

    public render() {
        return (
            <div className={`${styles.viewContainer} view-container`}>
                <Helmet>
                <style type="text/css">{`
                    body,html,#root {
                        background-color: white !important;
                    }
                `}</style>
                </Helmet>
                <Container className={styles.container}>
                    <Grid>
                        <Grid.Row className={styles.userRow}>
                            <Grid.Column className={styles.columnFit}>
                                <Ref innerRef={this.userImageRef}>
                                    <Image onClick={this.handleChangeAvatar} className={styles.avatar} size='small' circular />
                                </Ref>
                            </Grid.Column>
                            <Grid.Column id={styles.seccondColumn} widescreen='10'>
                                <Item.Group id={styles.noBorders}>
                                    <Segment id={styles.noBorders} attached='top' padded>
                                        <Item>
                                            <Grid className={styles.fluidGrid}>
                                                <Grid.Column className={styles.usernameColumn}><Header className={styles.username} as='h1'>{this.urlUsername}</Header></Grid.Column>
                                                {
                                                    this.urlUsername === this.props.auth?.username && 
                                                    <Grid.Column className={styles.userSettingsBtns} floated='right'><Button onClick={this.handleEditProfileClick} secondary>Edit Profile</Button><Button onClick={this.handleSettingClick} primary icon='setting'></Button></Grid.Column>
                                                }
                                                {
                                                    this.urlUsername !== this.props.auth?.username && (
                                                        this.props.user?.isCurrentUserFollowed ?
                                                        <Grid.Column className={styles.userSettingsBtns} floated='right'><Button onClick={() => {}} secondary>Messege</Button><Button onClick={this.unfollowUser.bind(this)} primary icon='remove user'></Button></Grid.Column>
                                                        :
                                                        <Grid.Column className={styles.userSettingsBtns} floated='right'><Button onClick={this.followUser.bind(this)} primary>Follow</Button></Grid.Column>
                                                    )
                                                }
                                            </Grid>
                                        </Item>
                                    </Segment>
                                    <Segment id={styles.noBorders} className={styles.userSettingsBtns2} attached>
                                        <Button size='mini' className={styles.editBtn2} onClick={this.handleEditProfileClick} secondary>Edit Profile</Button><Button onClick={this.handleSettingClick} className={styles.settingsBtn2} size='mini' primary icon='setting'></Button>
                                    </Segment>
                                    <Segment id={styles.noBorders} className={styles.stats} attached='bottom'>
                                        <Item id={styles.fluidItems}>
                                            <Grid className={styles.fluidGrid}>
                                                <Grid.Column id={styles.fluidColumn} textAlign='center' width='6'><Header as='span' className={styles.columnHeader} size='small'>{this.props.user?.currentUserPostsNum}</Header> Posts</Grid.Column>
                                                <Grid.Column id={styles.fluidColumn} textAlign='center' width='5'><Header as='span' className={styles.columnHeader} size='small'>{this.props.user?.currentUserFollowersNum}</Header> Followers</Grid.Column>
                                                <Grid.Column id={styles.fluidColumn} textAlign='center' width='5'><Header as='span' className={styles.columnHeader} size='small'>{this.props.user?.currentUserFollowingNum}</Header> Following</Grid.Column>
                                            </Grid>
                                        </Item>
                                    </Segment>
                                    <div id={styles.noBorders} className={styles.stats2}>
                                        <Segment id={styles.noBorders} attached>
                                            <Item>
                                                <Header as='span' className={styles.columnHeader} size='small'>0</Header> Posts
                                            </Item>
                                        </Segment>
                                        <Segment id={styles.noBorders} attached>
                                            <Item>
                                                <Header as='span' className={styles.columnHeader} size='small'>0</Header> Followers
                                            </Item>
                                        </Segment>
                                        <Segment id={styles.noBorders} attached='bottom'>
                                            <Item>
                                                <Header as='span' className={styles.columnHeader} size='small'>0</Header> Following
                                            </Item>
                                        </Segment>
                                    </div>
                                </Item.Group>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Segment id={styles.noBorders} attached='bottom'>
                                <Item>
                                    <Menu className={styles.postsMenu} pointing secondary fluid>
                                        <Menu.Item onClick={() => this.handleItemClick('recent')} active={this.state.selectionTab === 'recent'}>Recent Posts</Menu.Item>
                                        <Menu.Item onClick={() => this.handleItemClick('popular')} active={this.state.selectionTab === 'popular'}>Popular Posts</Menu.Item>
                                        <Menu.Item onClick={() => this.handleItemClick('saved')} active={this.state.selectionTab === 'saved'}>Saved Posts</Menu.Item>
                                    </Menu>
                                </Item>
                            </Segment>
                        </Grid.Row>
                        <UserPostsGrid refreshProp={this.state.selectionTab} currentPostSelectionFunction={this.props.user?.currentPostSelectionFunction as any} />
                    </Grid>
                </Container>
                {this.state.editProfilePopup && <EditProfile handleClose={this.handleCloseEditProfile} />}
                {this.state.settingsPopup && <UserSettings handleClose={this.handleCloseSettings} />}
            </div>
        );
    }
}

const mapStateToProps = (state: AppState): ReduxProps => ({
    auth: state.auth,
    user: state.user,
    post: state.post
})

interface DispatchProps {
    updateAvatar: (formData: FormData, username: string, token: string) => void,
    togglePostsSection: (fetchFunction: (startIndex: number, stopIndex: number) => Promise<IGenericResponse & { posts: IPostsListGrid }>) => void
    resetAvatarUploaded: () => void,
    setCurrentUserData: (username:string,userId:string,token:string) => void,
    followUser: (username:string,userId:string,token:string) => void,
    unfollowUser: (username:string,userId:string,token:string) => void,
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    updateAvatar: bindActionCreators(UPDATE_AVATAR_USER, dispatch),
    togglePostsSection: bindActionCreators(TOGGLE_USER_POSTS_LIST, dispatch),
    resetAvatarUploaded: bindActionCreators(RESET_USER_AVATAR_UPLOAD, dispatch),
    setCurrentUserData: bindActionCreators(SET_CURRENT_USER_DATA,dispatch),
    followUser: bindActionCreators(FOLLOW_USER_PAGE,dispatch),
    unfollowUser: bindActionCreators(UNFOLLOW_USER_PAGE,dispatch),
})

export default withRouter(withCookies(connect(mapStateToProps, mapDispatchToProps)(UserView as ComponentType<IProps>)));