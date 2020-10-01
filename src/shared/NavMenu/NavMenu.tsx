// IMPORT STYLES
import styles from './NavMenu.module.css';

// IMPORT REACT RELATED
import React, { createRef, ComponentType } from 'react';
import { ReactCookieProps, withCookies } from 'react-cookie';
import { Menu, Container, Item, Search, Icon, Ref, SearchResultProps, SearchResultData, SearchProps, Image } from 'semantic-ui-react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';

// IMPORT REDUX RELETED
import { connect } from 'react-redux';
import { AppState, ReduxProps } from '../../reducers/index';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../actions/types/actions';
import { TOGGLE_FULL_POST_VIEW } from '../../actions/postActions';
import { bindActionCreators } from 'redux';
import { TOGGLE_USERS_LIST } from '../../actions/userActions';
import { CALL_UPDATE_SELECTION, CALL_START_SEARCH, CALL_CLEAN_QUERY, CALL_FINISH_SEARCH } from '../../actions/navSearchActions';

// IMPORT OTHER
import $ from 'jquery';
import { settings } from '../../settings';
import axios from 'axios';

type IProps = RouteComponentProps & ReactCookieProps & ReduxProps & DispatchProps;

class NavMenu extends React.Component<IProps>{
    state = { isVisible: true }
    private cancelToken:any;
    private mobileSearchBar = createRef<HTMLDivElement>();

    constructor(props: IProps) {
        super(props);

        //bind local functions
        this.isCurrentPath = this.isCurrentPath.bind(this);
        this.handleVisibility = this.handleVisibility.bind(this);
        this.handleMobileSearchClick = this.handleMobileSearchClick.bind(this);
    }

    //this function acts as a switch for the mobile version of the nav search
    private handleMobileSearchClick() {
        if (this.mobileSearchBar.current) {
            if ($(this.mobileSearchBar.current).is(':visible'))
                $(this.mobileSearchBar.current).fadeOut(200);
            else
                $(this.mobileSearchBar.current).fadeIn(200);
        }
    }

    private handleVisibility() {
        const hideMobileBar = function (this: any) {
            if (this.mobileSearchBar.current)
                $(this.mobileSearchBar.current).hide();
        }.bind(this);

        if (this.props.location.pathname === '/login' || this.props.location.pathname === '/register') {
            this.setState({ isVisible: false }, hideMobileBar)
        }
        else {
            this.setState({ isVisible: true }, hideMobileBar)
        }
    }

    public componentDidMount() {
        this.handleVisibility();
    }

    private onRouteChanged(prevProps: RouteComponentProps) {
        if (this.props.post?.fullViewToggled && this.props.location.pathname !== '/') {
            this.props.toggleFullView()
        }

        if (this.props.user?.usersListToggled && (this.props.location.pathname !== '/' && !this.props.location.pathname.startsWith('/post/'))) {
            this.props.toggleUserList();
        }

        this.handleVisibility()
    }

    public componentDidUpdate(prevProps: RouteComponentProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged(prevProps);
        }
    }

    private isCurrentPath(path: string): string {
        let prefix: string = path === '/' ? '-' : '';
        return (this.props.location.pathname === '/' && path === '/') || (path !== '/' && this.props.location.pathname.startsWith(path)) ? '' : prefix + 'outline';
    }

    private handleOnResultSelect(event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: SearchResultData){
        this.props.updateSelection(data.result.name)
    }

    private handleOnSearchChange(event: React.MouseEvent<HTMLElement, MouseEvent>, data: SearchProps){
        this.props.startSearch(data.value as any);
        
        if (!data.value || data.value.length === 0) {
            this.props.cleanQuery();
            return
        }

        if (this.cancelToken) {
            this.cancelToken.cancel();
        }
        this.cancelToken = axios.CancelToken.source();
        
        axios.get(settings.BASE_URL + `/feed/user/users/${data.value}/as/${this.props.auth?.userId}`,
        {
            headers: {
            'token': this.props.auth?.token,
            },
            cancelToken: this.cancelToken.token
        }).then((r) => {
            let res = r.data;

            if(res.success){
                this.props.finishSearch(res.results);
            }
        })
        .catch((error) => {
            if (axios.isCancel(error) || error) {
                this.props.cleanQuery();
            }
        });
    }

    private searchResultRenderer(props: SearchResultProps){
        return (
            <Link className={styles.usernameRowLink} to={`/profile/${props.name}`}>
                <Image className={styles.verySmallImg} circular size='tiny' src={`${settings.BASE_URL}/feed/photo/user/${props.name}`}></Image>
                <p>{props.name}</p>
            </Link>
        )
    }

    public render() {
        if (!this.state.isVisible) return ''
        return (
            <Menu size='small' fixed='top'>
                <Container className={styles.itemContainer}>
                    <Link className={styles.LinkContainerLogo} to={`/`}>
                        <Item className={`logo-text ${styles.logo}`} as='span'>
                            Instaclone
                        </Item>
                    </Link>
                    <Item className={`right ${styles.searchItem}`}>
                        <Search 
                            loading={this.props.navSearch?.loading} 
                            value={this.props.navSearch?.value}
                            results={this.props.navSearch?.results}
                            onResultSelect={this.handleOnResultSelect.bind(this)}
                            onSearchChange={this.handleOnSearchChange.bind(this)}
                            resultRenderer={this.searchResultRenderer.bind(this)}
                            placeholder='Search' />
                    </Item>
                    <Item className='right'>
                        <Icon onClick={this.handleMobileSearchClick} className={`${styles.searchBtn} ${styles.iconBtn}`} name='search' size='big'></Icon>
                        <Link className={styles.LinkContainer} to={`/`}>
                            <Icon className={`${styles.iconBtn} home${this.isCurrentPath('/')}`} size='big'></Icon>
                        </Link>
                        <Link className={styles.LinkContainer} to={`/inbox`}>
                            <Icon className={`${styles.iconBtn} paper plane ${this.isCurrentPath('/inbox')}`} size='big'></Icon>
                        </Link>
                        <Link className={styles.LinkContainer} to={`/explore`}>
                            <Icon className={`${styles.iconBtn} compass ${this.isCurrentPath('/explore')}`} size='big'></Icon>
                        </Link>
                        <Link className={styles.LinkContainer} to={`/feed`}>
                            <Icon className={`${styles.iconBtn} heart ${this.isCurrentPath('/feed')}`} size='big'></Icon>
                        </Link>
                        <Link className={styles.LinkContainer} to={`/profile/${this.props.auth?.username}`}>
                            <Icon className={`${styles.iconBtn} user circle ${this.isCurrentPath(`/profile/${this.props.auth?.username}`)}`} size='big'></Icon>
                        </Link>
                    </Item>
                </Container>
                <Ref innerRef={this.mobileSearchBar}>
                    <Container fluid className={styles.searchBar}>
                        <Search
                            loading={this.props.navSearch?.loading} 
                            value={this.props.navSearch?.value}
                            results={this.props.navSearch?.results}
                            onResultSelect={this.handleOnResultSelect.bind(this)}
                            onSearchChange={this.handleOnSearchChange.bind(this)}
                            resultRenderer={this.searchResultRenderer.bind(this)}
                            placeholder='Search'/>
                    </Container>
                </Ref>
            </Menu>
        );
    }
}

const mapStateToProps = (state: AppState): ReduxProps => ({
    post: state.post,
    auth: state.auth,
    user: state.user,
    navSearch: state.navSearch,
})

interface DispatchProps {
    toggleUserList: () => void,
    toggleFullView: () => void,
    updateSelection: (selection:string) => void,
    startSearch: (value:string) => void,
    cleanQuery: () => void,
    finishSearch: (results:Array<{name:string}>) => void,
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    toggleFullView: bindActionCreators(TOGGLE_FULL_POST_VIEW, dispatch),
    toggleUserList: bindActionCreators(TOGGLE_USERS_LIST,dispatch),
    updateSelection: bindActionCreators(CALL_UPDATE_SELECTION,dispatch),
    startSearch: bindActionCreators(CALL_START_SEARCH,dispatch),
    cleanQuery: bindActionCreators(CALL_CLEAN_QUERY,dispatch),
    finishSearch: bindActionCreators(CALL_FINISH_SEARCH,dispatch),
})

export default React.memo(withRouter(withCookies(connect(mapStateToProps, mapDispatchToProps)(NavMenu as ComponentType<IProps>)) as any));