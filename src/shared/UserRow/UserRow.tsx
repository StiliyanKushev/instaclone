import React, { ComponentType } from 'react';
import { Segment, Header, Button, Image, Dimmer, Loader } from 'semantic-ui-react';
import { settings } from '../../settings';

import styles from './UserRow.module.css';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../actions/types/actions';
import { ReduxProps, AppState } from '../../reducers/index';
import { connect } from 'react-redux';

interface IParentProps {
    username?: string,
    userId?: string,

    index?:number,
    isLoaded?:boolean,
    measure?:() => void
}

type IProps = IParentProps & ReduxProps & DispatchProps;

interface IState {
    /*empty*/
}

class UserRow extends React.PureComponent<IProps,IState>{
    public render(){
        if(this.props.username && this.props.userId)
        return (
            <Segment className={styles.profileSegmentInternal}>
                <Image className={styles.verySmallImg} circular size='tiny' src={`${settings.BASE_URL}/feed/photo/user/${this.props.username}`}></Image>
                <Header className={styles.profileUsernameSmall} size='tiny'>{this.props.username}</Header>
                <Button primary size='tiny'>Folllow</Button>
            </Segment>
        )
    
        if(this.props.isLoaded && this.props.index !== undefined)
        return (
            <Segment className={styles.profileSegmentInternal}>
                <Image className={styles.verySmallImg} circular size='tiny' src={`${settings.BASE_URL}/feed/photo/user/${this.props.user?.usersList[this.props.index].username}`}></Image>
                <Header className={styles.profileUsernameSmall} size='tiny'>{this.props.user?.usersList[this.props.index].username}</Header>
                <Button primary size='tiny'>Folllow</Button>
            </Segment>
        )
    
        return (
            <Segment className={styles.loadingSegment}>
                <Dimmer inverted active>
                    <Loader inverted />
                </Dimmer>
            </Segment>
        )
    }
}

const mapStateToProps = (state: AppState): ReduxProps => ({
    user: state.user
});

interface DispatchProps {
    // todo
}

const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,AppActions>):DispatchProps => ({
    // todo
})

export default connect(mapStateToProps,mapDispatchToProps)(UserRow as ComponentType<IProps>);