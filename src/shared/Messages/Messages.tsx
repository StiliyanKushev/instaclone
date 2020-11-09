// IMPORT STYLES
import styles from './Messages.module.css';

// IMPORT REACT RELATED
import React from 'react';
import { ComponentType } from 'react';
import { InfiniteLoader, AutoSizer, List, InfiniteLoaderChildProps, CellMeasurerCache, CellMeasurer } from 'react-virtualized';

// IMPORT REDUX RELATED
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
<<<<<<< HEAD
import { AppActions } from '../../actions/types/actions';
import { ReduxProps, AppState } from '../../reducers/index';
import { CALL_ADD_MESSAGES_INBOX, CALL_CLEAR_MESSAGES } from '../../actions/inboxActions';

// IMPORT VALIDATION
import { IMessage, IMessageDB, IMessagesChunkResponse } from '../../types/response';

// IMPORT OTHER
=======
import { CALL_ADD_MESSAGES_INBOX, CALL_CLEAR_MESSAGES } from '../../actions/inboxActions';
>>>>>>> master
import Message from '../Message/Message';
import { getNewMessagesChunk } from '../../handlers/inbox';

interface ParentProps {
    onUpdate: () => void,
}

type IProps = ReduxProps & DispatchProps & ParentProps;

interface IState {
    hasMoreMessages: boolean,
}

class Messages extends React.Component<IProps, IState> {
    private cache: CellMeasurerCache;
    public state: IState = { hasMoreMessages: true, }
    private listRef: any;

    private get rowCount(): number {
        let messages: any = this.props.inbox?.messages;
        return this.state.hasMoreMessages ? messages.length + 10 : messages.length;
    }

    
    public componentDidUpdate(prevProps: IProps){
        if(this.props.inbox?.currentDirectItemId !== prevProps.inbox?.currentDirectItemId){
            this.props.onUpdate();
            this.props.CLEAR_MESSAGES();
            this.setState({hasMoreMessages:true})
        }
    }

    constructor(props: IProps) {
        super(props);

        this.cache = new CellMeasurerCache({
            // fixedWidth: true,
            // fixedHeight: true,
            defaultHeight: 57,
        });
    }

    private renderRow({ index, key, style, parent }: any) {
        let currentRow = this.props.inbox?.messages[index] as IMessage;
        let userA = currentRow && currentRow.user ? currentRow.user.toLowerCase() : "";
        let userB = this.props.auth?.username.toLowerCase();
        return (
            <CellMeasurer
                key={key}
                cache={this.cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}
            >
                {({ measure, registerChild }: any) => (
                    <div className={`row ${styles.rowContainer} ${userA === userB ? styles.right : styles.left}`} ref={registerChild} style={style}>
                        <Message measure={measure} authUsername={this.props.auth?.username as string} currentRow={currentRow}/>
                    </div>
                )}
            </CellMeasurer>
        );
    }

    private handleResize() {
        // clear the cache and update it (this is the solution with best performance)
        this.cache.clearAll();
    }

    private isRowLoaded = ({ index }: { index: number }) => {
        return !!this.props.inbox?.messages[index];
    };

    private fetchMessages = ({ startIndex, stopIndex }: { startIndex: number, stopIndex: number }) => {
        return getNewMessagesChunk(this.msgDbName, startIndex, stopIndex, this.props.auth?.userId as string, this.props.auth?.token as string).then((res: IMessagesChunkResponse) => {
            if (res.success) {
                if (res.messages.length === 0) {
                    // no more posts
                    this.setState({ hasMoreMessages: false })
                }
                else {
                    this.props.ADD_MESSAGES_INBOX(res.messages);
                }
            }
            else {
                // internal error
            }
        })
    };

    private get msgDbName() {
        let names = [this.props.auth?.username.toLowerCase(), this.props.inbox?.currentUsername.toLowerCase()];
        names.sort();
        if (names[0] && names[1]) {
            return names[0] + names[1];
        }
        else return '';
    }

    public render() {
        return (
            <InfiniteLoader
                isRowLoaded={this.isRowLoaded.bind(this)}
                loadMoreRows={this.fetchMessages.bind(this)}
                rowCount={this.rowCount}
                minimumBatchSize={10}
                threshold={15}>
                {({ onRowsRendered, registerChild }: InfiniteLoaderChildProps) => (
                    <AutoSizer className={styles.AutoSizer} onResize={this.handleResize.bind(this)}>
                        {({ width, height }) => {
                            return (
                                <List
                                    ref={(list) => {
                                        this.listRef = list;
                                        registerChild(list)
                                    }}
                                    onRowsRendered={onRowsRendered}
                                    className={styles.list}
                                    width={width}
                                    height={height}
                                    scrollToIndex={(((this.props.inbox) as any).messages.length) - 1}
                                    scrollToAlignment="end"
                                    deferredMeasurementCache={this.cache}
                                    rowHeight={this.cache.rowHeight}
                                    rowRenderer={this.renderRow.bind(this)}
                                    rowCount={this.rowCount}
                                    overscanRowCount={5}
                                />
                            );
                        }}
                    </AutoSizer>
                )}
            </InfiniteLoader>
        );
    }
}

const mapStateToProps = (state: AppState): ReduxProps => ({
    inbox: state.inbox,
    auth: state.auth,
})

interface DispatchProps {
    ADD_MESSAGES_INBOX: (messages: Array<IMessageDB>) => void,
    CLEAR_MESSAGES: () => void,
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    ADD_MESSAGES_INBOX: bindActionCreators(CALL_ADD_MESSAGES_INBOX, dispatch),
    CLEAR_MESSAGES: bindActionCreators(CALL_CLEAR_MESSAGES, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Messages as ComponentType<IProps>);