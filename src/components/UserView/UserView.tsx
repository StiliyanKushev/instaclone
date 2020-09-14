// IMPORT STYLES
import styles from './UserView.module.css';

// IMPORT REACT RELATED
import React, { ComponentType, createRef } from 'react';
import { ReactCookieProps, withCookies } from 'react-cookie';
import { Container, Grid, Item, Segment, Header, Button, Image, Menu, Ref } from 'semantic-ui-react';

// IMPORT REDUX RELATED
import { connect } from 'react-redux';
import { AppActions } from '../../actions/types/actions';
import { ThunkDispatch } from 'redux-thunk';
import { bindActionCreators } from 'redux';
import { UPDATE_AVATAR_USER, TOGGLE_USER_POSTS_LIST, ADD_USER_POSTS_ROW_LIST } from '../../actions/userActions';
import { AppState, ReduxProps } from '../../reducers';

// IMPORT OTHER
import EditProfile from '../EditProfile/EditProfile';
import UserSettings from '../UserSettings/UserSettings';

// IMPORT VALIDATION
import $ from 'jquery';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { settings } from '../../settings';
import IGenericResponse from '../../types/response';
import { IPostsListGrid } from '../../reducers/postReducer';
import { getUserPostsRecent, getUserPostsPopular, getUserPostsSaved } from '../../handlers/user';
import { CellMeasurerCache, CellMeasurer, AutoSizer, WindowScroller, InfiniteLoader, InfiniteLoaderChildProps } from 'react-virtualized';
import { Grid as VGrid } from 'react-virtualized';
import { IPost } from '../../shared/PostsPartial/PostsPartial';
import UserPostCell from '../../shared/UserPostCell/UserPostCell';
import {Helmet} from "react-helmet";

type IProps = ReactCookieProps & ReduxProps & DispatchProps;

interface IState {
    selectionTab: string,
    settingsPopup: boolean,
    editProfilePopup: boolean,
    hasMorePosts: boolean,
}

class UserView extends React.Component<IProps, IState> {
    state: IState = { hasMorePosts: true, selectionTab: 'recent', settingsPopup: false, editProfilePopup: false }
    private userImageRef = createRef<HTMLImageElement>();
    private cache: CellMeasurerCache;
    private startIndex: number = 0;

    constructor(props: IProps) {
        super(props);

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            fixedHeight: true,
        });

        this.handleItemClick = this.handleItemClick.bind(this);
        this.handleSettingClick = this.handleSettingClick.bind(this);
        this.handleEditProfileClick = this.handleEditProfileClick.bind(this);
        this.handleCloseSettings = this.handleCloseSettings.bind(this);
        this.handleCloseEditProfile = this.handleCloseEditProfile.bind(this);
        this.handleChangeAvatar = this.handleChangeAvatar.bind(this);
        this.setupAvatarHandlerUpload = this.setupAvatarHandlerUpload.bind(this);
        this.setFetchFunction = this.setFetchFunction.bind(this);
    }

    get rowCount(): number {
        const rows = this.props.user?.currentPostSelectionList.length as number;
        return this.state.hasMorePosts ? rows + 3 : rows;
    }

    public componentDidMount() {
        this.setupAvatarHandlerUpload()
        this.setFetchFunction(getUserPostsRecent)
    }

    public componentWillUnmount() {
        $('#global-file-input').unbind('change')
    }

    public componentDidUpdate(prevProps: IProps) {
        //on props change
        if (!_.isEqual(this.props.user, prevProps.user)) {
            if (!this.props.user?.error) {
                //if it was successfull
                if (this.props.user?.isUserAvatarUpdated) {
                    toast.success(this.props.user?.messege);
                    let date = new Date();
                    let user = this.props.auth?.username;
                    $(this.userImageRef.current as HTMLImageElement).attr("src", `${settings.BASE_URL}/feed/photo/user/${user}?` + date.getTime());
                }
            }
            //display backend error
            else {
                toast.error(this.props.user?.messege);
            }
        }
    }

    private setFetchFunction(func: Function) {
        // toggle the posts to the first option (recent)
        this.props.togglePostsSection((startIndex: number, stopIndex: number) => {
            return func(startIndex, stopIndex, this.props.auth?.userId as string, this.props.auth?.token as string);
        })
    }

    private setupAvatarHandlerUpload() {
        let user = this.props.auth?.username || '';
        let token = this.props.auth?.token || '';
        $(this.userImageRef.current as HTMLImageElement).attr('src', `${settings.BASE_URL}/feed/photo/user/${user}`);

        $('#global-file-input').change((e: any) => {
            let file = e.target.files[0];

            if (file) {
                //attach file to formData
                let formData = new FormData();
                formData.append('image', file);

                this.props.updateAvatar(formData, this.props.auth?.username || this.props.cookies?.get('username'), token);
            }

            $('#global-file-input').val('');
        });
    }

    private handleEditProfileClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.setState({ editProfilePopup: true })
    }

    private handleCloseEditProfile() {
        this.setState({ editProfilePopup: false })
    }

    private handleCloseSettings() {
        this.setState({ settingsPopup: false })
    }

    private handleItemClick(selectionTab: string) {
        this.setState({ selectionTab })

        switch (selectionTab) {
            case 'recent':
                this.setFetchFunction(getUserPostsRecent)
                break;

            case 'popular':
                this.setFetchFunction(getUserPostsPopular)
                break;

            case 'saved':
                this.setFetchFunction(getUserPostsSaved)
                break;

            default:
                break;
        }
    }

    private handleSettingClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.setState({ settingsPopup: true });
    }

    private handleChangeAvatar(e: React.MouseEvent<HTMLImageElement>) {
        e.preventDefault();

        $('#global-file-input').trigger('click');
    }

    private cellRenderer({
        columnIndex, // Horizontal (column) index of cell
        isScrolling, // The Grid is currently being scrolled
        isVisible, // This cell is visible within the grid (eg it is not an overscanned cell)
        key, // Unique key within array of cells
        parent, // Reference to the parent Grid (instance)
        rowIndex, // Vertical (row) index of cell
        style, // Style object to be applied to cell (to position it);
        // This must be passed through to the rendered cell element.
    }: any) {
        let post: IPost;
        if (this.props.user?.currentPostSelectionList[rowIndex])
            post = this.props.user?.currentPostSelectionList[rowIndex][columnIndex] as IPost

        return (
            <CellMeasurer
                key={key}
                cache={this.cache}
                parent={parent}
                columnIndex={columnIndex}
                rowIndex={rowIndex}
            >
                {({ measure, registerChild }: any) => (
                    <div ref={registerChild} style={style}>
                        <UserPostCell measure={measure} post={post as IPost} />
                    </div>
                )}
            </CellMeasurer>
        );
    }

    private isRowLoaded = ({ index }: { index: number }) => {
        return !!this.props.user?.currentPostSelectionList[index];
    };

    private fetchPosts = ({ startIndex, stopIndex }: { startIndex: number, stopIndex: number }) => {
        startIndex = this.startIndex - 3;
        stopIndex = this.startIndex;

        return this.props.user?.currentPostSelectionFunction(startIndex, stopIndex).then((res: IGenericResponse & { posts: IPostsListGrid }) => {
            if (res.success) {
                if (!res.posts || ((res.posts) as Array<any>).length === 0) {
                    // no more comments
                    this.setState({ hasMorePosts: false })
                }
                else {
                    this.props.addUserPostRowToList(res.posts as [IPost]);
                }
            }
            else {
                // internal error
            }
        }) as Promise<IGenericResponse & { posts: IPostsListGrid }>
    };

    private _createOnSectionRendered(onRowsRendered: Function) {
        return ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }: any) => {
            const startIndex = this.startIndex;
            const stopIndex = startIndex + 3;

            if (this.state.hasMorePosts)
                this.startIndex += 3;

            return onRowsRendered({ startIndex, stopIndex })
        }
    }

    public render() {
        return (
            <div className={`${styles.viewContainer} view-container`}>
                <Helmet>
                <style type="text/css">{`
                    body,html,#root {
                        background-color: white !important;
                    }
                `}</style>
                </Helmet>
                <Container className={styles.container}>
                    <Grid>
                        <Grid.Row className={styles.userRow}>
                            <Grid.Column className={styles.columnFit}>
                                <Ref innerRef={this.userImageRef}>
                                    <Image onClick={this.handleChangeAvatar} className={styles.avatar} size='small' circular />
                                </Ref>
                            </Grid.Column>
                            <Grid.Column id={styles.seccondColumn} widescreen='10'>
                                <Item.Group id={styles.noBorders}>
                                    <Segment id={styles.noBorders} attached='top' padded>
                                        <Item>
                                            <Grid className={styles.fluidGrid}>
                                                <Grid.Column className={styles.usernameColumn}><Header className={styles.username} as='h1'>{this.props.auth?.username}</Header></Grid.Column>
                                                <Grid.Column className={styles.userSettingsBtns} floated='right'><Button onClick={this.handleEditProfileClick} secondary>Edit Profile</Button><Button onClick={this.handleSettingClick} primary icon='setting'></Button></Grid.Column>
                                            </Grid>
                                        </Item>
                                    </Segment>
                                    <Segment id={styles.noBorders} className={styles.userSettingsBtns2} attached>
                                        <Button size='mini' className={styles.editBtn2} onClick={this.handleEditProfileClick} secondary>Edit Profile</Button><Button onClick={this.handleSettingClick} className={styles.settingsBtn2} size='mini' primary icon='setting'></Button>
                                    </Segment>
                                    <Segment id={styles.noBorders} className={styles.stats} attached='bottom'>
                                        <Item id={styles.fluidItems}>
                                            <Grid className={styles.fluidGrid}>
                                                <Grid.Column id={styles.fluidColumn} textAlign='center' width='6'><Header as='span' className={styles.columnHeader} size='small'>0</Header> Posts</Grid.Column>
                                                <Grid.Column id={styles.fluidColumn} textAlign='center' width='5'><Header as='span' className={styles.columnHeader} size='small'>0</Header> Followers</Grid.Column>
                                                <Grid.Column id={styles.fluidColumn} textAlign='center' width='5'><Header as='span' className={styles.columnHeader} size='small'>0</Header> Following</Grid.Column>
                                            </Grid>
                                        </Item>
                                    </Segment>
                                    <div id={styles.noBorders} className={styles.stats2}>
                                        <Segment id={styles.noBorders} attached>
                                            <Item>
                                                <Header as='span' className={styles.columnHeader} size='small'>0</Header> Posts
                                            </Item>
                                        </Segment>
                                        <Segment id={styles.noBorders} attached>
                                            <Item>
                                                <Header as='span' className={styles.columnHeader} size='small'>0</Header> Followers
                                            </Item>
                                        </Segment>
                                        <Segment id={styles.noBorders} attached='bottom'>
                                            <Item>
                                                <Header as='span' className={styles.columnHeader} size='small'>0</Header> Following
                                            </Item>
                                        </Segment>
                                    </div>
                                </Item.Group>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Segment id={styles.noBorders} attached='bottom'>
                                <Item>
                                    <Menu className={styles.postsMenu} pointing secondary fluid>
                                        <Menu.Item onClick={() => this.handleItemClick('recent')} active={this.state.selectionTab === 'recent'}>Recent Posts</Menu.Item>
                                        <Menu.Item onClick={() => this.handleItemClick('popular')} active={this.state.selectionTab === 'popular'}>Popular Posts</Menu.Item>
                                        <Menu.Item onClick={() => this.handleItemClick('saved')} active={this.state.selectionTab === 'saved'}>Saved Posts</Menu.Item>
                                    </Menu>
                                </Item>
                            </Segment>
                        </Grid.Row>
                        <Segment className={styles.vgridContainer}>

                            <InfiniteLoader
                                isRowLoaded={this.isRowLoaded.bind(this)}
                                loadMoreRows={this.fetchPosts.bind(this)}
                                rowCount={this.rowCount}
                            >
                                {({ onRowsRendered, registerChild }: InfiniteLoaderChildProps) => (
                                    <WindowScroller
                                        scrollingResetTimeInterval={10}
                                    >
                                        {({ height, scrollTop }) => (
                                            <AutoSizer>
                                                {({ width }) => {
                                                    return (
                                                        <VGrid
                                                            autoHeight
                                                            scrollTop={scrollTop}
                                                            className={styles.vgrid}
                                                            ref={registerChild}
                                                            onSectionRendered={this._createOnSectionRendered(onRowsRendered)}
                                                            cellRenderer={this.cellRenderer.bind(this)}
                                                            rowCount={this.rowCount}
                                                            columnCount={3}
                                                            rowHeight={300}
                                                            columnWidth={300}
                                                            overscanRowCount={3}
                                                            height={height}
                                                            width={width}
                                                        />
                                                    );
                                                }}
                                            </AutoSizer>
                                        )}
                                    </WindowScroller>
                                )}
                            </InfiniteLoader>

                        </Segment>

                    </Grid>
                </Container>
                {this.state.editProfilePopup && <EditProfile handleClose={this.handleCloseEditProfile} />}
                {this.state.settingsPopup && <UserSettings handleClose={this.handleCloseSettings} />}
            </div>
        );
    }
}

const mapStateToProps = (state: AppState): ReduxProps => ({
    auth: state.auth,
    user: state.user,
    post: state.post
})

interface DispatchProps {
    updateAvatar: (formData: FormData, username: string, token: string) => void,
    togglePostsSection: (fetchFunction: (startIndex: number, stopIndex: number) => Promise<IGenericResponse & { posts: IPostsListGrid }>) => void
    addUserPostRowToList: (posts: Array<IPost>) => void
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    updateAvatar: bindActionCreators(UPDATE_AVATAR_USER, dispatch),
    togglePostsSection: bindActionCreators(TOGGLE_USER_POSTS_LIST, dispatch),
    addUserPostRowToList: bindActionCreators(ADD_USER_POSTS_ROW_LIST, dispatch)
})

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(UserView as ComponentType<IProps>));