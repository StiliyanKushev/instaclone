// IMPORT STYLES
import styles from './UsersList.module.css';

// IMPORT REACT RELETED
import React, { createRef } from 'react';
import { ComponentType } from 'react';
import { Dimmer, Menu, Segment, Icon, Ref } from 'semantic-ui-react';
import { InfiniteLoader, InfiniteLoaderChildProps, AutoSizer, List, CellMeasurerCache, CellMeasurer } from 'react-virtualized';

// IMPORT REDUX RELETED
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../actions/types/actions';
import { TOGGLE_USERS_LIST, ADD_USER_LIST_ENTRIES } from '../../actions/userActions';
import { bindActionCreators } from 'redux';
import { AppState, ReduxProps } from '../../reducers/index';

// IMPORT TYPES
import { ICreator } from '../../types/auth';
import IGenericResponse from '../../types/response';

// IMPORT OTHER
import $ from 'jquery';
import UserRow from '../UserRow/UserRow';

interface IParentProps {
    lowerDim?: boolean,
    fetchFunction: (startIndex:number,stopIndex:number) => Promise<IGenericResponse & {likes:Array<ICreator>}>
}

type IProps = DispatchProps & IParentProps & ReduxProps;

interface IState {
    hasMoreLikes: boolean
}

class UsersList extends React.PureComponent<IProps, IState>{
    public state: IState = { hasMoreLikes: true };
    private cache: CellMeasurerCache;
    
    private self = createRef<HTMLElement>();

    private get rowCount(): number {
        let likes: any = this.props.user?.usersList;
        return this.state.hasMoreLikes ? likes.length + 5 : likes.length;
    }

    constructor(props: IProps) {
        super(props);

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 54,
        });
    }

    public componentDidMount() {
        // activate the popup animation
        $(this.self.current as HTMLElement).addClass("component-load");

        // doing this will execute the function at the end of the queue after css is applied
        setTimeout(() => { $('body').css('overflow', 'hidden') },0)
    }

    public componentWillUnmount() {
        if(!this.props.post?.fullViewToggled)
        $('body').css('overflow', 'initial');
    }

    handleClose(){
        this.props.toggleUserLikes();
    }

    private isRowLoaded = ({ index }: { index: number }) => {
        return !!this.props.user?.usersList[index];
    };

    private fetchLikes = ({ startIndex, stopIndex }: { startIndex: number, stopIndex: number }) => {
        return this.props.user?.currentUsersFetchFunction(startIndex,stopIndex).then((res:IGenericResponse & {likes:Array<ICreator>}) => {

            if (res.success) {
                if (((res.likes) as Array<any>).length === 0) {
                    // no more comments
                    this.setState({ hasMoreLikes: false })
                }
                else {
                    this.props.addUserListEntries(res.likes);
                }
            }
            else {
                // internal error
            }
        }) as Promise<IGenericResponse & {likes:Array<ICreator>}>
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
                        <UserRow
                            index={index}
                            isLoaded={this.isRowLoaded({index})}
                            measure={measure}
                        />
                    </div>
                )}
            </CellMeasurer>
        );
    }

    public render() {
        return (
            <Ref innerRef={this.self}>
                <div className={styles.containerAnimation}>
                <Dimmer id={this.props.lowerDim ? `${styles.lowerDim}` : ''} className={styles.container} active>
                    {
                        this.props.user?.usersList.length === 0 && (
                            <p className={styles.noOtherLikes}>Others have not liked this yet.</p>
                        )
                    }
                    
                    <Segment className={styles.likes} attached='top'>
                        Likes
                        <Icon onClick={this.handleClose.bind(this)} name='close' size='big' className={styles.closeIcon}></Icon>
                    </Segment>
                    <Segment attached='bottom'>
                        <Menu className={styles.menu} size='massive' vertical>
                            <InfiniteLoader
                                        isRowLoaded={this.isRowLoaded}
                                        loadMoreRows={this.fetchLikes.bind(this)}
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
                                                                className={styles.likesList}
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
                        </Menu>
                    </Segment>
                </Dimmer>
                </div>
            </Ref>
        );
    }
}

const mapStateToProps = (state: AppState): ReduxProps => ({
    user: state.user,
    post: state.post
});

interface DispatchProps {
    toggleUserLikes: () => void,
    addUserListEntries: (arr:Array<ICreator>) => void
}

const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,AppActions>):DispatchProps => ({
    toggleUserLikes:bindActionCreators(TOGGLE_USERS_LIST,dispatch),
    addUserListEntries:bindActionCreators(ADD_USER_LIST_ENTRIES,dispatch)
})

export default React.memo(connect(mapStateToProps,mapDispatchToProps)(UsersList as ComponentType<IProps>));