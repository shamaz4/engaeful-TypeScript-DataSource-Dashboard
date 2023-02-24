/* eslint-disable no-empty */

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
import ReactTooltip from "react-tooltip";
import { StyledButtonIcon } from "src/components/settings/pages/healthscores/style";
import { ChevronDown, ChevronUp, Plus, XCircle } from "react-feather";
import { PanOnScrollMode } from "react-flow-renderer";
import { ApiUrl } from "@doar/shared/data";
import axios from "axios";
import { toast } from "react-toastify";
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
import { ILifecycle, ILifecycleMilestone } from "../../interfaces";
import AccordionEditableMini from "./accordionEditableMini";
import TaskItem from "./taskItem";
import AchievementItem from "./achievementItem";

interface ILifecycleEditor {
    lifecycle?: ILifecycle;
    dictionary: Array<IDictionaryItem>;
    eventDictionary: Array<IDictionaryItem>;
    onSave?: any;
    onCancel?: any;
}

const LifecycleEditor: FC<ILifecycleEditor> = ({
    lifecycle = {
        _id: "",
        name: "New lifecycle",
        description: "",
        state: "draft",
        lifecycleActivationMethod: "manual",
        entryConditions: {
            predicates: [
                {
                    value: [],
                },
            ],
            predicatesOperator: "and",
        },
        reentrySettings: {
            enabled: false,
            reentryInterval: {
                interval: "day",
                intervalValue: 30,
                intervalMilliseconds: 2592000000,
            },
            capNumberOfEntries: {
                enabled: false,
                maxEntries: 1,
            },
        },
        lifecycleCompletionMethod: "manual",
        completionConditions: {
            predicates: [
                {
                    value: [],
                },
            ],
            predicatesOperator: "and",
        },
        daysToComplete: {
            days: 10,
            progressCycle: {
                onTrack: 5,
                behind: 15,
            },
        },
        milestones: [],
    },
    dictionary = [],
    eventDictionary = [],
    onSave = () => {},
    onCancel = () => {},
}) => {
    const { sidebar } = useAppSelector((state) => state.ui);
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const token: string = useAppSelector((state) => state.auth.accessToken);
    const [selectedLifecycle, setSelectedLifecycle] = useState(lifecycle);
    const [accordionState, setAccordionState] = useState<number>(0);
    const [addcounter, setaddcounter] = useState(0);
    const [selectedTab, setselectedTab] = useState(1);
    const [selectedMilestone, setselectedMilestone] = useState(
        selectedLifecycle.milestones.length > 0
            ? selectedLifecycle.milestones[0].id
            : ""
    );

    const uid = () => {
        return (
            String.fromCharCode(Math.floor(Math.random() * 26) + 97) +
            Math.random().toString(16).slice(2) +
            Date.now().toString(16).slice(4)
        );
    };

    const [milestone, setmilestone] = useState(
        selectedLifecycle.milestones.length > 0
            ? selectedLifecycle.milestones[0]
            : {
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
              }
    );
    const dispatch = useAppDispatch();

    const deleteLifecycle = () => {
        if (
            confirm(
                "Are you sure that you want to delete this lifecycle? (Can't be undone)"
            )
        ) {
            if (selectedLifecycle._id === "") {
                toast.success("Lifecycle deleted successfully!");
                onSave();
                return;
            }
            const url = `${ApiUrl}/websites/${WebsiteId}/lifecycles/${
                selectedLifecycle ? selectedLifecycle._id : "a"
            }`;
            axios
                .delete(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((d) => {
                    toast.success("Lifecycle deleted successfully!");
                    onSave();
                })
                .catch((error) => {
                    toast.error(
                        "Something went wrong when deleting lifecycle setting."
                    );
                    console.log("Error saving data", error);
                });
        }
    };

    const formatPredicatesSingle = (
        predicateGroup: Array<IPredicate>
    ): Array<IPredicate> => {
        const newPredicates: Array<IPredicate> = [];
        predicateGroup.forEach((tp) => {
            if (tp.type === "event") {
                newPredicates.push({
                    _id: tp._id,
                    attribute: `event:${tp.attribute}:${
                        tp.comparison.split(":")[0]
                    }`,
                    comparison: tp.comparison.split(":")[1],
                    type: "number",
                    value: tp.value,
                    additionalData: tp.additionalData,
                });
            } else if (tp.attribute && tp.attribute.includes("event:")) {
                newPredicates.push(tp);
            } else {
                newPredicates.push(tp);
            }
        });

        const newPredicatesWithIds: Array<IPredicate> = [];
        newPredicates.forEach((np) => {
            if (np.attribute) {
                newPredicatesWithIds.push({
                    ...np,

                    id: `new_predicate_${uid()}`,
                });
            }
        });

        return newPredicatesWithIds;
    };

    const formatPredicates = () => {
        // Update completionConditions
        const newCompleitionConditions = formatPredicatesSingle(
            selectedLifecycle.completionConditions.predicates
        );
        // Update entryConditions
        const newEntryConditions = formatPredicatesSingle(
            selectedLifecycle.entryConditions.predicates
        );
        // Update milestones
        const newMilestones = [];
        selectedLifecycle.milestones.forEach((m) => {
            const newAchievements = [];
            m.achievements.forEach((ma) => {
                const newConditions = formatPredicatesSingle(
                    ma.completionConditions.predicates
                );
                newAchievements.push({
                    ...ma,
                    completionConditions: {
                        ...ma.completionConditions,
                        predicates: newConditions,
                    },
                });
            });
            newMilestones.push({
                ...m,
                achievements: newAchievements,
            });
        });

        console.log(selectedLifecycle.milestones);
        console.log(newMilestones);
        const newLifecycle = {
            ...selectedLifecycle,
            completionConditions: {
                ...selectedLifecycle.completionConditions,
                predicates: newCompleitionConditions,
            },
            entryConditions: {
                ...selectedLifecycle.entryConditions,
                predicates: newEntryConditions,
            },
            milestones: newMilestones,
        };
        setSelectedLifecycle(newLifecycle);

        return newLifecycle;
    };

    const handleSaveChanges = () => {
        const newLifecycle = formatPredicates();
        const url = `${ApiUrl}/websites/${WebsiteId}/lifecycles`;
        axios
            .post(url, newLifecycle, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((d) => {
                if (d.data.name) {
                    toast.success("Lifecycle settings saved successfully!");
                    onSave();
                } else {
                    toast.error(
                        "Something went wrong when saving lifecycle setting."
                    );
                }
            })
            .catch((error) => {
                toast.error(
                    "Something went wrong when saving lifecycle setting."
                );
                console.log("Error saving data", error);
            });
        onSave({
            lifecycle,
        });
    };

    const addNewTask = () => {
        setmilestone({
            ...milestone,
            tasks: [
                ...milestone.tasks,
                {
                    id: uid(),
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
            ],
        });
        setaddcounter((v) => v + 1);
    };

    // eslint-disable-next-line consistent-return
    const moveMilestone = (order: number, directionText: string) => {
        let direction = 0;
        let newDirection = 0;

        if (order === 1 && directionText === "up") {
            return;
        }
        if (
            order === selectedLifecycle.milestones.length &&
            directionText === "down"
        ) {
            return;
        }

        if (directionText === "up") {
            direction = order - 1;
            newDirection = direction - 1;
        } else if (directionText === "down") {
            direction = order;
            newDirection = direction;
        }

        console.log("direction is", direction);
        const data = selectedLifecycle.milestones;
        const oldData = data;

        // remove `from` item and store it
        const f = data.splice(order - 1, 1)[0];

        // insert stored item into position `to`
        data.splice(newDirection, 0, f);

        // Re-order
        const dataOrdered: [ILifecycleMilestone] = [];

        let counter = 1;
        data.forEach((d) => {
            dataOrdered.push({
                ...d,
                order: counter,
            });
            counter += 1;
        });
        console.log(data, "order", order);
        console.log(dataOrdered);
        console.log(dataOrdered[newDirection]);
        setmilestone(dataOrdered[newDirection]);
        setSelectedLifecycle({
            ...selectedLifecycle,
            milestones: dataOrdered,
        });
    };

    const addNewMilestone = () => {
        const newMilestone: ILifecycleMilestone[] = [];
        const newId = uid();
        setSelectedLifecycle({
            ...selectedLifecycle,
            milestones: [
                ...selectedLifecycle.milestones,
                {
                    id: newId,
                    order:
                        selectedLifecycle &&
                        selectedLifecycle.milestones &&
                        selectedLifecycle.milestones.length
                            ? Number(selectedLifecycle.milestones.length) + 1
                            : 1,
                    name: "New milestone",
                    description: "",
                    milestoneBeginsWhen: "manual",
                    milestoneCompletesWhen: "whenTasksFinished",
                    daysToComplete: {
                        days: 10,
                        progressCycle: {
                            onTrack: 5,
                            behind: 15,
                        },
                    },
                    tasks: [],
                    achievements: [],
                },
            ],
        });
        setaddcounter((v) => v + 1);
        setselectedMilestone(newId);
    };

    useEffect(() => {
        if (selectedMilestone === "new") {
            addNewMilestone();
        } else {
            const currentMilestone = selectedLifecycle.milestones.filter(
                (m) => m.id === selectedMilestone
            )[0];
            setmilestone(currentMilestone);
        }
    }, [selectedMilestone]);

    useEffect(() => {
        console.log("current", milestone);
        if (!milestone) {
            setmilestone({
                id: "",
                name: "New milestone",
                description: "",
                milestoneBeginsWhen: "manual",
                milestoneCompletesWhen: "whenTasksFinished",
                daysToComplete: {
                    days: 10,
                    progressCycle: {
                        onTrack: 5,
                        behind: 15,
                    },
                },
                tasks: [],
                achievements: [],
            });
        }
        const newMilestones: ILifecycleMilestone[] = [];
        selectedLifecycle.milestones.forEach((m) => {
            if (m.id !== milestone.id) {
                newMilestones.push(m);
            } else {
                newMilestones.push(milestone);
            }
        });
        setSelectedLifecycle({
            ...selectedLifecycle,
            milestones: newMilestones,
        });
    }, [milestone]);

    const deleteMilestone = (id: string | undefined) => {
        const newMilestones: ILifecycleMilestone[] = [];
        let deletedMilestoneIndex = 0;
        let counter = 1;
        selectedLifecycle.milestones.forEach((t) => {
            if (t.id !== id) {
                newMilestones.push({
                    ...t,
                    order: counter,
                });
                counter += 1;
            } else if (t.order > 1) {
                deletedMilestoneIndex = t.order - 2;
            }
        });
        setSelectedLifecycle({
            ...selectedLifecycle,
            milestones: newMilestones,
        });
        if (newMilestones.length > 0) {
            setselectedMilestone(newMilestones[deletedMilestoneIndex].id);
            setmilestone(newMilestones[deletedMilestoneIndex]);
        }
    };

    const deleteTask = (id: string | undefined) => {
        const newTasks: ITask[] = [];
        milestone.tasks.forEach((t) => {
            if (t.id !== id) {
                newTasks.push(t);
            }
        });
        setmilestone({
            ...milestone,
            tasks: newTasks,
        });
    };

    const changeTask = (id: string, newTask: ITask) => {
        const newTasks: ITask[] = [];
        console.log(newTask);
        milestone.tasks.forEach((t) => {
            if (t.id !== id) {
                newTasks.push(t);
            } else {
                newTasks.push(newTask);
            }
        });
        setmilestone({
            ...milestone,
            tasks: newTasks,
        });
    };

    const addNewAchievement = () => {
        setmilestone({
            ...milestone,
            achievements: [
                ...milestone.achievements,
                {
                    id: uid(),
                    achievementCompletesWhen: "conditions",
                    completionConditions: {
                        predicates: [
                            {
                                value: [],
                            },
                        ],
                        predicatesOperator: "and",
                    },
                    status: 0,
                },
            ],
        });
        setaddcounter((v) => v + 1);
    };

    const deleteAchievement = (id: string | undefined) => {
        const newAchievements: ITask[] = [];
        milestone.achievements.forEach((t) => {
            if (t.id !== id) {
                newAchievements.push(t);
            }
        });
        setmilestone({
            ...milestone,
            achievements: newAchievements,
        });
    };

    const changeAchievement = (id: string, newAchievement: ITask) => {
        const newAchievements: ITask[] = [];
        milestone.achievements.forEach((a) => {
            if (a.id !== id) {
                newAchievements.push(a);
            } else {
                newAchievements.push(newAchievement);
            }
        });
        setmilestone({
            ...milestone,
            achievements: newAchievements,
        });
    };

    return (
        <StyledSidebar className="sidebar" $sidebar={sidebar}>
            <StyledHeader>
                <div>
                    <input
                        className="sideBarNodeNameInput"
                        type="text"
                        placeholder="Enter name..."
                        onChange={(d) => {
                            setSelectedLifecycle({
                                ...selectedLifecycle,
                                name: d.currentTarget.value,
                            });
                        }}
                        value={selectedLifecycle.name}
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
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    textAlign: "center",
                    background: "1px solid #e2e5ed",
                    borderBottom: "1px solid #485e9029",
                }}
            >
                <div
                    style={{
                        padding: "10px",
                        width: "50%",
                        fontWeight: selectedTab === 1 ? 500 : 400,
                        background: selectedTab === 1 ? "#f1f1f1" : "",
                        cursor: selectedTab === 2 ? "pointer" : "",
                    }}
                    onClick={() => {
                        setselectedTab(1);
                    }}
                    role="button"
                    tabIndex={0}
                >
                    General
                </div>
                <div
                    style={{
                        padding: "10px",
                        width: "50%",
                        fontWeight: selectedTab === 2 ? 500 : 400,
                        background: selectedTab === 2 ? "#f1f1f1" : "",
                        cursor: selectedTab === 1 ? "pointer" : "",
                    }}
                    onClick={() => {
                        setselectedTab(2);
                    }}
                    role="button"
                    tabIndex={0}
                >
                    Milestones
                </div>
            </div>
            <StyledBody>
                {selectedTab === 1 ? (
                    <>
                        <div style={{ padding: "20px" }}>
                            <Accordion active header="General settings">
                                <p
                                    style={{
                                        fontWeight: 500,
                                        marginRight: "20px",
                                    }}
                                    className="actionEditorLabel"
                                >
                                    Description
                                </p>
                                <InputSimple
                                    placeholder="Enter a detailed description that can be helpful to the person reading it"
                                    width="100%"
                                    value={selectedLifecycle.description}
                                    onChange={(data) => {
                                        setSelectedLifecycle({
                                            ...selectedLifecycle,
                                            description: data,
                                        });
                                    }}
                                />
                                <p
                                    style={{
                                        fontWeight: 500,
                                        marginRight: "20px",
                                        marginTop: "20px",
                                    }}
                                    className="actionEditorLabel"
                                >
                                    Lifecycle begins
                                </p>
                                <div style={{ display: "inline-block" }}>
                                    <SelectSimple
                                        placeholder="manual"
                                        values={[
                                            {
                                                value: "manual",
                                                name: "When assigned manually",
                                            },
                                            {
                                                value: "throughCampaign",
                                                name:
                                                    "Automatically through campaigns",
                                            },
                                            {
                                                value: "conditions",
                                                name:
                                                    "Automatically through conditions",
                                            },
                                        ]}
                                        height="40px"
                                        value={
                                            selectedLifecycle.lifecycleActivationMethod
                                        }
                                        onChange={(data) => {
                                            setSelectedLifecycle({
                                                ...selectedLifecycle,
                                                lifecycleActivationMethod: data,
                                            });
                                        }}
                                    />
                                </div>
                                {selectedLifecycle.lifecycleActivationMethod ===
                                "conditions" ? (
                                    <div>
                                        <p
                                            style={{
                                                marginTop: "20px",
                                                fontWeight: 500,
                                            }}
                                            className="actionEditorLabel"
                                        >
                                            Entry conditions
                                        </p>
                                        <PredicateGroup
                                            noMatchIf
                                            predicates={
                                                selectedLifecycle
                                                    .entryConditions.predicates
                                            }
                                            predicateOperator={
                                                selectedLifecycle
                                                    .entryConditions
                                                    .predicatesOperator
                                            }
                                            dictionary={dictionary}
                                            eventDictionary={eventDictionary}
                                            onChange={(data) => {
                                                setSelectedLifecycle({
                                                    ...selectedLifecycle,
                                                    entryConditions: {
                                                        ...selectedLifecycle.entryConditions,
                                                        predicates:
                                                            data.predicates,
                                                        predicatesOperator:
                                                            data.operator,
                                                    },
                                                });
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <p
                                    style={{
                                        fontWeight: 500,
                                        marginRight: "20px",
                                        marginTop: "20px",
                                    }}
                                    className="actionEditorLabel"
                                >
                                    Allow re-entry
                                </p>
                                <SwitchSimple
                                    onChange={(data) => {
                                        setSelectedLifecycle({
                                            ...selectedLifecycle,
                                            reentrySettings: {
                                                ...selectedLifecycle.reentrySettings,
                                                enabled: data,
                                            },
                                        });
                                    }}
                                    value={
                                        selectedLifecycle.reentrySettings
                                            .enabled
                                    }
                                    text=""
                                />
                                {selectedLifecycle.reentrySettings.enabled ? (
                                    <>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                marginTop: "-5px",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span
                                                style={{ marginRight: "10px" }}
                                            >
                                                Users can only re-enter this
                                                lifecycle every
                                            </span>
                                            <InputSimple
                                                placeholder="Enter value"
                                                numeric
                                                centerText
                                                value={
                                                    selectedLifecycle
                                                        .reentrySettings
                                                        .reentryInterval
                                                        .intervalValue
                                                }
                                                margin="0px 10px 0px 0px"
                                                onChange={(data) => {
                                                    setSelectedLifecycle({
                                                        ...selectedLifecycle,
                                                        reentrySettings: {
                                                            ...selectedLifecycle.reentrySettings,
                                                            reentryInterval: {
                                                                ...selectedLifecycle
                                                                    .reentrySettings
                                                                    .reentryInterval,
                                                                intervalValue: data,
                                                            },
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
                                                            selectedLifecycle
                                                                .reentrySettings
                                                                .reentryInterval
                                                                .intervalValue >
                                                            1
                                                                ? "hours"
                                                                : "hour",
                                                    },
                                                    {
                                                        value: "day",
                                                        name:
                                                            selectedLifecycle
                                                                .reentrySettings
                                                                .reentryInterval
                                                                .intervalValue >
                                                            1
                                                                ? "days"
                                                                : "day",
                                                    },
                                                    {
                                                        value: "week",
                                                        name:
                                                            selectedLifecycle
                                                                .reentrySettings
                                                                .reentryInterval
                                                                .intervalValue >
                                                            1
                                                                ? "weeks"
                                                                : "week",
                                                    },
                                                    {
                                                        value: "month",
                                                        name:
                                                            selectedLifecycle
                                                                .reentrySettings
                                                                .reentryInterval
                                                                .intervalValue >
                                                            1
                                                                ? "months"
                                                                : "month",
                                                    },
                                                ]}
                                                height="40px"
                                                value={
                                                    selectedLifecycle
                                                        .reentrySettings
                                                        .reentryInterval
                                                        .interval
                                                }
                                                onChange={(data) => {
                                                    setSelectedLifecycle({
                                                        ...selectedLifecycle,
                                                        reentrySettings: {
                                                            ...selectedLifecycle.reentrySettings,
                                                            reentryInterval: {
                                                                ...selectedLifecycle
                                                                    .reentrySettings
                                                                    .reentryInterval,
                                                                interval: data,
                                                            },
                                                        },
                                                    });
                                                }}
                                            />
                                        </div>
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                marginRight: "20px",
                                                marginTop: "10px",
                                            }}
                                            className="actionEditorLabel"
                                        >
                                            Max entry numbers
                                        </p>
                                        <SwitchSimple
                                            onChange={(data) => {
                                                setSelectedLifecycle({
                                                    ...selectedLifecycle,
                                                    reentrySettings: {
                                                        ...selectedLifecycle.reentrySettings,
                                                        capNumberOfEntries: {
                                                            ...selectedLifecycle
                                                                .reentrySettings
                                                                .capNumberOfEntries,
                                                            enabled: data,
                                                        },
                                                    },
                                                });
                                            }}
                                            value={
                                                selectedLifecycle
                                                    .reentrySettings
                                                    .capNumberOfEntries.enabled
                                            }
                                            text=""
                                        />
                                        {selectedLifecycle.reentrySettings
                                            .capNumberOfEntries.enabled ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    marginTop: "-5px",
                                                    width: "50%",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        marginRight: "10px",
                                                    }}
                                                >
                                                    Users can only enter this
                                                    lifecycle
                                                </span>
                                                <InputSimple
                                                    placeholder="Enter value"
                                                    numeric
                                                    centerText
                                                    value={
                                                        selectedLifecycle
                                                            .reentrySettings
                                                            .capNumberOfEntries
                                                            .maxEntries
                                                    }
                                                    margin="0px 10px 0px 0px"
                                                    onChange={(data) => {
                                                        setSelectedLifecycle({
                                                            ...selectedLifecycle,
                                                            reentrySettings: {
                                                                ...selectedLifecycle.reentrySettings,
                                                                capNumberOfEntries: {
                                                                    ...selectedLifecycle
                                                                        .reentrySettings
                                                                        .capNumberOfEntries,
                                                                    maxEntries: data,
                                                                },
                                                            },
                                                        });
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        marginRight: "10px",
                                                    }}
                                                >
                                                    time
                                                    {selectedLifecycle
                                                        .reentrySettings
                                                        .capNumberOfEntries
                                                        .maxEntries > 1
                                                        ? "s"
                                                        : ""}
                                                </span>
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                    </>
                                ) : (
                                    <></>
                                )}
                                <p
                                    style={{
                                        fontWeight: 500,
                                        marginRight: "20px",
                                        marginTop: "20px",
                                    }}
                                    className="actionEditorLabel"
                                >
                                    Lifecycle completes
                                </p>
                                <div style={{ display: "inline-block" }}>
                                    <SelectSimple
                                        placeholder="manual"
                                        values={[
                                            {
                                                value: "manual",
                                                name: "When manually completed",
                                            },
                                            {
                                                value: "throughMilestones",
                                                name:
                                                    "When all milestones are completed",
                                            },
                                            {
                                                value: "conditions",
                                                name:
                                                    "Automatically through conditions",
                                            },
                                        ]}
                                        height="40px"
                                        value={
                                            selectedLifecycle.lifecycleCompletionMethod
                                        }
                                        onChange={(data) => {
                                            setSelectedLifecycle({
                                                ...selectedLifecycle,
                                                lifecycleCompletionMethod: data,
                                            });
                                        }}
                                    />
                                </div>
                                {selectedLifecycle.lifecycleCompletionMethod ===
                                "conditions" ? (
                                    <div>
                                        <p
                                            style={{
                                                marginTop: "20px",
                                                fontWeight: 500,
                                                marginBottom: "0px",
                                            }}
                                            className="actionEditorLabel"
                                        >
                                            Completion conditions
                                        </p>
                                        <PredicateGroup
                                            noMatchIf
                                            predicates={
                                                selectedLifecycle
                                                    .completionConditions
                                                    .predicates
                                            }
                                            predicateOperator={
                                                selectedLifecycle
                                                    .completionConditions
                                                    .predicatesOperator
                                            }
                                            dictionary={dictionary}
                                            eventDictionary={eventDictionary}
                                            onChange={(data) => {
                                                setSelectedLifecycle({
                                                    ...selectedLifecycle,
                                                    completionConditions: {
                                                        ...selectedLifecycle.completionConditions,
                                                        predicates:
                                                            data.predicates,
                                                        predicatesOperator:
                                                            data.operator,
                                                    },
                                                });
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <p
                                    style={{
                                        fontWeight: 500,
                                        marginRight: "20px",
                                        marginTop: "10px",
                                        marginBottom: "10px",
                                    }}
                                    className="actionEditorLabel"
                                >
                                    Completion time
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: "-5px",
                                        width: "50%",
                                        alignItems: "center",
                                    }}
                                >
                                    <span style={{ marginRight: "10px" }}>
                                        Lifecycle should take
                                    </span>
                                    <InputSimple
                                        placeholder="Enter value"
                                        numeric
                                        centerText
                                        value={
                                            selectedLifecycle.daysToComplete
                                                .days
                                        }
                                        margin="0px 10px 0px 0px"
                                        onChange={(data) => {
                                            setSelectedLifecycle({
                                                ...selectedLifecycle,
                                                daysToComplete: {
                                                    ...selectedLifecycle.daysToComplete,
                                                    days: data,
                                                },
                                            });
                                        }}
                                    />
                                    days to complete
                                </div>
                                <p
                                    style={{
                                        fontWeight: 500,
                                        marginRight: "20px",
                                        marginTop: "10px",
                                    }}
                                    className="actionEditorLabel"
                                >
                                    Progress scale
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: "-5  px",
                                        alignItems: "center",
                                    }}
                                >
                                    <span style={{ marginRight: "10px" }}>
                                        Users residing in this lifecycle from 0
                                        to
                                    </span>
                                    <InputSimple
                                        placeholder="Enter value"
                                        numeric
                                        centerText
                                        value={
                                            selectedLifecycle.daysToComplete
                                                .progressCycle.onTrack
                                        }
                                        margin="0px 10px 0px 0px"
                                        onChange={(data) => {
                                            setSelectedLifecycle({
                                                ...selectedLifecycle,
                                                daysToComplete: {
                                                    ...selectedLifecycle.daysToComplete,
                                                    progressCycle: {
                                                        ...selectedLifecycle
                                                            .daysToComplete
                                                            .progressCycle,
                                                        onTrack: data,
                                                    },
                                                },
                                            });
                                        }}
                                    />
                                    days are{" "}
                                    <span className="onTrackspan">Green</span>{" "}
                                    (on track)
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: "10px",
                                        alignItems: "center",
                                    }}
                                >
                                    <span style={{ marginRight: "10px" }}>
                                        Users residing in this lifecycle from{" "}
                                        {Number(
                                            selectedLifecycle.daysToComplete
                                                .progressCycle.onTrack
                                        ) + 1}{" "}
                                        to
                                    </span>
                                    <InputSimple
                                        placeholder="Enter value"
                                        numeric
                                        centerText
                                        value={
                                            selectedLifecycle.daysToComplete
                                                .progressCycle.behind
                                        }
                                        margin="0px 10px 0px 0px"
                                        onChange={(data) => {
                                            setSelectedLifecycle({
                                                ...selectedLifecycle,
                                                daysToComplete: {
                                                    ...selectedLifecycle.daysToComplete,
                                                    progressCycle: {
                                                        ...selectedLifecycle
                                                            .daysToComplete
                                                            .progressCycle,
                                                        behind: data,
                                                    },
                                                },
                                            });
                                        }}
                                    />
                                    days are{" "}
                                    <span className="behindSpan">Yellow</span>{" "}
                                    (behind)
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: "10px",
                                        alignItems: "center",
                                    }}
                                >
                                    <span style={{ marginRight: "10px" }}>
                                        Users residing in this lifecycle{" "}
                                        {Number(
                                            selectedLifecycle.daysToComplete
                                                .progressCycle.behind
                                        ) + 1}{" "}
                                        or more days are
                                    </span>
                                    <span className="stuckSpan">Red</span>{" "}
                                    (stuck)
                                </div>
                            </Accordion>
                        </div>
                        <div style={{ padding: "20px" }}>
                            <Accordion header="Danger zone">
                                <p
                                    style={{
                                        fontWeight: 500,
                                        marginRight: "20px",
                                        marginTop: "20px",
                                    }}
                                    className="actionEditorLabel"
                                >
                                    Delete lifecycle
                                </p>
                                <StyledButtonSave
                                    onClick={deleteLifecycle}
                                    size="sm"
                                    ml="0px"
                                    deleted
                                >
                                    Delete this lifecycle
                                </StyledButtonSave>
                            </Accordion>
                        </div>
                    </>
                ) : (
                    <div style={{ padding: "20px" }}>
                        {selectedLifecycle.milestones.length > 0 ? (
                            <>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                    }}
                                >
                                    <div style={{ width: "250px" }}>
                                        <SelectSimple
                                            onChange={(data) => {
                                                setselectedMilestone(data);
                                            }}
                                            value={selectedMilestone}
                                            values={[
                                                ...Array.from(
                                                    selectedLifecycle.milestones,
                                                    ({
                                                        id,
                                                        name = "",
                                                        order = 1,
                                                    }) => {
                                                        return {
                                                            value: id,
                                                            name: `${order}. ${name}`,
                                                        };
                                                    }
                                                ),
                                                {
                                                    value: "new",
                                                    name:
                                                        "Create new milestone...",
                                                },
                                            ]}
                                        />
                                    </div>
                                    <div style={{ marginLeft: "auto" }}>
                                        <ReactTooltip
                                            place="top"
                                            effect="solid"
                                        />
                                        <StyledButtonIcon
                                            onClick={() => {
                                                moveMilestone(
                                                    milestone.order,
                                                    "up"
                                                );
                                            }}
                                            disabled={milestone.order === 1}
                                            data-tip="Move milestone order up"
                                            primary={false}
                                            size="sm"
                                            ml="10px"
                                        >
                                            <ChevronUp size="16px" />
                                        </StyledButtonIcon>
                                        <ReactTooltip
                                            place="top"
                                            effect="solid"
                                        />
                                        <StyledButtonIcon
                                            onClick={() => {
                                                moveMilestone(
                                                    milestone.order,
                                                    "down"
                                                );
                                            }}
                                            disabled={
                                                milestone.order ===
                                                selectedLifecycle.milestones
                                                    .length
                                            }
                                            data-tip="Move milestone order down"
                                            primary={false}
                                            size="sm"
                                            ml="10px"
                                        >
                                            <ChevronDown size="16px" />
                                        </StyledButtonIcon>
                                        <ReactTooltip
                                            place="top"
                                            effect="solid"
                                        />
                                        <StyledButtonIcon
                                            onClick={() => {
                                                deleteMilestone(milestone.id);
                                            }}
                                            data-tip="Delete milestone"
                                            primary={false}
                                            size="sm"
                                            ml="10px"
                                        >
                                            <XCircle size="16px" />
                                        </StyledButtonIcon>
                                    </div>
                                </div>
                                <div style={{ marginTop: "20px" }}>
                                    <Accordion active header="General settings">
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                marginRight: "20px",
                                            }}
                                            className="actionEditorLabel"
                                        >
                                            Name
                                        </p>
                                        <InputSimple
                                            placeholder="Enter the name for this milestone"
                                            width="100%"
                                            value={milestone.name}
                                            onChange={(data) => {
                                                setmilestone({
                                                    ...milestone,
                                                    name: data,
                                                });
                                            }}
                                        />
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                marginRight: "20px",
                                                marginTop: "20px",
                                            }}
                                            className="actionEditorLabel"
                                        >
                                            Description
                                        </p>
                                        <InputSimple
                                            placeholder="Enter a detailed description that can be helpful to the person reading it"
                                            width="100%"
                                            value={milestone.description}
                                            onChange={(data) => {
                                                setmilestone({
                                                    ...milestone,
                                                    description: data,
                                                });
                                            }}
                                        />
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                marginRight: "20px",
                                                marginTop: "20px",
                                            }}
                                            className="actionEditorLabel"
                                        >
                                            Milestone begins
                                        </p>
                                        <div
                                            style={{ display: "inline-block" }}
                                        >
                                            <SelectSimple
                                                placeholder="manual"
                                                values={[
                                                    {
                                                        value: "manual",
                                                        name:
                                                            "When assigned manually",
                                                    },
                                                    {
                                                        value:
                                                            "previousMilestoneComplete",
                                                        name:
                                                            "When previous milestone have been completed",
                                                    },
                                                    {
                                                        value:
                                                            "whenLifecycleBegins",
                                                        name:
                                                            "immediately when lifecycle begins",
                                                    },
                                                ]}
                                                height="40px"
                                                value={
                                                    milestone.milestoneBeginsWhen
                                                }
                                                onChange={(data) => {
                                                    setmilestone({
                                                        ...milestone,
                                                        milestoneBeginsWhen: data,
                                                    });
                                                }}
                                            />
                                        </div>
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                marginRight: "20px",
                                                marginTop: "20px",
                                            }}
                                            className="actionEditorLabel"
                                        >
                                            Milestone completes
                                        </p>
                                        <div
                                            style={{ display: "inline-block" }}
                                        >
                                            <SelectSimple
                                                placeholder="manual"
                                                values={[
                                                    {
                                                        value: "manual",
                                                        name:
                                                            "When marked manually",
                                                    },
                                                    {
                                                        value:
                                                            "whenTasksFinished",
                                                        name:
                                                            "Automatically when all steps are completed",
                                                    },
                                                ]}
                                                height="40px"
                                                value={
                                                    milestone.milestoneCompletesWhen
                                                }
                                                onChange={(data) => {
                                                    setmilestone({
                                                        ...milestone,
                                                        milestoneCompletesWhen: data,
                                                    });
                                                }}
                                            />
                                        </div>
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                marginRight: "20px",
                                                marginTop: "20px",
                                                marginBottom: "10px",
                                            }}
                                            className="actionEditorLabel"
                                        >
                                            Completion time
                                        </p>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                marginTop: "-5px",
                                                width: "50%",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span
                                                style={{ marginRight: "10px" }}
                                            >
                                                Milestone should take
                                            </span>
                                            <InputSimple
                                                placeholder="Enter value"
                                                numeric
                                                centerText
                                                value={
                                                    milestone.daysToComplete
                                                        .days
                                                }
                                                margin="0px 10px 0px 0px"
                                                onChange={(data) => {
                                                    setmilestone({
                                                        ...milestone,
                                                        daysToComplete: {
                                                            ...milestone.daysToComplete,
                                                            days: data,
                                                        },
                                                    });
                                                }}
                                            />
                                            days to complete
                                        </div>
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                marginRight: "20px",
                                                marginTop: "10px",
                                            }}
                                            className="actionEditorLabel"
                                        >
                                            Progress scale
                                        </p>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                marginTop: "-5  px",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span
                                                style={{ marginRight: "10px" }}
                                            >
                                                Users residing in this milestone
                                                from 0 to
                                            </span>
                                            <InputSimple
                                                placeholder="Enter value"
                                                numeric
                                                centerText
                                                value={
                                                    milestone.daysToComplete
                                                        .progressCycle.onTrack
                                                }
                                                margin="0px 10px 0px 0px"
                                                onChange={(data) => {
                                                    setmilestone({
                                                        ...milestone,
                                                        daysToComplete: {
                                                            ...milestone.daysToComplete,
                                                            progressCycle: {
                                                                ...milestone
                                                                    .daysToComplete
                                                                    .progressCycle,
                                                                onTrack: data,
                                                            },
                                                        },
                                                    });
                                                }}
                                            />
                                            days are{" "}
                                            <span className="onTrackspan">
                                                Green
                                            </span>{" "}
                                            (on track)
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                marginTop: "10px",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span
                                                style={{ marginRight: "10px" }}
                                            >
                                                Users residing in this milestone
                                                from{" "}
                                                {Number(
                                                    milestone.daysToComplete
                                                        .progressCycle.onTrack
                                                ) + 1}{" "}
                                                to
                                            </span>
                                            <InputSimple
                                                placeholder="Enter value"
                                                numeric
                                                centerText
                                                value={
                                                    milestone.daysToComplete
                                                        .progressCycle.behind
                                                }
                                                margin="0px 10px 0px 0px"
                                                onChange={(data) => {
                                                    setmilestone({
                                                        ...milestone,
                                                        daysToComplete: {
                                                            ...milestone.daysToComplete,
                                                            progressCycle: {
                                                                ...milestone
                                                                    .daysToComplete
                                                                    .progressCycle,
                                                                behind: data,
                                                            },
                                                        },
                                                    });
                                                }}
                                            />
                                            days are{" "}
                                            <span className="behindSpan">
                                                Yellow
                                            </span>{" "}
                                            (behind)
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                marginTop: "10px",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span
                                                style={{ marginRight: "10px" }}
                                            >
                                                Users residing in this milestone{" "}
                                                {Number(
                                                    milestone.daysToComplete
                                                        .progressCycle.behind
                                                ) + 1}{" "}
                                                or more days are
                                            </span>
                                            <span className="stuckSpan">
                                                Red
                                            </span>{" "}
                                            (stuck)
                                        </div>
                                    </Accordion>
                                </div>
                                <div style={{ marginTop: "20px" }}>
                                    <AccordionEditable
                                        active
                                        onAddClick={addNewTask}
                                        header="Task list"
                                        subtitle="0 active tasks"
                                    >
                                        {milestone.tasks.map((_task, j) => {
                                            return (
                                                <TaskItem
                                                    key={_task.id}
                                                    _task={_task}
                                                    onDelete={() => {
                                                        deleteTask(_task.id);
                                                    }}
                                                    onChange={changeTask}
                                                />
                                            );
                                        })}
                                    </AccordionEditable>
                                </div>
                                <div style={{ marginTop: "20px" }}>
                                    <AccordionEditable
                                        active
                                        addButtonText="Add achievement"
                                        onAddClick={addNewAchievement}
                                        header="Achievement list"
                                        subtitle="0 active tasks"
                                    >
                                        {milestone.achievements.map(
                                            (_achievement, j) => {
                                                return (
                                                    <AchievementItem
                                                        dictionary={dictionary}
                                                        eventDictionary={
                                                            eventDictionary
                                                        }
                                                        key={_achievement.id}
                                                        _achievement={
                                                            _achievement
                                                        }
                                                        onDelete={() => {
                                                            deleteAchievement(
                                                                _achievement.id
                                                            );
                                                        }}
                                                        onChange={
                                                            changeAchievement
                                                        }
                                                    />
                                                );
                                            }
                                        )}
                                    </AccordionEditable>
                                </div>
                            </>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                }}
                            >
                                <img
                                    alt="journey"
                                    src="/images/journey.png"
                                    style={{ width: "256px" }}
                                />
                                <h5
                                    style={{
                                        marginTop: "30px",
                                        fontWeight: 500,
                                        fontSize: "16px",
                                    }}
                                >
                                    Add milestones to this lifecycle
                                </h5>
                                <p>
                                    A Milestone is a distinct phase/step in the
                                    overall Lifecycle
                                </p>
                                <div style={{}}>
                                    <StyledButtonSave
                                        onClick={addNewMilestone}
                                        size="sm"
                                        ml="10px"
                                    >
                                        Create new milestone
                                    </StyledButtonSave>
                                </div>
                            </div>
                        )}

                        {/*
                         */}
                    </div>
                )}
            </StyledBody>
        </StyledSidebar>
    );
};

export default LifecycleEditor;
