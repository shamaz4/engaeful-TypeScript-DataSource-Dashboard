/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-lonely-if */

import React, { useEffect, useState, useRef } from 'react';
import '../PredicateSelectorStyles.css'
import { Activity, Plus, Hash, Type, Calendar, CheckSquare } from "react-feather";
import { usePopper } from 'react-popper';
import { reference } from '@popperjs/core';
import PropertySelector from './components/PropertySelector/PropertySelector'
import StringIcon from './icons/StringIcon';
import DateIcon from './icons/DateIcon';

export default function PredicateEditor({
    predicate,
    dictionaryName,
    dictionary,
    eventDictionary,
    onSelect,
    label = "Add goal"
}) {
    const psRef = useRef();
    const [selectedPredicate, setSelectedPredicate] = useState(predicate);
    const [previousSelectedPredicate, setPreviousSelectedPredicate] = useState();
    const [showSelector, setShowSelector] = useState(false);

    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const [arrowElement, setArrowElement] = useState(null);
    const { styles, attributes } = usePopper(referenceElement, popperElement, { 
        placement:"bottom",
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 10]
                },
            }
        ],
    });



    const getDefaultOperator = (type, previousType, previousComparison) => {
        // This sets the operator when we change from one data type to another
        if (type === previousType) {
            return previousComparison;
        }

        switch (type) {
            case "string":
                return "equals";
            case "number":
                return "equals";
            case "date":
                return "inTheLast";
            case "array":
                return "contains";
            case "boolean":
            case "bool":
                return "isTrue";
            case "event":
                return "total:greaterThanOrEqual";
            default:
                return "equals";
        }
    }

    const selectPredicate = (data) => {
        const newData = {
            ...predicate,
            attribute: data.id,
            type: data.type,
            comparison: getDefaultOperator(data.type, selectedPredicate.type, selectedPredicate.comparison)
        };
        setSelectedPredicate(newData);
        setPreviousSelectedPredicate(newData);
        onSelect(newData);
        setShowSelector(false);
    }

    // Cause updating react state from property is kinda hacky. https://betterprogramming.pub/updating-state-from-properties-with-react-hooks-5d48693a4af8
    if (predicate !== previousSelectedPredicate) {
        setSelectedPredicate(predicate);
        setPreviousSelectedPredicate(predicate);
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

    const getNameFromDictionary = (id) => {
        const mergedDictionary = [...dictionary, ...eventDictionary];
        const res = mergedDictionary.filter(i => i.id === id);
        if (res.length > 0) {
            if (res[0].name) {
                return res[0].name;
            } else {
                return res[0].id;
            }
        } else {
            return id;
        }
    }

    return (
        <div className="predicateSelectorContainer" ref={psRef}>
            {selectedPredicate.attribute ?
                <div role="button" tabIndex="0" onClick={() => { setShowSelector(true) }} className={"addPredicate selected" + (showSelector ? " active" : "")}>
                    {
                        selectedPredicate.type === "event" ?
                        
                        <Activity/>    : <></>
                        // selectedPredicate.type === "string" ? 
                        //     <StringIcon/>
                        //     :
                        //     selectedPredicate.type === "number" ? <Hash /> :
                        //     selectedPredicate.type === "boolean" ? <CheckSquare /> :
                        //         selectedPredicate.type === "date" ? <DateIcon/> :
                        //             selectedPredicate.type === "event" ? <Activity /> :
                        //                 <Type strokeWidth="3px" size="1px" />

                    }
                    <span className="textAligned">{getNameFromDictionary(selectedPredicate.attribute)}</span>
                </div>
                :
                <div role="button" tabIndex="0" onClick={() => { setShowSelector(true) }} className={"addPredicate " + (showSelector ? " active" : "")}>
                    <Plus /> <span className="textAligned">{label}</span>
                </div>
            }
            <div ref={setReferenceElement}>
            {showSelector ?
            <div ref={setPopperElement} className="popperContainer" style={styles.popper} {...attributes.popper}>
                <PropertySelector
                dictionaryName={dictionaryName}
                predicate={selectedPredicate.attribute} eventDictionary={eventDictionary} dictionary={dictionary} onSelect={selectPredicate} />
                </div>
                : <></>}
            </div>
        </div>
    );
}
