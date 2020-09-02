// IMPORT STYLES
import 'react-lazy-load-image-component/src/effects/blur.css';
import styles from './PostsPartial.module.css';

// IMPORT REACT RELATED
import React, { ComponentType } from 'react';
import { WindowScroller, List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader, InfiniteLoaderChildProps } from 'react-virtualized';

// IMPORT REDUX RELETED
import { connect } from 'react-redux';
import { ADD_POSTS_HOME } from '../../actions/postActions';
import { AppState, ReduxProps } from '../../reducers';

// OTHER
import Post from '../Post/Post';
import { getNewPostsChunk } from '../../handlers/post';
import { IPostsChunkResponse } from '../../types/response';
import { ICreator } from '../../types/auth';

interface IParentProps {
    token: string,
}

export interface IPostComment {
    id: string,
    post: string,
    content:string,
    creator?:ICreator,
    isLiked:boolean,
    likesCount:number,
    childCommentsNumber: number,
    maxChildCommentsNumber: number,
    subComments?: Array<IPostComment>,
    parentComment?: string,
    moreToggled?: boolean,
}
export interface IPost {
    postIndex:number,
    creator:{
        id:string,
        username:string,
    },
    _id:string,
    description:string,
    isLiked:boolean,
    likesCount:number,
    source:{
        data:any,
        contentType:string,
    },
    comments: Array<IPostComment>,
    ownComments: Array<IPostComment>, //this doesnt need a creator prop
}

export interface IPostsPartialState {
    hasMorePosts: boolean,
}

type IProps = ReduxProps & DispatchProps & IParentProps;

class PostsPartial extends React.PureComponent<IProps>{
    state: IPostsPartialState = { hasMorePosts: true }

    private cache: CellMeasurerCache;

    private get rowCount(): number {
        let homePosts: any = this.props.post?.homePosts;
        return this.state.hasMorePosts ? homePosts.length + 2 : homePosts.length;
    }

    constructor(props: IProps) {
        super(props);

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 1000,
        });

        this.renderRow = this.renderRow.bind(this);
        this.handleListResize = this.handleListResize.bind(this);
    }

    private handleListResize(){
        this.cache.clearAll();
    }

    private fetchPosts = ({ startIndex, stopIndex }: { startIndex: number, stopIndex: number }) => {
        return getNewPostsChunk(startIndex, stopIndex,this.props.auth?.userId as string, this.props.token).then((res: IPostsChunkResponse) => {
            if (res.success) {
                if (res.posts.length === 0) {
                    // no more posts
                    this.setState({ hasMorePosts: false })
                }
                else {
                    this.props.ADD_POSTS_HOME(res.posts);
                }
            }
            else {
                // internal error
            }
        })
    };

    private renderRow({ index, key, parent, style }: any) {
        return (
            <CellMeasurer
                cache={this.cache}
                columnIndex={0}
                key={key}
                parent={parent}
                rowIndex={index}
            >
                {({ measure, registerChild }: any) => (
                    <div className={styles.paddingContainer} ref={registerChild} style={style}>
                        <Post
                            postIndex={index}
                            isLoaded={this.isRowLoaded({index})}
                            measure={measure}
                        />
                    </div>
                )}
            </CellMeasurer>
        );
    }

    private isRowLoaded = ({ index }: { index: number }) => {
        return !!this.props.post?.homePosts[index];
    };

    public render() {
        return (
            <div className={styles.mainContainer}>
                <InfiniteLoader
                    isRowLoaded={this.isRowLoaded}
                    loadMoreRows={this.fetchPosts}
                    rowCount={this.rowCount}
                    minimumBatchSize={10}
                    threshold={15}
                >
                    {({ onRowsRendered, registerChild }: InfiniteLoaderChildProps) => (
                        <WindowScroller
                            scrollingResetTimeInterval={10}
                        >
                            {({ height, isScrolling, onChildScroll, scrollTop }) => (
                                <AutoSizer disableHeight onResize={this.handleListResize}>
                                    {
                                        ({ width }: any) => (
                                            <List
                                                ref={registerChild}
                                                onRowsRendered={onRowsRendered}
                                                autoHeight
                                                width={width}
                                                height={height}
                                                isScrolling={isScrolling}
                                                onScroll={onChildScroll}
                                                scrollTop={scrollTop}
                                                deferredMeasurementCache={this.cache}
                                                rowHeight={this.cache.rowHeight}
                                                rowRenderer={this.renderRow}
                                                rowCount={this.rowCount}
                                                overscanRowCount={3}
                                            />
                                        )
                                    }
                                </AutoSizer>
                            )}
                        </WindowScroller>
                    )}
                </InfiniteLoader>
            </div>
        );
    }
}

const mapStateToProps = (state:AppState):ReduxProps => ({
    post:state.post,
    auth:state.auth
})

interface DispatchProps {
    ADD_POSTS_HOME: (posts: Array<IPost>) => void 
}

export default connect(mapStateToProps,{ADD_POSTS_HOME})(PostsPartial as ComponentType<IProps>);