/* eslint-disable no-param-reassign */
/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-lonely-if */
import { maxWidth } from "@doar/shared";
import { reference } from "@popperjs/core";
import React, { useEffect, useState, useRef } from "react";
import { usePopper } from 'react-popper';
import ValueSelector from "./components/ValueSelector/ValueSelector";

export default function ValueSelectorContainerNumber({
    dataType = "string",
    inputValue = [],
    comparison = "equals",
    onSelect = () => { },
}) {
    const psRef = useRef();
    const [selectedValue, setSelectedValue] = useState(inputValue);
    const [selectedComparison, setSelectedComparison] = useState(comparison);
    const [valuesArray, setValuesArray] = useState();
    const [showSelector, setShowSelector] = useState(false);

    useEffect(() => {
        onSelect(selectedValue)
    }, [selectedValue]);

    useEffect(() => {
        setSelectedComparison(comparison)
    }, [comparison])

    return (
        <>
                <div
                    style={{
                        marginLeft: "5px",
                        position: "relative",
                    }}
                    className="predicateSelectorContainer"
                    ref={psRef}
                >

                    <input
                        type="number"
                        style={{lineHeight:"23px",
                            maxHeight: "36px",
                            border: "0px",
                            cursor: "text",
                        maxWidth: "120px"
                        }}
                        value={selectedValue[0]}
                        tabIndex="0"
                        onChange={(e) => {
                            setSelectedValue([e.target.value, selectedValue[1]])
                        }}
                        onClick={() => {
                        }}
                        className={
                            "addPredicate selected" +
                            (showSelector ? " active" : "")
                        }
                    />
                    {["between", "notBetween"].includes(selectedComparison) ? 
                    <>
                    <span style={{marginLeft: "10px", marginRight: "10px"}}>and</span>
                    <input
                        type="number"
                        style={{lineHeight:"23px",
                            maxHeight: "36px",
                            border: "0px",
                            cursor: "text",
                        maxWidth: "120px"
                        }}
                        value={selectedValue[1]}
                        tabIndex="0"
                        onChange={(e) => {
                            setSelectedValue([selectedValue[0], e.target.value])
                        }}
                        onClick={() => {
                        }}
                        className={
                            "addPredicate selected" +
                            (showSelector ? " active" : "")
                        }
                    />
                    </>
                    : <></>}
                        
                    </div>
        </>
    );
}
