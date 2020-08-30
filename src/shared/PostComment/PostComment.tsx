// IMPORT STYLES
import styles from './PostComment.module.css';

 // IMPORT REACT RELETED
 import React, { ComponentType } from 'react';
 import { Header, Icon, Segment, Dimmer, Loader, Image } from 'semantic-ui-react';
 import { withCookies, ReactCookieProps } from 'react-cookie';

 // IMPORT REDUX RELETED
 import { connect } from 'react-redux';
 import { AppActions } from '../../actions/types/actions';
 import { LIKE_COMMENT } from '../../actions/postActions';
 import { ThunkDispatch } from 'redux-thunk';
 import { bindActionCreators } from 'redux';
 import { AppState, ReduxProps } from '../../reducers/index';

 // IMPORT OTHER
 import { settings } from '../../settings';
import IGenericResponse from '../../types/response';
import { ICreator } from '../../types/auth';
import { TOGGLE_USERS_LIST } from '../../actions/userActions';
import { getUserLikesFromComment } from '../../handlers/post';

interface ParentProps {
    commentIndex: number,
    isLoaded: boolean,
    measure: () => void
}

type IProps = ParentProps & ReduxProps & ReactCookieProps & DispatchProps;

interface IState { /*empty*/ }

class PostComment extends React.PureComponent<IProps, IState>{
    private handleCommentLike(){
        let commentData = this.props.post?.fullViewPostData.commentsList[this.props.commentIndex];

        if(this.props.auth && commentData?.id) // just so es-lint shuts up
        this.props.likeComment(this.props.commentIndex,commentData.id ,this.props.auth?.userId,this.props.auth?.token);
    }

    private handleLikesClick(){
        this.props.toggleUserLikes((startIndex:number,stopIndex:number) => {
            return getUserLikesFromComment(startIndex,stopIndex,this.props.auth?.userId as string, this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].id as string,this.props.auth?.token as string);
        });
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
                            onLoad={() => this.props.measure()}
                        ></Image>
                        <div>
                            <Header className={styles.commentItemHeader}>
                                <span>
                                    {this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].creator?.username || this.props.auth?.username || this.props.cookies?.get('username')}
                                </span>{" "}
                                {this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].content}
                            </Header>
                            
                            {!this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].isDescription && (
                                <div className={styles.commentItemBtns}>
                                    <Header onClick={this.handleLikesClick.bind(this)} className={styles.likesBtn} disabled>{this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].likesCount} likes</Header>
                                    {
                                        this.props.post?.fullViewPostData.commentsList[this.props.commentIndex].creator?.username && (
                                            <Header disabled className={styles.commentItemReply}>
                                                Reply
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
    likeComment: (commentIndex:number,commentId:string,userId:string,token:string) => void,
    toggleUserLikes: (fetchFunction:(startIndex:number,stopIndex:number) => Promise<IGenericResponse & {likes:[ICreator]}>) => void,
}

const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,AppActions>):DispatchProps => ({
    likeComment:bindActionCreators(LIKE_COMMENT,dispatch),
    toggleUserLikes:bindActionCreators(TOGGLE_USERS_LIST,dispatch)
})

export default withCookies(connect(mapStateToProps,mapDispatchToProps)(PostComment as ComponentType<IProps>));