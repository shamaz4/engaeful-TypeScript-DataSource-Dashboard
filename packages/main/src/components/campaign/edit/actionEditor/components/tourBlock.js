/* eslint-disable no-constant-condition */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable no-nested-ternary */

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "react-feather";
import { useHover } from "@doar/shared/hooks";

/* eslint-disable react/jsx-filename-extension */
export default function TourBlock({
    c = {},
    index = 0,
    totalLength = 0,
    active = false,
    onClick = () => {},
    onChange = () => {},
    onDelete = () => {},
    onMove = () => {}
}) {
    const [card, setcard] = useState(c);
    const hoverRef = useRef(null);
    const isHover = useHover(hoverRef);
    

    const changeName= () => {
        onChange(c);
    }

    useEffect(() => {
        setcard(c);
    }, [c]);

    return (
        <>
            <div
                onClick={(e) => {
                    // Needs rework
                    // Determine if we click on the actual SVG icon
                    let onSvg = false;
                    e.nativeEvent.path.forEach((el) => {
                        if (el.classList && el.classList.contains("deleteButton")) {
                            onSvg = true;
                        }
                    });
                    if (!onSvg) {
                        onClick();
                    }
                }}
                role="button"
                ref={hoverRef}
                className={`tourBlock ${active ? "active" : ""}`}
            >
                {isHover ? (
                    <div style={{
                        position: "relative"
                    }}
                    >
                        <ChevronLeft 
                        onClick={() => {
                            onMove(card.id, "left");
                        }}
                        className="deleteButton"
                        style={{
                            width: "16px",
                            top: "-8px",
                            right: "55px",
                            position: "absolute",
                            display: "flex",
                            justifyContent: "center",
                            color: "rgb(102 102 102)",
                        }}
                        />
                        <ChevronRight 
                        onClick={() => {
                            onMove(card.id, "right");
                        }}
                        className="deleteButton"
                        style={{
                            width: "16px",
                            top: "-8px",
                            right: "35px",
                            position: "absolute",
                            display: "flex",
                            justifyContent: "center",
                            color: "rgb(102 102 102)",
                        }}
                        />
                    <Trash2
                        className="deleteButton"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this step?"))
                            {
                                onDelete();
                            }
                        }}
                        style={{
                            width: "16px",
                            top: "-8px",
                            left: "50px",
                            position: "absolute",
                            display: "flex",
                            justifyContent: "center",
                            color: "#ffb2b2",
                        }}
                    />
                    </div>
                ) : (
                    <></>
                )}
                {card.messageType === "toolTip" ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                            width: "24px",
                            marginBottom: "5px",
                        }}
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#c1c1c1"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                    </svg>
                ) : card.messageType === "imageBox" ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        style={{
                            width: "24px",
                            marginBottom: "5px",
                        }}
                        viewBox="0 0 24 24"
                        stroke="#c1c1c1"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                ) : (
                    <></>
                )}
                <div style={{ display: "flex", alignItems: "center" }}>
                    {(index + 1).toString()}.{" "}
                    <input
                        onChange={(data) => {
                            setcard({
                                ...card,
                                stepName: data.target.value,
                            });
                            onChange({
                                ...card,
                                stepName: data.target.value,
                            })
                        }}
                        className="blockInput"
                        style={{
                            marginLeft: "5px",
                            padding: "5px",
                            height: "unset",
                        }}
                        type="text"
                        value={
                            card.stepName
                                ? card.stepName
                                : card.stepName === ""
                                ? ""
                                : "Unnamed step"
                        }
                    />
                </div>
            </div>
            {index < totalLength ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: "2px",
                        marginRight: "2px",
                    }}
                >
                    <div
                        style={{
                            width: "8px",
                            height: "2px",
                            display: "block",
                            background: "#d1d1d1",
                            marginRight: "2px",
                            marginLeft: "2px",
                        }}
                    />
                    {card.advanceOn === "navigation" || card.advanceOn === "none" ? (
                        <svg
                            className=""
                            width={16}
                            height={16}
                            viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="grey"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M2 4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2zm7 2l3 2.5L9 11V9H4V8h5V6z"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="interface-icon o__standard o__standard__click-element o__palette-gray"
                            width="16"
                            height="16"
                            fill="gray"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M9.14 1.169a.7.7 0 0 0-1.339-.41l-.537 1.758a.7.7 0 0 0 1.338.41l.538-1.758zm-5.3.671a.7.7 0 0 1 1.236-.657l.94 1.766a.7.7 0 1 1-1.237.657L3.84 1.84zm8.44 1.176a.7.7 0 0 0-.947-.29l-1.766.94a.7.7 0 0 0 .657 1.235l1.766-.938a.7.7 0 0 0 .29-.947zM1.556 5.201a.7.7 0 0 1 .409-1.338l1.758.537a.7.7 0 1 1-.41 1.339L1.557 5.2zm-.225 3.636a.7.7 0 0 1 .29-.946l1.766-.94a.7.7 0 1 1 .657 1.237l-1.766.939a.7.7 0 0 1-.947-.29zm4.667-3.269c0-.457.508-.73.89-.479l6.82 4.497a.574.574 0 0 1-.194 1.04l-2.753.603 1.844 3.414a.573.573 0 0 1-.234.777l-.758.408a.574.574 0 0 1-.777-.233l-1.844-3.413-2.02 1.966a.574.574 0 0 1-.974-.41v-8.17z" />
                        </svg>
                    )}
                    <div
                        style={{
                            width: "8px",
                            height: "2px",
                            display: "block",
                            background: "#d1d1d1",
                            marginRight: "2px",
                            marginLeft: "2px",
                        }}
                    />
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
