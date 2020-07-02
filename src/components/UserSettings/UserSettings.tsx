import React, { ComponentType } from 'react';
import { Dimmer, Menu, Segment, Header } from 'semantic-ui-react';

import {bindActionCreators} from 'redux';

import styles from './UserSettings.module.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../actions/types/actions';
import { LOGOUT_AUTH } from '../../actions/authActions';
import { clearUser } from '../../handlers/serializationData';
import { toast } from 'react-toastify';
import ReportBug from '../ReportBug/ReportBug';
import ChangePassword from '../ChangePassword/ChangePassword';

interface IProps extends DispatchProps {
    handleClose: Function
}

class UserSettings extends React.Component<IProps> {
    state ={showTabView:''}

    private logout(){
        //toast for goodbye
        toast.info("See you soon!");
        //remove cookies
        clearUser();
        //logout form global state
        this.props.logout();
    }

    render() {
        return (
            this.state.showTabView === '' ?
            <Dimmer active>
                <Menu size='massive' vertical>
                    <Segment className={styles.segmentPaddingNone} attached='top'>
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
    logout: () => void
}

const mapDispathToProps = (dispatch:ThunkDispatch<any,any,AppActions>):DispatchProps => ({
    logout: bindActionCreators(LOGOUT_AUTH,dispatch)
})

export default connect(null,mapDispathToProps)(UserSettings as ComponentType<IProps>);