import React, { FC, useState } from "react";
import {
    Card,
    CardBody,
    CardTitle,
    Col,
    Container,
    Row,
} from "@doar/components";
import { Briefcase, Columns, User } from "react-feather";
import SearchForm from "./search-form";
import Layout from "../../../layouts";
import Content from "../../../layouts/content";
import SEO from "../../seo";
import Pagination from "./pagination";
import SegmentList from "./segments";
import {
    SwitchContainer,
    SwitchContainerItemLeft,
    SwitchContainerItemRight,
} from "./style";
import PaginationGroup from "./pagination-group";

const UserList: FC = () => {
    const [searchValue, setSearchValue] = useState("");
    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };
    const [listToggle, setlistToggle] = useState(true);
    const toggleListToggle = () => {
        setlistToggle((prevCheck) => !prevCheck);
    };

    return (
        <Layout hideFooter hideSearch>
            <SEO titleTemplate="Users" />
            <Content style={{maxWidth: "100%"}}>
                <Container className="fullWidth">
                    <Row mb="15px" mt="0px" style={{display: "flex", alignItems: "center"}}>
                        <Col col lg={4}>
                        <CardTitle as="h5" style={{margin: "0px 0px 0px 10px"}}>
                                        {listToggle ? "All users" : "Groups"}
                                    </CardTitle>
                            </Col>
                        <Col col lg={8}>
                            <div style={{ float: "right" }}>
                                {/* <Columns/> */}
                                <SearchForm
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {/* <Col col sm={3}>
                            <div style={{ padding: "0px 10px" }}>
                                <SwitchContainer>
                                    <SwitchContainerItemLeft
                                        onClick={toggleListToggle}
                                        active={listToggle}
                                    >
                                        <User size="16px" />{" "}
                                        <span
                                            style={{
                                                position: "relative",
                                                marginLeft: "5px",
                                                top: "1px",
                                            }}
                                        >
                                            Users
                                        </span>
                                    </SwitchContainerItemLeft>
                                    <SwitchContainerItemRight
                                        onClick={toggleListToggle}
                                        active={!listToggle}
                                    >
                                        <Briefcase size="16px" />{" "}
                                        <span
                                            style={{
                                                position: "relative",
                                                marginLeft: "5px",
                                                top: "1px",
                                            }}
                                        >
                                            Groups
                                        </span>
                                    </SwitchContainerItemRight>
                                </SwitchContainer>
                            </div>
                            <SegmentList />
                        </Col> */}
                        <Col col>
                            <Card width={["100%", "100%"]}>
                                <CardBody paddingBottom="0px" style={{padding: "0px 20px"}}>
                                    {listToggle ? (
                                        <Pagination
                                            search={searchValue}
                                            onChange={() => {
                                                console.log("lol");
                                            }}
                                        />
                                    ) : (
                                        <PaginationGroup
                                            search={searchValue}
                                            onChange={() => {
                                                console.log("lol");
                                            }}
                                        />
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

export default UserList;
