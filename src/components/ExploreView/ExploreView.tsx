// IMPORT STYLES
import styles from '../UserView/UserView.module.css';

// IMPORT REACT RELATED
import React from 'react';
import {ComponentType} from 'react';
import { Segment, Container } from 'semantic-ui-react';
import { InfiniteLoader, WindowScroller, InfiniteLoaderChildProps, AutoSizer, Grid, CellMeasurerCache, CellMeasurer } from 'react-virtualized';

// IMPORT REDUX RELATED
import { connect } from 'react-redux';
import { AppActions } from '../../actions/types/actions';
import { ThunkDispatch } from 'redux-thunk';
import { IPostsListGrid } from '../../reducers/postReducer';
import { IOtherPost, IPost } from '../../shared/PostsPartial/PostsPartial';
import { bindActionCreators } from 'redux';
import { AppState, ReduxProps } from '../../reducers/index';
import { ADD_EXPLORER_POSTS_ROW_LIST } from '../../actions/postActions';

// IMPORT VALIDATION

// IMPORT OTHER
import { Helmet } from 'react-helmet';
import IGenericResponse from '../../types/response';
import { getExploreChunck } from '../../handlers/post';
import UserPostCell from '../../shared/UserPostCell/UserPostCell';

type IProps = ReduxProps & DispatchProps;

interface IState {
    hasMorePosts: boolean,
    firstRowRendered:boolean,
    cellSize:number,
}

class ExploreView extends React.PureComponent<IProps,IState>{
    public state:IState = {hasMorePosts:true,firstRowRendered:false,cellSize:300}
    private cache: CellMeasurerCache;
    private fetchIncremental:number = 3; // 3 = 1 row
    private startIndex: number = 0;

    public constructor(props:IProps){
        super(props);

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            fixedHeight: true,
        });
    }

    public componentDidMount(){
        this.handleResize();
    }

    get rowCount(): number {
        const rows = this.props.post?.currentExplorerGrid.length as number;
        return this.state.hasMorePosts ? rows + this.fetchIncremental : rows;
    }

    get cellCount(): number {
        let cells =  this.rowCount * 3;
        return cells - this.emptyCells;
    }

    get emptyCells():number {
        let lastRow = this.props.post?.currentExplorerGrid[this.props.post?.currentExplorerGrid.length - 1];
        let countOfEmpty = 0;

        if(lastRow)
        for(let i = 0; i < 3;i++){
            if(lastRow[i]._id === '#'){ // if its # cell component makes it look empty
                countOfEmpty++;
            }
        }

        return countOfEmpty;
    }

    private handleResize(){
        this.cache.clearAll()

        let w = window.innerWidth;

        if(w >= 992 && this.state.cellSize !== 300){
            this.setState({cellSize:300})
        }

        else if(w < 992 && w > 640 && this.state.cellSize !== 200){
            this.setState({cellSize:200})
        }

        else if(w <= 640){
            this.setState({cellSize:w * 0.28})
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
        if (this.props.post?.currentExplorerGrid[rowIndex] && this.props.post?.currentExplorerGrid[rowIndex][columnIndex])
            post = this.props.post?.currentExplorerGrid[rowIndex][columnIndex] as IPost

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
        return !!this.props.post?.currentExplorerGrid[index];
    };

    private fetchPosts = ({ startIndex, stopIndex }: { startIndex: number, stopIndex: number }) => {
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

        return getExploreChunck(startIndex, stopIndex,this.props.auth?.userId as string, this.props.auth?.token as string).then((res: IGenericResponse & { posts: Array<IOtherPost> }) => {
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

                    this.props.addExpPostGridToGrid(grid as Array<Array<IOtherPost>>);
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

    public render(){
        return (
            <div className={`${styles.viewContainerNoMargin} view-container`}>
                <Helmet>
                <style type="text/css">{`
                    body,html,#root {
                        background-color: white !important;
                    }
                `}</style>
                </Helmet>
                <Container className={styles.container}>
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
                                    onResize={this.handleResize.bind(this)}
                                >
                                    {({ height, scrollTop }) => (
                                        <AutoSizer >
                                            {({ width }) => {
                                                return (
                                                    <Grid
                                                        ref={registerChild}
                                                        autoHeight
                                                        scrollTop={scrollTop}
                                                        className={styles.vgrid}
                                                        onSectionRendered={this._createOnSectionRendered(onRowsRendered)}
                                                        cellRenderer={this.cellRenderer.bind(this)}
                                                        rowCount={this.rowCount}
                                                        columnCount={3}
                                                        rowHeight={this.state.cellSize}
                                                        columnWidth={this.state.cellSize}
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
                </Container>
            </div>
        )
    }
}

const mapStateToProps = (state: AppState): ReduxProps => ({
    auth: state.auth,
    user: state.user,
    post: state.post
})

interface DispatchProps {
    addExpPostGridToGrid: (posts: Array<Array<IOtherPost>>) => void,
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    addExpPostGridToGrid: bindActionCreators(ADD_EXPLORER_POSTS_ROW_LIST, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ExploreView as ComponentType<IProps>);