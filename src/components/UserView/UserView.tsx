import React, { FunctionComponentElement } from 'react';
import { Container, Grid, ItemGroup, Item, Segment, Header, Button, Icon, Image, Menu } from 'semantic-ui-react';

import avatar from '../../assets/avatar.jpg';

import styles from './UserView.module.css';

class UserView extends React.Component {
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
                                                <Grid.Column className={styles.usernameColumn}><Header className={styles.username} as='h1'>Username</Header></Grid.Column>
                                                <Grid.Column className={styles.userSettingsBtns} floated='right'><Button secondary>Edit Profile</Button><Button primary icon='setting'></Button></Grid.Column>
                                            </Grid>
                                        </Item>
                                    </Segment>
                                    <Segment className={styles.userSettingsBtns2} attached>
                                        <Button size='mini' className={styles.editBtn2} secondary>Edit Profile</Button><Button className={styles.settingsBtn2} size='mini' primary icon='setting'></Button>
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
                                        <Menu.Item active>Recent Posts</Menu.Item>
                                        <Menu.Item>Popular Posts</Menu.Item>
                                        <Menu.Item>Commented Posts</Menu.Item>
                                    </Menu>
                                </Item>
                            </Segment>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    }
}

export default UserView;