import React from 'react';
import PostArticle from '../../shared/PostArticle/PostArticle';
import {ComponentType} from 'react';
import { AppState, ReduxProps } from '../../reducers';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../actions/types/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { FETCH_FULL_POST_VIEW_AND_SAVE, COMMENT_FULL_POST, LIKE_FULL_POST } from '../../actions/postActions';
import styles from './PostPageView.module.css';
import UsersList from '../../shared/UsersList/UsersList';
import { IPostComment } from '../../shared/PostsPartial/PostsPartial';

type IProps = ReduxProps & DispatchProps & RouteComponentProps;

class PostPageView extends React.PureComponent<IProps>{
    public componentDidMount(){
        const id = (/\post\/(\w+)/g.exec(this.props.location.pathname) as any)[1];
        // if user went to post url right away fetch post data or to a different post then cached
        if(this.props.post?.fullViewPostData._id !== undefined && (this.props.post?.fullViewPostData._id.length === 0 || this.props.post.fullViewPostData._id !== id)){
            this.props.fetchPostDataAndSave(id,this.props.auth?.userId as string,this.props.auth?.token as string)
        }
    }

    private handleLike(){
        if(this.props.auth && this.props.post){ // just so es-lint shuts up
            this.props.like(this.props.post.fullViewPostData._id,this.props.auth.userId,this.props.auth.token);
        }
    }

    private handleComment(comment:string,replyCommentId?:string){
        if(this.props.auth && this.props.post){ // just so es-lint shuts up
            this.props.comment({content:comment} as IPostComment,this.props.post.fullViewPostData._id,this.props.auth.token,this.props.auth.userId,replyCommentId);
        }
    }

    public render(){
        return (
            <div className='view-container'>
                {
                    this.props.user?.usersListToggled && <UsersList lowerDim={this.props.post?.fullViewToggled} fetchFunction={this.props.user?.currentUsersFetchFunction}/>
                }
                <div className={styles.centerContent}>
                    <div className={styles.postArticleContainer}>
                        <PostArticle handleLike={this.handleLike.bind(this)} handleComment={this.handleComment.bind(this)} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState): ReduxProps => ({
    auth: state.auth,
    post: state.post,
    user: state.user
});

interface DispatchProps {
    fetchPostDataAndSave:(postId:string,userId:string,token:string) => void,
    comment:(comment:IPostComment,postId?:string,token?:string,userId?:string,replyCommentId?:string) => void,
    like: (postId:string,userId:string,token:string) => void,
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    fetchPostDataAndSave:bindActionCreators(FETCH_FULL_POST_VIEW_AND_SAVE,dispatch),
    comment:bindActionCreators(COMMENT_FULL_POST,dispatch),
    like:bindActionCreators(LIKE_FULL_POST,dispatch)
});

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(PostPageView as ComponentType<IProps>));