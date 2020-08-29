// IMPORT STYLES
import styles from "./PostArticle.module.css";

// IMPORT REACT RELETED
import React from "react";
import { ComponentType } from 'react';
import { ReactCookieProps, withCookies } from 'react-cookie';
import { Grid, Image, Segment, Header, Menu, Item, Icon, Form, Button } from 'semantic-ui-react';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader, InfiniteLoaderChildProps } from "react-virtualized";

// IMPORT REDUX RELETED
import { connect } from "react-redux";
import { AppState, ReduxProps } from "../../reducers";

// IMPORT ROUTER RELETED
import { Link } from "react-router-dom";

// IMPORT OTHER
import { settings } from "../../settings";
import { getNewCommentsChunk } from '../../handlers/post';
import { ICommentsChunkResponse } from '../../types/response';
import { ADD_COMMENTS_POST } from '../../actions/postActions';
import { IPostComment } from '../PostsPartial/PostsPartial';
import PostComment from "../PostComment/PostComment";
import { toast } from 'react-toastify';

interface IState {
    comment: string;
    hasMoreComments: boolean;
}

interface IParentProps {
    handleLike: () => void;
    handleComment: (comment: string) => void;
}

type IProps = IParentProps & ReduxProps & ReactCookieProps & DispatchProps;

class PostArticle extends React.PureComponent<IProps, IState> {
    public state: IState = { comment: "", hasMoreComments: true };
    private cache: CellMeasurerCache;

    private get rowCount(): number {
        let comments: any = this.props.post?.fullViewPostData.commentsList;
        return this.state.hasMoreComments ? comments.length + 2 : comments.length;
    }

    constructor(props: IProps) {
        super(props);

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 46,
        });
    }

    private handleComment(){
        if(this.state.comment.trim().length >= 5){
            this.props.handleComment(this.state.comment);
            this.setState({ comment: "" });
        }
        else{
            toast.error('Comment has to be at least 5 chars long.');
        }
    }

    private fetchComments = ({ startIndex, stopIndex }: { startIndex: number, stopIndex: number }) => {
        console.log('fetching comments');
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
                    <div className="row" ref={registerChild} style={style}>
                        <PostComment
                            commentIndex={index}
                            isLoaded={this.isRowLoaded({index})}
                            measure={measure}
                        />
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
                                            <AutoSizer className={styles.AutoSizer}>
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
                                        <Icon
                                            className={styles.iconBtn}
                                            size="big"
                                            name="comment outline"
                                        ></Icon>
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
    ADD_COMMENTS_POST: (comments: Array<IPostComment>) => void
}

export default withCookies(connect(mapStateToProps, {ADD_COMMENTS_POST})(PostArticle as ComponentType<IProps>));