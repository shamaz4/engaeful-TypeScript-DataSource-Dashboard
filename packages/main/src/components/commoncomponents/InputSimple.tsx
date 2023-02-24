import React, { useEffect, useState, FC } from "react";

interface IInputSimple {
    value: string;
    width: string;
    numeric: boolean;
    padding: string;
    centerText: boolean;
    margin: string;
    height: string;
    placeholder: string;
    readOnly: boolean;
    disabled: boolean;
    textarea: boolean;
    onChange: (s: string) => void;
}

export const InputSimple: FC<IInputSimple> = ({
    value = 1,
    width = "50px",
    height = "",
    padding = "",
    margin = "",
    numeric = false,
    readOnly = false,
    placeholder = "enter value...",
    centerText = false,
    disabled = false,
    textarea = false,
    onChange = () => {},
}) => {
    const [selectedValue, setSelectedValue] = useState(value);
    const [isDisabled, setIsDisabled] = useState(disabled);

    useEffect(() => {
        setIsDisabled(disabled);
    }, [disabled]);

    const handleChange = (_value: string) => {
        if (numeric) {
            if (_value === "0" || Number(_value)) {
                setSelectedValue(value);
                onChange(_value);
            }
            if (_value === "") {
                setSelectedValue("");
            }
        } else {
            setSelectedValue(_value);
            onChange(_value);
        }
    };

    useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    return textarea ? (
        <textarea
            style={{
                width,
                resize: "none",
                height: "100px",
                textAlign: centerText ? "center" : "start",
                padding,
                margin,
            }}
            disabled={isDisabled}
            className="predicateSelectorSearchBar"
            value={selectedValue}
            onChange={(event) => handleChange(event.target.value)}
            placeholder={placeholder}
        />
    ) : (
        <input
            type="text"
            disabled={isDisabled}
            readOnly={readOnly}
            className="predicateSelectorSearchBar"
            style={{
                width,
                textAlign: centerText ? "center" : "start",
                padding,
                height,
                margin,
            }}
            value={selectedValue}
            onChange={(event) => handleChange(event.target.value)}
            placeholder={placeholder}
        />
    );
};
