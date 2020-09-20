
// IMPORT STYLES
import styles from './UserPostCell.module.css';

// IMPORT REACT RELETED
import React from 'react';
import { Link } from 'react-router-dom';
import { Segment, Grid, Header, Placeholder, PlaceholderImage } from 'semantic-ui-react';

// IMPORT REDUX RELETED

// IMPORT OTHER
import { IPost } from '../PostsPartial/PostsPartial';

interface IParentProps {
    measure?: () => void,
    post: IPost
}

type IProps = IParentProps;

class UserPostCell extends React.PureComponent<IProps>{
    public render() {
        if (this.props.post && this.props.post._id !== '#')
            return (
                <Link key={this.props.post._id} to={`/post/${this.props.post._id}`}>
                    <Grid.Column>
                        <Segment id={styles.otherImageSegment}>
                            <img onLoad={this.props.measure} alt='#' className={styles.imageOther} src={`data:${this.props.post.source.contentType};base64,${Buffer.from(this.props.post.source.data).toString('base64')}`}></img>
                            <div id={styles.dimmer} className={styles.dimmer}>
                                <Header className={styles.dimmerHeader} icon='heart' content={`${this.props.post.likesCount} likes`} />
                            </div>
                        </Segment>
                    </Grid.Column>
                </Link>
            )
        
        else if(this.props.post && this.props.post._id === '#'){
            return (
                <Grid.Column>
                        <Segment id={styles.otherImageSegment}>
                            <img hidden={true} alt='#' className={styles.imageOther}></img>
                        </Segment>
                    </Grid.Column>
            )
        }

        return (
            <Placeholder>
                <PlaceholderImage className={styles.imagePlaceHolder}></PlaceholderImage>
            </Placeholder>
        )
    }
}

export default React.memo(UserPostCell);