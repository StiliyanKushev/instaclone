import React from 'react';
import { connect } from 'react-redux';
import { ComponentType } from 'react';
import { ReduxProps, AppState } from '../../reducers/index';
import { InfiniteLoader, AutoSizer, List, InfiniteLoaderChildProps, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import { IMessage } from '../../types/response';
import styles from './Messages.module.css';
import { Header } from 'semantic-ui-react';

type IProps = ReduxProps;

interface IState {
    hasMoreMessages: boolean,
}

class Messages extends React.PureComponent<IProps, IState> {
    private cache: CellMeasurerCache;
    public state: IState = { hasMoreMessages: false, }
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

    public componentDidUpdate(prevProps: IProps){
        if(prevProps.inbox?.messages.length !== this.props.inbox?.messages.length && this.listRef){
            this.listRef.scrollToRow(this.props.inbox?.messages.length);
        }
    }
    
    private renderRow({ index, key, style, parent }: any) {
        let currentRow = this.props.inbox?.messages[index] as IMessage;
        return (
            <CellMeasurer
                key={key}
                cache={this.cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}
            >
                {({measure, registerChild }: any) => (
                    <div onLoad={measure} className={`row ${styles.rowContainer} ${currentRow.user.toLowerCase() === this.props.auth?.username.toLowerCase() ? styles.right: styles.left}`} ref={registerChild} style={style}>
                        {
                            currentRow && (
                                <>
                                    {
                                        currentRow.user.toLowerCase() === this.props.auth?.username.toLowerCase() ? (
                                            <>
                                                <Header className={styles.headerRight} block size='medium'>{currentRow.text}</Header>
                                            </>
                                        ) : 
                                        (
                                            <>
                                                <Header className={styles.headerUsername} size='tiny'>{currentRow.user}</Header>
                                                <Header className={styles.headerLeft} block size='medium'>{currentRow.text}</Header>
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                    </div>
                )}
            </CellMeasurer>
        );
    }

    private handleResize(){
        // clear the cache and update it (this is the solution with best performance)
        this.cache.clearAll();
    }

    private isRowLoaded = ({ index }: { index: number }) => {
        return !!this.props.inbox?.messages[index];
    };

    private fetchMessages = ({ startIndex, stopIndex }: { startIndex: number, stopIndex: number }) => {
        // return getNewDirectsChunk(startIndex, stopIndex,this.props.auth?.userId as string, this.props.auth?.token as string).then((res: IDirectsChunkResponse) => {
        //     if (res.success) {
        //         if (res.directs.length === 0) {
        //             // no more posts
        //             this.setState({ hasMoreDirects: false })
        //         }
        //         else {
        //             this.props.ADD_INBOX_DIRECTS(res.directs);
        //         }
        //     }
        //     else {
        //         // internal error
        //     }
        // })
        return new Promise<any>(() => {})
    };

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

export default connect(mapStateToProps, null)(Messages as ComponentType<IProps>);