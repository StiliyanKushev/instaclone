// IMPORT STYLES
import 'react-lazy-load-image-component/src/effects/blur.css';
import styles from './Post.module.css';

// IMPORT REACT RELATED
import React from 'react';
import { Link } from 'react-router-dom';
import { Segment, Image, Header, Menu, Item, Icon, Form, Button } from 'semantic-ui-react';

// IMPORT OTHER
import { settings } from '../../settings';
import { IPost } from '../PostsPartial/PostsPartial';


interface IParentProps {
    post: IPost,
    handleNewLastSeenPost: () => void,
    scrollPosition: any,
    measure: () => void
}

type IProps = IParentProps;

class Post extends React.PureComponent<IProps>{
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
                <div className={styles.imageContainer}>
                    <Image onLoad={this.handleLoad.bind(this)} src={`${settings.BASE_URL}/feed/photo/post/${this.props.post._id}`} className={styles.image}></Image>
                </div>
                
                <Segment className={styles.bottomSegment} attached='bottom'>
                    <>
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
                    </>
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