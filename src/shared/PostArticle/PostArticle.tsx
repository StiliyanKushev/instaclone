// IMPORT STYLES
import styles from "./PostArticle.module.css";

// IMPORT REACT RELETED
import React from "react";
import { toast } from 'react-toastify';
import { ComponentType } from 'react';
import { ReactCookieProps, withCookies } from 'react-cookie';
import { Grid, Image, Segment, Header, Menu, Item, Icon, Form, Button } from 'semantic-ui-react';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader, InfiniteLoaderChildProps } from "react-virtualized";

// IMPORT REDUX RELETED
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState, ReduxProps } from "../../reducers";
import { TOGGLE_USERS_LIST } from '../../actions/userActions';
import { ADD_COMMENTS_POST, TOGGLE_MORE_COMMENT } from '../../actions/postActions';

// IMPORT ROUTER RELETED
import { Link } from "react-router-dom";

// IMPORT TYPES
import { ICreator } from '../../types/auth';
import { ICommentsChunkResponse } from '../../types/response';
import { AppActions } from '../../actions/types/actions';
import IGenericResponse from '../../types/response';


// IMPORT OTHER
import { settings } from "../../settings";
import { getNewCommentsChunk, getUserLikesFromPost } from '../../handlers/post';
import { IPostComment } from '../PostsPartial/PostsPartial';
import PostComment from "../PostComment/PostComment";
import SubComments from '../SubComments/SubComments';

interface IState {
    comment: string;
    hasMoreComments: boolean;
}

interface IParentProps {
    handleLike: () => void;
    handleComment: (comment: string,replyCommentId?: string) => void;
}

type IProps = IParentProps & ReduxProps & ReactCookieProps & DispatchProps;

class PostArticle extends React.PureComponent<IProps, IState> {
    public state: IState = { comment: "", hasMoreComments: true };
    private cache: CellMeasurerCache;

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
        }
    }

    private handleResize(){
        // clear the cache and update it (this is the solution with best performance)
        this.cache.clearAll();
    }

    private handleMoreClick(commentIndex:number,measure:() => void){        
        const maxEver = this.props.post?.fullViewPostData.commentsList[commentIndex].maxChildCommentsNumber as number;
        const currentCount = this.props.post?.fullViewPostData.commentsList[commentIndex].childCommentsNumber as number;
        const numPerPage = 5;

        const multiplier = (maxEver - currentCount) / numPerPage;

        let startIndex = multiplier * numPerPage;
        let stopIndex = startIndex + numPerPage;

        this.props.toggleMoreComment(startIndex,stopIndex,this.props.post?.fullViewPostData.commentsList[commentIndex].id as string,commentIndex,this.props.auth?.userId as string,this.props.auth?.token as string);
        
        // recalculate the height
        setTimeout(() => {
            measure();
        },10)
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

    render() {
        return (
            <article className={styles.article}>
                <Grid centered className={styles.grid}>
                    <Grid.Row className={styles.row}>
                        <div className={styles.leftCol}>
                            <Image
                                className={styles.postImage}
                                size="huge"
                                src={`data:${this.props.post?.fullViewPostData.source.contentType};base64,${Buffer.from(this.props.post?.fullViewPostData.source.data).toString("base64")}`}
                            />
                        </div>
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
                                        <Form.Input
                                            className={styles.commentInput}
                                            placeholder="Adding comment ..."
                                            value={this.state.comment}
                                            onChange={(e) => this.setState({comment: e.target.value})}
                                        ></Form.Input>
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
}

const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,AppActions>):DispatchProps => ({
    toggleUserLikes:bindActionCreators(TOGGLE_USERS_LIST,dispatch),
    ADD_COMMENTS_POST:bindActionCreators(ADD_COMMENTS_POST,dispatch),
    toggleMoreComment:bindActionCreators(TOGGLE_MORE_COMMENT,dispatch)
})


export default withCookies(connect(mapStateToProps, mapDispatchToProps)(PostArticle as ComponentType<IProps>));