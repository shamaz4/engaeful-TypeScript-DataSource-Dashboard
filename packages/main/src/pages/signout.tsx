import React, { useEffect } from "react";
import { useAppDispatch } from "src/redux/hooks";
import { useHistory } from "react-router-dom";
import { logout } from "src/redux/slices/auth";
import Preloader from "src/components/preloader";
import Layout from "../layouts";
import Content from "../layouts/content";
import AuthContainer from "../containers/signin";
import SEO from "../components/seo";

const SignOut: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    useEffect(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessTokenExpires');
        localStorage.removeItem('refreshTokenExpires');

        dispatch(logout());
        history.replace("/signin");
    }, []);

    return (
        <Layout hideFooter hideHeader>
            <SEO titleTemplate="Sign in" />
            <Content fullHeight>
                <></>
            </Content>
        </Layout>
    );
};

export default SignOut;
