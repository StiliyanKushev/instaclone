// IMPORT STYLES
import styles from './InboxView.module.css';

// IMPORT REACT RELATED
import React from 'react';
import { Container, Grid, GridColumn, Icon, Segment, Header, Image } from 'semantic-ui-react';
import { InfiniteLoader, AutoSizer, InfiniteLoaderChildProps, List, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

// IMPORT REDUX RELATED
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../actions/types/actions';
import { AppState, ReduxProps } from '../../reducers/index';
import { CALL_TOGGLE_DIRECT, CALL_ADD_INBOX_DIRECTS, CALL_SELECT_DIRECT_ITEM, DELETE_DIRECT_ITEM, CALL_INPUT_MESSAGE, CALL_ADD_MESSAGES_MESSAGE, SAVE_MESSAGE_DB, CALL_CONNECT_INBOX_SOCKET, CALL_SEND_PREPARE_DATA_INBOX } from '../../actions/inboxActions';

// IMPORT OTHER
import { Helmet } from 'react-helmet';
import { ComponentType } from 'react';
import { settings } from '../../settings';
import ChatView from '../../shared/ChatView/ChatView';
import { getNewDirectsChunk } from '../../handlers/inbox';
import DirectPopup from '../../shared/DirectPopup/DirectPopup';
import { IDirectsChunkResponse, IMessage, IMessageDB } from '../../types/response';

type IProps = DispatchProps & ReduxProps & RouteComponentProps;

export interface DirectItem {
    name:string,
    lastMsg?:string,
    userId:string,
    _id:string,
    isCurrent?:boolean,
}

interface IState {
    hasMoreDirects: boolean,
    name:string,
    room:string,
    shouldSelectFirst: boolean,
}

class InboxView extends React.PureComponent<IProps, IState>{
    private cache: CellMeasurerCache;
    public state: IState = { hasMoreDirects:true, name:'', room:'', shouldSelectFirst:false, };

    private get rowCount(): number {
        let directs: any = this.props.inbox?.directs;
        return this.state.hasMoreDirects ? directs.length + 11 : directs.length;
    }

    constructor(props: IProps) {
        super(props);

        this.cache = new CellMeasurerCache({
            // fixedWidth: true,
            fixedHeight: true,
            defaultHeight: 69, // :D
        });
    }

    public componentDidMount(){
        this.props.connectSocket();

        this.props.inbox?.currentSocket.on('message', (message:IMessage) => {
            this.props.addToMessages(message);
        });

        if(this.props.inbox?.preparedInbox){
            this.handlePrepared();
        }
    }

    private handlePrepared(){
        let inbox = this.props.inbox;
        let auth = this.props.auth;
        // make a call to the backend
        this.props.sendPreparedDataToBackend(inbox?.preparedInbox as string,auth?.username as string,auth?.userId as string,auth?.token as string);
        // once added select it (open the chat)
        this.setState({shouldSelectFirst:true});
    }

    private handleDirectItemClick(index:number, row:DirectItem){
        // on desktop scale
        if(window.innerWidth >= 1000){
            if(row._id === this.props.inbox?.currentDirectItemId) return;
            this.props.inbox?.currentSocket.emit('exit', { room: this.state.room }, (error:string) => {
                if(error) {
                    alert(error);
                }
            });
            this.props.SELECT_DIRECT_ITEM(index,row);
        }
        // on mobile scale
        else{
            this.props.SELECT_DIRECT_ITEM(index,row);
            this.props.history.push('/inbox/chat/' + row.name);
        }
    }

    private get room(): string {
        let usr1 = this.props.auth?.username as string;
        let usr2 = this.props.inbox?.currentUsername as string;

        let sorted = [usr1,usr2].sort();
        let res = sorted[0] + sorted[1];

        return res.trim();
    }


    private onLoadCb() {
        this.setState({name: this.props.auth?.username as string,room: this.room}, () => {
            this.props.inbox?.currentSocket.emit('join', { name: this.state.name, room: this.state.room }, (error:string) => {});
        })
    }

    private renderRow({ index, key, style, parent }: any) {
        let currentRow = this.props.inbox?.directs[index];
        return (
            <CellMeasurer
                key={key}
                cache={this.cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}
            >
                {({ registerChild }: any) => (
                    <div onClick={() => this.handleDirectItemClick.bind(this)(index ,currentRow as DirectItem)} className={`row ${styles.rowContainer}`} ref={registerChild} style={style}>
                        <Container className={`${styles.directItemContainer} ${currentRow?.isCurrent ? styles.directItemContainerDark : null}`}>
                            <Image src={`${settings.BASE_URL}/feed/photo/user/${currentRow?.name}`} className={styles.directItemImg}></Image>
                            <div className={styles.directItemContent}>
                                <Header className={styles.directItemUsername} size='small'>{currentRow?.name}</Header>
                                <Header className={styles.directItemLastMsg} size='small' disabled>{currentRow?.lastMsg}</Header>
                            </div>
                        </Container>
                    </div>
                )}
            </CellMeasurer>
        );
    }

    private handleResize(){
        // clear the cache and update it (this is the solution with best performance)
        this.cache.clearAll();
    }

    private handleDirectClick(){
        // open the direct popup
        this.props.CALL_TOGGLE_DIRECT();
    }

    private isRowLoaded = ({ index }: { index: number }) => {
        return !!this.props.inbox?.directs[index];
    };

    private fetchDirects = ({ startIndex, stopIndex }: { startIndex: number, stopIndex: number }) => {
        return getNewDirectsChunk(startIndex, stopIndex,this.props.auth?.userId as string, this.props.auth?.token as string).then((res: IDirectsChunkResponse) => {
            if (res.success) {
                if (res.directs.length === 0) {
                    // no more posts
                    this.setState({ hasMoreDirects: false })
                }
                else {
                    this.props.ADD_INBOX_DIRECTS(res.directs);
                    if(this.state.shouldSelectFirst){
                        this.props.SELECT_DIRECT_ITEM(0,this.props.inbox?.directs[0] as DirectItem);
                        this.setState({shouldSelectFirst: false});
                    }
                }
            }
            else {
                // internal error
            }
        })
    };

    public render(){
        return (
            <div id={styles.viewContainer} className='view-container'>
                <Helmet>
                    <style type="text/css">{`
                        body,html,#root {
                            background-color: white !important;
                        }
                    `}</style>
                </Helmet>
                {this.props.inbox?.toggledDirect && <DirectPopup />}
                <Container className={styles.uiContainer}>
                    <Grid className={styles.grid}>
                        <GridColumn width='6' className={styles.firstCol}>
                            <Segment className={styles.directTopSegment} attached='top' textAlign='center'><Header className={styles.directHeader} size='medium'>Direct</Header><Icon onClick={this.handleDirectClick.bind(this)} className={styles.directBtn} size='big' name='edit outline'></Icon></Segment>
                            <Segment className={styles.directBottomSegment} attached='bottom'>
                            <Container className={styles.directItemContainerEmpty}></Container>
                                {
                                    this.props.inbox?.preparedInboxDone && (
                                        <InfiniteLoader
                                            isRowLoaded={this.isRowLoaded.bind(this)}
                                            loadMoreRows={this.fetchDirects.bind(this)}
                                            rowCount={this.rowCount}
                                            minimumBatchSize={10}
                                            threshold={15}>
                                            {({ onRowsRendered,registerChild }: InfiniteLoaderChildProps) => (
                                                    <AutoSizer className={styles.AutoSizer} onResize={this.handleResize.bind(this)}>
                                                        {({ width, height }) => {
                                                            return (
                                                                <List
                                                                    ref={registerChild}
                                                                    onRowsRendered={onRowsRendered}
                                                                    className={styles.commentsList}
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
                                    )
                                }
                                
                            </Segment>
                        </GridColumn>
                        <GridColumn width='9' className={styles.secondCol}>
                            {
                                this.props.inbox?.currentUserId ? (
                                    <ChatView onLoad={this.onLoadCb.bind(this)} />
                                ) :

                                (
                                    <Segment className={styles.emptySegment}>
                                        <Header size='large'>Chat with your friends.</Header>
                                        <Header size='medium'>Select one from the left menu!</Header>
                                    </Segment>
                                )
                            }                            
                        </GridColumn>
                    </Grid>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState): ReduxProps => ({
    inbox: state.inbox,
    auth: state.auth,
})

interface DispatchProps {
    connectSocket: () => void,
    CALL_TOGGLE_DIRECT: () => void,
    ADD_INBOX_DIRECTS: (directs:Array<DirectItem>) => void,
    SELECT_DIRECT_ITEM: (index:number,item:DirectItem) => void,
    DELETE_DIRECT_ITEM: (username:string, userId:string, token:string) => void,
    setInputVal: (value:string) => void,
    addToMessages: (msg: IMessage) => void,
    saveMessageToDb: (msg: IMessageDB, userId: string, token: string) => void,
    sendPreparedDataToBackend: (otherUsername: string, username:string, userId:string, token:string) => void,
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    CALL_TOGGLE_DIRECT: bindActionCreators(CALL_TOGGLE_DIRECT, dispatch),
    ADD_INBOX_DIRECTS: bindActionCreators(CALL_ADD_INBOX_DIRECTS, dispatch),
    SELECT_DIRECT_ITEM: bindActionCreators(CALL_SELECT_DIRECT_ITEM, dispatch),
    DELETE_DIRECT_ITEM: bindActionCreators(DELETE_DIRECT_ITEM, dispatch),
    connectSocket: bindActionCreators(CALL_CONNECT_INBOX_SOCKET, dispatch),
    setInputVal: bindActionCreators(CALL_INPUT_MESSAGE, dispatch),
    addToMessages: bindActionCreators(CALL_ADD_MESSAGES_MESSAGE, dispatch),
    saveMessageToDb: bindActionCreators(SAVE_MESSAGE_DB, dispatch),
    sendPreparedDataToBackend: bindActionCreators(CALL_SEND_PREPARE_DATA_INBOX, dispatch),
})

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(InboxView as ComponentType<IProps>));