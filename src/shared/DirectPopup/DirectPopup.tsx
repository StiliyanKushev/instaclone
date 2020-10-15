import React, { ComponentType } from 'react';
import { Dimmer, Segment, Icon, Header, Input, Container, Image, InputOnChangeData, Placeholder } from 'semantic-ui-react';
import styles from './DirectPopup.module.css';
import { AppActions } from '../../actions/types/actions';
import { ThunkDispatch } from 'redux-thunk';
import { CALL_TOGGLE_DIRECT, CALL_UPDATE_SELECTION_DIRECT, CALL_START_SEARCH_DIRECT, CALL_CLEAN_QUERY_DIRECT, CALL_FINISH_SEARCH_DIRECT, CALL_HANDLE_DIRECT_SELECTION } from '../../actions/inboxActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import defaultImg from '../../assets/avatar.jpg';
import { ReduxProps, AppState } from '../../reducers/index';
import axios from 'axios';
import { settings } from '../../settings';


type IProps = DispatchProps & ReduxProps;

class DirectPopup extends React.PureComponent<IProps, any>{
    private cancelToken: any;

    private handleClose() {
        this.props.cleanQuery();
        this.props.CALL_TOGGLE_DIRECT();
    }

    private handleSearchChange(event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) {
        this.props.updateSelection(data.value)

        this.props.startSearch(data.value as any);

        if (!data.value || data.value.length === 0) {
            this.props.cleanQuery();
            return
        }

        if (this.cancelToken) {
            this.cancelToken.cancel();
        }
        this.cancelToken = axios.CancelToken.source();

        axios.get(settings.BASE_URL + `/feed/user/users/${data.value}/as/${this.props.auth?.userId}/less`,
            {
                headers: {
                    'token': this.props.auth?.token,
                },
                cancelToken: this.cancelToken.token
            }).then((r) => {
                let res = r.data;

                if (res.success) {
                    setTimeout(() => {
                        this.props.finishSearch(res.results);
                    }, 100)
                }
            })
            .catch((error) => {
                if (axios.isCancel(error) || error) {
                    this.props.cleanQuery();
                }
            });
    }

    private handleSelectItem(e:any,user:{name:string}){
        e.stopPropagation();
        this.props.handleDirectSelection(user.name, this.props.auth?.userId as string, this.props.auth?.token as string);
        this.handleClose();
    }

    public render() {
        return (
            <Dimmer active>
                <Segment attached='top' className={styles.topSegment}>
                    <Icon onClick={this.handleClose.bind(this)} className={styles.closeBtn} size='large' color='black' name='close'></Icon>
                    <Header className={styles.newMsgText} size='medium'>Send message to</Header>
                </Segment>
                <Segment attached>
                    <Input onChange={this.handleSearchChange.bind(this)} value={this.props.inbox?.value} className={styles.usernameInput} label='To:' placeholder='username' />
                </Segment>
                <Segment attached='bottom' className={styles.bottomSegment}>
                    <Header className={styles.suggestedText} size='small'>Suggested:</Header>
                    {   this.props.inbox?.loading &&
                        (
                            <Placeholder id={styles.placeholder}>
                                <Placeholder.Image>

                                </Placeholder.Image>
                            </Placeholder>
                        )
                    }
                    {   !this.props.inbox?.loading && 

                        this.props.inbox?.results.map(user => (
                            <Container onClick={(e:any) => this.handleSelectItem.bind(this)(e,user)} className={styles.directItemContainer}>
                                <Image src={defaultImg} className={styles.directItemImg}></Image>
                                <div className={styles.directItemContent}>
                                    <Header className={styles.directItemUsername} size='small'>{user.name}</Header>
                                    <Header className={styles.directItemLastMsg} size='small' disabled>hello friend! How are you doing?</Header>
                                </div>
                            </Container>
                        ))
                    }

                </Segment>
            </Dimmer>
        );
    }
}

interface DispatchProps {
    CALL_TOGGLE_DIRECT: () => void,
    updateSelection: (selection: string) => void,
    startSearch: (value: string) => void,
    cleanQuery: () => void,
    finishSearch: (results: Array<{ name: string }>) => void,
    handleDirectSelection: (username: string, userId: string, token: string) => void,
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    CALL_TOGGLE_DIRECT: bindActionCreators(CALL_TOGGLE_DIRECT, dispatch),
    updateSelection: bindActionCreators(CALL_UPDATE_SELECTION_DIRECT, dispatch),
    startSearch: bindActionCreators(CALL_START_SEARCH_DIRECT, dispatch),
    cleanQuery: bindActionCreators(CALL_CLEAN_QUERY_DIRECT, dispatch),
    finishSearch: bindActionCreators(CALL_FINISH_SEARCH_DIRECT, dispatch),
    handleDirectSelection: bindActionCreators(CALL_HANDLE_DIRECT_SELECTION, dispatch),
})

const mapStateToProps = (state: AppState): ReduxProps => ({
    inbox: state.inbox,
    auth: state.auth,
})

export default connect(mapStateToProps, mapDispatchToProps)(DirectPopup as ComponentType<IProps>);