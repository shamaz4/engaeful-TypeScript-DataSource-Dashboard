import * as React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

interface IPublicRouteOnly extends RouteProps {
    // tslint:disable-next-line:no-any
    component?: any;
    render?: any;
    isSignedIn: boolean;
}

const PublicRouteOnly = (props: IPublicRouteOnly) => {
    const { component: Component, isSignedIn, ...rest } = props;

    return (
        <Route
            {...rest}
            render={(routeProps) =>
                !isSignedIn ? (
                    <Component {...routeProps} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: { from: routeProps.location },
                        }}
                    />
                )
            }
        />
    );
};

export default PublicRouteOnly;
