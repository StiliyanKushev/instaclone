import React from 'react';
import { Container, Grid, GridColumn, Icon, Segment, Header, Image, Button, Input } from 'semantic-ui-react';
import styles from './InboxView.module.css';

import defaultImg from '../../assets/avatar.jpg';
import { CALL_TOGGLE_DIRECT } from '../../actions/inboxActions';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../actions/types/actions';
import { connect } from 'react-redux';
import { ComponentType } from 'react';
import { Helmet } from 'react-helmet';
import { AppState, ReduxProps } from '../../reducers/index';
import DirectPopup from '../../shared/DirectPopup/DirectPopup';

type IProps = DispatchProps & ReduxProps;

interface IState {}

class InboxView extends React.PureComponent<IProps, IState>{
    private handleDirectClick(){
        // open the direct popup
        this.props.CALL_TOGGLE_DIRECT();
    }

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
                                <Container className={styles.directItemContainer}>
                                    <Image src={defaultImg} className={styles.directItemImg}></Image>
                                    <div className={styles.directItemContent}>
                                        <Header className={styles.directItemUsername} size='small'>Username</Header>
                                        <Header className={styles.directItemLastMsg} size='small' disabled>hello friend! How are you doing?</Header>
                                    </div>
                                </Container>
                            </Segment>
                        </GridColumn>
                        <GridColumn width='9' className={styles.secondCol}>
                            <Segment className={styles.contentTopSegment} attached='top'>
                                <Image className={styles.contentImg} src={defaultImg}></Image> <Header className={styles.contentUsername} size='small'>Username</Header>
                                <div className={styles.contentBtns}>
                                        <Button color='red' size='mini'>Delete</Button>
                                        <Button color='grey' size='mini'>Mute</Button>
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
                        </GridColumn>
                    </Grid>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState): ReduxProps => ({
    inbox: state.inbox,
})

interface DispatchProps {
    CALL_TOGGLE_DIRECT: () => void,
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    CALL_TOGGLE_DIRECT: bindActionCreators(CALL_TOGGLE_DIRECT,dispatch)
})

export default connect(mapStateToProps,mapDispatchToProps)(InboxView as ComponentType<IProps>);