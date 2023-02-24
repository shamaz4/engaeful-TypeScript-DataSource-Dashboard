/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-lonely-if */
import React, { useEffect, useState, useRef } from 'react';
import InputListAppendable from './components/InputListAppendable'
import InputListAppendableSingle from './components/InputListAppendableSingle';
import InputEventHasBeenTriggered from './components/InputEventHasBeenTriggered';
import InputEventHasNotBeenTriggered from './components/InputEventHasNotBeenTriggered';
import InputInTheLast from './components/InputInTheLast';
import InputBetweenDate from './components/InputBetweenDate';
import InputOnDate from './components/InputOnDate';


export default function ValueEditor({
    onSelect = () => { },
    availableMasks = [{
        value: "61fb03a2f70ca9791dc815d3",
        mask: "Hello!"
    }],
    comparison = "equals",
    additionalData = {},
    value = []
}) {
    const psRef = useRef();
    const [selectedValue, setSelectedValue] = useState(value);
    const [previousSelectedValue, setPreviousSelectedValue] = useState();
    const [selectedComparison, setSelectedComparison] = useState(comparison);
    const [previousSelectedComparison, setPreviousSelectedComparison] = useState();
    const [showSelector, setShowSelector] = useState(false);

    // Cause updating react state from property is kinda hacky. https://betterprogramming.pub/updating-state-from-properties-with-react-hooks-5d48693a4af8
    if (comparison !== previousSelectedComparison) {
        setSelectedComparison(comparison);
        setPreviousSelectedComparison(comparison);
    }
    if (value !== previousSelectedValue) {
        setSelectedValue(value);
        setPreviousSelectedValue(value);
    }

    const GetInputs = ({ type, _onSelect, _value, _additionalData={} }) => {
        switch (selectedComparison) {
            case "equals":
            case "notEquals":
                return (<InputListAppendable availableMasks={availableMasks} value={_value} onSelect={_onSelect} />)
            case "contains":
            case "notContains":
                return (<InputListAppendableSingle availableMasks={availableMasks} value={_value} onSelect={_onSelect} />)
            case "total":
                return (<InputEventHasBeenTriggered availableMasks={availableMasks} additionalData={_additionalData} comparison="greaterThanOrEqual" value={_value} onSelect={_onSelect} />);
            case "notTotal":
                return (<InputEventHasNotBeenTriggered  availableMasks={availableMasks} additionalData={_additionalData} comparison="equals" value={_value} onSelect={_onSelect} />);
            case "inTheNext":
                return (<InputInTheLast  availableMasks={availableMasks} additionalData={_additionalData} comparison="inTheNext" value={_value} onSelect={_onSelect} />)
            case "inTheLast":
                return (<InputInTheLast  availableMasks={availableMasks} additionalData={_additionalData} comparison="inTheLast" value={_value} onSelect={_onSelect} />)
            case "notInTheLast":
                return (<InputInTheLast  availableMasks={availableMasks} additionalData={_additionalData} comparison="notInTheLast" value={_value} onSelect={_onSelect} />)
            case "between":
                return (<InputBetweenDate  availableMasks={availableMasks} additionalData={_additionalData} comparison="between" value={_value} onSelect={_onSelect} />)
            case "notBetween":
                return (<InputBetweenDate  availableMasks={availableMasks} additionalData={_additionalData} comparison="notBetween" value={_value} onSelect={_onSelect} />)
            case "on":
                return (<InputOnDate  availableMasks={availableMasks} additionalData={_additionalData} comparison="on" value={_value} onSelect={_onSelect} />)
            case "notOn":
                return (<InputOnDate  availableMasks={availableMasks} additionalData={_additionalData} comparison="notOn" value={_value} onSelect={_onSelect} />)
            case "before":
                return (<InputOnDate  availableMasks={availableMasks} additionalData={_additionalData} comparison="before" value={_value} onSelect={_onSelect} />)
            case "since":
                return (<InputOnDate  availableMasks={availableMasks} additionalData={_additionalData} comparison="since" value={_value} onSelect={_onSelect} />)
            case "isTrue":
            case "isFalse":
                return (<></>);
            default:
                if (selectedComparison.includes("notTotal:")) {
                    const newComparison = selectedComparison.split(":")[1];
                    return (<InputEventHasNotBeenTriggered availableMasks={availableMasks} additionalData={_additionalData} comparison={newComparison} value={_value} onSelect={_onSelect} />);
                }
                else if (selectedComparison.includes("total:")) {
                    // Format value to fit into element
                    const newComparison = selectedComparison.split(":")[1];
                    return (<InputEventHasBeenTriggered availableMasks={availableMasks} additionalData={_additionalData} comparison={newComparison} value={_value} onSelect={_onSelect} />);
                }
                
                return ("Unknown: " + selectedComparison);
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


    const getStyle = () => {
        if (comparison.includes(":")) {
            const split = comparison.split(":");
            switch (split[0]) {
                case "total":
                    return { height: "auto", width: "auto", minWidth: "250px" }
                default:
                    return { width: "250px" }
            }
        }
        else {
            switch (comparison) {
                case "between":
                case "notBetween":
                case "on":
                case "notOn":
                case "before":
                case "since":
                    return { width: "350px" }
                default:
                    return { width: "250px" }
            }
        }
    }

    return (
        <>
            <div className="predicateSelector"
                style={getStyle()}
                ref={psRef}>
                <GetInputs  _onSelect={onSelect} _value={selectedValue} _additionalData={additionalData}/>
            </div>
        </>
    );
}
