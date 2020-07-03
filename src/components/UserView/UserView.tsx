import React, { ComponentType, createRef } from 'react';
import styles from './UserView.module.css';
import { Container, Grid, Item, Segment, Header, Button, Image, Menu, Ref } from 'semantic-ui-react';
import { ReactCookieProps, withCookies } from 'react-cookie';
import UserSettings from '../UserSettings/UserSettings';
import EditProfile from '../EditProfile/EditProfile';
import { connect } from 'react-redux';
import { AppState, ReduxProps } from '../../reducers';
import $ from 'jquery';
import { sendUserAvatar } from '../../handlers/user';
import { settings } from '../../settings';
import { toast } from 'react-toastify';

type IProps = ReactCookieProps & ReduxProps;

interface IState {
    selectionTab:string,
    settingsPopup:boolean,
    editProfilePopup:boolean,
    userImage:string
}

class UserView extends React.Component<IProps,IState> {
    state:IState = {userImage:'',selectionTab:'recent',settingsPopup:false,editProfilePopup:false}
    private userImageRef = createRef<HTMLImageElement>();

    constructor(props:IProps){
        super(props);

        this.handleItemClick = this.handleItemClick.bind(this);
        this.handleSettingClick = this.handleSettingClick.bind(this);
        this.handleEditProfileClick = this.handleEditProfileClick.bind(this);
        this.handleCloseSettings = this.handleCloseSettings.bind(this);
        this.handleCloseEditProfile = this.handleCloseEditProfile.bind(this);
        this.handleChangeAvatar = this.handleChangeAvatar.bind(this);
    }

    public componentDidMount(){
        let un = this.props.auth?.username;
        let imageRef = this.userImageRef.current;
        $(imageRef as any).attr('src',`${settings.BASE_URL}/feed/photo/user/${un}`);

        $('#global-file-input').change((e:any) => {
            let file = e.target.files[0];

            if(file){
                let formData = new FormData();
                formData.append('image',file);

                if(this.props.auth?.username)
                sendUserAvatar(formData,this.props.auth?.username,this.props.auth?.token).then((res) => {
                    toast.success(res.messege);
                    let date = new Date();
                    $(imageRef as any).attr("src", `${settings.BASE_URL}/feed/photo/user/${un}?`+date.getTime());
                });
            }

            $('#global-file-input').val('');
        });
    }

    private handleEditProfileClick(e:React.MouseEvent<HTMLButtonElement>){
        e.preventDefault();
        this.setState({editProfilePopup:true})
    }

    private handleCloseEditProfile(){
        this.setState({editProfilePopup:false})
    }

    private handleCloseSettings(){
        this.setState({settingsPopup:false})
    }

    private handleItemClick(selectionTab:string){
        this.setState({selectionTab})
    }

    private handleSettingClick(e:React.MouseEvent<HTMLButtonElement>){
        e.preventDefault();
        this.setState({settingsPopup:true});
    }

    private handleChangeAvatar(e:React.MouseEvent<HTMLImageElement>){
        e.preventDefault();

        $('#global-file-input').trigger('click');
    }

    render() {
        return (
            <div className='view-container'>
                <Container className={styles.container}>
                    <Grid>
                        <Grid.Row className={styles.userRow}>
                            <Grid.Column className={styles.columnFit}>
                                <Ref innerRef={this.userImageRef}>
                                    <Image onClick={this.handleChangeAvatar} className={styles.avatar} size='small' circular src={this.state.userImage} />
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

const mapStateToProps = (state:AppState):ReduxProps => ({
    auth:state.auth
})

export default withCookies(connect(mapStateToProps,null)(UserView as ComponentType<IProps>));