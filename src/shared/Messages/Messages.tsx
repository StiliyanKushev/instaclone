import React from 'react';
import { connect } from 'react-redux';
import { ComponentType } from 'react';
import { ReduxProps, AppState } from '../../reducers/index';
import { InfiniteLoader, AutoSizer, List, InfiniteLoaderChildProps, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import { IMessage, IMessageDB, IMessagesChunkResponse } from '../../types/response';
import styles from './Messages.module.css';
import { getNewMessagesChunk } from '../../handlers/inbox';
import { bindActionCreators } from 'redux';
import { AppActions } from '../../actions/types/actions';
import { ThunkDispatch } from 'redux-thunk';
import { CALL_ADD_MESSAGES_INBOX } from '../../actions/inboxActions';
import Message from '../Message/Message';

type IProps = ReduxProps & DispatchProps;

interface IState {
    hasMoreMessages: boolean,
}

class Messages extends React.PureComponent<IProps, IState> {
    private cache: CellMeasurerCache;
    public state: IState = { hasMoreMessages: true, }
    private listRef: any;

    private get rowCount(): number {
        let messages: any = this.props.inbox?.messages;
        return this.state.hasMoreMessages ? messages.length + 10 : messages.length;
    }

    constructor(props: IProps) {
        super(props);

        this.cache = new CellMeasurerCache({
            // fixedWidth: true,
            // fixedHeight: true,
            defaultHeight: 57,
        });
    }

    public componentDidUpdate(prevProps: IProps) {
        if (prevProps.inbox?.messages.length !== this.props.inbox?.messages.length && this.listRef) {
            this.listRef.scrollToRow(this.props.inbox?.messages.length);
        }
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
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    ADD_MESSAGES_INBOX: bindActionCreators(CALL_ADD_MESSAGES_INBOX, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Messages as ComponentType<IProps>);