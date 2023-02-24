import { ApiUrl } from "@doar/shared/data";
import axios from "axios";
import * as React from "react";
import { Route, Redirect, RouteProps, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import auth, { logout, setAuthenticated } from "src/redux/slices/auth";

interface PrivateRouteProps extends RouteProps {
    // tslint:disable-next-line:no-any
    component?: any;
    render?: any;
    isSignedIn: boolean;
}

const PrivateRoute = (props: PrivateRouteProps) => {
    const authenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const [waitAuth, setwaitAuth] = React.useState(false);
    const { component: Component, isSignedIn, ...rest } = props;
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();


    return (
        <Route
            {...rest}
            render={(routeProps) =>
                isSignedIn ? (
                    <Component {...routeProps} />
                ) : (
                    <Redirect
                        to={{
                            pathname: authenticated
                                ? pathname
                                : "/signin",
                            state: { from: routeProps.location },
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;
