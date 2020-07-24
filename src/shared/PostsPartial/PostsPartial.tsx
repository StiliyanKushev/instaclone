// IMPORT STYLES
import 'react-lazy-load-image-component/src/effects/blur.css';
import styles from './PostsPartial.module.css';

// IMPORT REACT RELATED
import React, { ComponentType } from 'react';
import { WindowScroller, List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader, InfiniteLoaderChildProps } from 'react-virtualized';

// OTHER
import $ from 'jquery';
import Post from '../Post/Post';
import { getNewPostsChunk } from '../../handlers/post';
import { IPostsChunkResponse } from '../../types/response';

interface IParentProps {
    token: string,
}

export interface IPost {
    creator: string,
    _id: string,
    description: string,
    likesCount: number,
    source:{
        data: any,
        contentType:string,
    }
    //todo comments
}

export interface IPostsPartialState {
    posts: Array<IPost>,
    hasMorePosts: boolean,
}

type IProps = IParentProps;

class PostsPartial extends React.PureComponent<IProps>{
    state: IPostsPartialState = { posts: [], hasMorePosts: true }

    private cache: CellMeasurerCache;

    private get rowCount(): number {
        return this.state.hasMorePosts ? this.state.posts.length + 2 : this.state.posts.length;
    }

    constructor(props: IProps) {
        super(props);

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 1000,
        });

        this.renderRow = this.renderRow.bind(this);
    }

    private fetchPosts = ({ startIndex, stopIndex }: { startIndex: number, stopIndex: number }) => {
        return getNewPostsChunk(startIndex, stopIndex, this.props.token).then((res: IPostsChunkResponse) => {
            if (res.success) {
                if (res.posts.length === 0) {
                    // no more posts
                    this.setState({ hasMorePosts: false })
                }
                else {
                    let newPosts = [...this.state.posts, ...res.posts];
                    this.setState({ posts: newPosts })
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
                            isLoaded={this.isRowLoaded({index})}
                            measure={measure}
                            post={this.state.posts[index]}
                        />
                    </div>
                )}
            </CellMeasurer>
        );
    }

    private isRowLoaded = ({ index }: { index: number }) => {
        return !!this.state.posts[index];
    };

    public render() {
        return (
            <div className={styles.mainContainer}>
                <InfiniteLoader
                    isRowLoaded={this.isRowLoaded}
                    loadMoreRows={this.fetchPosts}
                    rowCount={this.rowCount}
                    minimumBatchSize={15}
                    threshold={10}
                >
                    {({ onRowsRendered, registerChild }: InfiniteLoaderChildProps) => (
                        <WindowScroller>
                            {({ height, isScrolling, onChildScroll, scrollTop }) => (
                                <AutoSizer disableHeight>
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
                                                overscanRowCount={1}
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

export default PostsPartial as ComponentType<IProps>;