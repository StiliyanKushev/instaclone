// IMPORT STYLES
import styles from './SubComment.module.css';

// IMPORT REACT RELTED
import React from 'react';
import { Icon, Header, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {ComponentType} from 'react';
import { withCookies, ReactCookieProps } from 'react-cookie';

// IMPORT REDUX RELTED
import { connect } from 'react-redux';
import { AppState, ReduxProps } from '../../reducers/index';

// IMPORT OTHER
import { settings } from '../../settings';

interface IParentProps {
    i: number,
    index:number,
    measure: () => void,
    handleLikesClick: (i:number,e:React.MouseEvent<HTMLSpanElement, MouseEvent>) => void,
    handleReply: (i:number,e:React.MouseEvent<HTMLSpanElement, MouseEvent>) => void,
    handleCommentLike: (i:number,e:React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}

type IProps = IParentProps & ReduxProps & ReactCookieProps;

class SubComment extends React.PureComponent<IProps>{
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

    public render(){
        return (
            <div key={this.props.i} className={styles.commentItemContainer}>
                    <div className={styles.commentItemLeftSide}>
                        <Image
                            className={styles.verySmallImg}
                            circular
                            size="tiny"
                            src={`${settings.BASE_URL}/feed/photo/user/${((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[this.props.i].creator?.username || this.props.auth?.username || this.props.cookies?.get('username')}`}
                            onLoad={() => this.props.measure()}
                        ></Image>
                        <div>
                            <Header className={styles.commentItemHeader}>
                                <Link id={styles.noTextDecor} to={`/profile/${((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[this.props.i].creator?.username || this.props.auth?.username || this.props.cookies?.get('username')}`}>
                                <span>
                                    {((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[this.props.i].creator?.username || this.props.auth?.username || this.props.cookies?.get('username')}
                                </span></Link>{" "}
                                {
                                    /^(@\w+) (.+)/.exec(((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[this.props.i].content) !== null ?
                                    (
                                       <React.Fragment>
                                           <Link to={`/profile/${(/^(@\w+) (.+)/.exec(((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[this.props.i].content) as any)[1].slice(1)}`}>
                                                {
                                                    (/^(@\w+) (.+)/.exec(((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[this.props.i].content) as any)[1]
                                                }
                                                
                                            </Link> 
                                            {' '}{
                                                (/^(@\w+) (.+)/.exec(((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[this.props.i].content) as any)[2]
                                            }
                                        </React.Fragment> 
                                    )
                                    :
                                    (
                                        ((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[this.props.i].content
                                    )
                                }
                            </Header>
                            
                            <div className={styles.commentItemBtns}>
                                    <Header onClick={(e:React.MouseEvent<HTMLSpanElement, MouseEvent>) => this.props.handleLikesClick.bind(this)(this.props.i,e)} className={styles.likesBtn} disabled>{((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[this.props.i].likesCount} likes</Header>
                                    {
                                        ((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[this.props.i].creator?.username && (
                                            <Header id={`${this.props.post?.currentReplyingComment === this.props.index && this.props.post?.currentReplyingSubComment === this.props.i ? styles.cancelHeader : ''}`} onClick={(e:React.MouseEvent<HTMLSpanElement, MouseEvent>) => this.props.handleReply.bind(this)(this.props.i,e)} disabled className={styles.commentItemReply}>
                                                {
                                                    this.props.post?.currentReplyingComment === this.props.index && this.props.post?.currentReplyingSubComment === this.props.i ? 'Cancel' : 'Reply'
                                                }
                                            </Header>
                                        )
                                    }
                                </div>
                        </div>
                    </div>
                    
                    {!(!((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[this.props.i].creator?.username as any || ((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[this.props.i].creator?.username === (this.props.auth?.username || this.props.cookies?.get('username'))) && (
                        <Icon
                            //name="heart outline"
                            size="small"
                            color="black"
                            onClick={(e:React.MouseEvent<HTMLSpanElement, MouseEvent>) => this.props.handleCommentLike(this.props.i,e)}
                            id={!((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[this.props.i].isLiked ? `${styles.likeOutline}` : `${styles.likeBtnId}`}
                            className={`${styles.likeBtn} heart ${((this.props.post?.fullViewPostData.commentsList[this.props.index].subComments) as any)[this.props.i].isLiked ? '' : 'outline'}`}
                        ></Icon>
                    )}
                </div>
        )
    }
}

const mapStateToProps = (state: AppState): ReduxProps => ({
    post: state.post,
    auth: state.auth,
});


export default React.memo(withCookies(connect(mapStateToProps, null)(SubComment as ComponentType<IProps>)));