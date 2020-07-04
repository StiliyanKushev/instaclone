import React, { ComponentType } from 'react';
import { Segment, Image, Header, Menu, Container, Item, Icon, Form, FormField, Button } from 'semantic-ui-react';
import { settings } from '../../settings';
import _ from 'lodash';
import styles from './PostsPartial.module.css';
import { LazyLoadImage, trackWindowScroll, LazyComponentProps }
    from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link } from 'react-router-dom';

interface IParentProps {
    newPosts: Array<IPost>,
    handleNewLastSeenPost: () => void
}

export interface IPost {
    creator: string,
    _id: string,
    description: string,
    likesCount: number,
    //todo comments
}

export interface IPostsPartialState {
    posts: Array<IPost>
}

type IProps = IParentProps & LazyComponentProps;

class PostsPartial extends React.Component<IProps>{
    state: IPostsPartialState = { posts: [] }
    
    constructor(props: IProps) {
        super(props);

        this.handleNewPosts = this.handleNewPosts.bind(this);
        this.renderRow = this.renderRow.bind(this);
    }

    private handleNewPosts() {
        this.setState((prevState: IPostsPartialState) => ({
            posts: [...prevState.posts, ...this.props.newPosts]
        }))
    }

    public componentDidMount() {
        this.handleNewPosts();
    }

    public componentWillUpdate(prevProps: IProps) {
        if (!_.isEqual(prevProps.newPosts, this.props.newPosts)) {
            this.handleNewPosts();
        }
    }

    private renderRow(post:IPost) {
        return (
            <div key={post._id} className={styles.container}>
                <Segment className={styles.profileSegmentInternal} attached='top'>
                    <Image className={styles.verySmallImg} circular size='tiny' src={`${settings.BASE_URL}/feed/photo/user/${post.creator}`}></Image>
                    <Link to={`/profile/${post.creator}`}>
                        <Header size='small' className={styles.headerName} as='span'>{post.creator}</Header>
                    </Link>
                </Segment>
                <Segment className={styles.imageContainer} attached>
                    <LazyLoadImage
                        afterLoad={this.props.handleNewLastSeenPost}
                        scrollPosition={this.props.scrollPosition}
                        className={styles.image}
                        effect="blur"
                        src={`${settings.BASE_URL}/feed/photo/post/${post._id}`}
                    ></LazyLoadImage>
                    {/* <Image src={`${settings.BASE_URL}/feed/photo/post/${post._id}`} className={styles.image}></Image> */}
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
                    <Header className={styles.likes} size='tiny'>{post.likesCount} likes</Header>
                    <Header className={styles.description} size='tiny'>
                        <Header size='tiny' className={styles.commentUsername} as='span'>{post.creator}</Header>
                        <Header className={styles.commentText} as='span' size='tiny'> {post.description}</Header>
                    </Header>
                    <Link to='#'>
                        <Header className={styles.viewAllComments} size='tiny' disabled>View all comments</Header>
                        {
                            //backend will return the first 3-4 messeges only
                            // post.messeges.map((messege,index) => (

                            // ))
                        }
                        <Form>
                            <Form.Field className={styles.commentField}>
                                <Form.Input
                                    className={styles.commentInput}
                                    placeholder='Adding comment ...'
                                >

                                </Form.Input>
                                <Button className={styles.commentSubmit} size='medium' primary>Comment</Button>
                            </Form.Field>
                        </Form>
                    </Link>
                </Segment>
            </div>
        )
    }

    public render() {
        return (
            <div className={styles.mainContainer}>
                {
                    this.state.posts.map(this.renderRow)
                }
            </div>
        );
    }
}

export default trackWindowScroll(PostsPartial as ComponentType<IProps>);