/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-useless-concat */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-bitwise */
import React, { memo } from "react";
import { Handle } from "react-flow-renderer";

const ActionNode = React.memo(({ data }) => {
    console.log(data);
    const getIcon = () => {
        switch (data.action.action) {
            case "email":
                return (
                    <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                );
            case "slack":
                    return (
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
width="30" height="30"
viewBox="0 0 30 30"
style={{fill:"#3875c3"}}>
        <path style={{fill:"#3875c3"}} d="M 16.644531 2.0058594 C 16.365063 1.9841719 16.077422 2.0168281 15.794922 2.1113281 C 14.664922 2.4893281 14.053641 3.71375 14.431641 4.84375 L 15.324219 7.5117188 L 10.236328 9.2128906 L 9.3828125 6.6601562 C 9.0048125 5.5301563 7.7803906 4.9208281 6.6503906 5.2988281 C 5.5193906 5.6768281 4.9110625 6.8992969 5.2890625 8.0292969 L 6.1425781 10.582031 L 3.4746094 11.474609 C 2.3446094 11.852609 1.7333281 13.075078 2.1113281 14.205078 C 2.4893281 15.335078 3.71375 15.946359 4.84375 15.568359 L 7.5117188 14.675781 L 9.2128906 19.763672 L 6.6601562 20.617188 C 5.5301563 20.995187 4.9208281 22.219609 5.2988281 23.349609 C 5.6768281 24.480609 6.8992969 25.088938 8.0292969 24.710938 L 10.582031 23.857422 L 11.474609 26.525391 C 11.852609 27.655391 13.075078 28.266672 14.205078 27.888672 C 15.335078 27.510672 15.945359 26.28625 15.568359 25.15625 L 14.675781 22.488281 L 19.763672 20.785156 L 20.617188 23.339844 C 20.995187 24.469844 22.219609 25.079172 23.349609 24.701172 C 24.480609 24.323172 25.089891 23.100703 24.712891 21.970703 L 23.857422 19.416016 L 26.525391 18.523438 C 27.655391 18.145437 28.266672 16.922969 27.888672 15.792969 C 27.510672 14.662969 26.28625 14.053641 25.15625 14.431641 L 22.488281 15.324219 L 20.787109 10.236328 L 23.339844 9.3828125 C 24.469844 9.0048125 25.079172 7.7803906 24.701172 6.6503906 C 24.323172 5.5203906 23.100703 4.9110625 21.970703 5.2890625 L 19.417969 6.1425781 L 18.525391 3.4746094 C 18.241891 2.6271094 17.482937 2.0709219 16.644531 2.0058594 z M 16.693359 11.605469 L 18.394531 16.693359 L 13.306641 18.394531 L 11.605469 13.306641 L 16.693359 11.605469 z"/></svg>
                    )
            case "tour":
                return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
</svg>
            case "messagebox":
            case "imagebox":
            case "announcementbar":
            case "tooltip":
            case "modalbox":
                return (
                    <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            case "review":
                return (
                    <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            default:
                return (
                    <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
        }
    };
    const getTitle = () => {
        switch (data.action.action) {
            case "messagebox":
                return "In-app message";
            case "imagebox":
                return "In-app message";
            case "announcementbar":
                return "Banner";
            case "modalbox":
                return "Modal box";
            case "tooltip":
                return "Tooltip";
            case "tour":
                return "Tour";
            case "slack":
                return "Slack";
            case "email":
                return "Email";
            default:
                return "Unknown";
        }
    };

    const getIconStyle = () => {
        switch (data.action.action) {
            case "review":
                return {};
            default:
                return {};
        }
    };

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
            case "not_online":
                return "Not online";
            case "delivered":
                return "Delivered";
            case "excluded":
                return "Excluded";
            case "opened":
                return "Opened";
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
                <div style={getIconStyle()} className="NodeIcon action">
                    {getIcon()}
                </div>
                <span className="NodeText">{getTitle()}</span>
            </div>
            <div className="NodeRules action">
                {data.action.action === "slack" ? 
                    <span className="messageTitle">
                        {data.name ? data.name : data.action.config.message}
                    </span>
                :
                    <span className="messageTitle">
                        {data.name ? data.name : data.action.config.title}
                    </span>
                }
                {[
                    "messagebox",
                    "imagebox",
                    "announcementbar",
                    "modalbox",
                    "tooltip",
                    "tour",
                ].includes(data.action.action) ? (
                    <div style={{ display: "block" }}>
                        <span style={{ color: "gray" }}>Wait up to</span>{" "}
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
                ) : null}
            </div>
            <Handle
                type="source"
                position="right"
                id="b"
                style={{
                    background: "",
                    top: ["email", "slack"].includes(data.action.action) ? "50%" : "20%",
                }}
            />
            <span
                id={`handle-${data.nodeId}b-text`}
                style={{ top: ["email", "slack"].includes(data.action.action) ? "50%" : "20%" }}
                className="NodeActionTextTop"
            >{!["email", "slack"].includes(data.action.action) ? "When delivered" : "When sent"}</span>
            {!["email", "slack"].includes(data.action.action) ? (
                <>
                    <Handle
                        type="source"
                        position="right"
                        id="c"
                        style={{ background: "", top: "80%" }}
                        onConnect={(e) => { }}
                    />
                    <span
                        id={`handle-${data.nodeId}c-text`}
                        className="NodeActionTextBottom"
                    >
                        If Not Online After Waiting
                    </span>
                </>
            ) : (
                ""
            )}
        </>
    );
});

ActionNode.displayName = "ActionNode";

export default ActionNode;
