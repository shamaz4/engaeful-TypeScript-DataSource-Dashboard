/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from "react";

import { InputSimple } from "../../../../../commoncomponents/InputSimple";
import { SelectSimple } from "../../../../../commoncomponents/SelectSimple";
import QuillEditor from "./QuillEditor/QuillEditor";

export default function ModalBoxControls({
    params = {
        cards: [],
    },
    onChange = () => {},
}) {
    const [cards, setCards] = useState(params.cards);

    useEffect(() => {
        onChange({
            cards,
        });
    }, [cards]);

    const handleCardsChange = (data) => {
        const tempCards = cards;
        tempCards[0] = data;
        setCards(tempCards);
    };

    return (
        <>
            <div
                className=""
                style={{
                    marginLeft: "auto",
                    width: "100%",
                    background: "#f5f5f5",
                    padding: "60px 20px",
                }}
            >
                <div
                    className="engagefulModalBox"
                    style={{
                        position: "relative !important",
                    }}
                >
                    <QuillEditor
                        onChange={handleCardsChange}
                        value={params.cards[0]}
                    />
                    <div className="poweredBy">
                        Sent with <a href="#">Engageful</a>
                    </div>
                </div>
            </div>
        </>
    );
}
