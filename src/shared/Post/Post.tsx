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
import { COMMENT_POST, LIKE_POST, SAVE_POST, TOGGLE_FULL_POST_VIEW, CALL_FULL_POST_SAVE_SUCCESS, CALL_FULL_POST_LIKE_SUCCESS } from '../../actions/postActions';
import { ThunkDispatch } from 'redux-thunk';
import { bindActionCreators } from 'redux';
import { TOGGLE_USERS_LIST } from '../../actions/userActions';

// IMPORT TYPES
import { ICreator } from '../../types/auth';
import IGenericResponse from '../../types/response';

// IMPORT OTHER
import { toast } from 'react-toastify';
import { settings } from '../../settings';
import defaultUserImage from '../../assets/avatar.jpg';
import { getUserLikesFromPost } from '../../handlers/post';

interface IParentProps {
    postIndex: number,
    isLoaded: boolean,
    measure: () => void,
}

type IProps = IParentProps & DispatchProps & ReduxProps;

interface IState {
    comment: string,
}

class Post extends React.PureComponent<IProps, IState> {
    public state: IState = { comment: '' }

    public componentDidUpdate() {
        this.props.measure();
    }

    private handleComment() {
        if (this.state.comment.trim().length >= 5) {
            if (this.props.auth && this.props.post) // just so es-lint shuts up
                this.props.comment(this.props.postIndex, this.props.post?.homePosts[this.props.postIndex]._id, this.props.auth?.userId, this.state.comment, this.props.auth?.token);
            this.setState({ comment: '' });

            // resize the row size after adding new comment
            this.props.measure();
        }
        else {
            toast.error('Comment has to be at least 5 chars long.');
        }
    }

    private handleLikesClick() {
        this.props.toggleUserLikes((startIndex: number, stopIndex: number) => {
            return getUserLikesFromPost(startIndex, stopIndex, this.props.auth?.userId as string, this.props.post?.homePosts[this.props.postIndex]._id as string, this.props.auth?.token as string);
        });
    }

    private handleLike() {
        if (this.props.auth && this.props.post) // just so es-lint shuts up
            this.props.like(this.props.postIndex, this.props.post?.homePosts[this.props.postIndex]._id, this.props.auth?.userId, this.props.auth?.token)
        this.props.likeFullView('liked full post', true);
    }

    private handleSave() {
        if (this.props.auth && this.props.post) // just so es-lint shuts up
            this.props.save(this.props.postIndex, this.props.post?.homePosts[this.props.postIndex]._id, this.props.auth?.userId, this.props.auth?.token)
        this.props.saveFullView('saved full post', true);
    }

    private handleShare() {
        let urlText = `http://localhost:3000/post/${this.props.post?.homePosts[this.props.postIndex]._id}`;
        if(this.copyTextToClipboard(urlText)){
            toast.success("Copied to clipboard.");
        }
        else{
            toast.success("Could not be copied to clipboard.");
        }
    }

    private copyTextToClipboard(text: string) {
        let textArea: HTMLTextAreaElement = document.createElement("textarea") as HTMLTextAreaElement;

        // Place in top-left corner of screen regardless of scroll position.
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.style.width = '2em';
        textArea.style.height = '2em';

        // We don't need padding, reducing the size if it does flash render.
        textArea.style.padding = '0';

        // Clean up any borders.
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';

        // Avoid flash of white box if rendered for any reason.
        textArea.style.background = 'transparent';


        textArea.value = text;

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        let res: boolean = true;

        try {
            var successful = document.execCommand('copy');
            res = successful ? true : false;
        } catch (err) {
            res = false;
        }

        document.body.removeChild(textArea);

        return res;
    }

    public render() {
        if (!this.props.isLoaded)
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
                    </div>
                    <Segment className={styles.bottomSegment} attached='bottom'>
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

        if (this.props.post)
            return (
                <div className={styles.container}>
                    <Segment className={styles.profileSegmentInternal} attached='top'>
                        <Image className={styles.verySmallImg} circular size='tiny' src={`${settings.BASE_URL}/feed/photo/user/${this.props.post?.homePosts[this.props.postIndex].creator.username}`}></Image>
                        <Link to={`/profile/${this.props.post?.homePosts[this.props.postIndex].creator.username}`}>
                            <Header size='small' className={styles.headerName} as='span'>{this.props.post?.homePosts[this.props.postIndex].creator.username}</Header>
                        </Link>
                    </Segment>
                    <div className={styles.imageContainer}>
                        <Image onLoad={this.props.measure} className={styles.image} src={`data:${this.props.post?.homePosts[this.props.postIndex].source.contentType};base64,${Buffer.from(this.props.post?.homePosts[this.props.postIndex].source.data).toString('base64')}`} />
                    </div>
                    <Segment className={styles.bottomSegment} attached='bottom'>
                        <Menu className={styles.postMenu}>
                            <Item className='left'>
                                <Icon onClick={this.handleLike.bind(this)} id={!this.props.post.homePosts[this.props.postIndex].isLiked ? `${styles.likeOutline}` : ''} className={`${styles.likeBtn} ${styles.iconBtn} heart ${this.props.post.homePosts[this.props.postIndex].isLiked ? '' : 'outline'}`} size='big'></Icon>
                                <Link className={styles.linkWithNoColor} to={`/post/${this.props.post.homePosts[this.props.postIndex]._id}`}>
                                    <Icon className={styles.iconBtn} size='big' name='comment outline'></Icon>
                                </Link>
                                <Icon onClick={this.handleShare.bind(this)} className={styles.iconBtn} size='big' name='paper plane outline'></Icon>
                            </Item>
                            <Item className='right'>
                                <Icon onClick={this.handleSave.bind(this)} id={!this.props.post.homePosts[this.props.postIndex].isSaved ? `${styles.savedOutline}` : ''} className={`${styles.saveBtn} ${styles.iconBtn} bookmark ${this.props.post.homePosts[this.props.postIndex].isSaved ? '' : 'outline'}`} size='big'></Icon>
                            </Item>
                        </Menu>
                        <Header onClick={this.handleLikesClick.bind(this)} className={styles.likes} size='tiny'>{this.props.post.homePosts[this.props.postIndex].likesCount} likes</Header>
                        <Header className={styles.description} size='tiny'>
                            <Link to={`/profile/${this.props.post?.homePosts[this.props.postIndex].creator.username}`}><Header size='tiny' className={styles.commentUsername} as='span'>{this.props.post?.homePosts[this.props.postIndex].creator.username}</Header></Link>
                            <Header className={styles.commentText} as='span' size='tiny'> {this.props.post?.homePosts[this.props.postIndex].description}</Header>
                        </Header>
                        <Header onClick={() => this.props.toggleFullView(this.props.postIndex)} className={styles.viewAllComments} size='tiny' disabled>View all comments</Header>
                        {
                            // backend will return the first 3-4 messeges only (own comments + other comments)
                            this.props.post.homePosts[this.props.postIndex].ownComments.map((comment, index) => (
                                <Header key={index} className={styles.description} size='tiny'>
                                    <Link to={`/profile/${this.props.auth?.username}`}><Header size='tiny' className={styles.commentUsername} as='span'>{this.props.auth?.username}</Header></Link>
                                    <Header className={styles.commentText} as='span' size='tiny'> {comment.content}</Header>
                                </Header>
                            ))
                        }
                        {
                            this.props.post.homePosts[this.props.postIndex].comments.map((comment, index) => (
                                <Header key={index} className={styles.description} size='tiny'>
                                    <Link to={`/profile/${comment.creator?.username}`}><Header size='tiny' className={styles.commentUsername} as='span'>{comment.creator?.username}</Header></Link>
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
                                    onChange={(e) => this.setState({ comment: e.target.value })}
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

const mapStateToProps = (state: AppState): ReduxProps => ({
    auth: state.auth,
    post: state.post,
})

interface DispatchProps {
    save: (postIndex: number, postId: string, userId: string, token: string) => void,
    like: (postIndex: number, postId: string, userId: string, token: string) => void,
    comment: (postIndex: number, postId: string, userId: string, comment: string, token: string) => void,
    toggleFullView: (postIndex: number) => void,
    likeFullView: (messenge: string, force: boolean) => void,
    saveFullView: (messenge: string, force: boolean) => void,
    toggleUserLikes: (fetchFunction: (startIndex: number, stopIndex: number) => Promise<IGenericResponse & { likes: Array<ICreator> }>) => void,
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    comment: bindActionCreators(COMMENT_POST, dispatch),
    like: bindActionCreators(LIKE_POST, dispatch),
    likeFullView: bindActionCreators(CALL_FULL_POST_LIKE_SUCCESS, dispatch),
    save: bindActionCreators(SAVE_POST, dispatch),
    saveFullView: bindActionCreators(CALL_FULL_POST_SAVE_SUCCESS, dispatch),
    toggleFullView: bindActionCreators(TOGGLE_FULL_POST_VIEW, dispatch),
    toggleUserLikes: bindActionCreators(TOGGLE_USERS_LIST, dispatch)
})

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(Post as ComponentType<any>));