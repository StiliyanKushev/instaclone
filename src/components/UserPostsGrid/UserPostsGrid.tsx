// IMPORT STYLES
import styles from '../UserView/UserView.module.css'

// IMPORT REACT RELETED
import React, { ComponentType } from 'react';
import { Segment } from 'semantic-ui-react';
import { InfiniteLoader, WindowScroller, AutoSizer, Grid, InfiniteLoaderChildProps, CellMeasurerCache, CellMeasurer } from 'react-virtualized';

// IMPORT REDUX RELETED
import { AppState, ReduxProps } from '../../reducers/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../actions/types/actions';
import { ADD_USER_POSTS_ROW_LIST, SET_USER_DATA_CLEAR } from '../../actions/userActions';

// IMPORT TYPES
import IGenericResponse from '../../types/response';

// IMPORT OTHER
import UserPostCell from '../../shared/UserPostCell/UserPostCell';
import { IPostsListGrid } from '../../reducers/postReducer';
import { IPost, IOtherPost } from '../../shared/PostsPartial/PostsPartial';


interface IParentProps {
    currentPostSelectionFunction: (startIndex:number,stopIndex:number) => Promise<any>,
    refreshProp: any, // this is used to refresh the whole component *(has to be unique everytime)
}

type IProps = IParentProps & ReduxProps & DispatchProps;

interface IState {
    hasMorePosts: boolean,
    randomKey: number,
    firstRowRendered:boolean,
}

class UserPostsGrid extends React.PureComponent<IProps, IState>{
    public state: IState = { hasMorePosts: true, randomKey:0,firstRowRendered:false}
    private cache: CellMeasurerCache;
    private fetchIncremental:number = 3; // 3 = 1 row
    private startIndex: number = 0;
    private vgridRef:any;

    constructor(props: IProps) {
        super(props)

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            fixedHeight: true,
        });
    }

    componentDidUpdate(oldProps:IProps){
        if(oldProps.refreshProp !== this.props.refreshProp){
            this.setState(() => {
                window.scrollTo({top:0})
                this.cache.clearAll()
                this.startIndex = 0;
                try{ this.vgridRef.forceUpdateGrid();this.vgridRef.forceUpdate(); } catch {}
                
                return  {hasMorePosts:true,randomKey: Math.random(),firstRowRendered:false}
            })
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
        if (this.props.user?.currentPostSelectionList[rowIndex] && this.props.user?.currentPostSelectionList[rowIndex][columnIndex])
            post = this.props.user?.currentPostSelectionList[rowIndex][columnIndex] as IPost

        return (
            <CellMeasurer
                key={key}
                cache={this.cache}
                parent={parent}
                columnIndex={columnIndex}
                rowIndex={rowIndex}
            >
                {({ registerChild }: any) => (
                    <div ref={registerChild} style={style}>
                        <UserPostCell post={post as IPost} />
                    </div>
                )}
            </CellMeasurer>
        );
    }

    private isRowLoaded = ({ index }: { index: number }) => {
        return !!this.props.user?.currentPostSelectionList[index];
    };

    private fetchPosts = ({ startIndex, stopIndex }: { startIndex: number, stopIndex: number }) => {
        // I DONT KNOW HOW DOES THAT FIX THE FIRST ROW NOT REPEATING, NOR IF ITS BROWSER CONSISTENT
        if(startIndex === 0 && this.startIndex === 0 && !this.state.firstRowRendered){
            this.setState({firstRowRendered:true},() => {
                this.startIndex += this.fetchIncremental;
            })
        }

        if(!this.state.hasMorePosts) return new Promise<any>(() => {})
        if(this.emptyCells > 0) {
            this.setState({ hasMorePosts: false })
            return new Promise<any>(() => {})
        }

        startIndex = this.startIndex;
        stopIndex = this.startIndex + this.fetchIncremental;

        let cb = () => {
            if (this.state.hasMorePosts)
            this.startIndex += this.fetchIncremental;
        }

        return this.props.currentPostSelectionFunction(startIndex, stopIndex).then((res: IGenericResponse & { posts: Array<IOtherPost> }) => {
            if (res.success) {
                if (!res.posts || res.posts.length === 0) {
                    // no more posts
                    this.setState({ hasMorePosts: false },cb)
                }
                else {
                    // make the res.posts list to grid
                    let grid:any = (res.posts as any)
                    .reduce((rows:any, key:any, index:any) => 
                        (index % 3 === 0 ?
                        rows.push([key] as any) : 
                        ((rows[rows.length-1])as any).push(key)) && rows, []) as any;

                    // fill the last row
                    if (grid[grid.length - 1].length < 3) {
                        let n = 3 - grid[grid.length - 1].length;
                        for (let i = 0; i < n; i++) {
                            grid[grid.length - 1].push({
                                source: {
                                    data: '',
                                    contentType: 'png',
                                },
                                likesCount: 0,
                                _id: '#' // cell component checks if its # and renders nothing
                            })
                        }

                        this.setState({ hasMorePosts: false },cb)
                    }

                    this.props.addUserPostGridToGrid(grid as Array<Array<IOtherPost>>);
                }

                this.startIndex += this.fetchIncremental;
            }

            else {
                // internal error
            }

        }) as Promise<IGenericResponse & { posts: IPostsListGrid }>
    };

    private _createOnSectionRendered(onRowsRendered: Function) {
        return ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }: any) => {
            const startIndex = this.startIndex;
            const stopIndex = startIndex + this.fetchIncremental;

            return onRowsRendered({ startIndex, stopIndex })
        }
    }


    get rowCount(): number {
        const rows = this.props.user?.currentPostSelectionList.length as number;
        return this.state.hasMorePosts ? rows + this.fetchIncremental : rows;
    }

    get cellCount(): number {
        let cells =  this.rowCount * 3;
        return cells - this.emptyCells;
    }

    get emptyCells():number {
        let lastRow = this.props.user?.currentPostSelectionList[this.props.user?.currentPostSelectionList.length - 1];
        let countOfEmpty = 0;

        if(lastRow)
        for(let i = 0; i < 3;i++){
            if(lastRow[i]._id === '#'){ // if its # cell component makes it look empty
                countOfEmpty++;
            }
        }

        return countOfEmpty;
    }

    public render() {
        return (
            <Segment className={styles.vgridContainer}>
                <InfiniteLoader
                    isRowLoaded={this.isRowLoaded.bind(this)}
                    loadMoreRows={this.fetchPosts.bind(this)}
                    rowCount={this.cellCount}
                    minimumBatchSize={30}
                    threshold={10}
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
                                                key={this.state.randomKey}
                                                ref={registerChild}
                                                autoHeight
                                                scrollTop={scrollTop}
                                                className={styles.vgrid}
                                                // ref={registerChild}
                                                onSectionRendered={this._createOnSectionRendered(onRowsRendered)}
                                                cellRenderer={this.cellRenderer.bind(this)}
                                                rowCount={this.rowCount}
                                                columnCount={3}
                                                rowHeight={300}
                                                columnWidth={300}
                                                overscanRowCount={3}
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
    addUserPostGridToGrid: (posts: Array<Array<IOtherPost>>) => void,
    clearUserData: () => void,
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    addUserPostGridToGrid: bindActionCreators(ADD_USER_POSTS_ROW_LIST, dispatch),
    clearUserData: bindActionCreators(SET_USER_DATA_CLEAR,dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UserPostsGrid as ComponentType<IProps>);