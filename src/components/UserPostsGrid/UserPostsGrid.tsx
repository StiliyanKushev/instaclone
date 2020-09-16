import React, { ComponentType } from 'react';
import { Segment } from 'semantic-ui-react';
import { InfiniteLoader, WindowScroller, AutoSizer, Grid, InfiniteLoaderChildProps, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import styles from '../UserView/UserView.module.css'
import { IPost } from '../../shared/PostsPartial/PostsPartial';
import UserPostCell from '../../shared/UserPostCell/UserPostCell';
import IGenericResponse from '../../types/response';
import { IPostsListGrid } from '../../reducers/postReducer';
import { AppState, ReduxProps } from '../../reducers/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../actions/types/actions';
import { ADD_USER_POSTS_ROW_LIST, SET_USER_DATA_CLEAR } from '../../actions/userActions';

interface IParentProps {
    currentPostSelectionFunction: (startIndex:number,stopIndex:number) => Promise<any>,
    refreshProp: any, // this is used to refresh the whole component *(has to be unique everytime)
}

type IProps = IParentProps & ReduxProps & DispatchProps;

interface IState {
    hasMorePosts: boolean,
}

class UserPostsGrid extends React.PureComponent<IProps, IState>{
    public state: IState = { hasMorePosts: true }
    private cache: CellMeasurerCache;
    private startIndex: number = 0;

    constructor(props: IProps) {
        super(props)

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            fixedHeight: true,
        });
    }

    componentDidUpdate(oldProps:IProps){
        if(oldProps.refreshProp !== this.props.refreshProp){
            this.props.clearUserData()
            this.setState({hasMorePosts:true})
            this.startIndex = 0;
        }
    }

    private cellRenderer({
        columnIndex, // Horizontal (column) index of cell
        isScrolling, // The Grid is currently being scrolled
        isVisible, // This cell is visible within the grid (eg it is not an overscanned cell)
        key, // Unique key within array of cells
        parent, // Reference to the parent Grid (instance)
        rowIndex, // Vertical (row) index of cell
        style, // Style object to be applied to cell (to position it);
        // This must be passed through to the rendered cell element.
    }: any) {
        let post: IPost;
        if (this.props.user?.currentPostSelectionList[rowIndex])
            post = this.props.user?.currentPostSelectionList[rowIndex][columnIndex] as IPost

        return (
            <CellMeasurer
                key={key}
                cache={this.cache}
                parent={parent}
                columnIndex={columnIndex}
                rowIndex={rowIndex}
            >
                {({ measure, registerChild }: any) => (
                    <div ref={registerChild} style={style}>
                        <UserPostCell measure={measure} post={post as IPost} />
                    </div>
                )}
            </CellMeasurer>
        );
    }

    private isRowLoaded = ({ index }: { index: number }) => {
        return !!this.props.user?.currentPostSelectionList[index];
    };

    private fetchPosts = ({ startIndex, stopIndex }: { startIndex: number, stopIndex: number }) => {
        startIndex = this.startIndex - 3;
        stopIndex = this.startIndex;

        return this.props.currentPostSelectionFunction(startIndex, stopIndex).then((res: IGenericResponse & { posts: IPostsListGrid }) => {
            if (res.success) {
                if (!res.posts || ((res.posts) as Array<any>).length === 0) {
                    // no more comments
                    this.setState({ hasMorePosts: false })
                }
                else {
                    if (res.posts.length < 3) {
                        let n = 3 - res.posts.length;
                        for (let i = 0; i < n; i++) {
                            res.posts.push({
                                source: {
                                    data: '',
                                    contentType: 'png',
                                },
                                likesCount: 0,
                                _id: '#'
                            })
                        }
                    }

                    this.props.addUserPostRowToList(res.posts as [IPost]);
                }
            }
            else {
                // internal error
            }
        }) as Promise<IGenericResponse & { posts: IPostsListGrid }>
    };

    private _createOnSectionRendered(onRowsRendered: Function) {
        return ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }: any) => {
            const startIndex = this.startIndex;
            const stopIndex = startIndex + 3;

            if (this.state.hasMorePosts)
                this.startIndex += 3;

            return onRowsRendered({ startIndex, stopIndex })
        }
    }


    get rowCount(): number {
        const rows = this.props.user?.currentPostSelectionList.length as number;
        return this.state.hasMorePosts ? rows + 3 : rows;
    }

    public render() {
        return (
            <Segment className={styles.vgridContainer}>
                <InfiniteLoader
                    isRowLoaded={this.isRowLoaded.bind(this)}
                    loadMoreRows={this.fetchPosts.bind(this)}
                    rowCount={this.rowCount}
                    // minimumBatchSize={30}
                    // threshold={3}
                >
                    {({ onRowsRendered, registerChild }: InfiniteLoaderChildProps) => (
                        <WindowScroller
                            scrollingResetTimeInterval={10}
                        >
                            {({ height, scrollTop }) => (
                                <AutoSizer>
                                    {({ width }) => {
                                        return (
                                            <Grid
                                                autoHeight
                                                scrollTop={scrollTop}
                                                className={styles.vgrid}
                                                ref={registerChild}
                                                onSectionRendered={this._createOnSectionRendered(onRowsRendered)}
                                                cellRenderer={this.cellRenderer.bind(this)}
                                                rowCount={this.rowCount}
                                                columnCount={3}
                                                rowHeight={300}
                                                columnWidth={300}
                                                overscanRowCount={5}
                                                height={height}
                                                width={width}
                                            />
                                        );
                                    }}
                                </AutoSizer>
                            )}
                        </WindowScroller>
                    )}
                </InfiniteLoader>

            </Segment>
        )
    }
}


const mapStateToProps = (state: AppState): ReduxProps => ({
    auth: state.auth,
    user: state.user,
    post: state.post
})

interface DispatchProps {
    addUserPostRowToList: (posts: Array<IPost>) => void,
    clearUserData: () => void,
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    addUserPostRowToList: bindActionCreators(ADD_USER_POSTS_ROW_LIST, dispatch),
    clearUserData: bindActionCreators(SET_USER_DATA_CLEAR,dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UserPostsGrid as ComponentType<IProps>);