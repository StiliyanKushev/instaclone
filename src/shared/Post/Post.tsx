// IMPORT STYLES
import 'react-lazy-load-image-component/src/effects/blur.css';
import styles from './Post.module.css';

// IMPORT REACT RELATED
import React from 'react';
import { Link } from 'react-router-dom';
import { Segment, Image, Header, Menu, Item, Icon, Form, Button, Placeholder, PlaceholderImage } from 'semantic-ui-react';

// IMPORT OTHER
import { settings } from '../../settings';
import { IPost } from '../PostsPartial/PostsPartial';
import defaultUserImage from '../../assets/avatar.jpg';

interface IParentProps {
    post: IPost,
    isLoaded:boolean,
    measure: () => void,
}

type IProps = IParentProps;

const Post = (props:IProps) => {
        if(!props.isLoaded)
        return (
            <div className={styles.container}>
                <Segment className={styles.profileSegmentInternal} attached='top'>
                    <Image className={styles.verySmallImg} circular size='tiny' src={defaultUserImage}></Image>
                    <Link to='#'>
                        <Header size='small' className={styles.headerName} as='span'>loading</Header>
                    </Link>
                </Segment>
                <div className={styles.imageContainer}>
                    <Placeholder className={styles.imagePlaceholder}>
                        <PlaceholderImage>

                        </PlaceholderImage>
                    </Placeholder>
                    {/* <Image onLoad={props.measure} src={`${settings.BASE_URL}/feed/photo/post/${props.post._id}`} className={styles.image}></Image> */}
                    {/* <Image onLoad={props.measure} src={`data:${props.post.source.contentType};base64,${Buffer.from(props.post.source.data).toString('base64')}`} /> */}
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
                    <Header className={styles.likes} size='tiny'>{0} likes</Header>
                    <Header className={styles.description} size='tiny'>
                        <Header size='tiny' className={styles.commentUsername} as='span'>loading</Header>
                        <Header className={styles.commentText} as='span' size='tiny'>loading</Header>
                    </Header>
                    <Link to='#'>
                        <Header className={styles.viewAllComments} size='tiny' disabled>View all comments</Header>
                    </Link>
                    {
                        //backend will return the first 3-4 messeges only
                        // props.post.messeges.map((messege,index) => (

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

        if(props.post)
        return (
            <div className={styles.container}>
                <Segment className={styles.profileSegmentInternal} attached='top'>
                    <Image className={styles.verySmallImg} circular size='tiny' src={`${settings.BASE_URL}/feed/photo/user/${props.post.creator}`}></Image>
                    <Link to={`/profile/${props.post.creator}`}>
                        <Header size='small' className={styles.headerName} as='span'>{props.post.creator}</Header>
                    </Link>
                </Segment>
                <div className={styles.imageContainer}>
                    {/* <Image onLoad={props.measure} src={`${settings.BASE_URL}/feed/photo/post/${props.post._id}`} className={styles.image}></Image> */}
                    <Image className={styles.image} onLoad={props.measure} src={`data:${props.post.source.contentType};base64,${Buffer.from(props.post.source.data).toString('base64')}`} />
                    {/* <Image onLoad={props.measure} src={``} /> */}
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
                    <Header className={styles.likes} size='tiny'>{props.post.likesCount} likes</Header>
                    <Header className={styles.description} size='tiny'>
                        <Header size='tiny' className={styles.commentUsername} as='span'>{props.post.creator}</Header>
                        <Header className={styles.commentText} as='span' size='tiny'> {props.post.description}</Header>
                    </Header>
                    <Link to='#'>
                        <Header className={styles.viewAllComments} size='tiny' disabled>View all comments</Header>
                    </Link>
                    {
                        //backend will return the first 3-4 messeges only
                        // props.post.messeges.map((messege,index) => (

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

export default React.memo(Post as any);