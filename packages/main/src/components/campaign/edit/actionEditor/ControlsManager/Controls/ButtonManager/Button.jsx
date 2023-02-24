/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-this-alias */
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Trash, Trash2 } from "react-feather";
import { SelectSimple } from "../../../../../../commoncomponents/SelectSimple";
import { InputSimple } from "../../../../../../commoncomponents/InputSimple";
import { SwitchSimple } from "../../../../../../commoncomponents/SwitchSimple";
import { ColorSelectorInput } from "../../../../../../commoncomponents/ColorSelectorInput";
import "./ButtonManager.css";

function Button({
    allCards = [],
    currentCardId = null,
    isTour = false,
    value,
    onDelete = () => {},
    onChange = () => {},
    onMove = () => {},
}) {
    const [currentValue, setValue] = useState(value);
    const [oldValue, setoldValue] = useState(value);
    const [edit, setedit] = useState(false);

    const handleChange = () => {
        onChange("changed!");
    };

    useEffect(() => {
        onChange(currentValue);
    }, [currentValue]);

    return (
        <>
            {edit ? (
                <div
                    className="predicateSelectorSelect buttonItemUnedit"
                    style={{
                        display: edit ? "block" : "flex",
                    }}
                >
                    <div
                        style={{
                            marginTop: "0px",
                            display: "flex",
                            alignItems: "center",
                        }}
                        className="actionEditorLabel"
                    >
                        Action
                        <div
                            className="moveUpOrDown"
                            style={{
                                marginLeft: "auto",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Trash2
                                title="Delete"
                                size={14}
                                onClick={() => {
                                    if (
                                        confirm(
                                            "Are you sure you want to delete this button?"
                                        )
                                    ) {
                                        onDelete(currentValue);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <SelectSimple
                        placeholder="exactly"
                        values={
                            isTour
                                ? [
                                      { value: "jumpToStep", name: "Go to step" },
                                      {
                                          value: "link",
                                          name: "Navigate to page",
                                      },
                                      { value: "eval", name: "Run JS code" },
                                      {
                                          value: "dismiss",
                                          name: "Dismiss message",
                                      },
                                  ]
                                : [
                                      {
                                          value: "link",
                                          name: "Navigate to page",
                                      },
                                      { value: "eval", name: "Run JS code" },
                                      {
                                          value: "dismiss",
                                          name: "Dismiss message",
                                      },
                                  ]
                        }
                        value={currentValue.type}
                        onChange={(data) => {
                            setValue({
                                ...currentValue,
                                type: data,
                            });
                        }}
                    />

                    <p
                        style={{ marginTop: "20px" }}
                        className="actionEditorLabel"
                    >
                        Button text
                    </p>
                    <InputSimple
                        placeholder="Enter value"
                        value={currentValue.config.text}
                        width="100%"
                        onChange={(data) => {
                            setValue({
                                ...currentValue,
                                config: {
                                    ...currentValue.config,
                                    text: data,
                                },
                            });
                        }}
                    />
                    <p
                        style={{ marginTop: "20px" }}
                        className="actionEditorLabel"
                    >
                        Button color
                    </p>
                    <ColorSelectorInput
                        placeholder="Enter value"
                        value={currentValue.config.backgroundColor}
                        width="100%"
                        onChange={(data) => {
                            setValue({
                                ...currentValue,
                                config: {
                                    ...currentValue.config,
                                    backgroundColor: data,
                                },
                            });
                        }}
                    />
                    <p
                        style={{ marginTop: "10px" }}
                        className="actionEditorLabel"
                    />
                    <SwitchSimple
                        onChange={(data) => {
                            setValue({
                                ...currentValue,
                                config: {
                                    ...currentValue.config,
                                    primary: data,
                                },
                            });
                        }}
                        value={currentValue.config.primary}
                        text="Primary button"
                    />
                    {currentValue.type === "jumpToStep" ? (
                        <>
                            <hr
                                className="actionEditorHr"
                                style={{
                                    marginTop: "15px",
                                    marginBottom: "-10px",
                                }}
                            />
                            <p
                                style={{ marginTop: "20px" }}
                                className="actionEditorLabel"
                            >
                                Step
                            </p>
                            <SelectSimple
                                placeholder="exactly"
                                values={allCards
                                    .map((i, k) => {
                                        return {
                                            value: i.id,
                                            name: i.stepName
                                                ? 
                                                 `${(
                                                      k + 1
                                                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                                  ).toString()}. ${i ? i.stepName : ""}`
                                                : `${(
                                                      k + 1
                                                  ).toString()}. Unnamed step`,
                                        };
                                    })
                                    .filter((i) => i.value !== currentCardId)}
                                value={
                                    currentValue.config.toStep
                                        ? currentValue.config.toStep
                                        : null
                                }
                                onChange={(data) => {
                                    setValue({
                                        ...currentValue,
                                        config: {
                                            ...currentValue.config,
                                            toStep: data,
                                        },
                                    });
                                }}
                            />
                        </>
                    ) : (
                        <></>
                    )}

{currentValue.type === "eval" ? (
                        <>
                            <hr
                                className="actionEditorHr"
                                style={{
                                    marginTop: "15px",
                                    marginBottom: "",
                                }}
                            />
                            <p
                            style={{color: "#9f9f9f"}}
                            >This code will be run as-is in the user&apos;s browser when this button is pressed. </p>
                            <p
                                className="actionEditorLabel"
                            >
                                Javascript code
                            </p>
                            <InputSimple
                                placeholder="console.log('hello world!')"
                                textarea
                                width="100%"
                                value={currentValue.config.eval}
                                onChange={(data) => {
                                    setValue({
                                        ...currentValue,
                                        config: {
                                            ...currentValue.config,
                                            eval: data,
                                        },
                                    });
                                }}
                            />
                            </>
                    ) : (
                        <></>
                    )}


                    {currentValue.type === "link" ? (
                        <>
                            <hr
                                className="actionEditorHr"
                                style={{
                                    marginTop: "15px",
                                    marginBottom: "-10px",
                                }}
                            />
                            <p
                                style={{ marginTop: "20px" }}
                                className="actionEditorLabel"
                            >
                                Link
                            </p>
                            <InputSimple
                                placeholder="Enter URL"
                                width="100%"
                                value={currentValue.config.href}
                                onChange={(data) => {
                                    setValue({
                                        ...currentValue,
                                        config: {
                                            ...currentValue.config,
                                            href: data,
                                        },
                                    });
                                }}
                            />
                            <>
                                <p
                                    style={{ marginTop: "20px" }}
                                    className="actionEditorLabel"
                                />
                                <SwitchSimple
                                    onChange={(data) => {
                                        setValue({
                                            ...currentValue,
                                            config: {
                                                ...currentValue.config,
                                                newTab: data,
                                            },
                                        });
                                    }}
                                    value={currentValue.config.newTab}
                                    text="Open link in new tab"
                                />
                                <p
                                    style={{ marginTop: "10px" }}
                                    className="actionEditorLabel"
                                />
                                <SwitchSimple
                                    onChange={(data) => {
                                        setValue({
                                            ...currentValue,
                                            config: {
                                                ...currentValue.config,
                                                dismissOnClick: data,
                                            },
                                        });
                                    }}
                                    value={currentValue.config.dismissOnClick}
                                    text="Dismiss message on click"
                                />
                            </>
                        </>
                    ) : (
                        <></>
                    )}

                    <div
                        className="callToActions"
                        style={{
                            marginTop: "10px",
                            display: "flex",
                        }}
                    >
                        <span
                            role="button"
                            tabIndex={0}
                            style={{
                                marginLeft: "auto",
                            }}
                            onClick={() => {
                                setValue(oldValue);
                                setedit(false);
                            }}
                            className="secondary"
                        >
                            Cancel
                        </span>
                        <span
                            className="primary"
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                                setedit(false);
                            }}
                        >
                            Done
                        </span>
                    </div>
                </div>
            ) : (
                <>
                    <div
                        role="button"
                        tabIndex="0"
                        className="predicateSelectorSelect buttonItemUnedit"
                        style={{
                            justifyContent: "space-between"
                        }}
                    >
                        <svg
                            style={{ cursor: "grab", display: "none" }}
                            width="16px"
                            height="16px"
                            viewBox="0 0 48 48"
                            fill="gray"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect
                                width="48"
                                height="48"
                                fill="white"
                                fillOpacity="0.01"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M19 10.3075C19 12.6865 17.2091 14.615 15 14.615C12.7909 14.615 11 12.6865 11 10.3075C11 7.92854 12.7909 6 15 6C17.2091 6 19 7.92854 19 10.3075ZM15 28.615C17.2091 28.615 19 26.6865 19 24.3075C19 21.9285 17.2091 20 15 20C12.7909 20 11 21.9285 11 24.3075C11 26.6865 12.7909 28.615 15 28.615ZM15 42.615C17.2091 42.615 19 40.6865 19 38.3075C19 35.9285 17.2091 34 15 34C12.7909 34 11 35.9285 11 38.3075C11 40.6865 12.7909 42.615 15 42.615Z"
                                fill="gray"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M37 10.3075C37 12.6865 35.2091 14.615 33 14.615C30.7909 14.615 29 12.6865 29 10.3075C29 7.92854 30.7909 6 33 6C35.2091 6 37 7.92854 37 10.3075ZM33 28.615C35.2091 28.615 37 26.6865 37 24.3075C37 21.9285 35.2091 20 33 20C30.7909 20 29 21.9285 29 24.3075C29 26.6865 30.7909 28.615 33 28.615ZM33 42.615C35.2091 42.615 37 40.6865 37 38.3075C37 35.9285 35.2091 34 33 34C30.7909 34 29 35.9285 29 38.3075C29 40.6865 30.7909 42.615 33 42.615Z"
                                fill="gray"
                            />
                        </svg>
                        <span style={{ marginLeft: "10px" }}>
                            {currentValue.config.text}
                        </span>
                        <div
                        style={{
                            display: "flex",
                            alignItems: "center"
                        }}
                        >
                            <ChevronUp
                            style={{
                                cursor: "pointer"
                            }}
                            onClick={() => {
                                onMove(currentValue ? currentValue.id : null, "up")
                            }}
                            title="Move down" size={18} />
                        <ChevronDown
                            style={{
                                cursor: "pointer"
                            }}
                            onClick={() => {
                                onMove(currentValue ? currentValue.id : null, "down")
                            }}
                            title="Move up" size={18} />
                        <span
                            onClick={() => {
                                setoldValue(currentValue);
                                setedit(true);
                            }}
                            style={{
                                marginLeft: "5px"
                            }}
                            role="button"
                            tabIndex={0}
                            className="editText"
                        >
                            Edit
                        </span>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Button;
