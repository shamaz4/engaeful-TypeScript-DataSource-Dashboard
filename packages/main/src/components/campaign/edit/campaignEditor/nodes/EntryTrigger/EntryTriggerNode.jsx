/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { memo } from "react";
import { Handle } from "react-flow-renderer";
import PredicateDisplay from "../../predicateDisplay/PredicateDisplay.jsx";
import PredicateDisplayGroup from "../../predicateDisplay/PredicateDisplayGroup.jsx";

const EntryTriggerNode = React.memo(({ data }) => {
    
    const transformActionToStat = (action, value) => {
        switch (action) {
            case "waiting":
                return "Waiting";
            case "matched":
                return "Matched";
            case "not_matched":
                return "Not matched";
            case "clicked":
                return "Clicked";
            default: 
                return action;
        }
    }


    return (
        <>
            {data.statistics  && data.statistics.length > 0? 
            <div className="nodeStats">
                {}
                {data.statistics.map((ds) => {
                    return <div key={ds._id}><span style={{fontWeight: 500}}>{transformActionToStat(ds._id)}</span> {ds.count}</div>
                })}
            </div>
            : <></>}
            <div>
                <div className="NodeIcon trigger">
                    <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <span className="NodeText">Entry rules</span>
            </div>
            <div className="NodeRules trigger">
                {data.name ? (
                    data.name
                ) : (
                    <PredicateDisplayGroup
                        _predicates={data.filters}
                        _predicatersOperator={data.filterOperator}
                    />
                )}
            </div>
            <Handle
                type="source"
                position="right"
                id="b"
                style={{ background: "" }}
            />
            <span
                id={`handle-${data.nodeId}b-text`}
                style={{ top: "50%", right: "-111px" }}
                className="NodeActionTextTop"
            >
                WHEN MATCHED
            </span>
        </>
    );
});

EntryTriggerNode.displayName = "EntryTriggerNode";

export default EntryTriggerNode;
