/* eslint-disable @typescript-eslint/restrict-template-expressions */

import React, { FC, useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardTitle,
    Col,
    Container,
    Row,
    Spinner,
} from "@doar/components";
import { Briefcase, Loader, User } from "react-feather";
import { useAppSelector } from "src/redux/hooks";
import { useHistory, useParams } from "react-router-dom";
import { ApiUrl } from "@doar/shared/data/api-keys";
import { formatDistance, format } from "date-fns";
import { useQuery } from "react-query";
import axios from "axios";
import Layout from "../../../layouts";
import Content from "../../../layouts/content";
import SEO from "../../seo";
import {
    SwitchContainer,
    SwitchContainerItemLeft,
    SwitchContainerItemRight,
} from "./style";
import { IWebsiteUser } from "../interfaces";
import AttributeList from "./attributeList";
import HealthList from "./healthList";
import ActivityFeed from "./activityFeed";

export interface IParams {
    id?: string;
}

const UserView: FC = () => {
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const token: string = useAppSelector((state) => state.auth.accessToken);
    const { id } = useParams<IParams>();
    const history = useHistory();
    const [loading, setloading] = useState(true);
    const [currentUser, setcurrentUser] = useState<IWebsiteUser>({id: 0});

    const { isLoading, error, data } = useQuery(`getUser-${id}`, () => {
        const url = `${ApiUrl}/websites/${WebsiteId}/users/${id}`;
        return axios.get(url, { headers: { Authorization: `Bearer ${token}`, }, })
    }, {
        onSuccess: () => {console.log("nice", data)},
    })

    return (
        <Layout hideFooter hideSearch>
            <SEO titleTemplate="Users" />
            <Content style={{maxWidth: "100%"}}>
                <Container className="fullWidth" mb="60px">
                    {isLoading ?
                        <div
                            style={{
                                display: "flex",
                                alignContent: "center",
                                justifyContent: "center",
                                minHeight: "300px",
                                alignItems: "center",
                            }}
                        >
                            <Spinner color="primary" />
                        </div>
                    : 
                    <>
                    <Row mb="60px" mt="30px" paddingX="20px" style={{display: 'flex', alignItems: 'center'}}>
                        <Col col>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <img src={`https://avatars.dicebear.com/api/initials/${data.data.name.toString()}.svg`} alt="Avatar" style={{width: '46px', borderRadius: '50%'}} />
                                <div style={{marginLeft: '20px'}}>
                                    <div style={{fontSize: '18px', fontWeight: 500}}>{data.data.name}</div>
                                    <div>{data.data.email}</div>
                                </div>
                            </div>
                        </Col>
                        <Col col>
                            <div style={{display:"flex", alignItems: "center", justifyContent: "flex-end"}}>
                                <div>
                                    <div style={{color: '#6f7488', display: 'block', fontSize: '.6875rem', fontWeight: 600, lineHeight: 1, marginBottom: '8px', textTransform: 'uppercase'}}>LAST SEEN</div>
                                    <div>{data.data.last_seen ? formatDistance(new Date(data.data.last_seen), new Date(), {addSuffix: true}) : <span style={{color: "#c8c9cf"}}>—</span>}</div>
                                </div>
                                <div style={{marginLeft: "60px"}}>
                                    <div style={{color: '#6f7488', display: 'block', fontSize: '.6875rem', fontWeight: 600, lineHeight: 1, marginBottom: '8px', textTransform: 'uppercase'}}>Signed up</div>
                                    <div>{data.data.createdAt ? formatDistance(new Date(data.data.createdAt), new Date(), {addSuffix: true}) : <span style={{color: "#c8c9cf"}}>—</span>}</div>
                                </div>
                                <div style={{marginLeft: "60px"}}>
                                    <div style={{color: '#6f7488', display: 'block', fontSize: '.6875rem', fontWeight: 600, lineHeight: 1, marginBottom: '8px', textTransform: 'uppercase'}}>Last messaged</div>
                                    <div>{data.data.lastMessaged ? formatDistance(new Date(data.data.lastMessaged), new Date(), {addSuffix: true}) : <span style={{color: "#c8c9cf"}}>—</span>}</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col col lg={4}>
                            <Card width={["100%", "100%"]}>
                                <CardBody paddingBottom="0px">
                                    <AttributeList user={data.data}/>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col col>
                            <Card width={["100%", "100%"]} style={{marginBottom: "30px"}}>
                                <CardBody paddingBottom="0px">
                                    <ActivityFeed user={data.data}/>
                                </CardBody>
                            </Card>
                            <Card width={["100%", "100%"]} >
                                <CardBody paddingBottom="0px">
                                    <HealthList user={data.data}/>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    </>}
                </Container>
            </Content>
        </Layout>
    );
};

export default UserView;
