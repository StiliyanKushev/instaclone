// IMPORT STYLES
import styles from './NavMenu.module.css';

// IMPORT REACT RELATED
import React, { createRef, ComponentType } from 'react';
import { ReactCookieProps, withCookies } from 'react-cookie';
import { Menu, Container, Item, Search, Icon, Ref } from 'semantic-ui-react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';

// IMPORT OTHER
import $ from 'jquery';
import { connect } from 'react-redux';
import { AppState, ReduxProps } from '../../reducers/index';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../actions/types/actions';
import { TOGGLE_FULL_POST_VIEW } from '../../actions/postActions';
import { bindActionCreators } from 'redux';

type IProps = RouteComponentProps & ReactCookieProps & ReduxProps & DispatchProps;

class NavMenu extends React.Component<IProps>{
    state = { isVisible: true }

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

    private onRouteChanged() {
        if (this.props.post?.fullViewToggled && this.props.location.pathname !== '/') {
            this.props.toggleFullView()
        }

        this.handleVisibility()
    }

    public componentDidUpdate(prevProps: RouteComponentProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    private isCurrentPath(path: string): string {
        let prefix: string = path === '/' ? '-' : '';
        return (this.props.location.pathname === '/' && path === '/') || (path !== '/' && this.props.location.pathname.startsWith(path)) ? '' : prefix + 'outline';
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
                        <Search placeholder='Search' />
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
                        <Link className={styles.LinkContainer} to={`/profile/${this.props.cookies?.get('username')}`}>
                            <Icon className={`${styles.iconBtn} user circle ${this.isCurrentPath('/profile')}`} size='big'></Icon>
                        </Link>
                    </Item>
                </Container>
                <Ref innerRef={this.mobileSearchBar}>
                    <Container fluid className={styles.searchBar}>
                        <Search placeholder='Search' />
                    </Container>
                </Ref>
            </Menu>
        );
    }
}

const mapStateToProps = (state: AppState): ReduxProps => ({
    post: state.post,
})

interface DispatchProps {
    toggleFullView: () => void,
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): DispatchProps => ({
    toggleFullView: bindActionCreators(TOGGLE_FULL_POST_VIEW, dispatch),
})

export default React.memo(withRouter(withCookies(connect(mapStateToProps, mapDispatchToProps)(NavMenu as ComponentType<IProps>)) as any));