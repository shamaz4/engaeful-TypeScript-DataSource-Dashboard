import { FC, useState, useEffect, useCallback } from "react";
import { PredicateGroup } from "src/components/predicates/predicategroup/PredicateGroup";
import Accordion from "src/components/accordion";
import { SelectSimple } from "src/components/commoncomponents/SelectSimple";
import { setShowExitWarning } from "src/redux/slices/campaignEditor";
import PredicateUsers from "src/components/predicates/predicateusers/PredicateUsers";
import PredicateSelector from "src/components/predicates/predicateselector/PredicateSelector";
import { SwitchSimple } from "src/components/commoncomponents/SwitchSimple";
import { InputSimple } from "src/components/commoncomponents/InputSimple";
import {
    StyledSidebar,
    StyledHeader,
    StyledBody,
    StyledFooter,
    StyledButtonSave,
} from "./style";
import Scrollbar from "../../../scrollbar";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
    IDictionaryItem,
    IThrottleSettings,
    INode,
    IPredicate,
} from "../../interfaces";

interface ITaskEditor {
    dictionary: Array<IDictionaryItem>;
    eventDictionary: Array<IDictionaryItem>;
    goalPredicate: IPredicate;
    goalTimeConstraintDays: number;
    onSave?: (e: any) => any;
    onCancel?: (e: any) => any;
}

const TaskEditor: FC<ITaskEditor> = ({
    campaignName = "",
    selectedNodeData = {
        task: {
            name: "",
            description: "",
            dueDate: {
                interval: "days",
                intervalValue: 7,
                intervalMilliseconds: 86400,
            },
            tags: [],
            priority: "normal",
            assignedTo: "",
            attachToGroup: false,
            status: 0,
        },
    },
    dictionary = [],
    eventDictionary = [],
    goalTimeConstraintDays = 86400,
    goalPredicate = {
        value: [],
        attribute: null,
        additionalData: { inlineFilter: [] },
    },
    throttleSettings = {
        bypass: false,
        deliveryOrder: 1,
    },
    exitPredicates = [
        {
            value: [],
            attribute: null,
            additionalData: { inlineFilter: [] },
        },
    ],
    exitPredicateOperator = "and",
    onSave = () => {},
    onCancel = () => {},
}) => {
    const { sidebar } = useAppSelector((state) => state.ui);
    const [currentCampaignName, setCurrentCampaignName] = useState<
        string | any
    >(campaignName);

    const [task, settask] = useState(selectedNodeData.task);
    const [currentGoalPredicate, setcurrentGoalPredicate] = useState(
        goalPredicate
    );
    const [formattedGoalPredicate, setformattedGoalPredicate] = useState();
    const [currentGoalTime, setcurrentGoalTime] = useState(
        goalTimeConstraintDays
    );
    const [currentThrottleSettings, setcurrentThrottleSettings] = useState(
        throttleSettings
    );
    const [reRender, setreRender] = useState(false);

    const [
        currentExitPredicatesOperator,
        setcurrentExitPredicatesOperator,
    ] = useState(exitPredicateOperator);

    const handleSaveChanges = () => {
        onSave({
            name: currentCampaignName,
            goalPredicate: formattedGoalPredicate,
            goalTimeConstraintDays: currentGoalTime,
            task,
        });
    };

    const handleExitRulesChange = (data: any) => {
        setcurrentexitPredicates(data.predicates);
        setcurrentExitPredicatesOperator(data.operator);
    };

    const handleGoalChange = (data: any) => {
        setformattedGoalPredicate(data);
        setcurrentGoalPredicate(data);
    };

    const formatGoalPredicate = () => {
        const sp = goalPredicate;
        if (sp) {
            if (sp.attribute && sp.attribute.includes("event:")) {
                const split = sp.attribute.split(":");
                setformattedGoalPredicate({
                    _id: sp._id,
                    value: sp.value,
                    type: split[0],
                    attribute: split[1],
                    comparison: `${split[2]}:${sp.comparison}`,
                    additionalData: sp.additionalData,
                });
            } else {
                setformattedGoalPredicate(sp);
            }
        } else {
            setformattedGoalPredicate(sp);
        }
        console.log(formattedGoalPredicate);
    };

    useEffect(() => {
        console.log(goalTimeConstraintDays, "hehe");
        console.log(goalPredicate);
        formatGoalPredicate();
    }, []);

    return (
        <StyledSidebar className="sidebar" $sidebar={sidebar}>
            <StyledHeader>
                <div>
                    <input
                        className="sideBarNodeNameInput"
                        type="text"
                        placeholder="Enter campaign name..."
                        onChange={(d) => {
                            setCurrentCampaignName(d.currentTarget.value);
                        }}
                        value={currentCampaignName}
                    />
                </div>
                <div style={{ marginLeft: "auto" }}>
                    <StyledButtonSave
                        onClick={onCancel}
                        primary={false}
                        size="sm"
                        ml="10px"
                    >
                        Cancel
                    </StyledButtonSave>
                </div>
                <div style={{}}>
                    <StyledButtonSave
                        onClick={handleSaveChanges}
                        size="sm"
                        ml="10px"
                    >
                        Save changes
                    </StyledButtonSave>
                </div>
            </StyledHeader>
            <StyledBody>
                <div style={{ marginTop: "20px" }}>
                    <Accordion active header="Task details">
                        <div>
                            <p className="actionEditorLabel">Title</p>
                            <InputSimple
                                placeholder="Enter a name for this task"
                                width="100%"
                                value={task.name}
                                onChange={(data) => {
                                    settask({
                                        ...task,
                                        name: data,
                                    });
                                }}
                            />
                            <p
                                style={{ marginTop: "20px" }}
                                className="actionEditorLabel"
                            >
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
                                                    task.dueDate.intervalValue >
                                                    1
                                                        ? "hours"
                                                        : "hour",
                                            },
                                            {
                                                value: "day",
                                                name:
                                                    task.dueDate.intervalValue >
                                                    1
                                                        ? "days"
                                                        : "day",
                                            },
                                            {
                                                value: "week",
                                                name:
                                                    task.dueDate.intervalValue >
                                                    1
                                                        ? "weeks"
                                                        : "week",
                                            },
                                            {
                                                value: "month",
                                                name:
                                                    task.dueDate.intervalValue >
                                                    1
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
                            <div style={{ marginLeft: "20px", width: "100%" }}>
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
                            <div style={{ marginLeft: "20px", width: "100%" }}>
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
                        </div>
                    </Accordion>
                </div>
                <div style={{ marginTop: "20px" }}>
                    <Accordion active header="Task goal">
                        <div style={{ marginBottom: "20px" }}>
                            Understand how your tasks drives people to take
                            action in your product
                        </div>
                        {formattedGoalPredicate && !reRender ? (
                            <PredicateSelector
                                predicate={formattedGoalPredicate}
                                dictionary={dictionary}
                                eventDictionary={eventDictionary}
                                onChange={(predicate) => {
                                    handleGoalChange(predicate);
                                }}
                                onDelete={() => {
                                    handleGoalChange({
                                        value: [],
                                        attribute: null,
                                        additionalData: { inlineFilter: [] },
                                    });
                                    // Rerender predicate
                                    setreRender(true);
                                    setTimeout(() => {
                                        setreRender(false);
                                    }, 1);
                                }}
                            />
                        ) : (
                            <></>
                        )}
                        <div style={{ marginTop: "15px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <div style={{ marginRight: "10px" }}>
                                    Users have to match within:
                                </div>
                                <div>
                                    <SelectSimple
                                        padding="5px 10px"
                                        values={[
                                            { value: 86400, name: "1 day" },
                                            { value: 259200, name: "3 days" },
                                            { value: 604800, name: "7 days" },
                                            { value: 2592000, name: "30 days" },
                                        ]}
                                        value={currentGoalTime}
                                        onChange={(data) => {
                                            setcurrentGoalTime(data);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Accordion>
                </div>
            </StyledBody>
        </StyledSidebar>
    );
};

export default TaskEditor;
