/* eslint-disable no-nested-ternary */
import React, { FC, useState } from "react";
import {
    Card,
    CardBody,
    CardTitle,
    Col,
    Container,
    Row,
} from "@doar/components";
import { Briefcase, User } from "react-feather";
import { useLocation } from "react-router-dom";
import Layout from "../../layouts";
import Content from "../../layouts/content";
import SEO from "../seo";
import NavigationList from "./navigation";
import {
    SwitchContainer,
    SwitchContainerItemLeft,
    SwitchContainerItemRight,
} from "./style";
import HealthScoreSettings from "./pages/healthscores";
import DictionarySettings from "./pages/dictionary";
import ApikeysSettings from "./pages/apikeys";
import ThrottleSettings from "./pages/throttle";
import IntegrationSettings from "./pages/integration";
import EmailSettings from "./pages/email";

const SettingsContainer: FC = () => {
    const [searchValue, setSearchValue] = useState("");
    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };
    const [listToggle, setlistToggle] = useState(true);
    const toggleListToggle = () => {
        setlistToggle((prevCheck) => !prevCheck);
    };
    const path = useLocation().pathname;
    return (
        <Layout hideFooter hideSearch>
            <SEO titleTemplate="Users" />
            <Content>
                <Container>
                    <Row>
                        <Col col sm={3}>
                            <NavigationList />
                        </Col>
                        <Col col>
                            <Card width={["100%", "100%"]}>
                                <CardBody paddingBottom="0px">
                                    {path === "/settings/general" ? (
                                        <></>
                                    ) : path === "/settings/dictionary" ? (
                                        <DictionarySettings />
                                    ) : path === "/settings/healthscores" ? (
                                        <HealthScoreSettings />
                                    ) : path === "/settings/apikeys" ? (
                                        <ApikeysSettings />
                                    ) : path === "/settings/throttle" ? (
                                        <ThrottleSettings />
                                    ) : path === "/settings/integrations" ? (
                                        <IntegrationSettings />
                                    ) : path === "/settings/email" ? (
                                        <EmailSettings />
                                    ) : (
                                        <></>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Content>
        </Layout>
    );
};

export default SettingsContainer;
