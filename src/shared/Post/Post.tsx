import React from 'react';
import { IPost } from '../PostsPartial/PostsPartial';

import { Segment, Image, Header, Menu, Container, Item, Icon, Form, Button } from 'semantic-ui-react';
import { settings } from '../../settings';
import _ from 'lodash';
import styles from './Post.module.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link } from 'react-router-dom';


interface IParentProps {
    post: IPost,
    handleNewLastSeenPost: () => void,
    scrollPosition: any,
    measure: () => void
}

type IProps = IParentProps;

class Post extends React.Component<IProps>{
    private handleLoad() {
        this.props.handleNewLastSeenPost();
        this.props.measure();
    }

    render() {
        return (
            <div key={this.props.post._id} className={styles.container}>
                <Segment className={styles.profileSegmentInternal} attached='top'>
                    <Image className={styles.verySmallImg} circular size='tiny' src={`${settings.BASE_URL}/feed/photo/user/${this.props.post.creator}`}></Image>
                    <Link to={`/profile/${this.props.post.creator}`}>
                        <Header size='small' className={styles.headerName} as='span'>{this.props.post.creator}</Header>
                    </Link>
                </Segment>
                <Segment className={styles.imageContainer} attached>
                    <Image onLoad={this.handleLoad.bind(this)} src={`${settings.BASE_URL}/feed/photo/post/${this.props.post._id}`} className={styles.image}></Image>
                </Segment>
                
                <Segment className={styles.bottomSegment} attached='bottom'>
                    <Container>
                        <Menu className={styles.postMenu}>
                            <Item className='left'>
                                <Icon className={styles.iconBtn} size='big' name='heart outline'></Icon>
                                <Icon className={styles.iconBtn} size='big' name='comment outline'></Icon>
                                <Icon className={styles.iconBtn} size='big' name='paper plane outline'></Icon>
                            </Item>
                            <Item className='right'>
                                <Icon className={styles.iconBtn} size='big' name='bookmark outline'></Icon>
                            </Item>
                        </Menu>
                    </Container>
                    <Header className={styles.likes} size='tiny'>{this.props.post.likesCount} likes</Header>
                    <Header className={styles.description} size='tiny'>
                        <Header size='tiny' className={styles.commentUsername} as='span'>{this.props.post.creator}</Header>
                        <Header className={styles.commentText} as='span' size='tiny'> {this.props.post.description}</Header>
                    </Header>
                    <Link to='#'>
                        <Header className={styles.viewAllComments} size='tiny' disabled>View all comments</Header>
                    </Link>
                    {
                        //backend will return the first 3-4 messeges only
                        // this.props.post.messeges.map((messege,index) => (

                        // ))
                    }
                    <Form className={styles.commentForm}>
                        <Form.Field className={styles.commentField}>
                            <Form.Input
                                className={styles.commentInput}
                                placeholder='Adding comment ...'
                            >

                            </Form.Input>
                            <Button className={styles.commentSubmit} size='medium' primary>Comment</Button>
                        </Form.Field>
                    </Form>
                </Segment>
            </div>
        )
    }
}

export default React.memo(Post);