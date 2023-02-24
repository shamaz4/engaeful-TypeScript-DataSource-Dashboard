import React from "react";
import { Row } from "@doar/components";
import {
    StyledSidebar,
    StyledBody,
    StyledHeader,
} from "src/components/campaign/edit/sidebar/style";
import { Redirect } from "react-router-dom";
import Layout from "../layouts";
import Content from "../layouts/content";
import RowOne from "../containers/dashboard/row-one";
import RowTwo from "../containers/dashboard/row-two";
import SEO from "../components/seo";

const Dashboard: React.FC = () => {
    return (
        <Layout hideFooter hideSearch>
                <Redirect
                to={{
                    pathname: "/campaigns"
                }}
            />
            <SEO />
            <Content>
                <Row gutters={10}>
                    <RowTwo />
                    <RowOne />
                </Row>
            </Content>
        </Layout>
    );
};

export default Dashboard;
