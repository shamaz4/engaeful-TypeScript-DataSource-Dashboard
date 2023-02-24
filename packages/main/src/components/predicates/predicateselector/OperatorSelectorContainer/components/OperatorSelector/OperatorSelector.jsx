/* eslint-disable no-constant-condition */
/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-lonely-if */

import React, { useEffect, useState, useRef } from 'react';

const PredicateSelectorItem = ({ value, symbol, title, clickHandler, selected }) => {
    return (
        <div role="button" tabIndex="0" className={"predicateSelectorItem " + (selected ? " selected" : "")} onClick={() => { clickHandler({ value, title, symbol }) }}>
            {symbol && false ?
                <span className="operatorIcon">
                    {symbol}
                </span>
                : <></>}
            <span>
                {title}
            </span>
        </div>
    )
}

export default function OperatorEditor({
    onSelect = () => { },
    dataType = "string",
    value
}) {
    const psRef = useRef();
    const [selectedPredicate, setSelectedPredicate] = useState(value);
    const [previousSelectedPredicate, setPreviousSelectedPredicate] = useState();
    const [selectedDataType, setSelectedDataType] = useState(dataType);
    const [previousSelectedDataType, setPreviousSelectedDataType] = useState();
    const [showSelector, setShowSelector] = useState(false);

    const selectPredicate = (data) => {
        setSelectedPredicate(data);
    }

    // Cause updating react state from property is kinda hacky. https://betterprogramming.pub/updating-state-from-properties-with-react-hooks-5d48693a4af8
    if (value !== previousSelectedPredicate) {
        setSelectedPredicate(value);
        setPreviousSelectedPredicate(value);
    }
    if (dataType !== previousSelectedDataType) {
        setSelectedDataType(dataType);
        setPreviousSelectedDataType(dataType);
    }

    const getOperators = () => {
        switch (selectedDataType) {
            case "string":
                return [
                    { value: "equals", title: "Equals", "symbol": "=" },
                    { value: "notEquals", title: "Does not equal", "symbol": "≠" },
                    { value: "contains", title: "Contains", "symbol": "∋" },
                    { value: "notContains", title: "Does not contain", "symbol": "∌" },
                    { value: "set", title: "Is set", "symbol": "•" },
                    { value: "notSet", title: "Is not set", "symbol": "◦" },
                ];
            case "number":
                return [
                    { value: "equals", title: "Equals", "symbol": "=" },
                    { value: "notEquals", title: "Does not equal", "symbol": "≠" },
                    { value: "greaterThan", title: "Greater than", "symbol": ">" },
                    { value: "greaterThanOrEqual", title: "Greater than or equal", "symbol": "≥" },
                    { value: "lessThan", title: "Less than", "symbol": ">" },
                    { value: "lessThanOrEqual", title: "Less than or equal", "symbol": "≥" },
                    { value: "between", title: "Between", "symbol": "∈" },
                    { value: "notBetween", title: "Not between", "symbol": "∉" },
                ];
            case "date":
                return [
                    { value: "inTheLast", title: "In the last", "symbol": null },
                    { value: "notInTheLast", title: "Not in the last", "symbol": null },
                    { value: "between", title: "Between", "symbol": null },
                    { value: "notBetween", title: "Not between", "symbol": null },
                    { value: "on", title: "On", "symbol": null },
                    { value: "notOn", title: "Not on", "symbol": null },
                    { value: "before", title: "Before", "symbol": null },
                    { value: "since", title: "Since", "symbol": null },
                    { value: "inTheNext", title: "In the next", "symbol": null },
                ];
            case "array":
                return [
                    { value: "contains", title: "Contains", "symbol": "∋" },
                    { value: "notContains", title: "Does not contain", "symbol": "∌" },
                    { value: "set", title: "Is set", "symbol": "•" },
                    { value: "notSet", title: "Is not set", "symbol": "◦" },
                ];
            case "boolean":
            case "bool":
                return [
                    { value: "isTrue", title: "Is true", "symbol": null },
                    { value: "isFalse", title: "Is false", "symbol": null },
                ];
            case "event":
                return [
                    { value: "total", title: "Has been triggered", "symbol": null },
                    { value: "notTotal", title: "Has not been triggered", "symbol": null },
                ];
            default:
                return [];
        }
    }

    const handleClick = e => {
        if (psRef.current) {
            if (!psRef.current.contains(e.target)) {
                setShowSelector(false);
            }
        }
    };

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const onSelectHandler = ({ value, title, symbol }) => {
        setSelectedPredicate(value)
        onSelect({ value, title, symbol });
    }

    return (
        <>
            <div style={{ width: "250px" }} className="predicateSelector" ref={psRef}>
                <div className="predicateSelectorItemsContainer">
                    {
                        getOperators().map((o) => {
                            return (
                                <>
                                    <PredicateSelectorItem selected={o.value === selectedPredicate || o.title === selectedPredicate} clickHandler={onSelectHandler} value={o.value} title={o.title} symbol={o.symbol} />
                                </>
                            )
                        })
                    }
                </div>
            </div>
        </>
    );
}
