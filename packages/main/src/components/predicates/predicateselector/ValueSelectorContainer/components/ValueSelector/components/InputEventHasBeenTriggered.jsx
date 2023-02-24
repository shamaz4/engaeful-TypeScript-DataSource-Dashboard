/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-lonely-if */
import { useEffect, useState } from 'react';
import { Checkbox } from '@doar/components';
import { SelectSimple } from "../../../../../../commoncomponents/SelectSimple";
import { InputSimple } from "../../../../../../commoncomponents/InputSimple";

export default function InputEventHasBeenTriggered({
    value = [
        1, 10
    ],
    additionalData = {},
    comparison = "greaterThanOrEqual",
    onSelect = () => { }
}) {

    const [currentValues, setCurrentValues] = useState(value);
    const [comparisonValue, setComparisonValue] = useState(comparison);
    // Date
    const [dateIntervalValue, setdateIntervalValue] = useState(1);
    const [datePeriod, setdatePeriod] = useState("days");
    const [selectedAdditionalData, setadditionalData] = useState(additionalData);

    useEffect(() => {
        // Format inline filter
        if (additionalData) {
            if (!additionalData.dateFilter) {
                setadditionalData({
                    ...additionalData,
                    dateFilter: {
                        range: "anytime",
                        value: 1,
                        period: "day",
                        milliseconds: 86400000
                    }
                })
            } 
        }
    }, [])

    /*
    useEffect(() => {
        if (selectedAdditionalData.dateFilter) {
            if (selectedAdditionalData.dateFilter.range === "inTheLast") {
                setadditionalData({
                    ...selectedAdditionalData,
                    dateFilter: {
                        ...selectedAdditionalData.dateFilter,
                        milliseconds: newMs
                }}); 
            }
        }
    }, [selectedAdditionalData])
    */


    const onSubmitClick = () => {
        // Calculate millisecons for date filters
        let newMs = 0;
        switch(selectedAdditionalData.dateFilter.period) {
            case "month":
                newMs = (30*86400000) * selectedAdditionalData.dateFilter.value;
                break;
            case "week":
                newMs = (7*86400000) * selectedAdditionalData.dateFilter.value;
                break;
            case "day":
                newMs = 86400000 * selectedAdditionalData.dateFilter.value;
                break;
            case "hour":
                newMs = 3600000 * selectedAdditionalData.dateFilter.value;
                break;
            default: 
                newMs = 86400000;
                break;
        }
        console.log(comparisonValue);
        onSelect({ action: "total", comparison: comparisonValue, values: currentValues, additionalData: {
            ...selectedAdditionalData,
            dateFilter: {
                ...selectedAdditionalData.dateFilter,
                milliseconds: newMs
            }
        } });
    }

    return (
        <>
            {comparisonValue && selectedAdditionalData.dateFilter ?
            <>
                <div className="predicateSelectorItemsContainer" style={{ overflowY: "auto", maxHeight: "auto" }}>
                    <div className="hasTotalContainer">
                        <SelectSimple placeholder="exactly" 
                        values={[
                            { value: "greaterThanOrEqual", name: "At least" },
                            { value: "lessThanOrEqual", name: "At most" },
                            { value: "between", name: "Between" },
                            { value: "equals", name: "Exactly" },
                        ]}
                        value={comparisonValue} onChange={(data) => { setComparisonValue(data) }} />
                        {comparisonValue === 'between' ?
                            <>
                                <InputSimple numeric placeholder="" value={currentValues[0]} onChange={(data) => {
                                    setCurrentValues([data, currentValues[1]]);
                                }} />
                                and
                                <InputSimple numeric placeholder="" value={currentValues[1]} onChange={(data) => {
                                    setCurrentValues([currentValues[0], data]);
                                }} />
                                <span>times</span>
                            </>
                            :
                            <>
                                <InputSimple numeric placeholder="" value={currentValues[0]} onChange={(data) => {
                                    setCurrentValues([data]);
                                }} />
                                <span>time{currentValues[0] > 1 ? "s" : ""}</span>
                            </>
                        }
                    </div>
                    <div className="hasTotalContainer" style={{
                        marginBottom: "20px"
                    }}>
                        <SelectSimple placeholder="anytime" 
                        values={[
                            { value: "anytime", name: "Anytime" },
                            { value: "inTheLast", name: "In the last" },
                            { value: "afterCampaignPublish", name: "After campaign publish" },
                        ]}
                        value={selectedAdditionalData.dateFilter.range} onChange={(data) => { 
                            setadditionalData({
                                ...selectedAdditionalData,
                                dateFilter: {
                                    ...selectedAdditionalData.dateFilter,
                                    range: data
                                }});
                        }} />
                        {selectedAdditionalData.dateFilter.range === 'inTheLast' ?
                            <>
                                <InputSimple numeric placeholder="" value={selectedAdditionalData.dateFilter.value} onChange={(data) => {
                                    console.log(data);
                                    setadditionalData({
                                        ...selectedAdditionalData,
                                        dateFilter: {
                                            ...selectedAdditionalData.dateFilter,
                                            value: data
                                        }});
                                }} />
                                <SelectSimple placeholder="anytime" 
                                values={[
                                    { value: "hour", name: selectedAdditionalData.dateFilter.value > 1 ? "hours" : "hour" },
                                    { value: "day", name: selectedAdditionalData.dateFilter.value > 1 ? "days" : "day" },
                                    { value: "week", name: selectedAdditionalData.dateFilter.value > 1 ? "weeks" : "week" },
                                    { value: "month", name: selectedAdditionalData.dateFilter.value > 1 ? "months" : "month" },
                                ]}
                                value={selectedAdditionalData.dateFilter.period} onChange={(data) => { 
                                    setadditionalData({
                                        ...selectedAdditionalData,
                                        dateFilter: {
                                            ...selectedAdditionalData.dateFilter,
                                            period: data
                                        }});
                                     }} />
                            </>
                            :
                            <>
                            </>
                        }
                    </div>
                </div>
                <div role="button" style={{marginTop: "10px"}} tabIndex="0" onClick={onSubmitClick} className="addValueButton">Add value</div>
                </>
                : <></>}
        </>
    )
}