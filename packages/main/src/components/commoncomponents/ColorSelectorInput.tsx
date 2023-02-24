import { useClickOutside, useDebounce } from "@doar/shared/hooks";
import React, { useEffect, useState, FC, useCallback } from "react";
import { ColorResult, ChromePicker } from "react-color";

interface IColorSelectorInput {
    value: string;
    disabled: boolean;
    onChange: (s: string) => void;
}

export const ColorSelectorInput: FC<IColorSelectorInput> = ({
    value = "#4B4B4B",
    disabled = false,
    onChange = () => {},
}) => {
    const [selectedValue, setSelectedValue] = useState(value);
    const debouncedValue = useDebounce<string>(selectedValue, 200);
    const [isDisabled, setIsDisabled] = useState(disabled);
    const [pickerOpen, setPickerOpen] = useState(false);
    const closeSelector = useCallback(() => {
        setPickerOpen(false);
        setIsDisabled(false);
    }, []);
    const containerRef = useClickOutside<HTMLDivElement>(closeSelector);

    useEffect(() => {
        onChange(debouncedValue);
    }, [debouncedValue]);

    useEffect(() => {
        setIsDisabled(disabled);
    }, [disabled]);

    const handleChange = (_value: ColorResult) => {
        setSelectedValue(_value.hex);
    };

    const handleFocus = () => {
        setPickerOpen(true);
        setIsDisabled(true);
    };

    return (
        <div ref={containerRef}>
            <input
                type="text"
                onFocus={handleFocus}
                className={`predicateSelectorSearchBar ${
                    pickerOpen ? "isFocused" : ""
                }`}
                onChange={(d) => {
                    setSelectedValue(d.target.value);
                }}
                style={{ width: "100%" }}
                value={selectedValue}
            />
            {pickerOpen ? (
                <div
                    style={{
                        marginTop: "-275px",
                        position: "absolute",
                    }}
                >
                    <ChromePicker
                        disableAlpha
                        color={selectedValue}
                        onChange={handleChange}
                        onChangeComplete={handleChange}
                    />
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};
