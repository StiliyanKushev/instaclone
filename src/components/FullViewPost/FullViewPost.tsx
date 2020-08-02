// IMPORT STYLES
import styles from './FullViewPost.module.css';

// IMPORT REACT RELETED
import React from 'react';
import { Dimmer, Icon } from 'semantic-ui-react';

// IMPORT REDUX RELTED
import { connect } from 'react-redux';
import { AppActions } from '../../actions/types/actions';
import { ThunkDispatch } from 'redux-thunk';
import {bindActionCreators} from 'redux';
import { AppState, ReduxProps } from '../../reducers';
import { TOGGLE_FULL_POST_VIEW,SET_FULL_POST_DATA_VIEW, COMMENT_POST, LIKE_POST, LIKE_FULL_POST } from '../../actions/postActions';

// IMPORT OTHER
import $ from 'jquery';
import { IPost } from '../../shared/PostsPartial/PostsPartial';
import PostArticle from '../../shared/PostArticle/PostArticle';

interface IParentProps {
    postIndex:number,
}

type IProps = IParentProps & DispatchProps & ReduxProps;

class FullViewPost extends React.PureComponent<IProps>{

    constructor(props:IProps){
        super(props);

        this.props.setFullViewPostData(this.props.post?.homePosts[this.props.postIndex] as IPost);
    }

    public componentDidMount(){
        $('#root').css('overflow','hidden');
    }

    public componentWillUnmount(){
        $('#root').css('overflow','initial');
    }

    private handleLike(){
        if(this.props.auth && this.props.post) // just so es-lint shuts up
        this.props.like(this.props.postIndex,this.props.post?.homePosts[this.props.postIndex]._id,this.props.auth?.username,this.props.auth?.token);
        this.props.likeFullView();
    }

    private handleComment(comment:string){
        //todo
    }
    
    public render(){
        return (
            <Dimmer className={styles.dimmer} active>
                    <div className={styles.container}>
                        <div className={styles.innerContainer}>
                            <Icon onClick={() => this.props.toggleFullView()} id={styles.closeIcon} color='black' size='big' name='close'></Icon>
                            <PostArticle
                                handleLike={this.handleLike.bind(this)}
                                handleComment={this.handleComment.bind(this)}
                            />
                        </div>
                    </div>
            </Dimmer>
        );
    }
};

const mapStateToProps = (state:AppState):ReduxProps => ({
    auth:state.auth,
    post:state.post,
})

interface DispatchProps {
    toggleFullView:() => void,
    setFullViewPostData:(PostData:IPost) => void,
    like:(postIndex:number,postId:string,username:string,token:string) => void,
    likeFullView:() => void,
    comment: (postIndex:number,postId: string, username: string, comment: string, token: string) => void,
}

const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,AppActions>):DispatchProps => ({
    toggleFullView:bindActionCreators(TOGGLE_FULL_POST_VIEW,dispatch),
    setFullViewPostData:bindActionCreators(SET_FULL_POST_DATA_VIEW,dispatch),
    comment:bindActionCreators(COMMENT_POST,dispatch),
    like:bindActionCreators(LIKE_POST,dispatch),
    likeFullView:bindActionCreators(LIKE_FULL_POST,dispatch)
})

export default connect(mapStateToProps,mapDispatchToProps)(FullViewPost);