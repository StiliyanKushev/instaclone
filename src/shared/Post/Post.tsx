// IMPORT STYLES
import 'react-lazy-load-image-component/src/effects/blur.css';
import styles from './Post.module.css';

// IMPORT REACT RELATED
import React, { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Image, Header, Menu, Item, Icon, Form, Button, Placeholder, PlaceholderImage } from 'semantic-ui-react';

// IMPORT REDUX RELETED
import { AppState, ReduxProps } from '../../reducers';
import { connect } from 'react-redux';
import { AppActions } from '../../actions/types/actions';
import { COMMENT_POST,LIKE_POST } from '../../actions/postActions';
import { ThunkDispatch } from 'redux-thunk';
import {bindActionCreators} from 'redux';

// IMPORT OTHER
import { settings } from '../../settings';
import { IPost } from '../PostsPartial/PostsPartial';
import defaultUserImage from '../../assets/avatar.jpg';

interface IParentProps {
    postIndex:number,
    postData: IPost,
    isLoaded:boolean,
    measure: () => void,
}

type IProps = IParentProps & DispatchProps & ReduxProps;

interface IState {
    comment: string,
}

class Post extends React.PureComponent<IProps,IState> {
    public state: IState = { comment:'' }

    private handleComment(){
        if(this.props.auth) // just so es-lint shuts up
        this.props.comment(this.props.postIndex,this.props.postData._id,this.props.auth?.username,this.state.comment,this.props.auth?.token);
        this.setState({comment:''});

        // resize the row size after adding new comment
        this.props.measure();
    }

    private handleLike(){
        if(this.props.auth) // just so es-lint shuts up
        this.props.like(this.props.postIndex,this.props.postData._id,this.props.auth?.username,this.props.auth?.token)
    }

    public render(){
        if(!this.props.isLoaded)
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
                    {/* <Image onLoad={this.props.measure} src={`${settings.BASE_URL}/feed/photo/post/${this.props.post._id}`} className={styles.image}></Image> */}
                    {/* <Image onLoad={this.props.measure} src={`data:${this.props.post.source.contentType};base64,${Buffer.from(this.props.post.source.data).toString('base64')}`} /> */}
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

        if(this.props.post)
        return (
            <div className={styles.container}>
                <Segment className={styles.profileSegmentInternal} attached='top'>
                    <Image className={styles.verySmallImg} circular size='tiny' src={`${settings.BASE_URL}/feed/photo/user/${this.props.postData.creator}`}></Image>
                    <Link to={`/profile/${this.props.postData.creator}`}>
                        <Header size='small' className={styles.headerName} as='span'>{this.props.postData.creator}</Header>
                    </Link>
                </Segment>
                <div className={styles.imageContainer}>
                    <Image className={styles.image} onLoad={this.props.measure} src={`data:${this.props.postData.source.contentType};base64,${Buffer.from(this.props.postData.source.data).toString('base64')}`} />
                </div>
                
                <Segment className={styles.bottomSegment} attached='bottom'>
                    <>
                        <Menu className={styles.postMenu}>
                            <Item className='left'>
                                <Icon onClick={this.handleLike.bind(this)} className={`${styles.iconBtn} heart ${this.props.post.homePosts[this.props.postIndex].isLiked ? '' : 'outline'}`} size='big'></Icon>
                                <Icon className={styles.iconBtn} size='big' name='comment outline'></Icon>
                                <Icon className={styles.iconBtn} size='big' name='paper plane outline'></Icon>
                            </Item>
                            <Item className='right'>
                                <Icon className={styles.iconBtn} size='big' name='bookmark outline'></Icon>
                            </Item>
                        </Menu>
                    </>
                    <Header className={styles.likes} size='tiny'>{this.props.post.homePosts[this.props.postIndex].likesCount} likes</Header>
                    <Header className={styles.description} size='tiny'>
                        <Header size='tiny' className={styles.commentUsername} as='span'>{this.props.postData.creator}</Header>
                        <Header className={styles.commentText} as='span' size='tiny'> {this.props.postData.description}</Header>
                    </Header>
                    <Link to='#'>
                        <Header className={styles.viewAllComments} size='tiny' disabled>View all comments</Header>
                    </Link>
                    {
                        //backend will return the first 3-4 messeges only
                        this.props.post.homePosts[this.props.postIndex].ownComments.map((comment:any,index) => (
                            <Header key={index} className={styles.description} size='tiny'>
                                <Header size='tiny' className={styles.commentUsername} as='span'>{this.props.auth?.username}</Header>
                                <Header className={styles.commentText} as='span' size='tiny'> {comment.content}</Header>
                            </Header>
                        ))
                    }
                    {
                        //backend will return the first 3-4 messeges only
                        this.props.postData.comments.map((comment:any,index) => (
                            <Header key={index} className={styles.description} size='tiny'>
                                <Header size='tiny' className={styles.commentUsername} as='span'>{comment.creator}</Header>
                                <Header className={styles.commentText} as='span' size='tiny'> {comment.content}</Header>
                            </Header>
                        ))
                    }
                    <Form className={styles.commentForm}>
                        <Form.Field className={styles.commentField}>
                            <Form.Input
                                className={styles.commentInput}
                                placeholder='Adding comment ...'
                                value={this.state.comment}
                                onChange={(e) => this.setState({comment:e.target.value})}
                            >

                            </Form.Input>
                            <Button loading={this.props.post.isPostLoading} onClick={this.handleComment.bind(this)} className={styles.commentSubmit} size='medium' primary>Comment</Button>
                        </Form.Field>
                    </Form>
                </Segment>
            </div>
        )
    }
}

const mapStateToProps = (state:AppState):ReduxProps => ({
    auth:state.auth,
    post:state.post,
})

interface DispatchProps {
    like:(postIndex:number,postId:string,username:string,token:string) => void
    comment: (postIndex:number,postId: string, username: string, comment: string, token: string) => void,
}

const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,AppActions>):DispatchProps => ({
    comment:bindActionCreators(COMMENT_POST,dispatch),
    like:bindActionCreators(LIKE_POST,dispatch),
})

export default React.memo(connect(mapStateToProps,mapDispatchToProps)(Post as ComponentType<any>));