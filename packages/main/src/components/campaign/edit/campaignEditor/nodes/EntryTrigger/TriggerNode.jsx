/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable import/extensions */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-bitwise */

import React from "react";
import { Handle } from "react-flow-renderer";
import PredicateDisplayGroup from "../../predicateDisplay/PredicateDisplayGroup.jsx";

const TriggerNode = React.memo(({ data }) => {

    const getWait = (seconds) => {
        // Hours, minutes and seconds
        const days = ~~(seconds / (24 * 3600));
        const hrs = ~~(seconds / 3600);
        const mins = ~~((seconds % 3600) / 60);

        // Output like "1:01" or "4:03:59" or "123:03:59"
        let ret = "";
        if (days > 0) {
            ret += `${days}d and `;
        }
        if (hrs > 0) {
            ret += `${hrs}h and `;
        }
        ret += `${mins}m`;
        return ret;
    };


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
                <span className="NodeText">Rules</span>
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
                {/* TODO: Add delay to match */}
                {data.evaluationValues.days === 0 && data.evaluationValues.hours === 0 && data.evaluationValues.minutes === 0 ?
                <></>
                :
                <div style={{ display: "block" }}>
                        <span style={{ color: "gray" }}>Try to match for</span>{" "}
                        <u>
                        {data.evaluationValues.days && data.evaluationValues.days > 0? (
                                ` ${data.evaluationValues.days}d`
                            ) : (
                                <></>
                            )}
                            {data.evaluationValues.hours && data.evaluationValues.hours > 0? (
                                ` ${data.evaluationValues.hours}h`
                            ) : (
                                <></>
                            )}
                            {data.evaluationValues.minutes && data.evaluationValues.minutes > 0? (
                                ` ${data.evaluationValues.minutes}m`
                            ) : (
                                <></>
                            )}
                        </u>
                    </div>
}
            </div>
            <Handle
                type="target"
                position="left"
                id="a"
                style={{ background: "" }}
            />
            <Handle
                type="source"
                position="right"
                id="b"
                style={{ background: "", top: "20%" }}
            />
            <span
                id={`handle-${data.nodeId}b-text`}
                style={{ top: "20%", right: "-111px" }}
                className="NodeActionTextTop"
            >
                WHEN MATCHED
            </span>
            <Handle
                type="source"
                position="right"
                id="c"
                style={{ background: "", top: "80%" }}
                onConnect={() => { }}
            />
            <span
                id={`handle-${data.nodeId}c-text`}
                style={{ right: "-125px" }}
                className="NodeActionTextBottom"
            >
                IF NOT MATCHED
            </span>
        </>
    );
});

TriggerNode.displayName = "TriggerNode";

export default TriggerNode;
