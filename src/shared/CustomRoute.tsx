import React from 'react';
import {Route, RouteProps, Redirect} from 'react-router';

export interface CustomRouteProps extends RouteProps {
    condition: boolean;
    redirectPath: string;
}

class CustomRoute extends Route<CustomRouteProps> {
    public render() {
        let redirectPath: string = '';
        if (!this.props.condition) {
            redirectPath = this.props.redirectPath;
        }

        if (redirectPath) {
            const renderComponent = () => <Redirect to={{pathname: redirectPath}}/>;
            return <Route {...this.props} component={renderComponent} render={undefined}/>;
        } else {
            return <Route {...this.props}/>;
        }
    }
}

export default CustomRoute;