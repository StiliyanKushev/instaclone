import React, { ComponentType } from 'react';
import { Container, Grid, Segment, Button, Header,Image, Divider, Form } from 'semantic-ui-react';

import styles from './HomeView.module.css';
import defaultUserImage from '../../assets/avatar.jpg';
import { connect } from 'react-redux';
import { ReduxProps, AppState } from '../../reducers';
import { settings } from '../../settings';

type IProps = ReduxProps;

class HomeView extends React.Component<IProps>{
    render(){
        return (
            <div className='view-container'>
                <Container>
                    <Grid>
                        <Grid.Column id={styles.firstColumn} width='10'>
                            <Segment className={styles.uploadImageSegment}>
                                <Form className={styles.uploadImageForm}>
                                    <Form.Field>
                                        <Button secondary>Upload</Button>
                                    </Form.Field>
                                    <Form.Field>
                                        <Form.Input iconPosition='left' icon='rocketchat' type='text' placeholder='Description'></Form.Input>
                                    </Form.Field>
                                    <Button primary>Add Post</Button>
                                </Form>
                            </Segment>
                            <Segment className={styles.uploadImageSegmentMobile}>
                                <Form className={styles.uploadImageFormMobile}>
                                    <Form.Field className={styles.buttonsFormMobile}>
                                        <Button secondary>Upload</Button>
                                        <Button primary>Add Post</Button>
                                    </Form.Field>
                                    <Form.Field>
                                        <Form.Input iconPosition='left' icon='rocketchat' type='text' placeholder='Description'></Form.Input>
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

const mapStateToProps = (state:AppState):ReduxProps => ({
    auth:state.auth,
  })

export default connect(mapStateToProps,null)(HomeView as ComponentType<IProps>);