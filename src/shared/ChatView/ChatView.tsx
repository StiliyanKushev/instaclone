// IMPORT STYLES
import styles from './ChatView.module.css';

// IMPORT REACT RELATED
import React from 'react';
import { createRef } from 'react';
import { Segment, Image, Button, Ref, Form, Input, Icon, Header } from 'semantic-ui-react';

// IMPORT REDUX RELATED
import {ComponentType} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../actions/types/actions';
import { AppState, ReduxProps } from '../../reducers/index';
import { CALL_TOGGLE_DIRECT, CALL_ADD_INBOX_DIRECTS, CALL_SELECT_DIRECT_ITEM, DELETE_DIRECT_ITEM, CALL_INPUT_MESSAGE, SAVE_MESSAGE_DB, CALL_CONNECT_INBOX_SOCKET } from '../../actions/inboxActions';

// IMPORT VALIDATION
import { IMessageDB } from '../../types/response';

// IMPORT ROUTER RELETED
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';

// IMPORT OTHER
import $ from 'jquery';
import { Helmet } from 'react-helmet';
import { settings } from '../../settings';
import Messages from '../Messages/Messages';
import { DirectItem } from '../../components/InboxView/InboxView';

interface ParentProps {
    onLoad: () => void,
}

type IProps = ParentProps & ReduxProps & DispatchProps & RouteComponentProps;

interface IState {
    // empty
}

class ChatView extends React.PureComponent<IProps, IState>{
    private formRef = createRef<HTMLFormElement>();

    private get msgDbName() {
        let names = [this.props.auth?.username.toLowerCase(), this.props.inbox?.currentUsername.toLowerCase()].sort();
        if(names[0] && names[1]){
            return names[0] + names[1];
        }
        else return '';
    }

    private get room(): string {
        let usr1 = this.props.auth?.username as string;
        let usr2 = ((this.props.match.params) as any).name as string;

        let sorted = [usr1,usr2].sort();
        let res = sorted[0] + sorted[1];

        return res.trim();
    }

    private inputSend(e: React.FormEvent<HTMLFormElement>, saveDb:boolean=true){
        e.preventDefault();
        if(this.props.inbox?.inputMessage) {
            this.props.inbox?.currentSocket.emit('sendMessage', this.props.inbox?.inputMessage, (err:string) => {        
                if(err){
                    this.props.inbox?.currentSocket.emit('join', { name: this.props.auth?.username as string, room: this.room }, (error:string) => {});
                    this.inputSend(e,false);
                }
                else{
                    this.props.setInputVal('');
                }
            });
            if(saveDb) this.props.saveMessageToDb({author: this.props.auth?.username, name: this.msgDbName, text: this.props.inbox?.inputMessage} as IMessageDB,this.props.auth?.userId as string, this.props.auth?.token as string);
        }
    }

    public componentDidMount(){
        // if user directly tries to go on to a chat
        if(!this.props.inbox?.currentUsername){
            // refer him to the inbox page
            this.props.history.push('/inbox');
        }

        if(!this.props.inbox?.currentSocket){
            this.props.connectSocket();
        }

        if(this.props.onLoad)
        this.props.onLoad();
    }

    private handleDeleteClick(){
        this.props.DELETE_DIRECT_ITEM(this.props.inbox?.currentUsername as string,this.props.auth?.userId as string,this.props.auth?.token as string);
    }

    private handleSendIcon(e:Event){
        e.preventDefault();
        e.stopPropagation();
        $(this.formRef.current as any).on('submit', (ee:Event) => {
            ee.preventDefault();
        })
        this.inputSend(e as any);
        $(this.formRef.current as any).submit();
    }


    public render() {
        return (
            <>
                <Helmet>
                    <style type="text/css">{`
                        main {
                            overflow: hidden !important; 
                        }
                    `}</style>
                </Helmet>
                <Segment className={styles.contentTopSegment} attached='top'>
                    <Image className={styles.contentImg} src={`${settings.BASE_URL}/feed/photo/user/${this.props.inbox?.currentUsername}`}></Image> <Header className={styles.contentUsername} size='small'>{this.props.inbox?.currentUsername}</Header>
                    <div className={styles.contentBtns}>
                        <Button onClick={this.handleDeleteClick.bind(this)} color='red' size='mini'>Delete</Button>
                    </div>
                </Segment>
                <Segment className={styles.contentBottomSegment} attached='bottom'>
                    <div className={styles.chatContent}>
                        <Messages onUpdate={this.props.onLoad} />
                    </div>
                    <div className={styles.inputSendContainer}>
                        <Ref innerRef={this.formRef}>
                            <Form onSubmit={(e) => this.inputSend.bind(this)(e,true)}>
                                <Input
                                    value={this.props.inbox?.inputMessage}
                                    onChange={e => this.props.setInputVal(e.target.value)}
                                    className={styles.inputSend}
                                    //icon={{ name: 'send', circular: true, link: true }}
                                    icon={<Icon link circular name='send' onClick={this.handleSendIcon.bind(this)} />}
                                    placeholder='Search...'
                                />
                            </Form>
                        </Ref>
                    </div>
                </Segment>
            </>
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
    saveMessageToDb: (msg: IMessageDB, userId: string, token: string) => void,
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    connectSocket: bindActionCreators(CALL_CONNECT_INBOX_SOCKET, dispatch),
    CALL_TOGGLE_DIRECT: bindActionCreators(CALL_TOGGLE_DIRECT, dispatch),
    ADD_INBOX_DIRECTS: bindActionCreators(CALL_ADD_INBOX_DIRECTS, dispatch),
    SELECT_DIRECT_ITEM: bindActionCreators(CALL_SELECT_DIRECT_ITEM, dispatch),
    DELETE_DIRECT_ITEM: bindActionCreators(DELETE_DIRECT_ITEM, dispatch),
    setInputVal: bindActionCreators(CALL_INPUT_MESSAGE, dispatch),
    saveMessageToDb: bindActionCreators(SAVE_MESSAGE_DB, dispatch),
})

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ChatView as ComponentType<IProps>));