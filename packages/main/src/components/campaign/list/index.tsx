import React, { FC, useState } from "react";
import {
    Card,
    CardBody,
    CardLink,
    CardSubtitle,
    CardText,
    CardTitle,
    Col,
    Container,
    Row,
} from "@doar/components";
import WelcomeArea from "src/containers/dashboard-one/welcome-area";
import MainNav from "src/components/apps/mail/main-nav";
import { Mail, Printer, File, Search } from "react-feather";
import { StyledForm } from "src/components/search-form/style";
import SearchForm from "./search-form";
import {
    StyledInput,
    StyledButtonSearch,
    StyledButton,
} from "./search-form/style";
import Layout from "../../../layouts";
import Content from "../../../layouts/content";
import SEO from "../../seo";
import { StyledCampaignList } from "./style";
import Pagination from "./pagination";

const CampaignList: FC = () => {
    const [searchValue, setSearchValue] = useState("");
    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };
    return (
        <Layout hideFooter hideSearch>
            <SEO titleTemplate="Campaigns" />
            <Content className="fullWidthContainer">
                <Container>
                <Row mb="15px" mt="0px" style={{display: "flex", alignItems: "center"}}>
                        <Col col lg={4}>
                        <CardTitle as="h5" style={{margin: "0px 0px 0px 10px"}}>
                        Campaign list</CardTitle>
                        </Col>
                        <Col col lg={8}>
                            <div style={{ float: "right" }}>
                                <SearchForm
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {/* <Col col sm={2}>
                            <MainNav />
                            </Col> */}
                        <Col col>
                            <Card width={["100%", "100%"]}>
                                <CardBody paddingBottom="0px" style={{padding: "0px 20px"}}>
                                    <Pagination
                                        search={searchValue}
                                        onChange={() => {
                                            console.log("lol");
                                        }}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Content>
        </Layout>
    );
};

export default CampaignList;
