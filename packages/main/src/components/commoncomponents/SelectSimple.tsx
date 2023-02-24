import { useClickOutside } from "@doar/shared/hooks";
import React, { useState, FC, useCallback, useEffect } from "react";
import { usePopper } from "react-popper";

interface IValue {
    value: string | number;
    name?: string;
}

interface ISelectSimple {
    padding: string;
    width: string;
    height: string;
    value: string | number | null;
    values: IValue[];
    onChange: (s: string | number) => void;
}

export const SelectSimple: FC<ISelectSimple> = ({
    padding,
    width,
    height,
    value,
    values = [],
    onChange = (s: string | number) => {},
}) => {
    const [selectedValue, setSelectedValue] = useState(value);
    const [showSelector, setShowSelector] = useState(false);
    const closeSelector = useCallback(() => {
        setShowSelector(false);
    }, []);

    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: "bottom-start",
        modifiers: [
            {
                name: "offset",
                options: {
                    offset: [0, 10],
                },
            },
        ],
    });

    const containerRef = useClickOutside<HTMLDivElement>(closeSelector);

    const handleItemClick = (_value: string | number) => {
        setSelectedValue(_value);
        setShowSelector(false);
        onChange(_value);
    };

    const getValueName = (_value: string | number) => {
        const v = values.find((_v) => _v.value === _value);
        if (v && v.name) {
            return v.name;
        }
        return _value;
    };

    useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    return (
        <div 
        style={{width: width || "initial"}}
        ref={containerRef}>
            <div
                role="button"
                tabIndex={0}
                style={{
                    width: "100% !important",
                    padding,
                    height,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                }}
                className={`predicateSelectorSelect selectSimple${
                    showSelector ? " selected" : ""
                }`}
                onClick={() => {
                    setShowSelector(true);
                }}
            >
                {getValueName(selectedValue) || "Select..."}
            </div>

            <div ref={setReferenceElement}>
                {showSelector && values.length > 0 ? (
                    <div
                        ref={setPopperElement}
                        className="popperContainer"
                        style={styles.popper}
                        {...attributes.popper}
                    >
                        <div
                            className="predicateSelector noWidthLimit"
                            style={{
                                width: "auto",
                                height: "auto",
                                minWidth: "150px",
                                zIndex: 999,
                            }}
                        >
                            <div className="predicateSelectorItemsContainer"
                            style={{
                                "maxHeight": "400px",
                                "overflowY": "scroll"
                            }}
                            >
                                {values.map((av) => {
                                    return (
                                        <div
                                            key={av.value}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => {
                                                handleItemClick(av.value);
                                            }}
                                            className={`predicateSelectorItem ${
                                                av.value === selectedValue
                                                    ? "selected"
                                                    : ""
                                            }`}
                                        >
                                            <span>
                                                {av.name ? av.name : av.value}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};
