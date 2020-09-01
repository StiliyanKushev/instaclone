import React, { ComponentType } from 'react';
import { AppState, ReduxProps } from '../../reducers';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../actions/types/actions';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import { IPostComment } from '../PostsPartial/PostsPartial';
import styles from './SubComments.module.css';
import { Image, Header, Icon } from 'semantic-ui-react';
import { settings } from '../../settings';
import { withCookies, ReactCookieProps } from 'react-cookie';
import { getUserLikesFromComment } from '../../handlers/post';
import { TOGGLE_USERS_LIST } from '../../actions/userActions';
import IGenericResponse from '../../types/response';
import { ICreator } from '../../types/auth';
import { LIKE_COMMENT, SET_REPLYING_COMMENT } from '../../actions/postActions';

interface IParentProps {
    measure: () => void,
    index: number,
}

type IProps = IParentProps & ReduxProps & ReactCookieProps & DispatchProps;

interface IState {
    // empty
}

class SubComments extends React.PureComponent<IProps,IState>{
    // this might need to be changed once I add the images of the users
    public componentDidMount(){
        this.props.measure();
    }

    public componentWillUnmount(){
        // doing this will set the measure at the end of the runtime queue after it will be removed
        setTimeout(() => {
            try {
                this.props.measure();
            } catch (error) {
                // the user has closed the whole view
            }
            
        },1)
    }

    private handleCommentLike(i:number,e:React.MouseEvent<HTMLSpanElement, MouseEvent>){
        // prevent propagation is very important here. Otherwise the store will update infinitely.
        e.preventDefault();
        e.stopPropagation();

        let commentData = ((this.props.post?.fullViewPostData.commentsList[this.props.index]) as any).subComments[i];

        if(this.props.auth && commentData?.id) // just so es-lint shuts up
        this.props.likeComment(this.props.index,commentData.id ,this.props.auth?.userId,this.props.auth?.token,i);
    }

    private handleLikesClick(i:number,e:React.MouseEvent<HTMLSpanElement, MouseEvent>){
        // prevent propagation is very important here. Otherwise the store will update infinitely.
        e.preventDefault();
        e.stopPropagation();

        this.props.toggleUserLikes((startIndex:number,stopIndex:number) => {
            return getUserLikesFromComment(startIndex,stopIndex,this.props.auth?.userId as string, ((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[i].id as string,this.props.auth?.token as string);
        });
    }

    private handleReply(i:number,e:React.MouseEvent<HTMLSpanElement, MouseEvent>){
        // prevent propagation is very important here. Otherwise the store will update infinitely.
        e.preventDefault();
        e.stopPropagation();

        // if user wants to cancel reset it to -1 (no comment)
        if(this.props.post?.currentReplyingComment === this.props.index && this.props.post?.currentReplyingSubComment === i){
            this.props.replyingComment(-1,-1);
            return;
        }

        this.props.replyingComment(this.props.index as number,i);
    }

    public render(){
        return (
            this.props.post?.fullViewPostData.commentsList[this.props.index].subComments?.map((comment:IPostComment,i:number) => (
                <div key={i} className={styles.commentItemContainer}>
                    <div className={styles.commentItemLeftSide}>
                        <Image
                            className={styles.verySmallImg}
                            circular
                            size="tiny"
                            src={`${settings.BASE_URL}/feed/photo/user/${((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[i].creator?.username || this.props.auth?.username || this.props.cookies?.get('username')}`}
                            onLoad={() => this.props.measure()}
                        ></Image>
                        <div>
                            <Header className={styles.commentItemHeader}>
                                <span>
                                    {((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[i].creator?.username || this.props.auth?.username || this.props.cookies?.get('username')}
                                </span>{" "}
                                {((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[i].content}
                            </Header>
                            
                            <div className={styles.commentItemBtns}>
                                    <Header onClick={(e:React.MouseEvent<HTMLSpanElement, MouseEvent>) => this.handleLikesClick.bind(this)(i,e)} className={styles.likesBtn} disabled>{((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[i].likesCount} likes</Header>
                                    {
                                        ((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[i].creator?.username && (
                                            <Header id={`${this.props.post?.currentReplyingComment === this.props.index && this.props.post?.currentReplyingSubComment === i ? styles.cancelHeader : ''}`} onClick={(e:React.MouseEvent<HTMLSpanElement, MouseEvent>) => this.handleReply.bind(this)(i,e)} disabled className={styles.commentItemReply}>
                                                {
                                                    this.props.post?.currentReplyingComment === this.props.index && this.props.post?.currentReplyingSubComment === i ? 'Cancel' : 'Reply'
                                                }
                                            </Header>
                                        )
                                    }
                                </div>
                        </div>
                    </div>
                    
                    {!(!((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[i].creator?.username as any || ((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[i].creator?.username === (this.props.auth?.username || this.props.cookies?.get('username'))) && (
                        <Icon
                            //name="heart outline"
                            size="small"
                            color="black"
                            onClick={(e:React.MouseEvent<HTMLSpanElement, MouseEvent>) => this.handleCommentLike.bind(this)(i,e)}
                            id={!((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[i].isLiked ? `${styles.likeOutline}` : `${styles.likeBtnId}`}
                            className={`${styles.likeBtn} heart ${((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[i].isLiked ? '' : 'outline'}`}
                        ></Icon>
                    )}
                </div>
            ))
        );
    }
}

const mapStateToProps = (state: AppState): ReduxProps => ({
    post: state.post,
    auth: state.auth,
});

interface DispatchProps {
    replyingComment: (commentIndex:number,subCommentIndex:number) => void,
    toggleUserLikes: (fetchFunction:(startIndex:number,stopIndex:number) => Promise<IGenericResponse & {likes:Array<ICreator>}>) => void,
    likeComment: (commentIndex:number,commentId:string,userId:string,token:string,subCommentIndex?:number) => void,
}

const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,AppActions>):DispatchProps => ({
    toggleUserLikes: bindActionCreators(TOGGLE_USERS_LIST,dispatch),
    likeComment:bindActionCreators(LIKE_COMMENT,dispatch),
    replyingComment:bindActionCreators(SET_REPLYING_COMMENT,dispatch)
})

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(SubComments as ComponentType<IProps>));