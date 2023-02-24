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
import axios from "axios";
import { toast } from "react-toastify";
import Accordion from "src/components/accordion";
import { File, Plus, Sliders } from "react-feather";
import { PredicateGroup } from "src/components/predicates/predicategroup/PredicateGroup";
import { IDictionaryItem } from "src/components/campaign/interfaces";
import ReactTooltip from "react-tooltip";
import { defaultTypes } from "@doar/shared/data/api-keys";
import { StyledButton, StyledButtonIcon, StyledButtonSave } from "./style";
import DictionaryPagination from "./pagination";

interface IHealthScore {
    id: string;
    name: string;
    conditions: any;
    weight: number;
}

const DictionarySettings: FC = () => {
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
                    <CardTitle as="h5">Dictionary</CardTitle>
                    <CardSubtitle>
                        Document your events and properties
                    </CardSubtitle>
                </div>
                {/* <div style={{ marginLeft: "auto" }}>
                    <ReactTooltip place="top" effect="solid" />
                    <StyledButtonSave size="sm" ml="10px">
                        Save changes
                    </StyledButtonSave>
                </div> */}
            </div>
            <div style={{ margin: "20px 0px" }}>
                <DictionaryPagination onChange={() => {}} search="" />
            </div>
        </>
    );
};

export default DictionarySettings;
