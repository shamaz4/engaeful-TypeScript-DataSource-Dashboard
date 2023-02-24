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
import { usePopper } from 'react-popper';
import OperatorSelector from './components/OperatorSelector/OperatorSelector'

export default function OperatorSelectorContainer({
    dataType = "string",
    comparison = "equals",
    onSelect = () => { }
}) {
    const psRef = useRef();
    const [selectedOperator, setSelectedOperator] = useState(comparison);
    const [selectedOperatorText, setSelectedOperatorText] = useState("");
    const [selectedDataType, setSelectedDataType] = useState(dataType);
    const [previousSelectedDataType, setPreviousSelectedDataType] = useState(dataType);
    const [showSelector, setShowSelector] = useState(false);

    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const [arrowElement, setArrowElement] = useState(null);
    const { styles, attributes } = usePopper(referenceElement, popperElement, { 
        placement:"bottom",
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 10]
                },
            }
        ],
    });

    // Cause updating react state from property is kinda hacky. https://betterprogramming.pub/updating-state-from-properties-with-react-hooks-5d48693a4af8
    if (dataType !== previousSelectedDataType) {
        console.log(dataType, previousSelectedDataType)
        setSelectedDataType(dataType);
        setPreviousSelectedDataType(dataType);


        
        switch (dataType) {
            case "string":
                setSelectedOperator("equals")
                break;
            case "event":
                setSelectedOperator("total:greaterThanOrEqual")
                break;
            case "date":
                setSelectedOperator("inTheLast");
                break;
            case "array":
                setSelectedOperator("contains");
                break;
            case "boolean":
            case "bool":
                setSelectedOperator("isTrue");
                break;
            case "number":
                setSelectedOperator("equals");
                break;
            default:
                if (selectedDataType.includes(":")) {
                    setSelectedOperator("total:greaterThanOrEqual")
                }
                else {
                    setSelectedOperator("UNKNOWN")
                }
                break;
        }
    }

    useEffect(() => {
        switch (selectedOperator) {
            case "inTheNext":
                setSelectedOperatorText("in the next");
                break;
            case "inTheLast":
                setSelectedOperatorText("in the last");
                break;
            case "notInTheLast":
                setSelectedOperatorText("not in the last");
                break;
            case "isSet":
                setSelectedOperatorText("is set");
                break;
            case "notSet":
                setSelectedOperatorText("is not set");
                break;
            case "isTrue":
                setSelectedOperatorText("is true");
                break;
            case "isFalse":
                setSelectedOperatorText("is false");
                break;
            case "notBetween":
                setSelectedOperatorText("not between");
                break;
            case "notEquals":
                setSelectedOperatorText("not equals");
                break;
            case "greaterThan":
                setSelectedOperatorText("greater than");
                break;
            case "greaterThanOrEqual":
                setSelectedOperatorText("greater than or equal");
                break;
            case "lessThan":
                setSelectedOperatorText("less than");
                break;
            case "lessThanOrEqual":
                setSelectedOperatorText("less than or equal");
                break;
            case "notOn":
                setSelectedOperatorText("not on");
                break;
            case "total":
                setSelectedOperatorText("has been triggered");
                break;
            case "notTotal":
                setSelectedOperatorText("has not been triggered");
                break;
            case "notContains":
                setSelectedOperatorText("does not contain");
                break;
            default:
                if (selectedOperator.includes(":")) {
                    setSelectedOperatorText(selectedOperator.split(":")[0]);
                    setSelectedOperator(selectedOperator.split(":")[0])
                } else {
                    setSelectedOperatorText(selectedOperator);
                }
        }
    }, [selectedOperator]);

    const selectOperator = (data) => {
        let newDataValue = data.value;
        if (data.value === "total") {
            newDataValue = "total:greaterThanOrEqual";
        }
        setSelectedOperator(data.title);
        onSelect(newDataValue);
        setShowSelector(false);
    }

useEffect(() => {
    // setSelectedOperator(comparison)
}, [comparison]);

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


    return (
        <div style={{ marginLeft: "5px", position: "relative" }} className="predicateSelectorContainer" ref={psRef}>
            <div style={{lineHeight:"23px"}} role="button" tabIndex="0" onClick={() => { setShowSelector(true) }} className={"addPredicate selected" + (showSelector ? " active" : "")}>
                {selectedOperatorText.toLowerCase()}
            </div>
            <div ref={setReferenceElement}>
            {showSelector ?
            <div ref={setPopperElement} className="popperContainer" style={styles.popper} {...attributes.popper}>
                <OperatorSelector dataType={selectedDataType} value={selectedOperator} onSelect={selectOperator} />
                </div>
                : <></>}
            </div>
        </div>
    );
}
