/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-nested-ternary */
import React, { useReducer, useEffect, useState } from "react";

import ReactTooltip from "react-tooltip";
import { useAppSelector } from "../../../../../../redux/hooks";
import { InputSimple } from "../../../../../commoncomponents/InputSimple";
import { SwitchSimple } from "../../../../../commoncomponents/SwitchSimple";
import { SelectSimple } from "../../../../../commoncomponents/SelectSimple";
import { ColorSelectorInput } from "../../../../../commoncomponents/ColorSelectorInput";
import ButtonManager from "./ButtonManager/ButtonManager";

export default function ImageBoxControls({
    params = {
        id: null,
        title: "Message from Nimble",
        body: "We are releasing our brand new editor",
    },
    onChange = () => {},
}) {
    const sendProfiles = useAppSelector((state) => state.email.senderProfiles);
    const [currentParams, setcurrentParams] = useState(params);
    const [tab, settab] = useState("content");


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
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                }}
            >
                <div
                    onClick={() => {
                        settab("content");
                    }}
                    role="button"
                    tabIndex={0}
                    style={{
                        padding: "10px 20px",
                        fontWeight: tab === "content" ? 500 : 400,
                        borderBottom: tab === "content" ? "3px solid #9385fc" : "3px solid transparent",
                        cursor: tab === "content" ? "default" : "pointer",
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    General
                </div>
                <div
                    onClick={() => {
                        settab("settings");
                    }}
                    role="button"
                    tabIndex={0}
                    style={{
                        padding: "10px 20px",
                        fontWeight: tab === "settings" ? 500 : 400,
                        borderBottom: tab === "settings" ? "3px solid #9385fc" : "3px solid transparent",
                        cursor: tab === "settings" ? "default" : "pointer",
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    Style
                </div>
            </div>
            {tab === "content" ? 
            <>
            <p className="actionEditorLabel">Email subject</p>
            <InputSimple
                placeholder="Enter email subject"
                width="100%"
                value={currentParams.title}
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        title: data,
                    });
                }}
            />
            <p style={{ marginTop: "20px" }} className="actionEditorLabel">
                Preview text
            </p>
            <InputSimple
                placeholder="Enter preview text (optional)"
                width="100%"
                value={currentParams.previewText}
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        previewText: data,
                    });
                }}
            />
            <hr className="actionEditorHr" />
            <p style={{ marginTop: "20px" }} className="actionEditorLabel">
                Sender from (email)
            </p>
            <SelectSimple
                placeholder="exactly"
                values={sendProfiles.map(sp => {
                    return {value: `${sp.sendFromEmail.name}@${sp.sendFromEmail.domain}`, name: `${sp.sendFromEmail.name}@${sp.sendFromEmail.domain}`}
                })}
                value={currentParams.sendFromEmail}
                onChange={(data) => {
                    // Get name
                    let foundName = "";
                    let avatar = "";
                    sendProfiles.forEach((sp)=> {
                        if (sp.sendFromEmail.name === data.split("@")[0] && sp.sendFromEmail.domain === data.split("@")[1])
                        {
                            foundName = sp.sendFromName;
                            avatar = sp.avatar;
                        }
                    });
                    setcurrentParams({
                        ...currentParams,
                        sendFromEmail: data,
                        sendFromName: foundName.split(" ")[0],
                        avatar,
                    });
                }}
            />
            <p style={{ marginTop: "20px" }} className="actionEditorLabel">
                Sender from (name)
            </p>
            <InputSimple
                placeholder="Enter sender name"
                value={currentParams.sendFromName}
                width="100%"
                disabled
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        sendFromName: data,
                    });
                }}
            />
            <div style={{borderRadius: '6px', padding: '16px', backgroundColor: 'rgb(249, 249, 249)', marginTop: '20px', color: 'rgb(115, 115, 118)', fontWeight: 500, display: 'flex', alignItems: 'center'}}>
                <p style={{margin: '0px'}}>This email would only send to eligible recipients 
                <ReactTooltip className="containedtooltip" place="top" effect="solid" id="email" />
                    <svg data-for="email" data-tip="People who unsubscribed or who marked your previous emails as spam would be excluded." title="" className="interface-icon o__standard o__standard__tooltip" xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" style={{fill: 'rgb(115, 115, 118)', position: 'relative', top: '3px', marginLeft: "5px"}}>
                        <path d="M1.321 7.982c0-3.661 2.982-6.661 6.679-6.661 1.839 0 3.411.643 4.732 1.946 1.304 1.321 1.946 2.893 1.946 4.714 0 3.696-2.982 6.696-6.679 6.696-1.857 0-3.429-.661-4.714-1.982-1.304-1.286-1.964-2.857-1.964-4.714zm4.947-1.946l.179-.125c.018 0 .054-.036.143-.089.071-.054.125-.071.161-.089.214-.125.446-.196.714-.25.161-.018.268-.036.321-.036.589 0 .768.214.768.643 0 .304-.143.554-.429.786l-.446.411a3.07 3.07 0 0 0-.464.536c-.214.286-.393.804-.393 1.393v.179c0 .089 0 .143.018.179l.018.179h1.536v-.179c0-.429.161-.821.482-1.161l.232-.196a1.67 1.67 0 0 1 .232-.196 2.38 2.38 0 0 0 .5-.464c.304-.375.554-.893.554-1.661 0-1.232-.911-2.018-2.357-2.018-.875 0-1.661.232-2.357.696l-.125.089zm.661 5.946c.196.196.429.286.732.286.661 0 1.089-.393 1.089-1.036 0-.625-.393-1-1.089-1-.625 0-1.036.375-1.036 1 0 .304.107.554.304.75z" />
                    </svg>
                </p>
            </div>
            {/* <p style={{ marginTop: "20px" }} className="actionEditorLabel">
                Sender avatar URL
            </p>
            <InputSimple
                placeholder="Direct URL to image"
                value={currentParams.avatar}
                width="100%"
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        avatar: data,
                    });
                }}
            /> */}
            </>
            : tab === "settings" ? 
            <>
            <p style={{ marginTop: "20px" }} className="actionEditorLabel">
                Position
            </p>
            <SelectSimple
                placeholder="exactly"
                values={[
                    { value: "centered", name: "Center" },
                    { value: "bottomLeft", name: "Bottom left" },
                    { value: "bottomRight", name: "Bottom right" },
                    { value: "topLeft", name: "Top left" },
                    { value: "topRight", name: "Top right" },
                ]}
                value={currentParams.position}
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        position: data,
                    });
                }}
            />
            <p style={{ marginTop: "20px" }} className="actionEditorLabel">
                Size
            </p>
            <SelectSimple
                placeholder="exactly"
                values={[
                    { value: 350, name: "Small" },
                    { value: 450, name: "Medium" },
                    { value: 550, name: "Large" },
                ]}
                value={currentParams.width}
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        width: data,
                    });
                }}
            />
            <p style={{ marginTop: "10px" }} className="actionEditorLabel" />
            <SwitchSimple
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        showPoweredBy: data,
                    });
                }}
                value={currentParams.showPoweredBy}
                text="Show Powered By"
            />
            </>
            :
            <></>}
        </>
    );
}
