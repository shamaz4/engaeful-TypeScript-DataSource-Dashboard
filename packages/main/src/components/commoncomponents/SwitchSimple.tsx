import React, { useEffect, useState, FC } from "react";
import Switch from "react-switch";

interface ISwitchSimple {
    value: boolean;
    text: string;
    disabled?: boolean;
    onChange: (s: boolean) => void;
}

export const SwitchSimple: FC<ISwitchSimple> = ({
    value = true,
    disabled = false,
    text = "Turn on feature",
    onChange = () => {},
}) => {
    const [selectedValue, setSelectedValue] = useState(value);

    const handleChange = (_value: boolean) => {
        setSelectedValue(_value);
        onChange(_value);
    };

    useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <div>
                <Switch
                    disabled={disabled}
                    height={24}
                    width={52}
                    borderRadius={6}
                    handleDiameter={18}
                    onColor="#a69bfd"
                    activeBoxShadow="0 0 2px 3px #c2bded"
                    onChange={(data: boolean) => {
                        handleChange(data);
                    }}
                    checked={value}
                />
            </div>
            <div
                style={{
                    margin: "unset",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginLeft: "10px",
                    color: "#717171",
                }}
            >
                {text}
            </div>
        </div>
    );
};
