/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-nested-ternary */
import React, { useReducer, useEffect, useState } from "react";

import ReactTooltip from "react-tooltip";
import { useQuery } from "react-query";
import axios from "axios";
import { ApiUrl } from "@doar/shared/data";
import { useAppSelector } from "../../../../../../redux/hooks";
import { InputSimple } from "../../../../../commoncomponents/InputSimple";
import { SwitchSimple } from "../../../../../commoncomponents/SwitchSimple";
import { SelectSimple } from "../../../../../commoncomponents/SelectSimple";
import { ColorSelectorInput } from "../../../../../commoncomponents/ColorSelectorInput";
import ButtonManager from "./ButtonManager/ButtonManager";

export default function SlackControls({
    params = {
        id: null,
        message: "Message from Nimble",
        toChannelId: "",
    },
    onChange = () => {},
}) {
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const token: string = useAppSelector((state) => state.auth.accessToken);
    const sendProfiles = useAppSelector((state) => state.email.senderProfiles);
    const [currentParams, setcurrentParams] = useState(params);
    const [tab, settab] = useState("content");


    const { isLoading, error, data, isFetching } = useQuery(`getSlackChannels`, () => {
        const url = `${ApiUrl}/websites/${WebsiteId}/slack/getChannels`; 
        return axios.get(url, { headers: { Authorization: `Bearer ${token}`, }, })
    })

    useEffect(() => {
        if (JSON.stringify(params) !== JSON.stringify(currentParams)) {
            setcurrentParams(params);
        }
    }, [params]);

    useEffect(() => {
        onChange(currentParams);
    }, [currentParams]);

    return (
        <>
            <p className="actionEditorLabel">Send to</p>
            <SelectSimple
                placeholder="exactly"
                values={data && data.data ? data.data : []}
                value={currentParams.toChannelId}
                onChange={(d) => {
                    setcurrentParams({
                        ...currentParams,
                        toChannelId: d,
                    });
                }}
            />
            <p style={{ marginTop: "20px" }} className="actionEditorLabel">Message</p>
            <InputSimple
                textarea
                placeholder="Enter email subject"
                width="100%"
                value={currentParams.message}
                onChange={(d) => {
                    setcurrentParams({
                        ...currentParams,
                        message: d,
                    });
                }}
            />
        </>
    );
}
