// IMPORT STYLES
import styles from "./PostArticle.module.css";

// IMPORT REACT RELETED
import React from "react";
import {
    Grid,
    Image,
    Segment,
    Header,
    Menu,
    Item,
    Icon,
    Form,
    Button,
} from "semantic-ui-react";
import {
    List,
    AutoSizer,
    CellMeasurer,
    CellMeasurerCache,
    InfiniteLoader,
    InfiniteLoaderChildProps,
} from "react-virtualized";

// IMPORT REDUX RELETED
import { connect } from "react-redux";
import { AppState, ReduxProps } from "../../reducers";

// IMPORT ROUTER RELETED
import { Link } from "react-router-dom";

// IMPORT OTHER
import { settings } from "../../settings";

interface IState {
    comment: string;
    hasMoreComments: boolean;
}

interface IParentProps {
    handleLike: () => void;
    handleComment: (comment: string) => void;
}

type IProps = IParentProps & ReduxProps;

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

    private fetchComments = ({ startIndex, stopIndex }: { startIndex: number, stopIndex: number }) => {
        // todo
        return new Promise(() => {});
        // return getNewPostsChunk(startIndex, stopIndex,this.props.auth?.username as any, this.props.token).then((res: IPostsChunkResponse) => {
        //     if (res.success) {
        //         if (res.posts.length === 0) {
        //             // no more posts
        //             this.setState({ hasMorePosts: false })
        //         }
        //         else {
        //             this.props.ADD_POSTS_HOME(res.posts);
        //         }
        //     }
        //     else {
        //         // internal error
        //     }
        // })
    };

    private isRowLoaded = ({ index }: { index: number }) => {
        return !!this.props.post?.fullViewPostData.commentsList[index];
    };

    renderRow({ index, key, style, parent }: any) {
        return (
            <CellMeasurer
                key={key}
                cache={this.cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}
            >
                <div style={style} className="row">
                    <div className={styles.commentItemContainer}>
                        <div className={styles.commentItemLeftSide}>
                            <Image
                                className={styles.verySmallImg}
                                circular
                                size="tiny"
                                src={`${settings.BASE_URL}/feed/photo/user/${this.props.post?.fullViewPostData.commentsList[index].creator}`}
                            ></Image>
                            <div>
                                <Header className={styles.commentItemHeader}>
                                    <span>
                                        {
                                            this.props.post?.fullViewPostData
                                                .commentsList[index].creator
                                        }
                                    </span>{" "}
                                    {
                                        this.props.post?.fullViewPostData
                                            .commentsList[index].content
                                    }
                                </Header>
                                {!this.props.post?.fullViewPostData
                                    .commentsList[index].isDescription && (
                                    <div className={styles.commentItemBtns}>
                                        <Header disabled>x likes</Header>
                                        <Header
                                            disabled
                                            className={styles.commentItemReply}
                                        >
                                            Reply
                                        </Header>
                                    </div>
                                )}
                            </div>
                        </div>
                        {!this.props.post?.fullViewPostData.commentsList[index]
                            .isDescription && (
                            <Icon
                                name="heart outline"
                                size="small"
                                color="black"
                            ></Icon>
                        )}
                    </div>
                </div>
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
                                src={`data:${
                                    this.props.post?.fullViewPostData.source
                                        .contentType
                                };base64,${Buffer.from(
                                    this.props.post?.fullViewPostData.source
                                        .data
                                ).toString("base64")}`}
                            />
                        </div>
                        <div className={styles.rightCol}>
                            <Segment
                                className={styles.profileSegmentInternal}
                                attached="top"
                            >
                                <Image
                                    className={styles.verySmallImg}
                                    circular
                                    size="tiny"
                                    src={`${settings.BASE_URL}/feed/photo/user/${this.props.post?.fullViewPostData.creator}`}
                                ></Image>
                                <Link
                                    to={`/profile/${this.props.post?.fullViewPostData.creator}`}
                                >
                                    <Header
                                        size="small"
                                        className={styles.headerName}
                                        as="span"
                                    >
                                        {
                                            this.props.post?.fullViewPostData
                                                .creator
                                        }
                                    </Header>
                                </Link>
                            </Segment>
                            <Segment
                                attached
                                className={styles.commentsContainer}
                            >
                                <InfiniteLoader
                                    isRowLoaded={this.isRowLoaded}
                                    loadMoreRows={this.fetchComments}
                                    rowCount={this.rowCount}
                                    minimumBatchSize={10}
                                    threshold={15}
                                >
                                    {({
                                        onRowsRendered,
                                        registerChild,
                                    }: InfiniteLoaderChildProps) => (
                                        <AutoSizer className={styles.AutoSizer}>
                                            {({ width, height }) => {
                                                return (
                                                    <List
                                                        className={
                                                            styles.commentsList
                                                        }
                                                        width={width}
                                                        height={height}
                                                        deferredMeasurementCache={
                                                            this.cache
                                                        }
                                                        rowHeight={
                                                            this.cache.rowHeight
                                                        }
                                                        rowRenderer={this.renderRow.bind(
                                                            this
                                                        )}
                                                        rowCount={
                                                            this.props.post
                                                                ?.fullViewPostData
                                                                .commentsList
                                                                .length as number
                                                        }
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
                                            id={
                                                !this.props.post
                                                    ?.fullViewPostData.isLiked
                                                    ? `${styles.likeOutline}`
                                                    : ""
                                            }
                                            className={`${styles.likeBtn} ${
                                                styles.iconBtn
                                            } heart ${
                                                this.props.post
                                                    ?.fullViewPostData.isLiked
                                                    ? ""
                                                    : "outline"
                                            }`}
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
                                        this.props.post?.fullViewPostData
                                            .likesCount
                                    }{" "}
                                    likes
                                </Header>
                            </Segment>
                            <Segment
                                className={styles.commentSegment}
                                attached="bottom"
                            >
                                <Form className={styles.commentForm}>
                                    <Form.Field className={styles.commentField}>
                                        <Form.Input
                                            className={styles.commentInput}
                                            placeholder="Adding comment ..."
                                            value={this.state.comment}
                                            onChange={(e) =>
                                                this.setState({
                                                    comment: e.target.value,
                                                })
                                            }
                                        ></Form.Input>
                                        <Button
                                            loading={
                                                this.props.post?.isPostLoading
                                            }
                                            onClick={() => {
                                                this.props.handleComment(
                                                    this.state.comment
                                                );
                                                this.setState({ comment: "" });
                                            }}
                                            className={styles.commentSubmit}
                                            size="medium"
                                            primary
                                        >
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
});

export default connect(mapStateToProps, null)(PostArticle);
