/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { FC, useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardSubtitle,
    CardTitle,
    Col,
    Container,
    Row,
} from "@doar/components";
import { useAppSelector } from "src/redux/hooks";
import { ApiUrl, WebsiteId } from "@doar/shared/data";
import axios from "axios";
import { toast } from "react-toastify";
import Accordion from "src/components/accordion";
import { File, Plus, Sliders } from "react-feather";
import { PredicateGroup } from "src/components/predicates/predicategroup/PredicateGroup";
import { IDictionaryItem } from "src/components/campaign/interfaces";
import ReactTooltip from "react-tooltip";
import { defaultTypes } from "@doar/shared/data/api-keys";
import { StyledButton, StyledButtonIcon, StyledButtonSave } from "./style";

const ApikeysSettings: FC = () => {
    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <div>
                    <CardTitle as="h5">API Keys</CardTitle>
                    <CardSubtitle>
                        API allows an external application or website to
                        interact with your account.
                    </CardSubtitle>
                </div>
                <div style={{ display: "none", marginLeft: "auto" }}>
                    <ReactTooltip place="top" effect="solid" />
                    <StyledButtonSave size="sm" ml="10px">
                        Save changes
                    </StyledButtonSave>
                </div>
            </div>
            <div style={{ margin: "20px 0px" }}>
                <p>Your API key</p>
                0401c998-cfa2-44f1-86cd-98b70fb3dce1
            </div>
        </>
    );
};

export default ApikeysSettings;
