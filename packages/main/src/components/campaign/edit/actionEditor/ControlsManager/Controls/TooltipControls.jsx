/* eslint-disable no-nested-ternary */
/* global chrome */
import React, { useEffect, useState } from "react";
import { Crosshair, Target } from "react-feather";

import { InputSimple } from "../../../../../commoncomponents/InputSimple";
import { SelectSimple } from "../../../../../commoncomponents/SelectSimple";
import { SwitchSimple } from "../../../../../commoncomponents/SwitchSimple";
import { ColorSelectorInput } from "../../../../../commoncomponents/ColorSelectorInput";
import ButtonManager from "./ButtonManager/ButtonManager";

export default function TooltipControls({
    allCards= [],
    currentCardId = null,
    isTour = false,
    params = {
        show: true,
        messageType: "toolTip",
        id: 2,
        title: "#### Message from App\nhere you can change the shipping.",
        position: "top",
        advanceOn: "navigation",
        showModal: true,
        hideBack: true,
        accentColor: "#4b4b4b",
        attachTo: "",
        buttons: [],
    },
    onChange = () => {},
}) {
    const [currentParams, setcurrentParams] = useState(params);
const [tab, settab] = useState("content");
    useEffect(() => {
        onChange(currentParams);
    }, [currentParams]);

    useEffect(() => {
        // Deep compare
        if (JSON.stringify(params) !== JSON.stringify(currentParams)) {
            setcurrentParams(params);
        }
    }, [params]);

    useEffect(() => {
    }, [])

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
                textarea
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
            <hr className="actionEditorHr" />
            <ButtonManager
                allCards={allCards}
                isTour={isTour}
                currentCardId={currentCardId}
                value={currentParams.buttons}
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        buttons: data,
                    });
                }}
            />
            </>
            : 
            tab === "settings" ? 
            <>
            <p className="actionEditorLabel">Position</p>
            <SelectSimple
                placeholder="top"
                values={[
                    { value: "top-start", name: "Top start" },
                    { value: "top", name: "Top" },
                    { value: "top-end", name: "Top end" },
                    { value: "left-start", name: "Left start" },
                    { value: "left", name: "Left" },
                    { value: "left-end", name: "Left end" },
                    { value: "bottom-start", name: "Bottom start" },
                    { value: "bottom", name: "Bottom" },
                    { value: "bottom-end", name: "Bottom end" },
                    { value: "right-start", name: "Right start" },
                    { value: "right", name: "Right" },
                    { value: "right-end", name: "Right end" },
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
                Attach to target
            </p>
            <InputSimple
                placeholder="Selector of element"
                id="targetSelector"
                width="100%"
                value={currentParams.attachTo}
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        attachTo: data,
                    });
                }}
            />
            <div
                role="button"
                tabIndex={0}
                onClick={() => {
                    const url = prompt("Enter URL where element is in");
                    let finalUrl = "";
                    try {
                        finalUrl = new URL(url);
                    }
                    catch (e) {
                        alert("Invalid URL!");
                        return;
                    }
                    finalUrl.searchParams.append('engagefulDisable', true);
                    chrome.runtime.sendMessage(
                        "fjkffankedmafdoiehfbgclmhapnicdm",
                        {
                            message: "pickElement",
                            messageParameters: {
                                url: finalUrl
                            },
                        },
                        (response) => {
                            const { lastError } = chrome.runtime;
                            if (lastError) {
                                // No chrome extension
                                console.log(lastError.message)
                                console.log("Download chrome extension")
                            } else {
                                setcurrentParams({
                                    ...currentParams,
                                    attachTo: response,
                                });
                                console.log("Hmm?")
                            }
                        }
                    );
                }}
                style={{
                    cursor: "pointer",
                    display: "inline-flex",
                    padding: "2px",
                    background: "white",
                    position: "absolute",
                    marginLeft: "-36px",
                    marginTop: "6px",
                    borderRadius: "4px",
                    color: "gray",
                }}
            >
                <Crosshair />
            </div>
            {/*
             */}
            <p style={{ marginTop: "10px" }} className="actionEditorLabel" />
            <SwitchSimple
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        showModal: data,
                    });
                }}
                value={currentParams.showModal}
                text="Highlight element"
            />
            <hr className="actionEditorHr" />
            <p className="actionEditorLabel">Advance on</p>
            <SelectSimple
                placeholder="top"
                values={[
                    { value: "navigation", name: "With navigation buttons" },
                    { value: "elementClick", name: "When target element is clicked" },
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
                                {currentParams.advanceOn === "none" ? 
                    <>
            <p style={{ marginTop: "20px" }} className="actionEditorLabel" />
                        <SwitchSimple
                onChange={(data) => {
                    setcurrentParams({
                        ...currentParams,
                        interactable: data,
                    });
                }}
                value={currentParams.interactable}
                text="Allow target interactions"
            />
            </>
            : <></>}
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
            : <></>}
        </>
    );
}
