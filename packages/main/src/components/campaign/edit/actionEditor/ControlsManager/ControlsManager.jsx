/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/naming-convention */
import { FC, useReducer, useState, useEffect } from "react";
import ImageBoxControls from "./Controls/ImageBoxControls";
import MessageBoxControls from "./Controls/MessageBoxControls";
import ModalBoxControls from "./Controls/ModalBoxControls";
import AnnouncementBarControls from "./Controls/AnnouncementBarControls";
import TooltipControls from "./Controls/TooltipControls";
import EmailControls from "./Controls/EmailControls";
import SlackControls from "./Controls/SlackControls";

export default function ControlsManager({
    action = "announcementbar",
    isTour = false,
    allCards = [],
    params = {
        show: true,
        accentColor: "#1e88ec",
        title: "Message from Nimble",
        body: "We are releasing our brand new editor",
        position: "bottomLeft",
        withLink: true,
        linkText: "Learn more →",
    },
    onChange = (a) => {},
}) {
    const [show, setshow] = useState(false);
    const [selectedParams, setselectedParams] = useState(params);
    const [selectedAction, setselectedAction] = useState(action);

    const handleChange = (data) => {
        onChange({
            ...params,
            ...data,
        });
    };

    useEffect(() => {
        setselectedParams(params);
        setselectedAction(
            params.messageType ? params.messageType.toLowerCase() : action
        );
    }, [params]);

    return (
        <>
            {selectedAction === "tooltip" ? (
                <TooltipControls
                    allCards={allCards}
                    currentCardId={selectedParams.id}
                    isTour={isTour}
                    params={selectedParams}
                    onChange={handleChange}
                />
            ) : selectedAction === "announcementbar" ? (
                <AnnouncementBarControls
                    params={params}
                    onChange={handleChange}
                />
            ) : selectedAction === "imagebox" ? (
                <ImageBoxControls
                    allCards={allCards}
                    currentCardId={selectedParams.id}
                    isTour={isTour}
                    params={selectedParams}
                    onChange={handleChange}
                />
            ) : selectedAction === "email" ? (
                <EmailControls
                    params={selectedParams}
                    onChange={handleChange}
                />
            ) : selectedAction === "slack" ? (
                    <SlackControls
                        params={selectedParams}
                        onChange={handleChange}
                    />
            ) : (
                <></>
            )}
        </>
    );
}
