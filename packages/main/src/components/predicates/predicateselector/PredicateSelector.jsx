/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect, useState, useRef } from "react";
import "./PredicateSelectorStyles.css";
import { XCircle, Trash, Filter } from "react-feather";
import { ApiUrl } from "@doar/shared/data";
// eslint-disable-next-line import/no-unresolved
import { useAppSelector } from "src/redux/hooks";
import PropertySelectorContainer from "./PropertySelectorContainer/PropertySelectorContainer";
import OperatorSelectorContainer from "./OperatorSelectorContainer/OperatorSelectorContainer";
import ValueSelectorContainer from "./ValueSelectorContainer/ValueSelectorContainer";
import ValueSelectorContainerNumber from "./ValueSelectorContainer/ValueSelectorContainerNumber";

export default function PredicateSelector({
    label,
    parentEvent = "",
    dictionary,
    dictionaryName = "PROFILE PROPERTIES",
    campaignNodeList = [],
    availableEmails = [],
    allowInlineFilters = true,
    debug = false,
    eventDictionary,
    keyIndex = 1,
    predicate = {
        _id: `new_predicate_${Date.now()}`,
        type: "",
        attribute: "",
        comparison: "",
        value: [],
        additionalData: allowInlineFilters ? {
            inlineFilter: {
                _id: `new_inline_predicate_${Date.now()}`,
                type: "",
                attribute: "",
                comparison: "",
                value: [],
            }
        } : {}
    },
    onChange = () => { },
    onDelete = () => { },
}) {
    const psRef = useRef();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const token = useAppSelector((state) => state.auth.accessToken);
    const [selectedPredicate, setSelectedPredicate] = useState(predicate);
    const [selectedPredicateInlineFilter, setSelectedPredicateInlineFilter] = useState(predicate.additionalData && allowInlineFilters ? predicate.additionalData.inlineFilter : {value:[]});
    const [inlineFilterDictionary, setInlineFilterDictionary] = useState([]);
    const [showInlineFilter, setShowInlineFilter] = useState(false);
    const [selectedParentEvent, setSelectedParentEvent] = useState("");
    const [lastAttribute, setLastAttribute] = useState(predicate.attribute);
    const [lastType, setLastType] = useState(predicate.type);
    const [availableAttributeValues, setAvailableAttributeValues] = useState(
        []
    );
    const [currentAvailableEmails, setcurrentAvailableEmails] = useState(availableEmails);
    const [availableMasks, setavailableMasks] = useState([]);
    const onInlineFilterChange = (predicates) => {
        setSelectedPredicateInlineFilter(predicates);
        setSelectedPredicate({
            ...selectedPredicate,
            additionalData: {
                ...selectedPredicate.additionalData,
                inlineFilter: predicates
            }
        })
    }

    const onInlineFilterDelete = (index, hide = false) => {
        if (hide) {
            setShowInlineFilter(false);
        }
        setSelectedPredicateInlineFilter({value:[]});
        setSelectedPredicate({
            ...selectedPredicate,
            additionalData: {
                ...selectedPredicate.additionalData,
                inlineFilter: []
            }
        })
    }

    // Get attribute values
    const getAttributeValues = (attribute) => {
        if (attribute) {
            const headers = new Headers({ "Content-Type": "application/json" });
            headers.set("Authorization", `Bearer ${token}`);
            return new Promise((resolve, reject) => {
                fetch(
                    `${ApiUrl}/websites/${WebsiteId}/users/getValuesOfField`,
                    {
                        method: "POST",
                        headers,
                        body: JSON.stringify({
                            field: attribute,
                            limit: 30,
                            offset: 0,
                        }),
                    }
                )
                    .then((response) => response.json())
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((e) => { })
                    .finally(() => { });
            });
        }
        return Promise.resolve([]);
    };

    // Get attribute values
    const getEventValues = (eventType, attribute) => {
        if (attribute) {

            // If emails
            if (attribute==="nodeId" && (eventType === "engageful_email_delivered"
            || eventType === "engageful_email_opened"
            || eventType === "engageful_email_clicked")) {
                const returnData = [];
                currentAvailableEmails.forEach((cae) => {
                    returnData.push(cae.id);
                })
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return new Promise ((resolve, reject) => {
                    resolve(returnData);
                })
            }

            const headers = new Headers({ "Content-Type": "application/json" });
            headers.set("Authorization", `Bearer ${token}`);
            return new Promise((resolve, reject) => {
                fetch(
                    `${ApiUrl}/websites/${WebsiteId}/users/getValuesOfEvent`,
                    {
                        method: "POST",
                        headers,
                        body: JSON.stringify({
                            eventType,
                            field: attribute,
                            limit: 30,
                            offset: 0,
                        }),
                    }
                )
                    .then((response) => response.json())
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((e) => { })
                    .finally(() => { });
            });
        }
        return Promise.resolve([]);
    };

    const onValueSelect = (data) => {
        if (data.comparison) {
            if (data.action) {
                setSelectedPredicate({
                    ...selectedPredicate,
                    value: data.values,
                    additionalData: data.additionalData,
                    comparison: `${data.action}:${data.comparison}`,
                });
            } else {
                setSelectedPredicate({
                    ...selectedPredicate,
                    value: data.values,
                    additionalData: data.additionalData,
                    comparison: data.comparison,
                });
            }
        } else {
            setSelectedPredicate({
                ...selectedPredicate,
                additionalData: data.additionalData,
                value: data,
            });
        }
    };

    const getAttributeValuesOfEvent = (eventType) => {
        if (eventType) {
            const headers = new Headers({ "Content-Type": "application/json" });
            headers.set("Authorization", `Bearer ${token}`);
            return new Promise((resolve, reject) => {
                fetch(
                    `${ApiUrl}/websites/${WebsiteId}/users/getEventAttributes?eventName=${eventType}`,
                    {
                        method: "GET",
                        headers,
                    }
                )
                    .then((response) => response.json())
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((e) => { })
                    .finally(() => { });
            });
        }
        return Promise.resolve([]);
    };

    // Update last attribute values
    useEffect(() => {
        if (selectedPredicate.type === "event" && allowInlineFilters) {
            setSelectedParentEvent(selectedPredicate.attribute)
            getAttributeValuesOfEvent(selectedPredicate.attribute).then((d) => {
                setInlineFilterDictionary(d.attributes)
            });
        }
        if (selectedPredicate.attribute !== lastAttribute) {
            setLastAttribute(selectedPredicate.attribute);
            if (allowInlineFilters) {
                getAttributeValues(selectedPredicate.attribute).then((d) => {
                    setAvailableAttributeValues(d);
                });
            } else {
                getEventValues(parentEvent, selectedPredicate.attribute).then((d) => {
                    setAvailableAttributeValues(d);
                });
            }
        }
        if (selectedPredicate.type !== lastType) {
            setLastType(selectedPredicate.type);
            onValueSelect([]);
            if (selectedPredicate.type === "event") {
                if (selectedPredicate.comparison.includes("notTotal")) {
                    onValueSelect([]);
                } else if (selectedPredicate.comparison.includes("total")) {
                    onValueSelect([1, 10]);
                }
            }
        }
        onChange(selectedPredicate, keyIndex);
    }, [selectedPredicate]);

    const onPredicateSelect = (data) => {
        setSelectedPredicate(data);
    };

    const onOperatorSelect = (data) => {
        setSelectedPredicate({
            ...selectedPredicate,
            comparison: data,
        });
    };

    useEffect(() => {
        // Configure mask list
        const masks = [];

        // From emails
        availableEmails.forEach((ae)=> {
            masks.push({
                value: ae.id,
                mask: ae.title,
            });
        })

        setavailableMasks(masks);
    }, [])

    return (
        <>
            {debug ? (
                <pre>{JSON.stringify(selectedPredicate, null, 2)}</pre>
            ) : (
                <></>
            )}
            <PropertySelectorContainer
                label={label}
                onSelect={onPredicateSelect}
                dictionaryName={dictionaryName}
                eventDictionary={eventDictionary}
                dictionary={dictionary}
                predicate={selectedPredicate}
            />
            {selectedPredicate.attribute ? (
                <OperatorSelectorContainer
                    comparison={selectedPredicate.comparison}
                    dataType={selectedPredicate.type}
                    onSelect={onOperatorSelect}
                />
            ) : (
                <></>
            )}
            {selectedPredicate.attribute ? (
                <>
                {selectedPredicate.type === "number" ? 
                <ValueSelectorContainerNumber
                        comparison={selectedPredicate.comparison}
                        availableValues={availableAttributeValues}
                        availableMasks={availableMasks}
                        inputValue={selectedPredicate.value}
                        onSelect={onValueSelect}
                        />
                :
                    <ValueSelectorContainer
                        comparison={selectedPredicate.comparison}
                        availableValues={availableAttributeValues}
                        availableMasks={availableMasks}
                        additionalData={selectedPredicate.additionalData}
                        inputValue={selectedPredicate.value}
                        onSelect={onValueSelect}
                    />
                }
                </>
            ) : (
                <></>
            )}

            {selectedPredicate.type === "event" ? <>
                                <div
                        role="button"
                        tabIndex="0"
                        className="predicateSelectorContainer"
                        style={{marginLeft: "7px"}}
                        onClick={() => {
                            setShowInlineFilter(true);
                        }}
                    >
                        <div
                            className="addPredicate "
                            style={{  height: "35px",
  display: "block",
  position: "relative"
}}
                        >
                    <Filter size="16px" style={{marginRight: "0px", position: "relative", top: "4px"}} />
                    </div>
                    </div>
            </> : <></>}

            
            {selectedPredicate.attribute || keyIndex > 0 ? (
                <>
                    <div
                        role="button"
                        tabIndex="0"
                        className="predicateSelectorContainer"
                        onClick={() => {
                            if (!allowInlineFilters) {
                                if (!selectedPredicate.attribute && !selectedPredicate.comparison) {
                                    onDelete(keyIndex, true);
                                } else {
                                    setSelectedPredicate({value:[]})
                                    onDelete(keyIndex, false);
                                }
                            } else {
                                onDelete(keyIndex, false);
                            }
                        }}
                    >
                        <div
                            className="addPredicate deleteButton"
                            style={{  
                                // height: "35px",
  display: "block",
  position: "relative"
}}
                        >
                            <XCircle size="16px" style={{marginRight: "0px", position: "relative", top: "4px"}} />
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}

            {selectedPredicate.type === "event" && allowInlineFilters && (showInlineFilter || (selectedPredicateInlineFilter && selectedPredicateInlineFilter.attribute))?
            <>
                <div style={{marginTop: "10px",
                                                    display: "flex",
                                                    alignContent: "center",
                                                    alignItems: "center",
                                                    flexFlow: "row wrap",
                                                    width: "100%"
            }}>
                    <div className="inlineFilterLine"/>
                <span className="inlineFilterWhereText">where</span>
                <PredicateSelector 
                label="Add inline filter"
                availableEmails={currentAvailableEmails}
                predicate={selectedPredicateInlineFilter}
                dictionaryName="EVENT PROPERTIES"
                parentEvent={selectedParentEvent}
                dictionary={inlineFilterDictionary}
                eventDictionary={[]}
                onChange={onInlineFilterChange}
                onDelete={onInlineFilterDelete}
                allowInlineFilters={false}/>
</div>
            </> 
        :<></>}
        </>
    );
}
