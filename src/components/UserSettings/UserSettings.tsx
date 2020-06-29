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

interface IProps extends DispatchProps {
    handleClose: Function
}

class UserSettings extends React.Component<IProps> {
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
                            <Link to='/report-bug'>
                                <Header as='span' size='tiny' textAlign='center'>Report a bug</Header>
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