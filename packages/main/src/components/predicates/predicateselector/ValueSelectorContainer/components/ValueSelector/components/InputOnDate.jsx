/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-lonely-if */
import { useEffect, useState } from "react";
import { Checkbox } from "@doar/components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./inputBetweenDate.css";

import { SelectSimple } from "../../../../../../commoncomponents/SelectSimple";
import { InputSimple } from "../../../../../../commoncomponents/InputSimple";

export default function InputOnDate({
    value = [],
    additionalData = {},
    comparison = "on",
    onSelect = () => {},
}) {
    const [currentValues, setCurrentValues] = useState(value);
    const [comparisonValue, setComparisonValue] = useState(comparison);
    // Date
    const [dateIntervalValue, setdateIntervalValue] = useState(1);
    const [datePeriod, setdatePeriod] = useState("days");
    const [selectedAdditionalData, setadditionalData] = useState(
        additionalData
    );
    const [
        previousSelectedAdditionalData,
        setpreviousSelectedAdditionalData,
    ] = useState();

    useEffect(() => {
        // Format inline filter
        const today = new Date();
        const firstVal = today.setUTCHours(0, 0, 0, 0);
        const secondVal = today.setUTCHours(23, 59, 59, 999);

        if (additionalData) {
            if (
                !additionalData.dateFilter ||
                !["on", "notOn", "before", "since"].includes(additionalData.dateFilter.range)
            ) {
                setadditionalData({
                    ...additionalData,
                    dateFilter: {
                        range: "on",
                        value: [firstVal, secondVal],
                        period: "day",
                        milliseconds: 86400000,
                    },
                });
            }
            else {
                if (currentValues) {
                setadditionalData({
                    ...additionalData,
                    dateFilter: {
                        ...additionalData.dateFilter,
                        value: [new Date(parseFloat(currentValues[0]))],
                    }
                })
                }

            }
        }
    }, []);

    const onSubmitClick = () => {
        // Calculate millisecons for date filters
        const firstVal = new Date(selectedAdditionalData.dateFilter.value[0])
            .setUTCHours(0, 0, 0, 0)
            .valueOf();
        const secondVal = new Date(selectedAdditionalData.dateFilter.value[0])
            .setUTCHours(23, 59, 59, 999)
            .valueOf();
        const values = [firstVal, secondVal];
        onSelect({
            comparison: comparisonValue,
            values,
            additionalData: {
                ...selectedAdditionalData,
                dateFilter: {
                    ...selectedAdditionalData.dateFilter,
                    milliseconds: 12334,
                },
            },
        });
    };

    return (
        <>
            {comparisonValue && selectedAdditionalData.dateFilter ? (
                <div
                    className="predicateSelectorItemsContainer"
                    style={{
                        overflowY: "auto",
                        maxHeight: "auto",
                    }}
                >
                    {selectedAdditionalData.dateFilter.value &&
                    selectedAdditionalData.dateFilter.value[0] ? (
                        <>
                            <div className="hasTotalContainer" style={{}}>
                                <DatePicker
                                    style={{
                                        width: "50%",
                                    }}
                                    className="predicateSelectorSearchBar"
                                    selected={
                                        selectedAdditionalData.dateFilter
                                            .value[0]
                                    }
                                    onChange={(date) => {}}
                                    placeholderText="This is readOnly"
                                    readOnly
                                />
                            </div>
                            <DatePicker
                                selected={
                                    selectedAdditionalData.dateFilter.value[0]
                                }
                                onChange={(newData) => {
                                    setadditionalData({
                                        ...additionalData,
                                        dateFilter: {
                                            range: "on",
                                            value: [newData],
                                            period: "day",
                                            milliseconds: 86400000,
                                        },
                                    });
                                }}
                                startDate={
                                    selectedAdditionalData.dateFilter.value[0]
                                }
                                inline
                            />
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            ) : (
                <></>
            )}
            <div
                role="button"
                style={{ marginTop: "10px" }}
                tabIndex="0"
                onClick={onSubmitClick}
                className="addValueButton"
            >
                Add value
            </div>
        </>
    );
}
