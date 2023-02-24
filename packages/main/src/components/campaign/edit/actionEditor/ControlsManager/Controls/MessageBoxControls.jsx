import React, { useEffect, useState } from "react";

import { InputSimple } from "../../../../../commoncomponents/InputSimple";
import { SelectSimple } from "../../../../../commoncomponents/SelectSimple";

export default function MessageBoxControls({
    params = {
        show: true,
        accentColor: "#1e88ec",
        title: "Message from Nimble",
        body: "We are releasing our brand new editor",
        position: "bottomLeft",
        withLink: true,
        linkHref: "",
        linkText: "Learn more →",
    },
    onChange = () => {},
}) {
    const [title, setTitle] = useState(params.title);
    const [body, setBody] = useState(params.body);
    const [position, setPosition] = useState(params.position);
    const [link, setLink] = useState(params.linkHref);
    const [linkText, setLinkText] = useState(params.linkText);

    useEffect(() => {
        onChange({
            title,
            body,
            position,
            withLink: link !== "",
            linkHref: link,
            linkText,
        });
    }, [title, body, position, link, linkText]);

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
                Body
            </p>
            <InputSimple
                placeholder="Enter value"
                width="100%"
                value={body}
                onChange={(data) => {
                    setBody(data);
                }}
            />
            <p style={{ marginTop: "20px" }} className="actionEditorLabel">
                Position
            </p>
            <SelectSimple
                placeholder="exactly"
                values={[
                    { value: "bottomLeft", name: "Bottom left" },
                    { value: "bottomRight", name: "Bottom right" },
                    { value: "topLeft", name: "Top left" },
                    { value: "topRight", name: "Top right" },
                ]}
                value={position}
                onChange={(data) => {
                    setPosition(data);
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
