/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { FC, useState, useEffect } from "react";
import { PredicateGroup } from "src/components/predicates/predicategroup/PredicateGroup";
import Accordion from "src/components/accordion";
import { setShowExitWarning } from "src/redux/slices/campaignEditor";
import PredicateUsers from "src/components/predicates/predicateusers/PredicateUsers";
import {
    IDictionaryItem,
    IPredicate,
} from "src/components/campaign/interfaces";
import { InputSimple } from "src/components/commoncomponents/InputSimple";
import { SelectSimple } from "src/components/commoncomponents/SelectSimple";
import { SelectSimpleMulti } from "src/components/commoncomponents/SelectSimpleMulti";
import { SwitchSimple } from "src/components/commoncomponents/SwitchSimple";
import { ITask } from "src/components/taskmanager/interfaces";
import AccordionEditable from "./accordionEditable";
import {
    StyledSidebar,
    StyledHeader,
    StyledBody,
    StyledFooter,
    StyledButtonSave,
} from "./style";
import Scrollbar from "../../../scrollbar";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { ILifecycle } from "../../interfaces";
import AccordionEditableMini from "./accordionEditableMini";

interface ITaskItem {
    _task: ITask;
    onChange?: any;
    onDelete?: any;
}

const TaskItem: FC<ITaskItem> = ({
    _task = {
        id: "",
        name: "",
        description: "",
        dueDate: {
            interval: "day",
            intervalValue: 7,
            intervalMilliseconds: 86400,
        },
        tags: [],
        priority: "normal",
        assignedTo: "",
        attachToGroup: false,
        status: 0,
    },
    onChange = () => {},
    onDelete = () => {},
}) => {
    const [task, settask] = useState(_task);

    useEffect(() => {
        onChange(task.id, task);
    }, [task]);

    return (
        <AccordionEditableMini
            placeholder="Enter task name..."
            dueDate={`${task.dueDate.intervalValue.toString()} ${task.dueDate.interval.toString()}${
                task.dueDate.intervalValue > 1 ? "s" : ""
            }`}
            onDelete={onDelete}
            onNameChange={(newname) => {
                settask({
                    ...task,
                    name: newname,
                });
            }}
            header={task.name}
            active={false}
            index={0}
            subIndex={0}
        >
            <div>
                <p style={{ marginTop: "20px" }} className="actionEditorLabel">
                    Body
                </p>
                <InputSimple
                    placeholder="Enter a detailed description that can be helpful to the person reading it"
                    textarea
                    width="100%"
                    value={task.description}
                    onChange={(data) => {
                        settask({
                            ...task,
                            description: data,
                        });
                    }}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "20px",
                    marginBottom: "20px",
                }}
            >
                <div>
                    <p className="actionEditorLabel">Due in</p>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <InputSimple
                            placeholder="Enter value"
                            numeric
                            centerText
                            value={task.dueDate.intervalValue}
                            margin="0px 10px 0px 0px"
                            onChange={(data) => {
                                settask({
                                    ...task,
                                    dueDate: {
                                        ...task.dueDate,
                                        intervalValue: data,
                                    },
                                });
                            }}
                        />
                        <SelectSimple
                            placeholder="anytime"
                            values={[
                                {
                                    value: "hour",
                                    name:
                                        task.dueDate.intervalValue > 1
                                            ? "hours"
                                            : "hour",
                                },
                                {
                                    value: "day",
                                    name:
                                        task.dueDate.intervalValue > 1
                                            ? "days"
                                            : "day",
                                },
                                {
                                    value: "week",
                                    name:
                                        task.dueDate.intervalValue > 1
                                            ? "weeks"
                                            : "week",
                                },
                                {
                                    value: "month",
                                    name:
                                        task.dueDate.intervalValue > 1
                                            ? "months"
                                            : "month",
                                },
                            ]}
                            height="40px"
                            value={task.dueDate.interval}
                            onChange={(data) => {
                                settask({
                                    ...task,
                                    dueDate: {
                                        ...task.dueDate,
                                        interval: data,
                                    },
                                });
                            }}
                        />
                    </div>
                </div>
                <div
                    style={{
                        marginLeft: "20px",
                        width: "100%",
                    }}
                >
                    <p className="actionEditorLabel">Priority</p>
                    <SelectSimple
                        placeholder="anytime"
                        values={[
                            {
                                value: "low",
                                name: "Low",
                            },
                            {
                                value: "normal",
                                name: "Normal",
                            },
                            {
                                value: "high",
                                name: "High",
                            },
                        ]}
                        height="40px"
                        value={task.priority}
                        onChange={(data) => {
                            settask({
                                ...task,
                                priority: data,
                            });
                        }}
                    />
                </div>
                <div
                    style={{
                        marginLeft: "20px",
                        width: "100%",
                    }}
                >
                    <p className="actionEditorLabel">Assigned to</p>
                    <SelectSimple
                        placeholder="Assign to"
                        values={[
                            {
                                value: "5fbd5056ff701b002d4a0fd4",
                                name: "Farouq Aldori",
                            },
                        ]}
                        height="40px"
                        value={task.assignedTo}
                        onChange={(data) => {
                            settask({
                                ...task,
                                assignedTo: data,
                            });
                        }}
                    />
                </div>
                <div
                    style={{
                        marginLeft: "20px",
                    }}
                >
                    <p
                        className="actionEditorLabel"
                        style={{ marginBottom: "24px" }}
                    >
                        Required
                    </p>
                    <SwitchSimple
                        onChange={(data) => {
                            settask({
                                ...task,
                                required: data,
                            });
                        }}
                        value={task.required}
                        text=""
                    />
                </div>
            </div>
        </AccordionEditableMini>
    );
};

export default TaskItem;
