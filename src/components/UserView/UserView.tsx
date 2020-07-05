// IMPORT STYLES
import styles from './UserView.module.css';

// IMPORT REACT RELATED
import React, { ComponentType, createRef } from 'react';
import { ReactCookieProps, withCookies } from 'react-cookie';
import { Container, Grid, Item, Segment, Header, Button, Image, Menu, Ref } from 'semantic-ui-react';

// IMPORT REDUX RELATED
import { connect } from 'react-redux';
import { AppActions } from '../../actions/types/actions';
import { ThunkDispatch } from 'redux-thunk';
import { bindActionCreators } from 'redux';
import { UPDATE_AVATAR_USER } from '../../actions/userActions';
import { AppState, ReduxProps } from '../../reducers';

// IMPORT OTHER
import EditProfile from '../EditProfile/EditProfile';
import UserSettings from '../UserSettings/UserSettings';

// IMPORT VALIDATION
import $ from 'jquery';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { settings } from '../../settings';

type IProps = ReactCookieProps & ReduxProps & DispatchProps;

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
    }

    public componentDidMount() {
        let user = this.props.auth?.username || '';
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

    public componentWillUnmount() {
        $('#global-file-input').unbind('change')
    }

    public componentDidUpdate(prevProps:IProps) {
        //on props change
        if (!_.isEqual(this.props.user,prevProps.user)) {
            if (!this.props.user?.error) {
                //if it was successfull
                if (this.props.user?.isUserAvatarUpdated) {
                    toast.success(this.props.user?.messege);
                    let date = new Date();
                    let user = this.props.auth?.username;
                    $(this.userImageRef.current as HTMLImageElement).attr("src", `${settings.BASE_URL}/feed/photo/user/${user}?` + date.getTime());
                }
            }
            //display backend error
            else {
                toast.error(this.props.user?.messege);
            }
        }
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
        this.setState({ selectionTab })
    }

    private handleSettingClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.setState({ settingsPopup: true });
    }

    private handleChangeAvatar(e: React.MouseEvent<HTMLImageElement>) {
        e.preventDefault();

        $('#global-file-input').trigger('click');
    }

    public render() {
        return (
            <div className='view-container'>
                <Container className={styles.container}>
                    <Grid>
                        <Grid.Row className={styles.userRow}>
                            <Grid.Column className={styles.columnFit}>
                                <Ref innerRef={this.userImageRef}>
                                    <Image onClick={this.handleChangeAvatar} className={styles.avatar} size='small' circular />
                                </Ref>
                            </Grid.Column>
                            <Grid.Column id={styles.seccondColumn} widescreen='10'>
                                <Item.Group>
                                    <Segment attached='top' padded>
                                        <Item>
                                            <Grid className={styles.fluidGrid}>
                                                <Grid.Column className={styles.usernameColumn}><Header className={styles.username} as='h1'>{this.props.auth?.username}</Header></Grid.Column>
                                                <Grid.Column className={styles.userSettingsBtns} floated='right'><Button onClick={this.handleEditProfileClick} secondary>Edit Profile</Button><Button onClick={this.handleSettingClick} primary icon='setting'></Button></Grid.Column>
                                            </Grid>
                                        </Item>
                                    </Segment>
                                    <Segment className={styles.userSettingsBtns2} attached>
                                        <Button size='mini' className={styles.editBtn2} onClick={this.handleEditProfileClick} secondary>Edit Profile</Button><Button onClick={this.handleSettingClick} className={styles.settingsBtn2} size='mini' primary icon='setting'></Button>
                                    </Segment>
                                    <Segment className={styles.stats} attached='bottom'>
                                        <Item>
                                            <Grid className={styles.fluidGrid}>
                                                <Grid.Column textAlign='center' width='6'><Header as='span' className={styles.columnHeader} size='small'>0</Header> Posts</Grid.Column>
                                                <Grid.Column textAlign='center' width='5'><Header as='span' className={styles.columnHeader} size='small'>0</Header> Followers</Grid.Column>
                                                <Grid.Column textAlign='center' width='5'><Header as='span' className={styles.columnHeader} size='small'>0</Header> Following</Grid.Column>
                                            </Grid>
                                        </Item>
                                    </Segment>
                                    <div className={styles.stats2}>
                                        <Segment attached>
                                            <Item>
                                                <Header as='span' className={styles.columnHeader} size='small'>0</Header> Posts
                                            </Item>
                                        </Segment>
                                        <Segment attached>
                                            <Item>
                                                <Header as='span' className={styles.columnHeader} size='small'>0</Header> Followers
                                            </Item>
                                        </Segment>
                                        <Segment attached='bottom'>
                                            <Item>
                                                <Header as='span' className={styles.columnHeader} size='small'>0</Header> Following
                                            </Item>
                                        </Segment>
                                    </div>
                                </Item.Group>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Segment attached='bottom'>
                                <Item>
                                    <Menu className={styles.postsMenu} pointing secondary fluid>
                                        <Menu.Item onClick={() => this.handleItemClick('recent')} active={this.state.selectionTab === 'recent'}>Recent Posts</Menu.Item>
                                        <Menu.Item onClick={() => this.handleItemClick('popular')} active={this.state.selectionTab === 'popular'}>Popular Posts</Menu.Item>
                                        <Menu.Item onClick={() => this.handleItemClick('saved')} active={this.state.selectionTab === 'saved'}>Saved Posts</Menu.Item>
                                    </Menu>
                                </Item>
                            </Segment>
                        </Grid.Row>
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
    user: state.user
})

interface DispatchProps {
    updateAvatar: (formData: FormData, username: string, token: string) => void,
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    updateAvatar: bindActionCreators(UPDATE_AVATAR_USER, dispatch)
})

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(UserView as ComponentType<IProps>));