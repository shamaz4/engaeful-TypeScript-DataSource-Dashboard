import { useEffect, ChangeEvent, FC, useState, useRef } from "react";
import { useHover } from "@doar/shared/hooks";
import { Check, Clock, Trash } from "react-feather";
import ReactTooltip from "react-tooltip";
import {
    TaskContainer,
    TaskContainerCheckContainer,
    TaskContainerCheckContainerUnchecked,
    TaskContainerDateContainer,
    TaskContainerIconContainer,
    TaskContainerNameContainer,
} from "./style";

interface IProps {
    id: number;
    name: string;
    company?: string;
    dueDate?: string;
}

const Task: FC<IProps> = ({ id, name, company, dueDate }) => {
    const hoverRef = useRef(null);
    const isHover = useHover(hoverRef);

    return (
        <TaskContainer ref={hoverRef}>
            <TaskContainerCheckContainer>
                <TaskContainerCheckContainerUnchecked />
            </TaskContainerCheckContainer>
            <TaskContainerNameContainer>
                {company ? (
                    <div style={{ color: "gray", fontSize: "13px" }}>
                        {company}
                    </div>
                ) : (
                    <></>
                )}
                <div
                    title={name}
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "350px",
                    }}
                >
                    {name}
                </div>
            </TaskContainerNameContainer>
            {!isHover ? (
                <TaskContainerDateContainer>
                    Due {dueDate}
                </TaskContainerDateContainer>
            ) : (
                <div
                    style={{
                        marginLeft: "auto",
                        position: "absolute",
                        right: "20px",
                    }}
                >
                    <ReactTooltip place="top" effect="solid" />
                    <TaskContainerIconContainer data-tip="Mark completed">
                        <Check size={18} />
                    </TaskContainerIconContainer>
                    <TaskContainerIconContainer data-tip="Change due date">
                        <Clock size={18} />
                    </TaskContainerIconContainer>
                    <TaskContainerIconContainer data-tip="Delete task">
                        <Trash size={18} />
                    </TaskContainerIconContainer>
                </div>
            )}
        </TaskContainer>
    );
};

export default Task;
