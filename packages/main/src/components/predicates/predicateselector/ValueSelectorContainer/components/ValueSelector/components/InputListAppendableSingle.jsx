/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-lonely-if */
import { Spinner } from '@doar/components';
import React, { useEffect, useState, useRef } from 'react';

const InputItem = ({ value, availableMasks, checked, onItemChange = () => { }, onClick = () => { } }) => {

    const selectItem = (e) => {
        onClick();
        onItemChange(value)
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
        <div tabIndex="0" role="button" className={"predicateSelectorItem " + (checked ? "inputItemSelected" : "")} style={{ "alignItems": "center" }} onClick={selectItem}>
            <span>
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


export default function InputListAppendableSingle({
    availableMasks,
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

    const onItemChange = (_value) => {
        onSelect([_value]);
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
                                onItemChange(searchBarValue)
                                setSearchBarValue("");
                            }} checked={false} />
                            : <></>}
                        {currentValues.map(lv => {
                            let doReturn = false;
                            if (searchBarValue !== "") {
                                if ((lv.value && lv.value.toLowerCase().includes(searchBarValue.toLowerCase())) || (lv.value && lv.value.toLowerCase().includes(searchBarValue.toLowerCase()))) {
                                    doReturn = true;
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
        </>
    )
}