/* eslint-disable no-param-reassign */
/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-lonely-if */
import { reference } from "@popperjs/core";
import React, { useEffect, useState, useRef } from "react";
import { usePopper } from 'react-popper';
import ValueSelector from "./components/ValueSelector/ValueSelector";

export default function ValueSelectorContainer({
    dataType = "string",
    availableMasks = [{
        value: "61fb03a2f70ca9791dc815d3",
        mask: "Hello!a"
    }],
    availableValues = [],
    inputValue = [],
    additionalData ={},
    comparison = "equals",
    onSelect = () => { },
}) {
    const psRef = useRef();
    const [selectedValue, setSelectedValue] = useState(inputValue);
    const [previousSelectedValue, setPreviousSelectedValue] = useState();
    const [selectedComparison, setSelectedComparison] = useState(comparison);
    const [selectedAdditionalData, setSelectedAdditionalData] = useState(additionalData);
    const [
        previousSelectedComparison,
        setPreviousSelectedComparison,
    ] = useState(null);
    const [valuesArray, setValuesArray] = useState();
    const [showSelector, setShowSelector] = useState(false);

    // This is a HACK, due to the fact that react-popper isn't attaching the position properly.
    // What we are doing is essentially manually hiding then displaying the container.
    // This is caused by the container being hidden by default, therefore calculation must be 
    // done once more after it's rendered.
    const [updatePopperPosition, setupdatePopperPosition] = useState(0);


    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const [arrowElement, setArrowElement] = useState(null);

    const popperObj = usePopper(referenceElement, popperElement, { 
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
    const { styles, attributes, forceUpdate } = popperObj; 
    const update = popperObj.update;



    useEffect(() => {   
        if (typeof update === "function") {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            update();
        }
    }, [updatePopperPosition])

    const selectValue = (data) => {
        if (data.length === 0) {
            onSelect([]);
            setSelectedValue([]);
            setPreviousSelectedValue([]);
        } else {
            console.log(selectedComparison)
            setSelectedAdditionalData(data.additionalData);
            if (selectedComparison.includes(":")) {
                const currentActionName = selectedComparison.split(":")[0];
                const newComparisonName = `${currentActionName}:${data.comparison}`;
                onSelect(data);
                setSelectedValue(data.values);
                setPreviousSelectedValue(data.values);
                setSelectedComparison(newComparisonName);
            } else {
                onSelect(data);
                setSelectedValue(data);
                setPreviousSelectedValue(data);
            }
        }
        setShowSelector(false);
    };

    // Cause updating react state from property is kinda hacky. https://betterprogramming.pub/updating-state-from-properties-with-react-hooks-5d48693a4af8
    if (inputValue !== previousSelectedValue) {
        setSelectedValue(inputValue);
        setPreviousSelectedValue(inputValue);
    }
    if (comparison !== previousSelectedComparison) {
        setSelectedComparison(comparison);
        setPreviousSelectedComparison(comparison);
    }

    const handleClick = (e) => {
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

    useEffect(() => {
        if (["contains", "notContains"].includes(selectedComparison)) {
            if (selectedValue[0]) {
                selectValue([selectedValue[0]]);
            } else {
                selectValue([]);
            }
        }
        if (["set", "notSet"].includes(selectedComparison)) {
            selectValue([]);
        }
    }, [selectedComparison]);

    const applyValueMasks = (value) => {
        const newValue = [];
        if (value) {
        value.forEach((v) => {
            let valueItem = v;
            availableMasks.forEach((am) => {
                if (am.value === v) {
                    valueItem = (am.mask)
                }
            })
            newValue.push(valueItem)
        })
        }
        return newValue;
    }

    const OutputInput = ({ _comparison, value, _additionalData = {} }) => {
        value = applyValueMasks(value);
        let valText = "";
        if (selectedComparison.includes(":") || ["total", "notTotal"].includes(selectedComparison)) {
            // Display group for total
            if (selectedComparison.split(":")[0] === "total" || selectedComparison === "total") {
                switch (selectedComparison.split(":")[1]) {
                    case "between":
                        valText =
                            "between " + value[0] + " and " + value[1] + " times";
                        break;
                    case "lessThanOrEqual":
                        valText =
                            "at most " +
                            value[0] +
                            " time" +
                            (value[0] > 1 ? "s" : "");
                        break;
                    case "greaterThanOrEqual":
                        valText =
                            "at least " +
                            value[0] +
                            " time" +
                            (value[0] > 1 ? "s" : "");
                        break;
                    case "equals":
                        valText =
                            "exactly " +
                            value[0] +
                            " time" +
                            (value[0] > 1 ? "s" : "");
                        break;
                    default:
                        valText = value[0];
                }
                if (_additionalData && _additionalData.dateFilter && _additionalData.dateFilter.range === "inTheLast") {
                    valText += ` in the last ${_additionalData.dateFilter.value > 1 ? _additionalData.dateFilter.value : "" } ${_additionalData.dateFilter.value > 1 ? _additionalData.dateFilter.period + "s" : _additionalData.dateFilter.period     }`;
                }
                if (_additionalData && _additionalData.dateFilter && _additionalData.dateFilter.range === "afterCampaignPublish") {
                    valText += ` after this campaign is published`;
                }
            } else if (selectedComparison.split(":")[0] === "notTotal" || selectedComparison === "notTotal") {
                if (_additionalData && _additionalData.dateFilter && _additionalData.dateFilter.range === "inTheLast") {
                    valText = `in the last ${_additionalData.dateFilter.value > 1 ? _additionalData.dateFilter.value : "" } ${_additionalData.dateFilter.value > 1 ? _additionalData.dateFilter.period + "s" : _additionalData.dateFilter.period     }`;
                } else {
                    valText = "at all"
                }
            }
        } else {
            if (_comparison === "inTheLast" || _comparison === "notInTheLast" || _comparison === "inTheNext") {
                if (_additionalData && _additionalData.dateFilter) {
                    valText = `${_additionalData.dateFilter.value > 1 ? _additionalData.dateFilter.value : "" } ${_additionalData.dateFilter.value > 1 ? _additionalData.dateFilter.period + "s" : _additionalData.dateFilter.period     }`;
                }
            }
            else if (_comparison === "on" || _comparison === "notOn" || _comparison === "before" || _comparison === "since") {
                if (_additionalData && _additionalData.dateFilter) {
                    if (value[0] && value[1]) {

                    try {
                        const val1 = new Date(parseFloat(value[0])).toLocaleDateString("en-US", { // you can use undefined as first argument
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                        });
                        valText = `${val1}`;
                    }
                    catch (e) {
                        valText = "Select value..."
                    }
                    }
                }
            }
            else if (_comparison === "between" || _comparison === "notBetween") {
                if (_additionalData && _additionalData.dateFilter) {
                    let val1 = "Select value..."
                    let val2 = "Select value..."
                    if (value[0] && value[1]) {
                    try {
                        val1 = new Date(parseFloat(value[0])).toLocaleDateString("en-US", { // you can use undefined as first argument
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                        });
                        val2 = new Date(parseFloat(value[1])).toLocaleDateString("en-US", { // you can use undefined as first argument
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                        });
                        valText = `${val1} — ${val2}`;
                    }
                    catch (e) {
                        valText = "Select value..."
                    }
                    }
                }
            }
            else {
                if (value.length > 3) {
                    valText =
                        value[0] +
                        " or " +
                        value[1] +
                        " or " +
                        (value.length - 2) +
                        " others";
                } else if (value.length === 3) {
                    valText = value[0] + " or " + value[1] + " or " + value[2];
                } else if (value.length === 2) {
                    valText = value[0] + " or " + value[1];
                } else if (value.length === 1) {
                    valText = value[0];
                }
            }
        }
        return <span>{valText !== "" ? valText : "Select value..."}</span>;
    };

    useEffect(() => {
        if (selectedValue[0] && typeof selectedValue[0] === "object") {
            const vals = [];
            selectedValue.forEach((sv) => {
                vals.push(sv.value);
            });
            setValuesArray(vals);
        } else {
            setValuesArray(selectedValue);
        }
    }, [selectedValue]);

    const valuesToObjectArray = () => {
        if (
            ["equals", "notEquals", "contains", "notContains"].includes(
                selectedComparison
            )
        ) {
            const array = [];
            selectedValue.forEach((sv) => {
                array.push({ value: sv, checked: true });
            });
            availableValues.forEach((av) => {
                if (array.filter((f) => f.value === av).length === 0) {
                    array.push({ value: av, checked: false });
                }
            });
            return array;
        } else if (["inTheLast"].includes(selectedComparison)) {
            return selectedValue
        } else if (selectedComparison.includes("total:")) {
            return selectedValue;
        } else if (selectedComparison.includes("notTotal")) {
            return selectedValue;
        } else {
            return selectedValue;
            // return ["ADD ME (" + selectedComparison + ")"];
        }
    };

    return (
        <>
            {!["set", "notSet", "isTrue", "isFalse"].includes(selectedComparison) &&
                valuesArray ? (
                <div
                    style={{
                        marginLeft: "5px",
                        position: "relative",
                    }}
                    className="predicateSelectorContainer"
                    ref={psRef}
                >
                    <div
                        style={{lineHeight:"23px"}}
                        role="button"
                        tabIndex="0"
                        onClick={() => {
                            setShowSelector(true);
                            setTimeout(()=> {
                            setupdatePopperPosition((position) => position + 1);
                            setupdatePopperPosition((position) => position + 1);
                            setupdatePopperPosition((position) => position + 1);
                            }, 5);
                        }}
                        className={
                            "addPredicate selected" +
                            (showSelector ? " active" : "")
                        }
                    >
                        <OutputInput _comparison={comparison} value={selectedValue} _additionalData={selectedAdditionalData}    />
                    </div>
                    <div ref={setReferenceElement}>
                        {showSelector ?
                            <div ref={setPopperElement} className="popperContainer" style={{...styles.popper}} {...attributes.popper}>
                                <ValueSelector
                                    availableMasks ={availableMasks}
                                    additionalData={selectedAdditionalData}    
                                    comparison={selectedComparison}
                                    onSelect={selectValue}
                                    value={valuesToObjectArray()}
                                />
                            </div>
                     : (
                        <></>
                    )}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
