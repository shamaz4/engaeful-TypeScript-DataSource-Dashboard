/* eslint-disable no-unreachable */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useEffect, useState } from "react";
import { Plus } from "react-feather";
import PredicateSelector from "../predicateselector/PredicateSelector";

export const PredicateGroup = ({
    debug = false,
    predicates = [
        {
            value: [],
            type: "",
            attribute: "",
            comparison: "",
        },
    ],
    predicateOperator = "and",
    campaignData = false,
    dictionary = [],
    eventDictionary = [],
    noMatchIf = false,
    onChange = (data: any) => { },
}) => {
    const [selectedPredicates, setSelectedPredicates] = useState(predicates);
    const [selectedPredicatesFormatted, setSelectedPredicatesFormatted] = useState(false);
    const [selectedPredicateOperator, setSelectedPredicateOperator] = useState(predicateOperator);
    const [canAddMorePredicates, setCanAddMorePredicates] = useState(false);
    const [availableEmails, setavailableEmails] = useState([]);
    useEffect(() => {
        onChange({
            predicates: selectedPredicates,
            operator: selectedPredicateOperator,
        });
    }, [selectedPredicates]);

    useEffect(() => {
        onChange({
            predicates: selectedPredicates,
            operator: selectedPredicateOperator,
        });
    }, [selectedPredicateOperator]);

    const formatPredicatesOnMount = () => {
        const newPredicates = [];
        selectedPredicates.forEach((sp) => {
            if (sp.attribute && sp.attribute.includes("event:")) {
                const split = sp.attribute.split(":");
                newPredicates.push({
                    _id: sp._id,
                    value: sp.value,
                    type: split[0],
                    attribute: split[1],
                    additionalData: sp.additionalData,
                    comparison: `${split[2]}:${sp.comparison}`,
                });
            } else {
                const valueArray = [];
                if (sp && sp.value) {
                    sp.value.forEach((spv) => {
                        valueArray.push({ value: spv, checked: true });
                    });
                }

                newPredicates.push({
                    _id: sp._id,
                    value: sp.value,
                    type: sp.type,
                    additionalData: sp.additionalData,
                    attribute: sp.attribute,
                    comparison: sp.comparison,
                });
            }
        });
        setSelectedPredicates(newPredicates);
        setSelectedPredicatesFormatted(true);
    };

    useEffect(() => {
        setCanAddMorePredicates(false);
        formatPredicatesOnMount();
    }, []);

    const handleChange = (data, key) => {
        const newPredicates = [];
        selectedPredicates.forEach((sp, i) => {
            if (i === key) {
                newPredicates.push(data);
            } else {
                newPredicates.push(sp);
            }
        });
        setSelectedPredicates(newPredicates);
    };

    const handleDelete = (key) => {
        const newPredicates = [];
        let deletedKey;
        selectedPredicates.forEach((sp, i) => {
            if (i !== key) {
                newPredicates.push(sp);
            } else {
                deletedKey = `${sp._id}${i}`;
            }
        });
        if (newPredicates.length === 0) {
            // Bug to remove last key
            setSelectedPredicates([
                {
                    _id: deletedKey,
                    value: [],
                },
            ]);
            setSelectedPredicates([
                {
                    _id: `new_predicate_${Date.now()}`,
                    value: [],
                },
            ]);
        } else {
            setSelectedPredicates(newPredicates);
        }
        onChange({
            predicates: selectedPredicates,
            operator: selectedPredicateOperator,
        });
    };

    const addNewPredicate = () => {
        setCanAddMorePredicates(false);
        setSelectedPredicates([
            ...selectedPredicates,
            {
                _id: `new_predicate_${Date.now()}`,
                value: [],
                type: "",
                attribute: "",
                comparison: "",
            },
        ]);
    };

    const changeOperator = () => {
        if (selectedPredicateOperator === "and") {
            setSelectedPredicateOperator("or");
        } else {
            setSelectedPredicateOperator("and");
        }
    };

    const checkIfCanAddMorePredicates = () => {
        const lastPredicate = selectedPredicates[selectedPredicates.length - 1];
        if (selectedPredicates.length > 0) {
            if (lastPredicate.attribute) {
                if (["set", "notSet", "isTrue", "isFalse"].includes(lastPredicate.comparison)) {
                    setCanAddMorePredicates(true);
                    return;
                }
                if (lastPredicate.value.length > 0) {
                    setCanAddMorePredicates(true);
                }
            } else {
                setCanAddMorePredicates(false);
            }
        }
    };

    useEffect(() => {
        checkIfCanAddMorePredicates();
    }, [selectedPredicates]);


    const getEmailsInCurrentCampaign = () => {
        const newAvailableEmails = [];
        if (campaignData && campaignData.nodes)
        {
            campaignData.nodes.forEach((n) => {
                if (n.type === "message" && (n.action && n.action.action === "email")) {
                    newAvailableEmails.push({
                        id: n._id,
                        title: n.action.config.title,
                    })
                }
            })
        }
        setavailableEmails(newAvailableEmails)
    }

    useEffect(() => {
        getEmailsInCurrentCampaign();
    }, [campaignData])


    return (
        <>
            {selectedPredicatesFormatted ? (
                <div style={{ padding: "0px" }}>
                    {debug ? (
                        <pre>{JSON.stringify(selectedPredicates, null, 2)}</pre>
                    ) : (
                        <></>
                    )}
                    {!noMatchIf ?
                    <span
                        style={{
                            fontSize: "15px",
                            fontWeight: "500",
                            marginBottom: "10px",
                        }}
                    >
                        Match if
                    </span>
                    : <></>}
                    {selectedPredicates.map((sp, i) => {
                        return (
                            <>
                                <div
                                    style={{
                                        marginTop: "10px",
                                        display: "flex",
                                        alignContent: "center",
                                        alignItems: "center",
                                        flexFlow: "row wrap"
                                    }}
                                >
                                    {i !== 0 ? (
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            className="andOrButtonSelector"
                                            onClick={changeOperator}
                                        >
                                            {selectedPredicateOperator}
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                    <PredicateSelector
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={`${sp._id}${i}`}
                                        label="Add rule"
                                        predicate={sp}
                                        debug={debug}
                                        keyIndex={i}
                                        dictionary={dictionary}
                                        eventDictionary={eventDictionary}
                                        availableEmails={availableEmails}
                                        onChange={handleChange}
                                        onDelete={handleDelete}
                                    />
                                </div>
                            </>
                        );
                    })}
                    {canAddMorePredicates ? (
                        <div
                            style={{
                                position: "",
                                display: "block",
                                marginTop: "10px",
                            }}
                            className="predicateSelectorContainer"
                        >
                            <div
                                role="button"
                                onClick={addNewPredicate}
                                className="addPredicate"
                                tabIndex={0}
                            >
                                <Plus /> <span className="textAligned">Add</span>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            ) : (
                <></>
            )}
        </>
    );

}