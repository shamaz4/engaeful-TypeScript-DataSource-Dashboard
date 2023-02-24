/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-useless-concat */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-bitwise */
import React, { memo } from "react";
import { Clock } from "react-feather";
import { Handle } from "react-flow-renderer";

const DelayNode = React.memo(({ data }) => {
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

    const getWaitText = (seconds) => {
        // Hours, minutes and seconds
        const days = ~~(seconds / (24 * 3600));
        const hrs = ~~(seconds / 3600);
        const mins = ~~((seconds % 3600) / 60);

        // Output like "1:01" or "4:03:59" or "123:03:59"
        let ret = "";
        if (days > 0) {
            ret += `${days}d `;
        }
        if (hrs > 0) {
            ret += `${hrs}h `;
        }
        ret += `${mins}m`;
        return ret;
    };
    
    const transformActionToStat = (action, value) => {
        switch (action) {
            case "sent":
                return "Sent";
            case "goal":
                return "Goal";
            case "delivered":
                return "Delivered";
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
            <Handle
                type="target"
                position="left"
                id="a"
                style={{ background: "" }}
            />
            <div>
                <div className="NodeIcon delay">
                    <Clock/>
                </div>
                <span className="NodeText">Wait</span>
            </div>
            <div className="NodeRules delay">
                <span className="messageTitle">
                    <div style={{ display: "block" }}>
                        <span style={{ color: "gray" }}>Wait for</span>{" "}
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
                </span>
            </div>
            <Handle
                type="source"
                position="right"
                id="b"
                style={{
                    background: "",
                    top: "50%",
                }}
            />
            <span
                id={`handle-${data.nodeId}b-text`}
                style={{top: "50%", right: "-103px"}}
                className="NodeActionTextTop"
            >
                WHEN PASSED
            </span>
        </>
    );
});

DelayNode.displayName = "DelayNode";

export default DelayNode;
