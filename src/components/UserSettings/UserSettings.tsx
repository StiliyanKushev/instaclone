// IMPORT STYLES
import styles from './UserSettings.module.css';

// IMPORT REACT RELATED
import React, { ComponentType } from 'react';
import { Dimmer, Menu, Segment, Header } from 'semantic-ui-react';


// IMPORT REDUX RELATED
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { AppActions } from '../../actions/types/actions';
import { LOGOUT_AUTH } from '../../actions/authActions';
import { ThunkDispatch } from 'redux-thunk';
import {bindActionCreators} from 'redux';

// IMPORT OTHER
import ChangePassword from '../ChangePassword/ChangePassword';
import ReportBug from '../ReportBug/ReportBug';
import { clearUser } from '../../handlers/serializationData';
import { toast } from 'react-toastify';
import { SET_POST_DATA_CLEAR } from '../../actions/postActions';
import { SET_USER_DATA_CLEAR } from '../../actions/userActions';

interface IProps extends DispatchProps {
    handleClose: Function
}

const REPORT_BUG_OPTION = 'report-bug';
const CHANGE_PASSWORD_OPTION = 'change-password';
const NO_OPTION = '';

interface IState {
    showTabView: typeof REPORT_BUG_OPTION | typeof CHANGE_PASSWORD_OPTION | typeof NO_OPTION
}

class UserSettings extends React.Component<IProps,IState> {
    state:IState = {showTabView:''}

    private logout(){
        //toast for goodbye
        toast.info("See you soon!");
        //remove cookies
        clearUser();
        //logout form global state
        this.props.logout();
        //clear data from global state
        this.props.clearPostData();
        this.props.clearUserData();
    }

    render() {
        return (
            this.state.showTabView === '' ?
            <Dimmer active>
                <Menu size='massive' vertical>
                    <Segment className={styles.segmentPaddingNone} attached='top'>
                        <Menu.Item>
                            <Link to='/forgot-password'>
                                <Header as='span' size='tiny' textAlign='center'>Forgot password</Header>
                            </Link>
                        </Menu.Item>
                    </Segment>
                    <Segment className={styles.segmentPaddingNone} attached>
                        <Menu.Item>
                            <Link to='#'>
                                <Header onClick={() => this.setState({showTabView:'change-password'})} as='span' size='tiny' textAlign='center'>Change password</Header>
                            </Link>
                        </Menu.Item>
                    </Segment>
                    <Segment className={styles.segmentPaddingNone} attached>
                        <Menu.Item>
                            <Link to='#'>
                                <Header onClick={() => this.setState({showTabView:'report-bug'})} as='span' size='tiny' textAlign='center'>Report a bug</Header>
                            </Link>
                        </Menu.Item>
                    </Segment>
                    <Segment className={styles.segmentPaddingNone} attached>
                        <Menu.Item>
                            <Link to='#'>
                                <Header onClick={this.logout.bind(this)} as='span' size='tiny' textAlign='center'>Log-out</Header>
                            </Link>
                        </Menu.Item>
                    </Segment>
                    <Segment className={styles.segmentPaddingNone} attached='bottom'>
                        <Menu.Item>
                            <Link to='#'>
                                <Header onClick={this.props.handleClose} as='span' size='tiny' textAlign='center'>Cancel</Header>
                            </Link>
                        </Menu.Item>
                    </Segment>
                </Menu>
            </Dimmer>
            :
            (this.state.showTabView === 'report-bug' && <ReportBug handleClose={this.props.handleClose}/>)
            || (this.state.showTabView === 'change-password' && <ChangePassword handleClose={this.props.handleClose} />)
        );
    }
}

interface DispatchProps {
    logout: () => void,
    clearPostData: () => void,
    clearUserData: () => void,
}

const mapDispathToProps = (dispatch:ThunkDispatch<any,any,AppActions>):DispatchProps => ({
    logout: bindActionCreators(LOGOUT_AUTH,dispatch),
    clearPostData: bindActionCreators(SET_POST_DATA_CLEAR,dispatch),
    clearUserData: bindActionCreators(SET_USER_DATA_CLEAR,dispatch),

})

export default connect(null,mapDispathToProps)(UserSettings as ComponentType<IProps>);