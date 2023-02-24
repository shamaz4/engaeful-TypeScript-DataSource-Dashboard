/* eslint-disable no-nested-ternary */
import React, { useReducer, useEffect, useState } from "react";

import { InputSimple } from "../../../../../commoncomponents/InputSimple";
import { SwitchSimple } from "../../../../../commoncomponents/SwitchSimple";
import { SelectSimple } from "../../../../../commoncomponents/SelectSimple";
import { ColorSelectorInput } from "../../../../../commoncomponents/ColorSelectorInput";
import ButtonManager from "./ButtonManager/ButtonManager";

export default function ImageBoxControls({
    allCards = [],
    currentCardId = null,
    isTour = false,
    params = {
        id: null,
        isTour: false,
        show: true,
        accentColor: "#1e88ec",
        title: "Message from Nimble",
        body: "We are releasing our brand new editor",
        position: "bottomLeft",
        backgroundImage:
            "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        videoUrl: "",
        action: "none",
        withLink: true,
        linkHref: "",
        linkText: "Learn more →",
        buttons: [],
    },
    onChange = () => {},
}) {
    const [currentParams, setcurrentParams] = useState(params);
    const [tab, settab] = useState("content");

    useEffect(() => {
        // Deep compare
        let newParamsFixed = {};
        const newLink = params.link;
        switch (params.action) {
            case "none":
                newLink.href = "";
                break;
            case "link":
                if (newLink.href === "") {
                    newLink.href = "https://www.google.com";
                }
                break;
            case "dismiss":
                newLink.href = "#";
                break;
            default:
                break;
        }

        newParamsFixed = {
            ...params,
            link: newLink,
            withLink: newLink && newLink.href !== "",
        };

        if (JSON.stringify(newParamsFixed) !== JSON.stringify(currentParams)) {
            setcurrentParams(newParamsFixed);
        }
    }, [params]);

    useEffect(() => {
        if (currentParams.messageType !== "imageBox") {
            return;
        }
        const newLink = currentParams.link;
        switch (currentParams.action) {
            case "none":
                newLink.href = "";
                break;
            case "link":
                if (newLink.href === "") {
                    newLink.href = "https://www.google.com";
                }
                break;
            case "dismiss":
                newLink.href = "#";
                break;
            default:
                break;
        }
        onChange({
            ...currentParams,
            link: newLink,
            withLink: newLink && newLink.href !== "",
        });
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
                    Content
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
                    Settings
                </div>
            </div>
            {tab === "content" ? 
            <>
            <p className="actionEditorLabel">Title</p>
            <InputSimple
                placeholder="Enter value"
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
                Body
            </p>
            <InputSimple
                placeholder="Enter value"
                textarea
                width="100%"
                value={currentParams.body}
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        body: data,
                    });
                }}
            />
            <p style={{ marginTop: "20px" }} className="actionEditorLabel">
                Background image
            </p>
            <InputSimple
                placeholder="Enter image URL"
                width="100%"
                value={currentParams.backgroundImage}
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        backgroundImage: data,
                    });
                }}
            />
            <hr className="actionEditorHr" />
            <ButtonManager
                isTour={isTour}
                allCards={allCards}
                currentCardId={currentCardId}
                value={currentParams.buttons}
                onChange={(data) => {
                    console.log(data);
                    setcurrentParams({
                        ...currentParams,
                        buttons: data,
                    });
                }}
            />
            <hr className="actionEditorHr" />
            <p style={{ marginTop: "20px" }} className="actionEditorLabel">
                Video URL
            </p>
            <InputSimple
                placeholder="Enter video URL"
                value={currentParams.videoUrl}
                width="100%"
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        videoUrl: data,
                    });
                }}
            />
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
            {isTour ? (
                <>
                    <hr className="actionEditorHr" style={{ marginTop: "15px" }} />
                    <p className="actionEditorLabel">Advance on</p>
                    <SelectSimple
                        placeholder="top"
                        values={[
                            {
                                value: "navigation",
                                name: "With navigation buttons",
                            },
                            { value: "none", name: "Through custom buttons" },
                        ]}
                        value={currentParams.advanceOn}
                        onChange={(data) => {
                            setcurrentParams({
                                ...currentParams,
                                advanceOn: data,
                            });
                        }}
                    />
                    {currentParams.advanceOn === "navigation" ? 
                    <>
                    <hr className="actionEditorHr" style={{ }} />
            <p style={{ marginTop: "20px" }} className="actionEditorLabel">
                Navigation button color
            </p>
            <ColorSelectorInput
                placeholder="Enter value"
                value={currentParams.accentColor}
                width="100%"
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        accentColor: data,
                    });
                }}
            />
                        <p style={{ marginTop: "10px" }} className="actionEditorLabel" />
                        <SwitchSimple
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        showNext: data,
                    });
                }}
                value={currentParams.showNext}
                text="Show next button"
            />
                        <p style={{ marginTop: "10px" }} className="actionEditorLabel" />
                        <SwitchSimple
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        showPrevious: data,
                    });
                }}
                value={currentParams.showPrevious}
                text="Show back button"
            />
                        <p style={{ marginTop: "10px" }} className="actionEditorLabel" />
                        <SwitchSimple
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        showSkip: data,
                    });
                }}
                value={currentParams.showSkip}
                text="Show skip button"
            />
                        <p style={{ marginTop: "10px" }} className="actionEditorLabel" />
                        <SwitchSimple
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        showDone: data,
                    });
                }}
                value={currentParams.showDone}
                text="Show done button"
            />
                    </>
                    :
                    <></>}
                </>
            ) : (
                <></>
            )}
            </>
            :
            <></>}
        </>
    );
}
