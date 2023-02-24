import React, { Suspense, lazy, useEffect, useState } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { ApiUrl, EngagefulWebsiteId } from "@doar/shared/data";
import Preloader from "./components/preloader";
import PrivateRoute from "./components/privateRoute";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import "react-toastify/dist/ReactToastify.css";
import { logout, setAuthenticated } from "./redux/slices/auth";
import PublicRouteOnly from "./components/publicRouteOnly";
import "./generalCss.css";
import LifecycleList from "./components/lifecycles/list";
import { addEmailDomain, addSenderProfile, resetEmailState } from "./redux/slices/email";
import UserView from "./components/users/view";

const Dashboard = lazy(() => import("./pages/dashboard"));
const DashboardOne = lazy(() => import("./pages/dashboard-one"));
const DashboardTwo = lazy(() => import("./pages/dashboard-two"));
const DashboardThree = lazy(() => import("./pages/dashboard-three"));
const DashboardFour = lazy(() => import("./pages/dashboard-four"));
const SignIn = lazy(() => import("./pages/signin"));
const SignOut = lazy(() => import("./pages/signout"));
// const SignUp = lazy(() => import("./pages/signup"));
const VerifyAccount = lazy(() => import("./pages/verify-account"));
const ForgotPassword = lazy(() => import("./pages/forgot-password"));
const ErrorNotFound = lazy(() => import("./pages/error-404"));
const Error500 = lazy(() => import("./pages/error-500"));
const Error503 = lazy(() => import("./pages/error-503"));
const Error505 = lazy(() => import("./pages/error-505"));
const ProfileView = lazy(() => import("./pages/profile-view"));
const Connections = lazy(() => import("./pages/connections"));
const Groups = lazy(() => import("./pages/groups"));
const Events = lazy(() => import("./pages/events"));
const Timeline = lazy(() => import("./pages/timeline"));
const Pricing = lazy(() => import("./pages/pricing"));
const HelpCenter = lazy(() => import("./pages/help-center"));
const Invoice = lazy(() => import("./pages/invoice"));
const Calendar = lazy(() => import("./pages/apps/calendar"));
const Chat = lazy(() => import("./pages/apps/chat"));
const Contacts = lazy(() => import("./pages/apps/contacts"));
const FileManager = lazy(() => import("./pages/apps/file-manager"));
const Mail = lazy(() => import("./pages/apps/mail"));
const CampaignList = lazy(() => import("./components/campaign/list"));
const CampaignEdit = lazy(() => import("./components/campaign/edit"));
const UserList = lazy(() => import("./components/users/list"));
const Settings = lazy(() => import("./components/settings"));

const App: React.FC = () => {
    const authenticated = useAppSelector((state) => state.auth.isAuthenticated);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const userObject = useAppSelector((state) => state.auth.userObject);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [initialLoading, setinitialLoading] = useState(true);

    const authToEngageful = () => {
        const { Engageful } = window as any;
        if (typeof Engageful === "function") {
                Engageful("init", {
                    website: EngagefulWebsiteId,
                    user: {
                        userId: userObject.id,
                        name: userObject.name,
                        email: userObject.email,
                        details: {
                        },
                    },
                });
        } else {
            setTimeout(authToEngageful, 250);
        }
    };

    useEffect(() => {
        if (authenticated && !initialLoading) {
            authToEngageful();
        }
    }, [location, authenticated]);

    const doRefreshToken = (refreshToken: string) => {
        axios
            .post(`${ApiUrl}/auth/refresh-tokens`, {
                refreshToken,
            })
            .then((_response) => {
                const response = _response.data;
                if (response.tokens && response.user && response.websites) {
                    localStorage.setItem(
                        "accessToken",
                        response.tokens.access.token
                    );
                    localStorage.setItem(
                        "refreshToken",
                        response.tokens.refresh.token
                    );
                    localStorage.setItem(
                        "accessTokenExpires",
                        response.tokens.access.expires
                    );
                    localStorage.setItem(
                        "refreshTokenExpires",
                        response.tokens.refresh.expires
                    );
                    dispatch(setAuthenticated({
                        authenticated: true,
                        userObject: response.user,
                        websites: response.websites,
                        accessToken: response.tokens.access.token,
                        refreshToken: response.tokens.refresh.token,
                        accessTokenExpires: new Date(
                            response.tokens.access.expires
                        ),
                        refreshTokenExpires: new Date(
                            response.tokens.refresh.expires
                        ),
                    }))
                    dispatch(resetEmailState());
                    if (response.websites[0].senderProfiles) {
                        response.websites[0].senderProfiles.forEach(sp => {
                            dispatch(addSenderProfile({
                                senderProfile: sp
                            }));
                        })
                    }
                    if (response.websites[0].emailDomains) {
                        response.websites[0].emailDomains.forEach(ed => {
                            dispatch(addEmailDomain({
                                emailDomain: ed
                            }));
                        })
                    }
                    setinitialLoading(false);
                } else {
                    dispatch(logout());
                    setinitialLoading(false);
                }
                
                
            })
            .catch(() => {
                    dispatch(logout());
                    setinitialLoading(false);
            });
    };

    const checkUserAuthenticatedInStore = () => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        const accessTokenExpires = localStorage.getItem("accessTokenExpires");
        const refreshTokenExpires = localStorage.getItem("refreshTokenExpires");

        if (
            accessToken &&
            refreshToken &&
            accessTokenExpires &&
            refreshTokenExpires
        ) {
            if (new Date() < new Date(accessTokenExpires)) {
                dispatch(setAuthenticated({
                    authenticated: true,
                    websites: [{id: 1}]
                }));
                doRefreshToken(refreshToken);
            } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('accessTokenExpires');
                localStorage.removeItem('refreshTokenExpires');
                dispatch(logout());
                setinitialLoading(false);
            }
        } else {
                dispatch(logout());
            setinitialLoading(false);
        }
    };

    useEffect(() => {
        checkUserAuthenticatedInStore();
    }, []);

    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('accessTokenExpires');
                    localStorage.removeItem('refreshTokenExpires');
                    dispatch(logout());
                    setinitialLoading(false);
                }
            }
        }
    );

    if (initialLoading) {
        return <Preloader/>;
    }

    return (
        <>
            <Suspense fallback={<Preloader />}>
                <Switch>
                    <PrivateRoute
                        isSignedIn={authenticated}
                        exact
                        path="/"
                        component={Dashboard}
                    />
                    <Route
                        exact
                        path="/dashboard-one"
                        component={DashboardOne}
                    />
                    <Route
                        exact
                        path="/dashboard-two"
                        component={DashboardTwo}
                    />
                    <Route
                        exact
                        path="/dashboard-three"
                        component={DashboardThree}
                    />
                    <Route
                        exact
                        path="/dashboard-four"
                        component={DashboardFour}
                    />
                    <Route exact path="/signout" component={SignOut} />
                    {/* <Route exact path="/signup" component={SignUp} /> */}
                    <Route
                        exact
                        path="/verify-account"
                        component={VerifyAccount}
                    />
                    <Route
                        exact
                        path="/forgot-password"
                        component={ForgotPassword}
                    />
                    <Route exact path="/error-500" component={Error500} />
                    <Route exact path="/error-503" component={Error503} />
                    <Route exact path="/error-505" component={Error505} />
                    <Route exact path="/profile-view" component={ProfileView} />
                    <Route exact path="/connections" component={Connections} />
                    <Route exact path="/groups" component={Groups} />
                    <Route exact path="/events" component={Events} />
                    <Route exact path="/timeline" component={Timeline} />
                    <Route exact path="/pricing" component={Pricing} />
                    <Route exact path="/help-center" component={HelpCenter} />
                    <Route exact path="/invoice" component={Invoice} />
                    <Route exact path="/apps/calendar" component={Calendar} />
                    <Route exact path="/apps/chat" component={Chat} />
                    <Route exact path="/apps/contacts" component={Contacts} />
                    <Route
                        exact
                        path="/apps/file-manager"
                        component={FileManager}
                    />
                    <Route exact path="/apps/mail" component={Mail} />
                    <PublicRouteOnly
                        isSignedIn={authenticated}
                        exact
                        path="/signin"
                        component={SignIn}
                    />
                    <PrivateRoute
                        isSignedIn={authenticated}
                        exact
                        path="/campaigns"
                        component={CampaignList}
                    />
                    <PrivateRoute
                        isSignedIn={authenticated}
                        exact
                        path="/campaigns/new"
                        component={CampaignEdit}
                    />
                    <PrivateRoute
                        isSignedIn={authenticated}
                        exact
                        path="/campaigns/:id"
                        component={CampaignEdit}
                    />
                    <PrivateRoute
                        isSignedIn={authenticated}
                        exact
                        path="/users"
                        component={UserList}
                    />
                    <PrivateRoute
                        isSignedIn={authenticated}
                        exact
                        path="/users/:id"
                        component={UserView}
                    />
                    <PrivateRoute
                        isSignedIn={authenticated}
                        path="/settings/*"
                        component={Settings}
                    />
                    <PrivateRoute
                        isSignedIn={authenticated}
                        path="/lifecycles"
                        component={LifecycleList}
                    />
                    <Route path="*" component={ErrorNotFound} />
                </Switch>
                <ToastContainer
                    style={{ fontWeight: 500, width: "390px" }}
                    position="bottom-center"
                />
            </Suspense>
        </>
    );
};

export default App;
