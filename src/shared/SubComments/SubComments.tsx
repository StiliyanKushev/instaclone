// IMPORT REACT RELETED
import React, { ComponentType } from 'react';
import { withCookies, ReactCookieProps } from 'react-cookie';

// IMPORT REDUX RELETED
import { connect } from 'react-redux';
import { AppActions } from '../../actions/types/actions';
import { ThunkDispatch } from 'redux-thunk';
import {bindActionCreators} from 'redux';
import { TOGGLE_USERS_LIST } from '../../actions/userActions';
import { AppState, ReduxProps } from '../../reducers';
import { LIKE_COMMENT, SET_REPLYING_COMMENT } from '../../actions/postActions';

// IMPORT TYPES
import { ICreator } from '../../types/auth';
import IGenericResponse from '../../types/response';

// IMPORT OTHERS
import { IPostComment } from '../PostsPartial/PostsPartial';
import { getUserLikesFromComment } from '../../handlers/post';
import SubComment from '../SubComment/SubComment';

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
            
        },10)
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
                <SubComment key={i} 
                    i={i} 
                    index={this.props.index} 
                    measure={this.props.measure}
                    handleCommentLike={this.handleCommentLike.bind(this)}
                    handleLikesClick={this.handleLikesClick.bind(this)} 
                    handleReply={this.handleReply.bind(this)} 
                />
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

export default React.memo(withCookies(connect(mapStateToProps, mapDispatchToProps)(SubComments as ComponentType<IProps>)));