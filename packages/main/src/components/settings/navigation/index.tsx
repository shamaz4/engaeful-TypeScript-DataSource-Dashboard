/* eslint-disable @typescript-eslint/no-unsafe-return */
import { FC, useEffect, useState } from "react";
import { User, Plus, Heart } from "react-feather";
import { Badge, Nav, NavLink } from "@doar/components";
import axios from "axios";
import { toast } from "react-toastify";
import { ApiUrl } from "@doar/shared/data/api-keys";
import { useAppSelector } from "src/redux/hooks";
import { Link, useLocation } from "react-router-dom";
import { StyledWrap } from "./style";

interface INavigation {
    _id: string;
    name: string;
}

const NavigationList: FC = () => {
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const token: string = useAppSelector((state) => state.auth.accessToken);
    const [segments, setSegments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const handleModal = () => {
        setShowModal((prev) => !prev);
    };
    const path = useLocation().pathname;
    return (
        <StyledWrap>
            <Nav customStyle="sidebar" fontSize="15px">
                <Link
                    style={{
                        padding: "10px",
                        background:
                            path === "/settings/general" ? "#eef0f7" : "",
                        fontWeight: path === "/settings/general" ? 500 : 400,
                    }}
                    to="general"
                >
                    <span
                        style={{
                            padding: "10px",
                            color: path === "/settings/general" ? "" : "black",
                        }}
                    >
                        General settings
                    </span>
                </Link>
            </Nav>
            <Nav customStyle="sidebar" fontSize="15px">
                <Link
                    style={{
                        padding: "10px",
                        background:
                            path === "/settings/integrations" ? "#eef0f7" : "",
                        fontWeight:
                            path === "/settings/integrations" ? 500 : 400,
                    }}
                    to="integrations"
                >
                    <span
                        style={{
                            padding: "10px",
                            color:
                                path === "/settings/integrations"
                                    ? ""
                                    : "black",
                        }}
                    >
                        Integrations
                    </span>
                </Link>
            </Nav>
            <Nav customStyle="sidebar" fontSize="15px">
                <Link
                    style={{
                        padding: "10px",
                        background:
                            path === "/settings/email" ? "#eef0f7" : "",
                        fontWeight:
                            path === "/settings/email" ? 500 : 400,
                    }}
                    to="email"
                >
                    <span
                        style={{
                            padding: "10px",
                            color:
                                path === "/settings/email"
                                    ? ""
                                    : "black",
                        }}
                    >
                        Email
                    </span>
                </Link>
            </Nav>
            <Nav customStyle="sidebar" fontSize="15px">
                <Link
                    style={{
                        padding: "10px",
                        background:
                            path === "/settings/healthscores" ? "#eef0f7" : "",
                        fontWeight:
                            path === "/settings/healthscores" ? 500 : 400,
                    }}
                    to="healthscores"
                >
                    <span
                        style={{
                            padding: "10px",
                            color:
                                path === "/settings/healthscores"
                                    ? ""
                                    : "black",
                        }}
                    >
                        Health scores
                    </span>
                </Link>
            </Nav>
            <Nav customStyle="sidebar" fontSize="15px">
                <Link
                    style={{
                        padding: "10px",
                        background:
                            path === "/settings/dictionary" ? "#eef0f7" : "",
                        fontWeight: path === "/settings/dictionary" ? 500 : 400,
                    }}
                    to="dictionary"
                >
                    <span
                        style={{
                            padding: "10px",
                            color:
                                path === "/settings/dictionary" ? "" : "black",
                        }}
                    >
                        Dictionary
                    </span>
                </Link>
            </Nav>
            <Nav customStyle="sidebar" fontSize="15px">
                <Link
                    style={{
                        padding: "10px",
                        background:
                            path === "/settings/apikeys" ? "#eef0f7" : "",
                        fontWeight: path === "/settings/apikeys" ? 500 : 400,
                    }}
                    to="apikeys"
                >
                    <span
                        style={{
                            padding: "10px",
                            color: path === "/settings/apikeys" ? "" : "black",
                        }}
                    >
                        API Keys
                    </span>
                </Link>
            </Nav>
            <Nav customStyle="sidebar" fontSize="15px">
                <Link
                    style={{
                        padding: "10px",
                        background:
                            path === "/settings/throttle" ? "#eef0f7" : "",
                        fontWeight: path === "/settings/throttle" ? 500 : 400,
                    }}
                    to="throttle"
                >
                    <span
                        style={{
                            padding: "10px",
                            color: path === "/settings/throttle" ? "" : "black",
                        }}
                    >
                        Throttle
                    </span>
                </Link>
            </Nav>
        </StyledWrap>
    );
};

export default NavigationList;
