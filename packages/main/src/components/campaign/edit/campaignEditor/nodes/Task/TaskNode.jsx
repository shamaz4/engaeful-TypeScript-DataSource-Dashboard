/* eslint-disable no-useless-concat */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-bitwise */
import React, { memo } from "react";
import { Clock } from "react-feather";
import { Handle } from "react-flow-renderer";

const TaskNode = React.memo(({ data }) => {
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

    return (
        <>
            <Handle
                type="target"
                position="left"
                id="a"
                style={{ background: "" }}
            />
            <div>
                <div className="NodeIcon playbook">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path
                                    fillRule="evenodd"
                                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                </div>
                <span className="NodeText">Create a task</span>
            </div>
            <div className="NodeRules playbook">
                <span className="messageTitle">
                    <span className="messageTitle">{data && data.task && data.task.name ? data.task.name : "New task"}</span>
                    <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{ display: "block" }}>
                        <span style={{ color: "gray" }}>Due in</span>{" "}
                        <u>{data.task.dueDate.intervalValue} {data.task.dueDate.interval}{data.task.dueDate.intervalValue > 1 ? "s" : ""}</u>
                    </div>
                    <div style={{ display: "block" }}>
                        <span style={{ color: "gray" }}>Assign to</span>{" "}
                        <u>Farouq Aldori</u>
                    </div>
                    </div>
                </span>
            </div>
            <Handle
                type="source"
                position="right"
                id="b"
                style={{
                    background: "",
                    top: "20%",
                }}
            />
            <span
                id={`handle-${data.nodeId}b-text`}
                style={{top: "20%", right: "-127px"}}
                className="NodeActionTextTop"
            >
                WHEN COMPLETED
            </span>
            <Handle
                type="source"
                position="right"
                id="c"
                style={{
                    background: "",
                    top: "80%",
                }}
            />
            <span
                id={`handle-${data.nodeId}c-text`}
                style={{top: "80%", right: "-172px"}}
                className="NodeActionTextTop"
            >
                WHEN DUE DATE PASSED
            </span>
        </>
    );
});

TaskNode.displayName = "TaskNode";

export default TaskNode;
