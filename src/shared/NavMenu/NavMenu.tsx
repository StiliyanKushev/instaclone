import React, { createRef } from 'react';
import $ from 'jquery';

import styles from './NavMenu.module.css';

import { Menu, Container, Item, Search, Icon, Ref } from 'semantic-ui-react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { ReactCookieProps, withCookies } from 'react-cookie';

class NavMenu extends React.Component<RouteComponentProps & ReactCookieProps>{
    state = {isVisible:true}

    private mobileSearchBar = createRef<HTMLDivElement>();

    constructor(props: RouteComponentProps) {
        super(props);

        //bind local functions
        this.isCurrentPath = this.isCurrentPath.bind(this);
        this.handleVisibility = this.handleVisibility.bind(this);
        this.handleMobileSearchClick = this.handleMobileSearchClick.bind(this);
    }

    //this function acts as a switch for the mobile version of the nav search
    private handleMobileSearchClick(){
        if(this.mobileSearchBar.current){
            if($(this.mobileSearchBar.current).is(':visible'))
                $(this.mobileSearchBar.current).fadeOut(200);
            else
                $(this.mobileSearchBar.current).fadeIn(200);
        }
    }

    private handleVisibility(){
        const hideMobileBar = function(this:any) {
            if(this.mobileSearchBar.current)
            $(this.mobileSearchBar.current).hide();
        }.bind(this);

        if(this.props.location.pathname === '/login' || this.props.location.pathname === '/register'){
            this.setState({isVisible:false},hideMobileBar)
        }
        else{
            this.setState({isVisible:true},hideMobileBar)
        }
    }

    public componentDidMount(){
        this.handleVisibility();
    }

    private onRouteChanged() {
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
        if(!this.state.isVisible) return ''
        return (
            <Menu size='small' fixed='top'>
                <Container className={styles.itemContainer}>
                    <Item className={`logo-text ${styles.logo}`} as='span'>
                        Instaclone
                    </Item>
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

export default withRouter(withCookies(NavMenu));