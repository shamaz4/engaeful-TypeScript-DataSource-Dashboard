import { useClickOutside } from "@doar/shared/hooks";
import React, { useEffect, useState, useRef, FC, useCallback } from "react";
import { Filter } from "react-feather";

interface ISelectSimpleMulti {
    value: Array<string>;
    values: Array<string>;
    onChange: () => any;
    onClose: () => any;
}

export const SelectSimpleMulti: FC<ISelectSimpleMulti> = ({
    value,
    values = [],
    onChange = (s: Array<string>) => {},
    onClose = () => {},
}) => {
    const [selectedValue, setSelectedValue] = useState<Array<string>>(value);
    const [availableValues, setAvailableValues] = useState<Array<string>>(
        values
    );
    const [showSelector, setShowSelector] = useState(false);

    const closeSelector = useCallback(() => {
        setShowSelector(false);
        onClose();
    }, []);
    const containerRef = useClickOutside<HTMLDivElement>(closeSelector);

    const handleItemClick = (_value: string) => {
        let newValues = [];
        if (selectedValue.includes(_value)) {
            newValues = selectedValue.filter(function (item) {
                return item !== _value;
            });
            setSelectedValue(newValues);
        } else {
            newValues = [...selectedValue, _value];
            setSelectedValue(newValues);
        }
        onChange(newValues);
    };

    return (
        <div ref={containerRef}>
            <Filter
                style={{
                    cursor: "pointer",
                    color: showSelector ? "rgb(120 107 222)" : "gray",
                    background: showSelector ? "#f3f3f3" : "",
                    borderRadius: "4px",
                    marginTop: "5px",
                    padding: "2px",
                }}
                onClick={() => {
                    setShowSelector(true);
                }}
            />
            {showSelector && values.length > 0 ? (
                <div
                    className="predicateSelector"
                    style={{
                        width: "auto",
                        height: "auto",
                        minWidth: "150px",
                        zIndex: 999,
                    }}
                >
                    <div className="predicateSelectorItemsContainer">
                        {values.map((av, i) => {
                            return (
                                <div
                                    key={av}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => {
                                        handleItemClick(av);
                                    }}
                                    style={{
                                        backgroundPosition: "96% 12px",
                                        backgroundRepeat: "no-repeat",
                                        backgroundImage: selectedValue.includes(
                                            av
                                        )
                                            ? "url('/images/checkmark.svg')"
                                            : "",
                                    }}
                                    className={`predicateSelectorItem ${
                                        selectedValue.includes(av)
                                            ? "selectedMulti"
                                            : ""
                                    }`}
                                >
                                    <span>{av}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};
