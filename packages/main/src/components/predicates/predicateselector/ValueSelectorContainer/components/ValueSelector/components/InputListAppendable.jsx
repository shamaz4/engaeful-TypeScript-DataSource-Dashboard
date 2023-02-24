/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-lonely-if */
import React, { useEffect, useState, useRef } from 'react';
import { Checkbox, Spinner } from '@doar/components';

const InputItem = ({ value, availableMasks, checked, onItemChange = () => { }, onClick = () => { } }) => {
    const [selected, setSelected] = useState(checked);

    const checkBoxRef = useRef();

    const handleCheckboxChange = (e) => {
        const newVal = !selected;
        onClick();
        setSelected(newVal);
        onItemChange({ value, checked: newVal });
    }

    const outputValue = (val) => {
        let returnVal = val;
        if (availableMasks) {
            availableMasks.forEach((am) => {
                if (am.value === val) {
                    returnVal = am.mask;
                }
            });
        }
        return returnVal;
    }

    return (
        <div role="button" tabIndex="0" className={"predicateSelectorItem " + (selected ? "inputItemSelected" : "")} style={{ "alignItems": "center" }} onClick={handleCheckboxChange}>
            <span className="operatorIcon checkBox" style={{ flexWrap: "wrap" }}>
                <Checkbox
                    ref={checkBoxRef}
                    checked={selected}
                />
            </span>
            <span 
                style={{
                    position: "relative",
                    top: "2px",
            }}>
                {outputValue(value)}
            </span>
        </div>
    )
}

const PredicateSelectorSearchBar = ({ value, onChange }) => {
    return (
        <div className="predicateSelectorSearchBarContainer">
            <input type="text" className="predicateSelectorSearchBar" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search or add item" />
        </div>
    )
}


export default function InputListAppendable({
    availableMasks = [],
    value = [
    ],
    onSelect = () => { }
}) {

    const [loading, setLoading] = useState(false);
    const [searchBarValue, setSearchBarValue] = useState("");
    const [currentValues, setCurrentValues] = useState(value);
    const [selectedValues, setSelectedValues] = useState([]);

    const onSearchChange = (data) => {
        setSearchBarValue(data);
    }


    useEffect(() => {
        const checked = currentValues.filter(cv => cv.checked === true);
        setSelectedValues(checked);
    }, [currentValues]);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const onItemChange = ({ value, checked }) => {
        const newValues = [];
        currentValues.forEach((cv) => {
            if (cv.value === value) {
                newValues.push({ value, checked });
            } else {
                newValues.push(cv);
            }
        })
        setCurrentValues(newValues);
    }


    const onSubmitClick = () => {
        const vals = [];
        selectedValues.forEach((sv) => {
            vals.push(sv.value);
        })
        onSelect(vals);
    }

    return (
        <>
            <PredicateSelectorSearchBar value={searchBarValue} onChange={onSearchChange} />
            <div className="predicateSelectorItemsContainer" style={{ overflowY: "auto", maxHeight: "203px" }}>
                {loading ?
                    <Spinner color="primary" />
                    /* <CircularProgress style={{ width: "24px", height: "24px", display: "flex", justifyContent: "center", margin: "10px auto auto auto" }} /> */
                    : <>
                        {searchBarValue !== "" ?
                            <InputItem value={"Specify: " + searchBarValue} onClick={() => {
                                setCurrentValues([...currentValues, { value: searchBarValue, checked: true }])
                                setSearchBarValue("");
                            }} checked={false} />
                            : <></>}
                        {currentValues.map(lv => {
                            let doReturn = false;
                            if (searchBarValue !== "") {
                                if (typeof lv.value === "string") {
                                    if ((lv.value && lv.value.toLowerCase().includes(searchBarValue.toLowerCase())) || (lv.value && lv.value.toLowerCase().includes(searchBarValue.toLowerCase()))) {
                                        doReturn = true;
                                    }
                                } else if (typeof lv.value === "number") {
                                    if ((lv.value && lv.value.toString().toLowerCase().includes(searchBarValue.toLowerCase())) || (lv.value && lv.value.toString().toLowerCase().includes(searchBarValue.toLowerCase()))) {
                                        doReturn = true;
                                    }
                                }
                            } else {
                                doReturn = true;
                            }
                            if (doReturn) {
                                return (
                                    <InputItem availableMasks={availableMasks} onItemChange={onItemChange} value={lv.value} checked={lv.checked} />
                                )
                            } else {
                                return <></>
                            }
                        })}
                    </>
                }
            </div>
            {selectedValues.length > 0 ?
                        <>
                            <div style={{height: "20px"}}  />
                            <div role="button" tabIndex="0" onClick={onSubmitClick} className="addValueButton">Add value{selectedValues.length > 1 ? "s" : ""}</div>
                            </>
                            : <></>}
        </>
    )
}