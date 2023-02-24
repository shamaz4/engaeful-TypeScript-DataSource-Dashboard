import React, { useEffect, useState } from "react";

import { InputSimple } from "../../../../../commoncomponents/InputSimple";
import { SelectSimple } from "../../../../../commoncomponents/SelectSimple";
import { ColorSelectorInput } from "../../../../../commoncomponents/ColorSelectorInput";

export default function AnnouncementBarControls({
    params = {
        show: true,
        accentColor: "#1e88ec",
        title: "Message from Nimble",
        body: "We are releasing our brand new editor",
        position: "bottom",
        variant: "floating",
        withLink: true,
        linkHref: "",
        linkText: "Learn more →",
    },
    onChange = () => {},
}) {
    const [title, setTitle] = useState(params.title);
    const [body, setBody] = useState(params.body);
    const [variant, setVariant] = useState(params.variant);
    const [position, setPosition] = useState(params.position);
    const [link, setLink] = useState(params.linkHref);
    const [backgroundColor, setBackgroundColor] = useState(
        params.backgroundColor
    );
    const [secondaryBackgroundColor, setSecondaryBackgroundColor] = useState(
        params.secondaryBackgroundColor
    );
    const [linkText, setLinkText] = useState(params.linkText);

    useEffect(() => {
        onChange({
            text: title,
            body,
            position,
            variant,
            backgroundColor,
            secondaryBackgroundColor,
            withLink: link !== "",
            linkHref: link,
            linkText,
        });
    }, [
        title,
        body,
        variant,
        position,
        link,
        linkText,
        backgroundColor,
        secondaryBackgroundColor,
    ]);

    return (
        <>
            <p className="actionEditorLabel">Title</p>
            <InputSimple
                placeholder="Enter value"
                width="100%"
                value={title}
                onChange={(data) => {
                    setTitle(data);
                }}
            />
            <p style={{ marginTop: "20px" }} className="actionEditorLabel">
                Bar type
            </p>
            <SelectSimple
                placeholder="floating"
                values={[
                    { value: "floating", name: "Floating" },
                    { value: "full", name: "Full" },
                ]}
                value={variant}
                onChange={(data) => {
                    setVariant(data);
                }}
            />
            <p style={{ marginTop: "20px" }} className="actionEditorLabel">
                Position
            </p>
            <SelectSimple
                placeholder="exactly"
                values={[
                    { value: "bottom", name: "Bottom" },
                    { value: "top", name: "Top" },
                ]}
                value={position}
                onChange={(data) => {
                    setPosition(data);
                }}
            />
            <hr className="actionEditorHr" />
            <p style={{ marginTop: "20px" }} className="actionEditorLabel">
                Background color
            </p>
            <ColorSelectorInput
                placeholder="Enter value"
                value={backgroundColor}
                width="100%"
                onChange={(data) => {
                    setBackgroundColor(data);
                }}
            />
            <p style={{ marginTop: "20px" }} className="actionEditorLabel">
                Secondary color
            </p>
            <ColorSelectorInput
                placeholder="Enter value"
                value={secondaryBackgroundColor}
                width="100%"
                onChange={(data) => {
                    setSecondaryBackgroundColor(data);
                }}
            />
            <hr className="actionEditorHr" />
            <p style={{ marginTop: "20px" }} className="actionEditorLabel">
                Link
            </p>
            <InputSimple
                placeholder="Enter value (Leave empty to disable)"
                width="100%"
                value={link}
                onChange={(data) => {
                    setLink(data);
                }}
            />
            <p style={{ marginTop: "20px" }} className="actionEditorLabel">
                Link text
            </p>
            <InputSimple
                disabled={link === ""}
                placeholder="Enter value"
                value={linkText}
                width="100%"
                onChange={(data) => {
                    setLinkText(data);
                }}
            />
        </>
    );
}
