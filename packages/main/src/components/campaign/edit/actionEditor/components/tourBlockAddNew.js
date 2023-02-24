/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-filename-extension */
import { FC, useState, useEffect, useReducer } from "react";

export default function TourBlockAddNew({ onClick = () => {} }) {
    const [showbuttons, setshowbuttons] = useState(false);
    const [text, settext] = useState("Cancel");
    return (
        <>
            {!showbuttons ? (
                <div
                    className="tourBlock"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                        setshowbuttons(true);
                    }}
                    style={{
                        background: "#f3f3f3",
                        color: "#4e4e4e",
                        width: "100%",
                        display: "block",
                        padding: "10px 20px",
                        textAlign: "center",
                    }}
                >
                    Add step
                </div>
            ) : (
                <>
                    <div
                        role="button"
                        tabIndex={0}
                        style={{ minWidth: "150px", textAlign: "center" }}
                    >
                        <div
                            role="button"
                            tabIndex={0}
                            style={{
                                minWidth: "150px",
                                textAlign: "center",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-evenly",
                            }}
                        >
                            <div
                            role="button"
                            tabIndex={0}
                                onClick={() => {
                                    onClick("modal");
                                    setshowbuttons(false);
                                }}
                                onMouseOver={() => {
                                    settext("New modal");
                                }}
                                onMouseOut={() => {
                                    settext("Cancel");
                                }}
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "50%",
                                    background: "rgb(255, 255, 255)",
                                    border: "1px solid rgb(239, 239, 239)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                                className="addNewTourBlockSymbol"
                            >
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
                            </div>
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "50%",
                                    background: "rgb(255, 255, 255)",
                                    border: "1px solid rgb(239, 239, 239)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                                className="addNewTourBlockSymbol"
                                role="button"
                                tabIndex={0}
                                    onClick={() => {
                                        onClick("tooltip");
                                    setshowbuttons(false);
                                    }}
                                onMouseOver={() => {
                                    settext("New tooltip");
                                }}
                                onMouseOut={() => {
                                    settext("Cancel");
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="#c1c1c1"
                                    style={{ width: "24px" }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div 
                        onClick={() => {
                            setshowbuttons(false)
                        }}
                        role="button"
                        tabIndex={0}
                        style={{
                            color: text !== "Cancel" ? "#a69bfd" : "initial",
                            fontWeight: text !== "Cancel" ? "500" : "initial",
                            marginTop: "10px", cursor: "pointer"}}>{text}</div>
                    </div>
                </>
            )}
        </>
    );
}
