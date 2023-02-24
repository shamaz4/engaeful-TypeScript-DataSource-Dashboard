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

export default function InputInTheLast({
    value = [
    ],
    additionalData = {},
    comparison = "inTheLast",
    onSelect = () => { }
}) {

    const [currentValues, setCurrentValues] = useState(value);
    const [comparisonValue, setComparisonValue] = useState(comparison);
    // Date
    const [dateIntervalValue, setdateIntervalValue] = useState(1);
    const [datePeriod, setdatePeriod] = useState("days");
    const [selectedAdditionalData, setadditionalData] = useState(additionalData);
    const [previousSelectedAdditionalData, setpreviousSelectedAdditionalData] = useState();

    useEffect(() => {
        // Format inline filter
        if (additionalData) {
            if (!additionalData.dateFilter || additionalData.dateFilter.range !== "inTheLast") {
                setadditionalData({
                    ...additionalData,
                    dateFilter: {
                        range: "inTheLast",
                        value: 1,
                        period: "day",
                        milliseconds: 86400000
                    }
                })
            } 
        }
    }, [])


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
        onSelect({ comparison: comparisonValue, values: [newMs], additionalData: {
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
                <div className="predicateSelectorItemsContainer" style={{ overflowY: "auto", maxHeight: "auto" }}>
                    <div className="hasTotalContainer" style={{
                        marginBottom: "20px"
                    }}>
                            <>
                                <InputSimple 
                                width='50%'
                                numeric placeholder="" value={selectedAdditionalData.dateFilter.value} onChange={(data) => {
                                    console.log(data);
                                    setadditionalData({
                                        ...selectedAdditionalData,
                                        dateFilter: {
                                            ...selectedAdditionalData.dateFilter,
                                            value: parseFloat(data)
                                        }});
                                }} />
                                <SelectSimple placeholder="anytime" 
                                width='50%'
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
                    </div>
                </div>
                : <></>}
                                    <div role="button" style={{marginTop: "10px"}} tabIndex="0" onClick={onSubmitClick} className="addValueButton">Add value</div>
        </>
    )
}