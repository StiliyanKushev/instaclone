// IMPORT STYLES
import styles from './PostComment.module.css';

 // IMPORT REACT RELETED
 import React, { ComponentType } from 'react';
 import { Header, Icon, Segment, Dimmer, Loader, Image } from 'semantic-ui-react';
 import { withCookies, ReactCookieProps } from 'react-cookie';

 // IMPORT REDUX RELETED
 import { connect } from 'react-redux';
 import { AppActions } from '../../actions/types/actions';
 import { LIKE_COMMENT, SET_REPLYING_COMMENT } from '../../actions/postActions';
 import { ThunkDispatch } from 'redux-thunk';
 import { bindActionCreators } from 'redux';
 import { AppState, ReduxProps } from '../../reducers/index';

 // IMPORT OTHER
 import { settings } from '../../settings';
import IGenericResponse from '../../types/response';
import { ICreator } from '../../types/auth';
import { TOGGLE_USERS_LIST } from '../../actions/userActions';
import { getUserLikesFromComment } from '../../handlers/post';
import { Link } from 'react-router-dom';

interface ParentProps {
    commentIndex: number,
    isLoaded: boolean,
    measure: () => void,
}

type IProps = ParentProps & ReduxProps & ReactCookieProps & DispatchProps;

interface IState {}

class PostComment extends React.PureComponent<IProps, IState>{
    private handleMeasure(){
        this.props.measure()
    }

    private handleCommentLike(){
        let commentData = this.props.post?.fullViewPostData.commentsList[this.props.commentIndex];
        this.handleMeasure()
        if(this.props.auth && commentData?.id) // just so es-lint shuts up
        this.props.likeComment(this.props.commentIndex,commentData.id ,this.props.auth?.userId,this.props.auth?.token);
    }

    private handleLikesClick(){
        this.props.toggleUserLikes((startIndex:number,stopIndex:number) => {
            return getUserLikesFromComment(startIndex,stopIndex,this.props.auth?.userId as string, this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].id as string,this.props.auth?.token as string);
        });
    }

    private handleReply(){
        // if user wants to cancel reset it to -1 (no comment)
        if(this.props.post?.currentReplyingComment === this.props.commentIndex && this.props.post.currentReplyingSubComment === -1){
            this.props.replyingComment(-1,-1);
            return;
        }

        // fetch comment and update redux
        this.props.replyingComment(this.props.commentIndex,-1);
    }

    public render() {
        if (this.props.isLoaded) {
            return (
                <div className={styles.commentItemContainer}>
                    <div className={styles.commentItemLeftSide}>
                        <Image
                            className={styles.verySmallImg}
                            circular
                            size="tiny"
                            src={`${settings.BASE_URL}/feed/photo/user/${this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].creator?.username || this.props.auth?.username || this.props.cookies?.get('username')}`}
                            onLoad={() => this.handleMeasure.bind(this)()}
                        ></Image>
                        <div>
                            <Header className={styles.commentItemHeader}>
                                <Link id={styles.noTextDecor} to={`/profile/${this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].creator?.username || this.props.auth?.username || this.props.cookies?.get('username')}`}><span>
                                    {this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].creator?.username || this.props.auth?.username || this.props.cookies?.get('username')}
                                </span></Link>{" "}
                                {this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].content}
                            </Header>
                            
                            {!this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].isDescription && (
                                <div className={styles.commentItemBtns}>
                                    <Header onClick={this.handleLikesClick.bind(this)} className={styles.likesBtn} disabled>{this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].likesCount} likes</Header>
                                    {
                                        this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].creator?.username && (
                                            <Header id={`${this.props.post?.currentReplyingComment === this.props.commentIndex && this.props.post.currentReplyingSubComment === -1 ? styles.cancelHeader : ''}`} onClick={this.handleReply.bind(this)} disabled className={styles.commentItemReply}>
                                                {
                                                    this.props.post?.currentReplyingComment === this.props.commentIndex && this.props.post.currentReplyingSubComment === -1 ? 'Cancel' : 'Reply'
                                                }
                                            </Header>
                                        )
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {!this.props.post?.fullViewPostData.commentsList[this.props.commentIndex]
                        .isDescription && !(!this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].creator?.username as any || this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].creator?.username === (this.props.auth?.username || this.props.cookies?.get('username'))) && (
                        <Icon
                            //name="heart outline"
                            size="small"
                            color="black"
                            onClick={this.handleCommentLike.bind(this)}
                            id={!this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].isLiked ? `${styles.likeOutline}` : `${styles.likeBtnId}`}
                            className={`${styles.likeBtn} heart ${this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].isLiked ? '' : 'outline'}`}
                        ></Icon>
                    )}
                </div>
            );
        }

        else {
            return (
                <Segment className={styles.loadingSegment}>
                    <Dimmer inverted active>
                        <Loader inverted />
                    </Dimmer>
                </Segment>
            );
        }
    }
}

const mapStateToProps = (state: AppState): ReduxProps => ({
    post: state.post,
    auth: state.auth
});

interface DispatchProps {
    replyingComment: (commentIndex:number,subCommentIndex:number) => void,
    likeComment: (commentIndex:number,commentId:string,userId:string,token:string) => void,
    toggleUserLikes: (fetchFunction:(startIndex:number,stopIndex:number) => Promise<IGenericResponse & {likes:Array<ICreator>}>) => void,
}

const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,AppActions>):DispatchProps => ({
    likeComment:bindActionCreators(LIKE_COMMENT,dispatch),
    toggleUserLikes:bindActionCreators(TOGGLE_USERS_LIST,dispatch),
    replyingComment:bindActionCreators(SET_REPLYING_COMMENT,dispatch)
})

export default withCookies(connect(mapStateToProps,mapDispatchToProps)(PostComment as ComponentType<IProps>));