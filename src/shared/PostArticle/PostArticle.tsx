// IMPORT REACT RELETED
import React, {
    ComponentType,
    createRef,
} from 'react';

import $ from 'jquery';
import {
    ReactCookieProps,
    withCookies,
} from 'react-cookie';
// IMPORT REDUX RELETED
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
// IMPORT ROUTER RELETED
import {
    Link,
    withRouter,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    AutoSizer,
    CellMeasurer,
    CellMeasurerCache,
    InfiniteLoader,
    InfiniteLoaderChildProps,
    List,
} from 'react-virtualized';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
    Button,
    Form,
    Grid,
    Header,
    Icon,
    Image,
    Item,
    Menu,
    Placeholder,
    PlaceholderImage,
    Ref,
    Segment,
} from 'semantic-ui-react';

import {
    ADD_COMMENTS_POST,
    CALL_POST_DELETE,
    TOGGLE_MORE_COMMENT,
    TOGGLE_MORE_COMMENT_NO_FETCH,
} from '../../actions/postActions';
import { AppActions } from '../../actions/types/actions';
import { TOGGLE_USERS_LIST } from '../../actions/userActions';
import {
    getNewCommentsChunk,
    getUserLikesFromPost,
} from '../../handlers/post';
import {
    AppState,
    ReduxProps,
} from '../../reducers';
// IMPORT OTHER
import { settings } from '../../settings';
// IMPORT TYPES
import { ICreator } from '../../types/auth';
import IGenericResponse, { ICommentsChunkResponse } from '../../types/response';
import PostComment from '../PostComment/PostComment';
import { IPostComment } from '../PostsPartial/PostsPartial';
import SubComments from '../SubComments/SubComments';
// IMPORT STYLES
import styles from './PostArticle.module.css';

interface IState {
    comment: string;
    hasMoreComments: boolean;
}

interface IParentProps {
    handleLike: () => void,
    handleSave: () => void,
    handleComment: (comment: string,replyCommentId?: string) => void,
}

type IProps = IParentProps & ReduxProps & ReactCookieProps & DispatchProps & RouteComponentProps;

class PostArticle extends React.PureComponent<IProps, IState> {
    public state: IState = { comment: "", hasMoreComments: true };
    private cache: CellMeasurerCache;

    private commentInputElRef = createRef<HTMLInputElement>();

    private get isCreator(){
        let creator = this.props.post?.fullViewPostData.creator.username;
        let current = this.props.auth?.username;

        if(creator === current && creator){
            return true;
        }

        return false;
    }

    private get rowCount(): number {
        let comments: any = this.props.post?.fullViewPostData.commentsList;
        return this.state.hasMoreComments ? comments.length + 10 : comments.length;
    }

    constructor(props: IProps) {
        super(props);

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 46,
        });
    }

    public componentDidUpdate(prevProps:IProps){
        const currentIndex = this.props.post?.currentReplyingComment as number;
        const currentSubIndex = this.props.post?.currentReplyingSubComment as number;

        if(prevProps.post?.currentReplyingComment !== currentIndex || prevProps.post?.currentReplyingSubComment !== currentSubIndex){
            // if user clicked cancel
            if(currentIndex === -1){
                this.setState({comment:''});
                return;
            }

            if(currentSubIndex === -1){
                // clear comment and set it to '@username of comment creator'
                this.setState({comment:`@${this.props.post?.fullViewPostData.commentsList[currentIndex].creator?.username as string} `});
            }
            else{
                // clear comment and set it to '@username of comment creator'
                this.setState({comment:`@${((this.props.post?.fullViewPostData.commentsList[currentIndex].subComments)as any)[currentSubIndex].creator?.username as string} `});
            }

            // focus the input field
            let input:HTMLInputElement = this.commentInputElRef.current?.children[0].children[0] as HTMLInputElement;
            $(input).focus();
        }
    }

    private handleResize(){
        // clear the cache and update it (this is the solution with best performance)
        this.cache.clearAll();
    }

    private handleMoreClick(commentIndex:number,measure:() => void){
        let maxEver = this.props.post?.fullViewPostData.commentsList[commentIndex].maxChildCommentsNumber as number;
        let currentCount = this.props.post?.fullViewPostData.commentsList[commentIndex].childCommentsNumber as number;
        let numPerPage = 5;

        // if user just commented and its the only comment, just close without making a fetch request 
        if(this.props.post?.fullViewPostData.commentsList[commentIndex].childCommentsNumber === 0 && this.props.post.didJustReplyToComment){
            this.props.toggleMoreCommentNoFetch(commentIndex);
            return;
        }

        // remove one from the fetching params if it was added already
        if(this.props.post?.didJustReplyToComment){
            maxEver--;
        }

        const multiplier = (maxEver - currentCount) / numPerPage;

        let startIndex = multiplier * numPerPage;
        let stopIndex = startIndex + numPerPage;

        this.props.toggleMoreComment(startIndex,stopIndex,this.props.post?.fullViewPostData.commentsList[commentIndex].id as string,commentIndex,this.props.auth?.userId as string,this.props.auth?.token as string);
        measure()
    }

    private handleLikesClick(){
        this.props.toggleUserLikes((startIndex:number,stopIndex:number) => {
            return getUserLikesFromPost(startIndex,stopIndex,this.props.auth?.userId as string, this.props.post?.fullViewPostData._id as string,this.props.auth?.token as string);
        });
    }

    private handleComment(){
        // if the actual comment (without the @anyusername - if it exists) is >= 5
        let reference = /^@\w+/gm.exec(this.state.comment);
        let refLength = reference != null ? reference[0].length : 0;

        let subComment = this.props.post?.fullViewPostData.commentsList[this.props.post.currentReplyingComment];

        if(this.state.comment.trim().length - refLength >= 5){
            this.props.handleComment(this.state.comment,subComment ? subComment.id : undefined);
            this.setState({ comment: "" });
        }
        else{
            toast.error('Comment has to be at least 5 chars long.');
        }
    }

    private async handleDelete(){
        let res = await this.props.deletePost(-1,this.props.post?.fullViewPostData._id as string,this.props.auth?.userId as string,this.props.auth?.token as string);
        if((res as unknown) as boolean){
            toast.success("Post Removed");
            this.props.history.push('/');
        }
        else{
            toast.error("There was an error removing the post");
        }
    }

    private fetchComments = ({ startIndex, stopIndex }: { startIndex: number, stopIndex: number }) => {
        return getNewCommentsChunk(startIndex, stopIndex, this.props.post?.fullViewPostData._id as string,this.props.auth?.userId as string , this.props.auth?.token as string).then((res:ICommentsChunkResponse) => {
            if (res.success) {
                if (res.comments.length === 0) {
                    // no more comments
                    this.setState({ hasMoreComments: false })
                }
                else {
                    this.props.ADD_COMMENTS_POST(res.comments);
                }
            }
            else {
                // internal error
            }
        })
    };

    private isRowLoaded = ({ index }: { index: number }) => {
        return !!this.props.post?.fullViewPostData.commentsList[index];
    };

    private renderRow({ index, key, style, parent }: any) {
        return (
            <CellMeasurer
                key={key}
                cache={this.cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}
            >
                {({ measure, registerChild }: any) => (
                    <div className={`row ${styles.rowContainer}`} ref={registerChild} style={style}>
                        <PostComment
                            commentIndex={index}
                            isLoaded={this.isRowLoaded({index})}
                            measure={measure}
                        />
                        {
                            index > 0 && this.props.post?.fullViewPostData.commentsList[index] && this.props.post?.fullViewPostData.commentsList[index].maxChildCommentsNumber as number > 0 && (
                                <React.Fragment>
                                    {
                                        this.props.post.fullViewPostData.commentsList[index].childCommentsNumber === 0 ? (
                                            <span onClick={(e) => this.handleMoreClick.bind(this)(index,measure)} className={styles.showMore}>close</span>
                                        ) : (
                                            <span onClick={(e) => this.handleMoreClick.bind(this)(index,measure)} className={styles.showMore}>more ({this.props.post?.fullViewPostData.commentsList[index].childCommentsNumber})</span>
                                        )
                                    }
                                    {
                                        this.props.post.fullViewPostData.commentsList[index].moreToggled && (
                                            <SubComments index={index} measure={measure} />
                                        )
                                    }
                                </React.Fragment>
                            )
                        }
                    </div>
                )}
            </CellMeasurer>
        );
    }

    private handleShare() {
        const hostName = window.location.hostname.includes('localhost') ?
                         window.location.hostname + ':3000':
                         window.location.hostname;
        
        let urlText = `http://${hostName}/post/${this.props.post?.fullViewPostData._id}`;
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

    render() {
        if(this.props.post?.isOtherPostDataLoading === false)
        return (
            <article className={styles.article}>
                <Grid doubling={false} centered className={styles.grid}>
                    <Grid.Row className={styles.row}>
                        <div className={styles.leftCol}>
                            <Image
                                className={styles.postImage}
                                size="huge"
                                src={`data:${this.props.post?.fullViewPostData.source.contentType};base64,${Buffer.from(this.props.post?.fullViewPostData.source.data).toString("base64")}`}
                            />
                        </div>
                        <br/>
                        <div className={styles.rightCol}>
                            <Segment className={styles.profileSegmentInternal} attached="top">
                                <Image
                                    className={styles.verySmallImg}
                                    circular
                                    size="tiny"
                                    src={`${settings.BASE_URL}/feed/photo/user/${this.props.post?.fullViewPostData.creator.username}`}
                                ></Image>
                                <Link to={`/profile/${this.props.post?.fullViewPostData.creator.username}`}>
                                    <Header size="small" className={styles.headerName} as="span">
                                        {this.props.post?.fullViewPostData.creator.username}
                                    </Header>
                                </Link>
                                {
                                    this.isCreator && <Icon onClick={this.handleDelete.bind(this)} className={styles.removePostBtn} color='red' size='big' name='remove circle'></Icon>
                                }
                            </Segment>
                            <Segment attached className={styles.commentsContainer}>
                                <InfiniteLoader
                                    isRowLoaded={this.isRowLoaded}
                                    loadMoreRows={this.fetchComments.bind(this)}
                                    rowCount={this.rowCount}
                                    minimumBatchSize={10}
                                    threshold={15}>
                                    {({ onRowsRendered,registerChild }: InfiniteLoaderChildProps) => (
                                            <AutoSizer className={styles.AutoSizer} onResize={this.handleResize.bind(this)}>
                                                {({ width, height }) => {
                                                    return (
                                                        <List
                                                            ref={registerChild}
                                                            onRowsRendered={onRowsRendered}
                                                            className={styles.commentsList}
                                                            width={width}
                                                            height={height}
                                                            deferredMeasurementCache={this.cache}
                                                            rowHeight={this.cache.rowHeight}
                                                            rowRenderer={this.renderRow.bind(this)}
                                                            rowCount={this.rowCount}
                                                            overscanRowCount={3}
                                                        />
                                                    );
                                                }}
                                            </AutoSizer>
                                        )}
                                </InfiniteLoader>
                            </Segment>
                            <Segment attached className={styles.actionSegment}>
                                <Menu className={styles.postMenu}>
                                    <Item className="left">
                                        <Icon
                                            onClick={this.props.handleLike}
                                            id={!this.props.post?.fullViewPostData.isLiked ? `${styles.likeOutline}`: ""}
                                            className={`${styles.likeBtn} ${styles.iconBtn} heart ${this.props.post?.fullViewPostData.isLiked ? "": "outline"}`}
                                            size="big"
                                        ></Icon>
                                        <Link className={styles.linkWithNoColor} to={`/post/${this.props.post?.fullViewPostData._id}`}>
                                            <Icon
                                                className={styles.iconBtn}
                                                size="big"
                                                name="comment outline"
                                            ></Icon>
                                        </Link>
                                        
                                        <Icon
                                            onClick={this.handleShare.bind(this)}
                                            className={styles.iconBtn}
                                            size="big"
                                            name="paper plane outline"
                                        ></Icon>
                                    </Item>
                                    <Item className="right">
                                        <Icon
                                            onClick={this.props.handleSave}
                                            id={!this.props.post?.fullViewPostData.isSaved ? `${styles.savedOutline}`: ""}
                                            className={`${styles.saveBtn} ${styles.iconBtn} bookmark ${this.props.post?.fullViewPostData.isSaved ? "": "outline"}`}
                                            size='big'>
                                        </Icon>                                
                                    </Item>
                                </Menu>
                                <Header onClick={this.handleLikesClick.bind(this)} className={styles.likes} size="tiny">
                                    {
                                        this.props.post?.fullViewPostData.likesCount
                                    }{" "}
                                    likes
                                </Header>
                            </Segment>
                            <Segment
                                className={styles.commentSegment}
                                attached="bottom">
                                <Form className={styles.commentForm}>
                                    <Form.Field className={styles.commentField}>
                                        <Ref innerRef={this.commentInputElRef}>
                                            <Form.Input
                                                className={styles.commentInput}
                                                placeholder="Adding comment ..."
                                                value={this.state.comment}
                                                onChange={(e) => this.setState({comment: e.target.value})}
                                            ></Form.Input>
                                        </Ref>
                                        <Button
                                            loading={this.props.post?.isPostLoading}
                                            onClick={this.handleComment.bind(this)}
                                            className={styles.commentSubmit}
                                            size="medium"
                                            primary>
                                            Comment
                                        </Button>
                                    </Form.Field>
                                </Form>
                            </Segment>
                        </div>
                    </Grid.Row>
                </Grid>
            </article>
        );
        else{
            return (
                <article className={styles.article}>
                <Grid doubling={false} centered className={styles.grid}>
                    <Grid.Row className={styles.row}>
                        <div className={styles.leftCol}>
                            {/* <Image
                                className={styles.postImage}
                                size="huge"
                            /> */}
                            <Placeholder className={styles.imagePlaceholder}>
                                <PlaceholderImage></PlaceholderImage>
                            </Placeholder>
                        </div>
                        <br/>
                        <div className={styles.rightCol}>
                            <Segment className={styles.profileSegmentInternal} attached="top">
                                <Image
                                    className={styles.verySmallImg}
                                    circular
                                    size="tiny"></Image>
                                <Link to="#">
                                    <Header size="small" className={styles.headerName} as="span">
                                        loading
                                    </Header>
                                </Link>
                            </Segment>
                            <Segment attached className={styles.commentsContainer}>
                            </Segment>
                            <Segment attached className={styles.actionSegment}>
                                <Menu className={styles.postMenu}>
                                    <Item className="left">
                                        <Icon
                                            name='heart outline'
                                            size="big"
                                        ></Icon>
                                        <Link className={styles.linkWithNoColor} to="#">
                                            <Icon
                                                className={styles.iconBtn}
                                                size="big"
                                                name="comment outline"
                                            ></Icon>
                                        </Link>
                                        
                                        <Icon
                                            className={styles.iconBtn}
                                            size="big"
                                            name="paper plane outline"
                                        ></Icon>
                                    </Item>
                                    <Item className="right">
                                        <Icon
                                            className={styles.iconBtn}
                                            size="big"
                                            name="bookmark outline"
                                        ></Icon>
                                    </Item>
                                </Menu>
                                <Header className={styles.likes} size="tiny">
                                    loading
                                </Header>
                            </Segment>
                            <Segment
                                className={styles.commentSegment}
                                attached="bottom">
                                <Form className={styles.commentForm}>
                                    <Form.Field className={styles.commentField}>
                                        <Form.Input
                                            className={styles.commentInput}
                                            placeholder="Adding comment ..."
                                            value={this.state.comment}
                                        ></Form.Input>
                                        <Button
                                            loading={true}
                                            className={styles.commentSubmit}
                                            size="medium"
                                            primary>
                                            Comment
                                        </Button>
                                    </Form.Field>
                                </Form>
                            </Segment>
                        </div>
                    </Grid.Row>
                </Grid>
            </article>
            )
        }
    }
}

const mapStateToProps = (state: AppState): ReduxProps => ({
    post: state.post,
    auth: state.auth
});

interface DispatchProps {
    ADD_COMMENTS_POST: (comments: Array<IPostComment>) => void,
    toggleMoreComment: (startIndex:number,stopIndex:number,commentId:string,commentIndex:number,userId:string,token:string) => void,
    toggleUserLikes: (fetchFunction:(startIndex:number,stopIndex:number) => Promise<IGenericResponse & {likes:Array<ICreator>}>) => void,
    toggleMoreCommentNoFetch: (commentIndex:number) => void,
    deletePost: (postIndex:number,postId: string, userId: string, token: string) => void,
}

const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,AppActions>):DispatchProps => ({
    toggleUserLikes:bindActionCreators(TOGGLE_USERS_LIST,dispatch),
    ADD_COMMENTS_POST:bindActionCreators(ADD_COMMENTS_POST,dispatch),
    toggleMoreComment:bindActionCreators(TOGGLE_MORE_COMMENT,dispatch),
    toggleMoreCommentNoFetch:bindActionCreators(TOGGLE_MORE_COMMENT_NO_FETCH,dispatch),
    deletePost: bindActionCreators(CALL_POST_DELETE, dispatch),
})


export default withRouter(withCookies(connect(mapStateToProps, mapDispatchToProps)(PostArticle as ComponentType<IProps>)));