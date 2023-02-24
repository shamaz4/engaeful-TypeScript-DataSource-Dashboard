/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-lonely-if */

import { useHover } from '@doar/shared/hooks';
import React, { useEffect, useState, useRef } from 'react';
import { Activity, Add, Hash, Type, Calendar, CheckSquare } from "react-feather";
import BoolIcon from '../../icons/BoolIcon';
import DateIcon from '../../icons/DateIcon';
import ListIcon from '../../icons/ListIcon';
import NumberIcon from '../../icons/NumberIcon';
import StringIcon from '../../icons/StringIcon';

const PredicateSelectorSearchBar = ({ value, onChange }) => {
    return (
        <div className="predicateSelectorSearchBarContainer">
            <input type="text" className="predicateSelectorSearchBar" onChange={(event) => onChange(event.target.value)} placeholder="Search" />
        </div>
    )
}

const PredicateSelectorItem = ({ id, type, title, selected, clickHandler, hoverHandler, hoverExitHandler }) => {
    return (
        <div role="button" 
        onMouseEnter={() => {
            hoverHandler({
                type
            })
        }}
        onMouseLeave={() => {
            hoverExitHandler()
        }}
        tabIndex="0" className={"predicateSelectorItem " + (selected ? " selected" : "")} onClick={() => { clickHandler({ id, type, title }) }}>
            {type === "string" ? <StringIcon/> :
                type === "number" ? <NumberIcon /> :
                type === "boolean" || type === "bool"?  <BoolIcon/> :
                    type === "date" ? <DateIcon/> :
                    type === "array" ? <ListIcon/> :
                        type === "event" ? <Activity strokeWidth="3px"  size="14px" /> :
                            <></>}
            <span  className="textAligned" style={{marginLeft:"10px"}}>{title}</span>
        </div>
    )
}


export default function PredicateEditor({
    predicate = "",
    dictionary,
    dictionaryName,
    eventDictionary,
    onSelect
}) {
    const psRef = useRef();
    const [selectedPredicate, setSelectedPredicate] = useState(predicate);
    const [showSelector, setShowSelector] = useState(false);
    const [searchBarValue, setSearchBarValue] = useState("");
    const hoverRef = useRef(null);
    const isHover = useHover(hoverRef);
    const [hoveredItem, sethoveredItem] = useState(null);

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

    const onSearchChange = (data) => {
        setSearchBarValue(data);
    }

    return (
        <>
        {hoveredItem && hoveredItem.description? 
            <div className="predicateSelector" style={{
                position: "absolute",
                left: "calc(100% + 10px)",
                minWidth: "250px",
                padding: "10px"
            }} >
            <div className="predicateSelectorItemsContainer" style={{ "overflowY": "auto", "maxHeight": "243px" }}>
                <p style={{
                    marginBottom: "10px",
                    fontWeight: 500,
                    fontSize: "16px"
                }}>
                    {hoveredItem.name ? hoveredItem.name : hoveredItem.id}
                </p>
                {hoveredItem.description}
                {hoveredItem.default ? 
                <i style={{
                    marginTop: "10px",
                    display:"block",
                    color: "gray"
                }}>
                    Default Engageful event
                </i>: <></>}
            </div>
            </div>
            : <></>}
            <div className="predicateSelector" ref={psRef}>
                <PredicateSelectorSearchBar value="" onChange={onSearchChange} />
                <div className="predicateSelectorItemsContainer" style={{ "overflowY": "auto", "maxHeight": "243px" }}>
                    {dictionary.length === 0 && eventDictionary.length === 0 ?
                    <div style={{
                        textAlign: "center",
                        color: "gray",
                        fontStyle:"italic",
                        margin: "10px"
                    }}>Nothing to filter with</div> 
                    : <></>}

                    {dictionary.length > 0 ? 
                        <>
                    <span className="categoryName">{dictionaryName}</span>
                    {
                        dictionary.map((o) => {
                            let doReturn = false;
                            if (searchBarValue !== "") {
                                if ((o.id && o.id.toLowerCase().includes(searchBarValue.toLowerCase())) || (o.name && o.name.toLowerCase().includes(searchBarValue.toLowerCase()))) {
                                    doReturn = true;
                                }
                            } else {
                                doReturn = true;
                            }
                            if (doReturn) {
                                return (
                                    <>
                                    <PredicateSelectorItem 
                                    hoverHandler={(data) => {
                                        sethoveredItem(o)
                                    }}
                                    hoverExitHandler={() => {
                                        sethoveredItem(null)
                                    }}
                                    selected={predicate === o.id}
                                    clickHandler={onSelect} 
                                    id={o.id}
                                    title={o.name ? o.name : o.id} 
                                    type={o.type} />
                                    </>
                                )
                            } else {
                                return <></>
                            }
                        })
                    }
                    </>
                    : <></>}
                    {eventDictionary.length > 0 ? 
                    <>
                    <span className="categoryName">EVENTS</span>
                    {
                        eventDictionary.map((o) => {
                            let doReturn = false;
                            if (searchBarValue !== "") {
                                if ((o.id && o.id.toLowerCase().includes(searchBarValue.toLowerCase())) || (o.name && o.name.toLowerCase().includes(searchBarValue.toLowerCase()))) {
                                    doReturn = true;
                                }
                            } else {
                                doReturn = true;
                            }
                            if (doReturn) {
                                return (
                                    <PredicateSelectorItem 
                                    hoverHandler={(data) => {
                                        sethoveredItem(o)
                                    }}
                                    hoverExitHandler={() => {
                                        sethoveredItem(null)
                                    }}
                                    selected={predicate === o.id} clickHandler={onSelect} id={o.id} title={o.name ? o.name : o.id} type={o.type} />
                                )
                            } else {
                                return <></>
                            }
                        })
                    }
                    </>
                    : <></>}
                </div>
            </div>
        </>
    );
}
