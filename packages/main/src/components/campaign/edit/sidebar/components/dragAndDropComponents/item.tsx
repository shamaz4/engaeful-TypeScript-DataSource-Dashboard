import { FC, MouseEvent } from "react";
import {
    Avatar,
    AvatarInitial,
    MediaBody,
    Heading,
    Text,
    Badge,
} from "@doar/components";
import {
    Activity,
    Calendar,
    Check,
    CheckCircle,
    CheckSquare,
    Clock,
    Share2,
} from "react-feather";
import { StyledItem } from "./style";

interface IProps {
    name: string;
    nodeType: string;
    params?: string;
}

const Item: FC<IProps> = ({ name, nodeType, params }) => {
    const onDragStart = (
        _event: React.DragEvent,
        _nodeType: string,
        _params = ""
    ) => {
        _event.dataTransfer.setData("application/reactflow", _nodeType);
        _event.dataTransfer.setData("params", _params);
        _event.dataTransfer.setData("effectAllowed", "move");
    };

    const getType = () => {
        switch (nodeType) {
            case "entryTriggerNode":
            case "triggerNode":
                return "trigger";
            case "message":
                return "action";
            case "playbook":
                return "playbook";
            case "extra":
                return "extra";
            default:
                return "";
        }
    };

    const getSvg = (_params = "") => {
        switch (nodeType) {
            case "entryTriggerNode":
            case "triggerNode":
                return (
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
                );
            case "message":
                if (_params === "email") {
                    return                     <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                }
                if (_params === "slack") {
                    return (
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
width="30" height="30"
viewBox="0 0 30 30"
style={{fill:"#3875c3"}}>
        <path style={{fill:"#3875c3"}} d="M 16.644531 2.0058594 C 16.365063 1.9841719 16.077422 2.0168281 15.794922 2.1113281 C 14.664922 2.4893281 14.053641 3.71375 14.431641 4.84375 L 15.324219 7.5117188 L 10.236328 9.2128906 L 9.3828125 6.6601562 C 9.0048125 5.5301563 7.7803906 4.9208281 6.6503906 5.2988281 C 5.5193906 5.6768281 4.9110625 6.8992969 5.2890625 8.0292969 L 6.1425781 10.582031 L 3.4746094 11.474609 C 2.3446094 11.852609 1.7333281 13.075078 2.1113281 14.205078 C 2.4893281 15.335078 3.71375 15.946359 4.84375 15.568359 L 7.5117188 14.675781 L 9.2128906 19.763672 L 6.6601562 20.617188 C 5.5301563 20.995187 4.9208281 22.219609 5.2988281 23.349609 C 5.6768281 24.480609 6.8992969 25.088938 8.0292969 24.710938 L 10.582031 23.857422 L 11.474609 26.525391 C 11.852609 27.655391 13.075078 28.266672 14.205078 27.888672 C 15.335078 27.510672 15.945359 26.28625 15.568359 25.15625 L 14.675781 22.488281 L 19.763672 20.785156 L 20.617188 23.339844 C 20.995187 24.469844 22.219609 25.079172 23.349609 24.701172 C 24.480609 24.323172 25.089891 23.100703 24.712891 21.970703 L 23.857422 19.416016 L 26.525391 18.523438 C 27.655391 18.145437 28.266672 16.922969 27.888672 15.792969 C 27.510672 14.662969 26.28625 14.053641 25.15625 14.431641 L 22.488281 15.324219 L 20.787109 10.236328 L 23.339844 9.3828125 C 24.469844 9.0048125 25.079172 7.7803906 24.701172 6.6503906 C 24.323172 5.5203906 23.100703 4.9110625 21.970703 5.2890625 L 19.417969 6.1425781 L 18.525391 3.4746094 C 18.241891 2.6271094 17.482937 2.0709219 16.644531 2.0058594 z M 16.693359 11.605469 L 18.394531 16.693359 L 13.306641 18.394531 L 11.605469 13.306641 L 16.693359 11.605469 z"/></svg>
                    )
                }
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
            case "extra":
                switch (_params) {
                    case "event":
                        return <Activity strokeWidth={3} />;
                    case "delay":
                        return (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        );
                    case "webhook":
                        return <Share2 strokeWidth={3} width={14} />;
                    default:
                        return "";
                }
            case "playbook":
                switch (_params) {
                    case "task":
                        return (
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
                        );
                    default:
                        return "";
                }
            default:
                return "";
        }
    };

    return (
        <StyledItem>
            <div
                className="dndnode entryTriggerNode"
                onDragStart={(event) => onDragStart(event, nodeType, params)}
                draggable
            >
                <div className={`NodeIcon ${getType()}`}>{getSvg(params)}</div>
                <span>{name}</span>
            </div>
        </StyledItem>
    );
};

export default Item;
