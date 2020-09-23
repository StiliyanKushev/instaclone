// IMPORT STYLES
import styles from './UserRow.module.css';

// IMPORT REACT RELETED
import React, { ComponentType } from 'react';
import { Segment, Header, Button, Image, Dimmer, Loader } from 'semantic-ui-react';

// IMPORT REDUX RELETED
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../actions/types/actions';
import { ReduxProps, AppState } from '../../reducers/index';

// IMPORT OTHER
import { settings } from '../../settings';
import { bindActionCreators } from 'redux';
import { FOLLOW_SUGGESTED, UNFOLLOW_SUGGESTED, FOLLOW_USER_LIST, UNFOLLOW_USER_LIST } from '../../actions/userActions';
import { Link } from 'react-router-dom';

interface IParentProps {
    username?: string,
    userId?: string,
    indexSuggested?:number,
    index?:number,
    isLoaded?:boolean,
    measure?:() => void
    onActionCallback?:(didFollow:boolean) => void
}

type IProps = IParentProps & ReduxProps & DispatchProps;

interface IState {
    /*empty*/
}

class UserRow extends React.PureComponent<IProps,IState>{
    private handleUnfollow(username:string){
        this.props.unfollow(this.props.index as number,username,this.props.auth?.userId as string,this.props.auth?.token as string)
        if(this.props.onActionCallback)
        this.props.onActionCallback(false);
    }

    private handleFollow(username:string){
        this.props.follow(this.props.index as number,username,this.props.auth?.userId as string,this.props.auth?.token as string)
        if(this.props.onActionCallback)
        this.props.onActionCallback(true);
    }

    private handleUnfollowSuggested(username:string){
        this.props.unfollowSuggested(this.props.indexSuggested as number,username,this.props.auth?.userId as string,this.props.auth?.token as string)
        if(this.props.onActionCallback)
        this.props.onActionCallback(false);
    }

    private handleFollowSuggested(username:string){
        this.props.followSuggested(this.props.indexSuggested as number,username,this.props.auth?.userId as string,this.props.auth?.token as string)
        if(this.props.onActionCallback)
        this.props.onActionCallback(true);
    }

    public render(){
        if(this.props.username && this.props.userId && this.props.indexSuggested !== undefined)
        return (
            <Segment className={styles.profileSegmentInternal}>
                <Image className={styles.verySmallImg} circular size='tiny' src={`${settings.BASE_URL}/feed/photo/user/${this.props.username}`}></Image>
                <Link to={`/profile/${this.props.username}`}><Header className={styles.profileUsernameSmall} size='tiny'>{this.props.username}</Header></Link>
                {
                    this.props.user?.suggestedUsers[this.props.indexSuggested].isFollowed ?
                    <Button id={styles.unfollowBtn} loading={this.props.user?.suggestedUsers[this.props.indexSuggested].isLoading} onClick={() => this.handleUnfollowSuggested.bind(this)(this.props.user?.suggestedUsers[this.props.indexSuggested as number].username as string)} primary size='tiny'>Unfolllow</Button>
                    :
                    <Button loading={this.props.user?.suggestedUsers[this.props.indexSuggested].isLoading} onClick={() => this.handleFollowSuggested.bind(this)(this.props.user?.suggestedUsers[this.props.indexSuggested as number].username as string)} primary size='tiny'>Folllow</Button>
                }
            </Segment>
        )
    
        if(this.props.isLoaded && this.props.index !== undefined)
        return (
            <Segment className={styles.profileSegmentInternal}>
                <Image className={styles.verySmallImg} circular size='tiny' src={`${settings.BASE_URL}/feed/photo/user/${this.props.user?.usersList[this.props.index].username}`}></Image>
                <Link to={`/profile/${this.props.user?.usersList[this.props.index].username}`}><Header className={styles.profileUsernameSmall} size='tiny'>{this.props.user?.usersList[this.props.index].username}</Header></Link>
                {
                    this.props.user?.usersList[this.props.index].isFollowed ?
                    <Button loading={this.props.user?.usersList[this.props.index].isLoading} id={styles.unfollowBtn} onClick={() => this.handleUnfollow.bind(this)(this.props.user?.usersList[this.props.index as number].username as string)} primary size='tiny'>Unfolllow</Button>
                    :
                    <Button disabled={this.props.user?.usersList[this.props.index].username === this.props.auth?.username} loading={this.props.user?.usersList[this.props.index].isLoading} onClick={() => this.handleFollow.bind(this)(this.props.user?.usersList[this.props.index as number].username as string)} primary size='tiny'>Folllow</Button>
                }
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
    user: state.user,
    auth: state.auth
});

interface DispatchProps {
    followSuggested: (index:number,username:string,userId:string,token:string) => void,
    unfollowSuggested: (index:number,username:string,userId:string,token:string) => void,
    follow: (index:number,username:string,userId:string,token:string) => void,
    unfollow: (index:number,username:string,userId:string,token:string) => void,
}

const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,AppActions>):DispatchProps => ({
    followSuggested: bindActionCreators(FOLLOW_SUGGESTED,dispatch),
    unfollowSuggested: bindActionCreators(UNFOLLOW_SUGGESTED,dispatch),
    follow: bindActionCreators(FOLLOW_USER_LIST,dispatch),
    unfollow: bindActionCreators(UNFOLLOW_USER_LIST,dispatch),
})

export default connect(mapStateToProps,mapDispatchToProps)(UserRow as ComponentType<IProps>);