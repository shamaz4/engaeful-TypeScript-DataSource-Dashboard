/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable radix */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/naming-convention */
import React from "react";
import { defaultEvents, defaultTypes } from "@doar/shared/data/api-keys";

export default function PredicateDisplay({ _predicate = {} }) {
    const _userTypes = [];
    const userTypes = [...defaultTypes, ..._userTypes, ...defaultEvents];

    const convertOperatorToText = (operator) => {
        switch (operator) {
            // String
            case "equals":
                return "is equal to";
            case "notEquals":
                return "is not equal to";
            case "contains":
                return "contains";
            case "notContains":
                return "does not contain";
            case "isSet":
                return "is set";
            case "notSet":
                return "is not set";
            // Date
            case "before":
                return "is before";
            case "inTheNext":
                return "is in the next";
            case "inTheLast":
                return "is in the last";
            case "notInTheLast":
                return "not is in the last";
            case "between":
                return "is between";
            case "notBetween":
                return "is not between";
            case "on":
                return "is on";
            case "notOn":
                return "is not on";
            case "after":
                return "is after";
            case "since":
                return "since";
            // String
            case "isTrue":
                return "is true";
            case "isFalse":
                return "is false";
            // numbers
            case "greaterThanOrEqual":
                return "greater than or equals";
            default:
                return operator;
        }
    };

    const convertValueDependingOnOpeartor = (type, operator, value, additionalData) => {
        switch (operator) {
            case "equals":
            case "notEquals":
                return value.join(" or ");
            case "contains":
            case "greaterThanOrEqual":
                return value[0];
            case "between":
            case "notBetween":
                if (type === "date") {
                const dateText1 = new Date(parseFloat(value[0])).toLocaleDateString("en-US", { // you can use undefined as first argument
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                });

                const dateText2 = new Date(parseFloat(value[0])).toLocaleDateString("en-US", { // you can use undefined as first argument
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                });
                    return `${dateText1} and ${dateText2}`;
                }
                return `${value[0]} and ${value[1]}`;
            case "before":
            case "since":
            case "on":
            case "notOn":
                const dateText = new Date(parseFloat(value[0])).toLocaleDateString("en-US", { // you can use undefined as first argument
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                });
                return dateText;
            case "inTheLast":
            case "notInTheLast":
            case "inTheNext":
                if (additionalData.dateFilter) {
                    return `${additionalData.dateFilter.value > 1 ? additionalData.dateFilter.value : "" } ${additionalData.dateFilter.value > 1 ? `${additionalData.dateFilter.period  }s` : additionalData.dateFilter.period     }`;
                }
                return value;
            default:
                return value;
        }
    };
    const getTypeName = (predicate) => {
        const typeName = userTypes.filter(
            (ut) => ut.id === predicate.attribute
        );
        let type = typeName.length > 0 ? typeName[0].name : predicate.attribute;

        // Event types
        if (predicate && predicate.attribute) {
            if (predicate.attribute.includes("event:")) {
                const [
                    predicateType,
                    eventName,
                    eventOperation,
                ] = predicate.attribute.split(":");
                const eventTypeName = userTypes.filter(
                    (ut) => ut.id === eventName
                );
                const eventNameFromDictionary = eventTypeName.length > 0 ? eventTypeName[0].name : eventName;
                let additionalText = "";
                switch (eventOperation) {
                    case "total":
                        if (predicate.additionalData && predicate.additionalData.dateFilter && predicate.additionalData.dateFilter.range === "inTheLast") {
                            additionalText = ` in the last ${predicate.additionalData.dateFilter.value > 1 ? predicate.additionalData.dateFilter.value : "" } ${predicate.additionalData.dateFilter.value > 1 ? `${predicate.additionalData.dateFilter.period  }s` : predicate.additionalData.dateFilter.period     }`;
                        }
                        type = `"${eventNameFromDictionary}" trigger count ${additionalText}`;
                        break;
                    case "notTotal":
                        if (predicate.additionalData && predicate.additionalData.dateFilter && predicate.additionalData.dateFilter.range === "inTheLast") {
                            additionalText = ` in the last ${predicate.additionalData.dateFilter.value > 1 ? predicate.additionalData.dateFilter.value : "" } ${predicate.additionalData.dateFilter.value > 1 ? `${predicate.additionalData.dateFilter.period  }s` : predicate.additionalData.dateFilter.period     }`;
                        } else {
                            additionalText = " at all"
                        }
                        type = `"${eventNameFromDictionary}" has not been triggered ${additionalText}`;
                        break;
                    default:
                }
            }
        }

        return type;
    };

    return (
        <>
            <span className="typeName" style={{ whiteSpace: "" }}>
                {getTypeName(_predicate)}
            </span>{" "}
            {getTypeName(_predicate).includes("has not been triggered") ? <></> :
            <>
            <span style={{ whiteSpace: "" }}>
                {convertOperatorToText(_predicate.comparison)}
            </span>{" "}
            <span style={{ whiteSpace: "" }} className="typeName">
                {convertValueDependingOnOpeartor(
                    _predicate.type,
                    _predicate.comparison,
                    _predicate.value,
                    _predicate.additionalData
                )}
            </span>
            </>}
        </>
    );
}
