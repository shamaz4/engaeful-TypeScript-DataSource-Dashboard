/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-this-alias */
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "./Button";
import "./ButtonManager.css";

function ButtonManager({
    allCards = [],
    isTour = false,
    currentCardId = null,
    value = [],
    onChange = () => {},
}) {
    const [currentValue, setValue] = useState(value);
    useEffect(() => {
        if (JSON.stringify(currentValue) !== JSON.stringify(value)) {
            setValue(value);
        }
    }, [value]);

    const arrayMove = (arr, oldIndex, newIndex) => {
        if (newIndex >= arr.length) {
            let k = newIndex - arr.length + 1;
            // eslint-disable-next-line no-plusplus
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return arr;
    };

    const moveButton = (id, direction) => {
        let currentIndex = -1;
        currentValue.forEach((b, i) => {
            if (b.id === id) {
                currentIndex = i;
            }
        });

        const tempArray = currentValue;
        let newArray = null;

        if (direction === "up") {
            if (currentIndex === 0) {
                return;
            }
            newArray = arrayMove(tempArray, currentIndex, currentIndex - 1);
        } else if (direction === "down") {
            if (currentIndex === currentValue.length - 1) {
                return;
            }
            newArray = arrayMove(tempArray, currentIndex, currentIndex + 1);
        }
        console.log(tempArray);
        console.log(newArray);
        setValue(tempArray);
        onChange(tempArray);
    };

    const addButton = () => {
        const newId = uuidv4();
        setValue([
            ...currentValue,
            {
                id: newId,
                type: "link",
                config: {
                    href: "https://www.google.com",
                    newTab: true,
                    text: "Learn more",
                    dismissOnClick: true,
                    backgroundColor: "#111111",
                    style: "full",
                    primary: false,
                },
            },
        ]);
    };

    const deleteButton = (value) => {
        const newButtons = [];
        currentValue.forEach((b) => {
            if (b.id !== value.id) {
                newButtons.push(b);
            }
        });
        setValue(newButtons);
        onChange(newButtons);
    };

    const changeButton = (value) => {
        const newButtons = [];
        currentValue.forEach((b) => {
            if (b.id === value.id) {
                newButtons.push(value);
            } else {
                newButtons.push(b);
            }
        });
        setValue(newButtons);
        onChange(newButtons);
    };

    useEffect(() => {}, []);

    return (
        <>
            <div className="addButtonContainer">
                <p style={{ marginTop: "10px" }} className="actionEditorLabel">
                    Buttons
                </p>
                <p
                    className="addButtonText"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                        addButton();
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Add button
                </p>
            </div>
            {currentValue.length === 0 ? (
                <div className="noButtonsAdded">
                    Add buttons for this message with specific actions
                </div>
            ) : (
                currentValue.map((button) => {
                    return (
                        <Button
                            isTour={isTour}
                            allCards={allCards}
                            currentCardId={currentCardId}
                            key={button.id}
                            value={button}
                            onChange={changeButton}
                            onDelete={deleteButton}
                            onMove={moveButton}
                        />
                    );
                })
            )}
        </>
    );
}

export default ButtonManager;
