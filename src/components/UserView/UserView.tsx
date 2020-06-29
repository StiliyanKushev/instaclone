import React from 'react';
import styles from './UserView.module.css';
import avatar from '../../assets/avatar.jpg';
import { Container, Grid, Item, Segment, Header, Button, Image, Menu } from 'semantic-ui-react';
import { ReactCookieProps, withCookies } from 'react-cookie';
import UserSettings from '../UserSettings/UserSettings';

type IProps = ReactCookieProps;
interface IState {
    selectionTab:string,
    settingsPopup:boolean,
}

class UserView extends React.Component<IProps,IState> {
    state:IState = {selectionTab:'recent',settingsPopup:false}

    constructor(props:IProps){
        super(props);

        this.handleItemClick = this.handleItemClick.bind(this);
        this.handleSettingClick = this.handleSettingClick.bind(this);
        this.handleCloseSettings = this.handleCloseSettings.bind(this);
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

    render() {
        return (
            <div className='view-container'>
                <Container className={styles.container}>
                    <Grid>
                        <Grid.Row className={styles.userRow}>
                            <Grid.Column className={styles.columnFit}>
                                <Image className={styles.avatar} size='small' circular src={avatar} />
                            </Grid.Column>
                            <Grid.Column id={styles.seccondColumn} widescreen='10'>
                                <Item.Group>
                                    <Segment attached='top' padded>
                                        <Item>
                                            <Grid className={styles.fluidGrid}>
                                                <Grid.Column className={styles.usernameColumn}><Header className={styles.username} as='h1'>{this.props.cookies?.get('username')}</Header></Grid.Column>
                                                <Grid.Column className={styles.userSettingsBtns} floated='right'><Button secondary>Edit Profile</Button><Button onClick={this.handleSettingClick} primary icon='setting'></Button></Grid.Column>
                                            </Grid>
                                        </Item>
                                    </Segment>
                                    <Segment className={styles.userSettingsBtns2} attached>
                                        <Button size='mini' className={styles.editBtn2} secondary>Edit Profile</Button><Button onClick={this.handleSettingClick} className={styles.settingsBtn2} size='mini' primary icon='setting'></Button>
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
                                        <Menu.Item onClick={() => this.handleItemClick('commented')} active={this.state.selectionTab === 'commented'}>Commented Posts</Menu.Item>
                                    </Menu>
                                </Item>
                            </Segment>
                        </Grid.Row>
                    </Grid>
                </Container>
                
                {this.state.settingsPopup && <UserSettings handleClose={this.handleCloseSettings} />}
            </div>
        );
    }
}

export default withCookies(UserView);