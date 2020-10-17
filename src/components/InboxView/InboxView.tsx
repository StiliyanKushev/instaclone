import React from 'react';
import { Container, Grid, GridColumn, Icon, Segment, Header, Image, Button, Input } from 'semantic-ui-react';
import styles from './InboxView.module.css';

import { CALL_TOGGLE_DIRECT, CALL_ADD_INBOX_DIRECTS, CALL_SELECT_DIRECT_ITEM } from '../../actions/inboxActions';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../actions/types/actions';
import { connect } from 'react-redux';
import { ComponentType } from 'react';
import { Helmet } from 'react-helmet';
import { AppState, ReduxProps } from '../../reducers/index';
import DirectPopup from '../../shared/DirectPopup/DirectPopup';
import { InfiniteLoader, AutoSizer, InfiniteLoaderChildProps, List, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import { getNewDirectsChunk } from '../../handlers/inbox';
import { IDirectsChunkResponse } from '../../types/response';
import { settings } from '../../settings';

type IProps = DispatchProps & ReduxProps;

export interface DirectItem {
    name:string,
    lastMsg?:string,
    userId:string,
    _id:string,
    isCurrent?:boolean,
}

interface IState {
    hasMoreDirects: boolean,
}

class InboxView extends React.PureComponent<IProps, IState>{
    private cache: CellMeasurerCache;
    public state: IState = { hasMoreDirects:true };

    private get rowCount(): number {
        let directs: any = this.props.inbox?.directs;
        return this.state.hasMoreDirects ? directs.length + 10 : directs.length;
    }

    constructor(props: IProps) {
        super(props);

        this.cache = new CellMeasurerCache({
            // fixedWidth: true,
            fixedHeight: true,
            defaultHeight: 69,
        });
    }

    private handleDirectItemClick(index:number, row:DirectItem){
        this.props.SELECT_DIRECT_ITEM(index,row);
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
                {
                    this.props.inbox?.toggledDirect && <DirectPopup />
                }
                <Container className={styles.uiContainer}>
                    <Grid className={styles.grid}>
                        <GridColumn width='6' className={styles.firstCol}>
                            <Segment className={styles.directTopSegment} attached='top' textAlign='center'><Header className={styles.directHeader} size='medium'>Direct</Header><Icon onClick={this.handleDirectClick.bind(this)} className={styles.directBtn} size='big' name='edit outline'></Icon></Segment>
                            <Segment className={styles.directBottomSegment} attached='bottom'>
                            <Container className={styles.directItemContainerEmpty}></Container>
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
                            </Segment>
                        </GridColumn>
                        <GridColumn width='9' className={styles.secondCol}>
                            {
                                this.props.inbox?.currentUserId ? (
                                    <>
                                        <Segment className={styles.contentTopSegment} attached='top'>
                                            <Image className={styles.contentImg} src={`${settings.BASE_URL}/feed/photo/user/${this.props.inbox?.currentUsername}`}></Image> <Header className={styles.contentUsername} size='small'>{this.props.inbox?.currentUsername}</Header>
                                            <div className={styles.contentBtns}>
                                                    <Button color='red' size='mini'>Delete</Button>
                                            </div>
                                        </Segment>
                                        <Segment className={styles.contentBottomSegment} attached='bottom'>
                                            <div className={styles.chatContent}>

                                            </div>
                                            <div className={styles.inputSendContainer}>
                                                <Input
                                                    className={styles.inputSend}
                                                    icon={{ name: 'send', circular: true, link: true }}
                                                    placeholder='Search...'
                                                />
                                            </div>
                                        </Segment>
                                    </>
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
    auth: state.auth
})

interface DispatchProps {
    CALL_TOGGLE_DIRECT: () => void,
    ADD_INBOX_DIRECTS: (directs:Array<DirectItem>) => void,
    SELECT_DIRECT_ITEM: (index:number,item:DirectItem) => void,
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    CALL_TOGGLE_DIRECT: bindActionCreators(CALL_TOGGLE_DIRECT, dispatch),
    ADD_INBOX_DIRECTS: bindActionCreators(CALL_ADD_INBOX_DIRECTS, dispatch),
    SELECT_DIRECT_ITEM: bindActionCreators(CALL_SELECT_DIRECT_ITEM, dispatch),
})

export default connect(mapStateToProps,mapDispatchToProps)(InboxView as ComponentType<IProps>);