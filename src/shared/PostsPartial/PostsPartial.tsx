// IMPORT STYLES
import 'react-lazy-load-image-component/src/effects/blur.css';
import styles from './PostsPartial.module.css';

// IMPORT REACT RELATED
import React, { ComponentType } from 'react';
import { WindowScroller, List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

// OTHER
import _ from 'lodash';
import Post from '../Post/Post';

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

type IProps = IParentProps;

class PostsPartial extends React.Component<IProps>{
    state: IPostsPartialState = { posts: [] }
    private cache: CellMeasurerCache;

    constructor(props: IProps) {
        super(props);

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 1000
        });

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

    private renderRow({ index, scrollTop, key, parent, style }: any) {
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
                            measure={measure}
                            handleNewLastSeenPost={this.props.handleNewLastSeenPost}
                            scrollPosition={scrollTop}
                            post={this.state.posts[index]}
                        />
                    </div>
                )}
            </CellMeasurer>

        );
    }

    public render() {
        return (
            <div className={styles.mainContainer}>
                <WindowScroller>
                    {({ height, isScrolling, onChildScroll, scrollTop }) => (
                        <AutoSizer disableHeight>
                            {
                                ({ width }: any) => (
                                    <List
                                        autoHeight
                                        width={width}
                                        height={height}
                                        isScrolling={isScrolling}
                                        onScroll={onChildScroll}
                                        scrollTop={scrollTop}
                                        deferredMeasurementCache={this.cache}
                                        rowHeight={this.cache.rowHeight}
                                        rowRenderer={this.renderRow}
                                        rowCount={this.state.posts.length}
                                        overscanRowCount={1}
                                    />
                                )
                            }

                        </AutoSizer>
                    )}
                </WindowScroller>,
            </div>
        );
    }
}

export default React.memo(PostsPartial as ComponentType<IProps>);