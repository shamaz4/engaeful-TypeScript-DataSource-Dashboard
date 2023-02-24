/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-nested-ternary */

import { CardTitle } from "@doar/components";
import { useHover } from "@doar/shared/hooks";
import { formatDistance } from "date-fns";
import { FC, useRef, useEffect, useState } from "react";
import { ArrowDown, ChevronDown, ChevronUp, Edit, Edit2, Edit3 } from "react-feather";
import { toast } from "react-toastify";

interface IProps {
    data: any;
}

const HealthItem: FC<IProps> = ({ name, score, scores = [], lastItem = false, weight=0 }) => {
    const [expanded, setexpanded] = useState(false);

    const getColor = (_score: number) => {
        if (scores.length > 0 && _score >= 0 && _score <= 3.3333333333333333333333) {
            return "#ee5752";
        }
        if (_score >= 3.4 && _score <= 6.66666666666666666666) {
            return "#fcc752";
        }
        if (_score >= 6.7 && _score <= 10) {
            return "#0bc078";
        }
        return "rgb(209 209 209)";
    };

    const getScoreTag = (_score: number) => {
        if (scores.length > 0 && _score >= 0 && _score <= 3.3333333333333333333333) {
            return "Poor";
        }
        if (_score >= 3.4 && _score <= 6.66666666666666666666) {
            return "Concerning";
        }
        if (_score >= 6.7 && _score <= 10) {
            return "Healthy";
        }
        return "Unknown";
    };

        return (
        <>
        {name === "Overall health" ? 
            <div style={{marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgb(235, 236, 241)'}}>
                <CardTitle as="h6">
                    {name}
                    <div style={{float: 'right'}}>{parseFloat(score).toFixed(2)}</div>
                </CardTitle>
                <div style={{width: '100%', height: '3px', background: '#e0e0e0', borderRadius: '15px'}}>
                    <div style={{width: `${(score/10)*100}%`, height: "3px", background: getColor(score) }}/> 
                </div>
            </div>
        : 
        <div style={{marginBottom: !lastItem ? '20px' : "10px", paddingBottom: !lastItem ? '20px' : false}}>
                <CardTitle as="h6" style={{cursor:"pointer", paddingLeft: "20px"}} onClick={() => {setexpanded((_expanded) => !_expanded)}}>
                    {expanded ? 
                    <ChevronUp style={{
                    position: "absolute",
                    marginLeft: "-20px",
                    width: "16px",
                    marginTop: "-2px"
                    }}/>
                    : 
                    <ChevronDown style={{
                        position: "absolute",
                        marginLeft: "-20px",
                        width: "16px",
                        marginTop: "-2px"
                        }}/>
                    }
                    {name} <span style={{marginLeft: '5px', color: 'rgb(111, 116, 136)', fontSize: '0.75rem', fontWeight: 600}}>(Weight: {weight}%)</span>
                    <div style={{float: 'right'}}>{parseFloat(score).toFixed(2)}</div>
                </CardTitle>
                <div style={{width: '100%', height: '3px', background: '#e0e0e0', borderRadius: '15px'}}>
                    <div style={{width: `${(score/10)*100}%`, height: "3px", background: getColor(score) }}/> 
                </div>
                {expanded ?
                <div>
                    {scores.map(s => (
                        <div key={s._id} style={{paddingLeft: '10px', paddingTop: '10px', marginBottom: "10px", marginTop: "10px"}}>
                            <CardTitle as="h6"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                            >
                                <div>
                                    <div style={{width: '16px', height: '12px', borderLeft: '1px solid #e2e2e2', borderBottom: '1px solid #e2e2e2', borderRadius: '0px 0px 0px 5px', display: "inline-block", marginRight: "10px"}} />
                                    {s.name}
                                </div>
                                <div style={{float: 'right'}}>{parseFloat(s.score).toFixed(2)}</div>
                            </CardTitle>
                            <div style={{paddingLeft: "25px"}}>
                            <div style={{ width: '100%', height: '3px', background: '#e0e0e0', borderRadius: '15px'}}>
                                <div style={{ width: `${(s.score/10)*100}%`, height: "3px", background: getColor(s.score) }}/> 
                            </div>
                            </div>
                        </div>
                    ))}
                </div>
                : <></>}
            </div>
        }
        </>
        )

};

export default HealthItem;
