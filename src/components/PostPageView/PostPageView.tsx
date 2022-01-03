// IMPORT REACT RELETED
import React, { ComponentType } from 'react';

// IMPORT REDUX RELETED
import { connect } from 'react-redux';
// IMPORT ROUTER RELETED
import {
    Link,
    RouteComponentProps,
    withRouter,
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
    Divider,
    Grid,
    Header,
    Segment,
} from 'semantic-ui-react';

import {
    CALL_OTHER_POST_DATA_LOADING_DONE,
    COMMENT_FULL_POST,
    FETCH_FULL_POST_VIEW_AND_SAVE,
    FETCH_OTHER_POSTS,
    LIKE_FULL_POST,
    RENEW_OTHER_POSTS,
    SAVE_FULL_POST,
} from '../../actions/postActions';
import { AppActions } from '../../actions/types/actions';
import {
    AppState,
    ReduxProps,
} from '../../reducers';
import { IPostsListGrid } from '../../reducers/postReducer';
// IMPORT OTHER
import PostArticle from '../../shared/PostArticle/PostArticle';
// IMPORT TYPES
import { IPostComment } from '../../shared/PostsPartial/PostsPartial';
import UsersList from '../../shared/UsersList/UsersList';
// IMPORT STYLES
import styles from './PostPageView.module.css';

type IProps = ReduxProps & DispatchProps & RouteComponentProps;

class PostPageView extends React.PureComponent<IProps>{
    constructor(props:IProps){
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.fetchAndSave = this.fetchAndSave.bind(this);
    }

    public componentDidMount(){
        // scroll to the start (fix for some browsers)
        window.scrollTo({top: 0});

        // fetch post data
        this.fetchAndSave();

        // fetch the other posts
        if(this.props.post?.fullViewPostData.creator.id){
            this.props.fetchOtherPosts(this.props.post?.fullViewPostData.creator.id as string,this.props.auth?.userId as string,this.props.auth?.token as string);
        }
    }

    private handleClick(id:string,index:number){
        // update the full post data
        this.fetchAndSave(id);

        // renew the clicked post with another that has not been seen
        this.renewOtherPost(id,index);

        // scroll back up
        window.scrollTo({top: 0, behavior: 'smooth'});

        // notify redux for the done operation
        this.props.CALL_OTHER_POST_DATA_LOADING_DONE();
    }

    private renewOtherPost(id:string,index:number){
        let others = [...this.props.post?.fullViewOtherPosts as any]
        others.splice(index,1);

        this.props.renewOtherPost(id,index,others as any,this.props.post?.fullViewPostData.creator.id as string,this.props.auth?.token as string);
    }

    private fetchAndSave(idParam?:string){
        let id;
        if(!idParam)
        id = (/\post\/(\w+)/g.exec(this.props.location.pathname) as any)[1];
        else id = idParam;

        // if user went to post url right away fetch post data or to a different post then cached
        if(this.props.post?.fullViewPostData._id !== undefined && (this.props.post?.fullViewPostData._id.length === 0 || this.props.post.fullViewPostData._id !== id)){
            this.props.fetchPostDataAndSave(id,this.props.auth?.userId as string,this.props.auth?.token as string)
        }
    }

    public componentDidUpdate(prevProps:IProps){
        // fetch the other posts
        if(this.props.post?.fullViewPostData.creator.id && (prevProps.post?.fullViewPostData.creator.id === undefined || this.props.post?.fullViewPostData.creator.id !== prevProps.post?.fullViewPostData.creator.id)){
            this.props.fetchOtherPosts(this.props.post?.fullViewPostData.creator.id as string,this.props.auth?.userId as string,this.props.auth?.token as string);
        }
    }

    private handleLike(){
        if(this.props.auth && this.props.post){ // just so es-lint shuts up
            this.props.like(this.props.post.fullViewPostData._id,this.props.auth.userId,this.props.auth.token);
        }
    }

    private handleSave(){
        if(this.props.auth && this.props.post) // just so es-lint shuts up
        this.props.save(this.props.post.fullViewPostData._id,this.props.auth.userId,this.props.auth.token);
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
                        <PostArticle handleSave={this.handleSave.bind(this)} handleLike={this.handleLike.bind(this)} handleComment={this.handleComment.bind(this)} />
                    </div>
                </div>
                <Divider horizontal>Other posts from {this.props.post?.fullViewPostData.creator.username}</Divider>
                <div className={styles.centerContent}>
                    <Grid centered columns='3' className={styles.imagesGrid} doubling stackable>
                        {
                            this.props.post?.fullViewOtherPosts.map((post:{ likesCount: number, source: { data: any; contentType: string; }, _id: string },i:number) => {
                                return (
                                    <Link key={i} onClick={() => this.handleClick(post._id,i)} to={`/post/${post._id}`}>
                                        <Grid.Column>
                                            <Segment id={styles.otherImageSegment}>
                                                <img alt='#' className={styles.imageOther} src={`data:${post.source.contentType};base64,${Buffer.from(post.source.data).toString('base64')}`}></img>
                                                <div className={styles.dimmer}>
                                                    <Header className={styles.dimmerHeader} icon='heart' content={`${post.likesCount} likes`} />
                                                </div>
                                            </Segment>                    
                                        </Grid.Column>
                                    </Link>
                                )
                            })
                        }
                    </Grid>
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
    save: (postId:string,userId:string,token:string) => void,
    fetchOtherPosts: (otherId:string,userId:string,token:string) => void,
    CALL_OTHER_POST_DATA_LOADING_DONE: () => void,
    renewOtherPost:(id:string,index:number,others:IPostsListGrid,userId:string,token:string) => void,
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    fetchPostDataAndSave:bindActionCreators(FETCH_FULL_POST_VIEW_AND_SAVE,dispatch),
    comment:bindActionCreators(COMMENT_FULL_POST,dispatch),
    like:bindActionCreators(LIKE_FULL_POST,dispatch),
    save:bindActionCreators(SAVE_FULL_POST,dispatch),
    fetchOtherPosts:bindActionCreators(FETCH_OTHER_POSTS,dispatch),
    CALL_OTHER_POST_DATA_LOADING_DONE:bindActionCreators(CALL_OTHER_POST_DATA_LOADING_DONE,dispatch),
    renewOtherPost:bindActionCreators(RENEW_OTHER_POSTS,dispatch)
});

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(PostPageView as ComponentType<IProps>));