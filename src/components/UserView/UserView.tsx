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
import { UPDATE_AVATAR_USER, TOGGLE_USER_POSTS_LIST, RESET_USER_AVATAR_UPLOAD, SET_CURRENT_USER_DATA, FOLLOW_USER_PAGE, UNFOLLOW_USER_PAGE, RESET_USER_DATA, TOGGLE_USERS_LIST } from '../../actions/userActions';
import { IPostsListGrid } from '../../reducers/postReducer';

// IMPORT OTHER
import _ from 'lodash';
import $ from 'jquery';
import {Helmet} from "react-helmet";
import { settings } from '../../settings';
import EditProfile from '../EditProfile/EditProfile';
import UserSettings from '../UserSettings/UserSettings';
import UserPostsGrid from '../UserPostsGrid/UserPostsGrid';
import { getUserPostsRecent, getUserPostsPopular, getUserPostsSaved, getFollowers, getFollowing } from '../../handlers/user';

// IMPORT TYPES
import IGenericResponse from '../../types/response';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { ICreator } from '../../types/auth';
import UsersList from '../../shared/UsersList/UsersList';

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
    refreshProp:string,
}

class UserView extends React.Component<IProps, IState> {
    state: IState = {refreshProp:'recent', selectionTab: 'recent', settingsPopup: false, editProfilePopup: false }
    private userImageRef = createRef<HTMLImageElement>();
    private customTitle:string = 'Followers';

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
        this.setUserData = this.setUserData.bind(this);
    }

    get urlUsername(): string{
        return this.props.match.params.name;
    }

    private resetImgSrc(){
        let date = new Date();
        let user = this.props.auth?.username;
        $(this.userImageRef.current as HTMLImageElement).attr("src", `${settings.BASE_URL}/feed/photo/user/${user}?` + date.getTime());
    }

    private setUserData(){
        if(this.urlUsername !== this.props.auth?.username)
        this.props.setCurrentUserData(this.urlUsername,this.props.auth?.userId as string,this.props.auth?.token as string)
        else
        this.props.setCurrentUserData(this.props.auth?.username,this.props.auth?.userId as string,this.props.auth?.token as string)
    }

    public componentDidMount() {
        this.setupAvatarHandlerUpload()
        this.setFetchFunction(getUserPostsRecent)
        this.setUserData();
    }

    public componentWillUnmount() {
        $('#global-file-input').unbind('change')
    }

    private onRouteChanged(prevProps: RouteComponentProps) {
        if(this.props.location.pathname !== prevProps.location.pathname && this.props.location.pathname.startsWith('/profile/')){
            this.props.clearUserData();
            this.resetImgSrc();
            this.setUserData();
            this.setFetchFunction(getUserPostsRecent);
            this.setState({refreshProp:'' + Math.random()})
        }        
    }

    public componentDidUpdate(prevProps: IProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged(prevProps);
        }

        //on props change
        if (!_.isEqual(this.props.user, prevProps.user)) {
            if (!this.props.user?.error) {
                //if it was successfull
                if (this.props.user?.isUserAvatarUpdated) {
                    toast.success(this.props.user?.messege);
                    this.resetImgSrc();
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

        this.setState({ selectionTab, refreshProp:selectionTab })

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

    private handleClickFollowers(){
        this.customTitle = 'Followers';
        this.props.toggleUserLikes((startIndex:number,stopIndex:number) => {
            return getFollowers(startIndex,stopIndex, this.urlUsername, this.props.auth?.userId as string,this.props.auth?.token as string);
        });
    }

    private handleClickFollowing(){
        this.customTitle = 'Following';
        this.props.toggleUserLikes((startIndex:number,stopIndex:number) => {
            return getFollowing(startIndex,stopIndex, this.urlUsername, this.props.auth?.userId as string,this.props.auth?.token as string);
        });
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
                {
                    this.props.user?.usersListToggled && <UsersList customTitle={this.customTitle} lowerDim={false} fetchFunction={this.props.user?.currentUsersFetchFunction}/>
                }
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
                                    {
                                                    this.urlUsername === this.props.auth?.username && 
                                                    <React.Fragment><Button size='mini' className={styles.editBtn2} onClick={this.handleEditProfileClick} secondary>Edit Profile</Button><Button onClick={this.handleSettingClick} className={styles.settingsBtn2} size='mini' primary icon='setting'></Button></React.Fragment>
                                                }
                                                {
                                                    this.urlUsername !== this.props.auth?.username && (
                                                        this.props.user?.isCurrentUserFollowed ?
                                                            <React.Fragment><Button size='mini' className={styles.editBtn2} onClick={() => {}} secondary>Messege</Button><Button className={styles.settingsBtn2} size='mini' onClick={this.unfollowUser.bind(this)} primary icon='remove user'/></React.Fragment>
                                                        :
                                                        <Button size='mini' className={styles.editBtn3} onClick={this.followUser.bind(this)} primary>Follow</Button>
                                                    )
                                                }
                                        {/*  */}
                                    </Segment>
                                    <Segment id={styles.noBorders} className={styles.stats} attached='bottom'>
                                        <Item id={styles.fluidItems}>
                                            <Grid className={styles.fluidGrid}>
                                                <Grid.Column id={styles.fluidColumn} textAlign='center' width='6'><Header as='span' className={styles.columnHeader} size='small'>{this.props.user?.currentUserPostsNum}</Header> Posts</Grid.Column>
                                                <Grid.Column onClick={this.handleClickFollowers.bind(this)} id={styles.fluidColumn} textAlign='center' width='5'><Header as='span' className={styles.columnHeader} size='small'>{this.props.user?.currentUserFollowersNum}</Header> Followers</Grid.Column>
                                                <Grid.Column onClick={this.handleClickFollowing.bind(this)} id={styles.fluidColumn} textAlign='center' width='5'><Header as='span' className={styles.columnHeader} size='small'>{this.props.user?.currentUserFollowingNum}</Header> Following</Grid.Column>
                                            </Grid>
                                        </Item>
                                    </Segment>
                                    <div id={styles.noBorders} className={styles.stats2}>
                                        <Segment id={styles.noBorders} attached>
                                            <Item>
                                                <Header as='span' className={styles.columnHeader} size='small'>{this.props.user?.currentUserPostsNum}</Header> Posts
                                            </Item>
                                        </Segment>
                                        <Segment id={styles.noBorders} attached>
                                            <Item>
                                                <Header onClick={this.handleClickFollowers.bind(this)} as='span' className={styles.columnHeader} size='small'>{this.props.user?.currentUserFollowersNum}</Header> Followers
                                            </Item>
                                        </Segment>
                                        <Segment id={styles.noBorders} attached='bottom'>
                                            <Item onClick={this.handleClickFollowing.bind(this)}>
                                                <Header as='span' className={styles.columnHeader} size='small'>{this.props.user?.currentUserFollowingNum}</Header> Following
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
                        <UserPostsGrid refreshProp={this.state.refreshProp} currentPostSelectionFunction={this.props.user?.currentPostSelectionFunction as any} />
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
    clearUserData: () => void,
    toggleUserLikes: (fetchFunction:(startIndex:number,stopIndex:number) => Promise<IGenericResponse & {likes:Array<ICreator>}>) => void,
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    updateAvatar: bindActionCreators(UPDATE_AVATAR_USER, dispatch),
    togglePostsSection: bindActionCreators(TOGGLE_USER_POSTS_LIST, dispatch),
    resetAvatarUploaded: bindActionCreators(RESET_USER_AVATAR_UPLOAD, dispatch),
    setCurrentUserData: bindActionCreators(SET_CURRENT_USER_DATA,dispatch),
    followUser: bindActionCreators(FOLLOW_USER_PAGE,dispatch),
    unfollowUser: bindActionCreators(UNFOLLOW_USER_PAGE,dispatch),
    clearUserData: bindActionCreators(RESET_USER_DATA,dispatch),
    toggleUserLikes:bindActionCreators(TOGGLE_USERS_LIST,dispatch)
})

export default withRouter(withCookies(connect(mapStateToProps, mapDispatchToProps)(UserView as ComponentType<IProps>)));