/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { FC, useState, useEffect } from "react";
import Accordion from "src/components/accordion";
import "./engagefulComponentOverride.css";
import PredicateSelector from "src/components/predicates/predicateselector/PredicateSelector";
import { SelectSimple } from "src/components/commoncomponents/SelectSimple";
import { InputSimple } from "src/components/commoncomponents/InputSimple";
import {
    StyledSidebar,
    StyledHeader,
    StyledBody,
    StyledButtonSave,
} from "./style";
import { useAppSelector } from "../../../../redux/hooks";
import { IDictionaryItem, INode, IPredicate } from "../../interfaces";
import ControlsManager from "./ControlsManager/ControlsManager";
import EmailPreview from "./EmailPreview/EmailPreview";

interface IActionEditor {
    dictionary: Array<IDictionaryItem>;
    eventDictionary: Array<IDictionaryItem>;
    selectedNodeData: INode;
    onSave?: (e: any) => any;
    onCancel?: (e: any) => any;
}

const ActionEditor: FC<IActionEditor> = ({
    dictionary,
    eventDictionary,
    selectedNodeData = {
        config: "messagebox",
        goalPredicate: {
            value: [],
            attribute: null,
            additionalData: { inlineFilter: [] },
        },
        evaluationValues: {
            days: 0,
            hours: 1,
            minutes: 0,
        },
        evaluationTime: 3600,
        goalTimeConstraintDays: 259200,
        params: {
            show: true,
            accentColor: "#1e88ec",
            title: "New features!",
            body: "We are releasing our brand new editor this week!",
            position: "bottomLeft",
            videoUrl: "",
            action: "none",
            withLink: true,
            linkText: "Learn more →",
        },
    },
    onSave = () => {},
    onCancel = () => {},
}) => {
    // Due to quill editor, we save email body in a variable so we don't re-render it
    const [emailBody, setemailBody] = useState(selectedNodeData.action.config.body);
    const { sidebar } = useAppSelector((state) => state.ui);
    const [selectedNodeDataConfig, setSelectedNodeDataConfig] = useState(
        selectedNodeData.action.config
    );
    const [selectedEvaluationValues, setselectedEvaluationValues] = useState(
        selectedNodeData.evaluationValues
            ? selectedNodeData.evaluationValues
            : {
                  days: 0,
                  hours: 1,
                  minutes: 0,
              }
    );
    const [selectedEvaluationTime, setselectedEvaluationTime] = useState(selectedNodeData.evaluationTime);
    const [selectedNodeDataAction, setSelectedNodeDataAction] = useState(
        selectedNodeData.action.action
    );
    const [nodeName, setNodeName] = useState<string | any>(
        selectedNodeData.name
    );
    const [nodeGoal, setNodeGoal] = useState<IPredicate | any>(
        selectedNodeData.goalPredicate
            ? selectedNodeData.goalPredicate
            : {
                  value: [],
                  additionalData: { inlineFilter: { value: [] } },
              }
    );
    const [formattedNodeGoal, setFormattedNodeGoal] = useState<
        IPredicate | any
    >(null);
    const [nodeGoalTime, setNodeGoalTime] = useState<number | string | null>(
        selectedNodeData.goalTimeConstraintDays
            ? selectedNodeData.goalTimeConstraintDays
            : null
    );

    const [widgetInitialized, setWidgetInitialized] = useState(false);

    const formatGoalPredicate = () => {
        const sp = selectedNodeData.goalPredicate;
        if (sp) {
            if (sp.attribute && sp.attribute.includes("event:")) {
                const split = sp.attribute.split(":");
                setFormattedNodeGoal({
                    _id: sp._id,
                    value: sp.value,
                    type: split[0],
                    attribute: split[1],
                    comparison: `${split[2]}:${sp.comparison}`,
                    additionalData: sp.additionalData,
                });
            } else {
                setFormattedNodeGoal(nodeGoal);
            }
        } else {
            setFormattedNodeGoal(nodeGoal);
        }
    };

    const handleSaveChanges = () => {
        // Due to react-quill re-render issue
        let newDataConfig = selectedNodeDataConfig;
        if (selectedNodeDataAction === "email") {
            newDataConfig = {
                ...newDataConfig,
                body: emailBody
            }
        }
        onSave({
            name: nodeName,
            nodeConfig: newDataConfig,
            goalPredicate: formattedNodeGoal,
            goalTimeConstraintDays: nodeGoalTime,
            evaluationValues: selectedEvaluationValues,
            evaluationTime: selectedEvaluationTime
        });
    };

    const renderMessage = () => {
        const { EngagefulInternal } = window as any;
        if (EngagefulInternal && widgetInitialized) {
            EngagefulInternal(selectedNodeDataAction, {
                ...selectedNodeDataConfig,
                attachTo: "#engageful-attachTo",
            });
        }
    };

    const handleControlsManagerChange = (data: any) => {
        setSelectedNodeDataConfig({
            ...selectedNodeDataConfig,
            ...data,
        });
        console.log(data);
    };

    const handleGoalChange = (data: any) => {
        setFormattedNodeGoal(data);
        setNodeGoal(data);
    };

    useEffect(() => {
        if (!["email", "slack"].includes(selectedNodeDataAction)) {
            renderMessage();
        }
    }, [selectedNodeDataConfig]);

    useEffect(() => {
        const newEv =
            selectedEvaluationValues.days * 86400 +
            selectedEvaluationValues.hours * 3600 +
            selectedEvaluationValues.minutes * 60;
            setselectedEvaluationTime(newEv);
    }, [selectedEvaluationValues]);

    useEffect(() => {
        const { EngagefulInternal } = window as any;
        formatGoalPredicate();
        if (!["email", "slack"].includes(selectedNodeDataAction)) {
            EngagefulInternal("init_inline", {}, () => {
                setWidgetInitialized(true);
            });
            renderMessage();
        }
    }, []);

    return (
        <StyledSidebar className={`sidebar ${selectedNodeDataAction === "slack" ? "slack" : ""}`} $sidebar={sidebar}>
            <StyledHeader>
                <div>
                    <input
                        className="sideBarNodeNameInput"
                        type="text"
                        placeholder="Enter name..."
                        onChange={(d) => {
                            setNodeName(d.currentTarget.value);
                        }}
                        value={nodeName}
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
                <Accordion active header="Message content">
                    <div style={{ display: "flex" }}>
                        <div
                            style={{
                                width:
                                    ["modalbox", "slack"].includes(selectedNodeDataAction)
                                        ? "100%"
                                        : "250px",
                            }}
                        >
                            <ControlsManager
                                params={selectedNodeDataConfig}
                                action={selectedNodeDataAction}
                                onChange={handleControlsManagerChange}
                            />
                        </div>
                            
                        <div
                            className="diContainer"
                            style={{
                                marginLeft: "auto",
                                width: "780px",
                                minHeight: selectedNodeDataAction === "slack" ? "auto" : false,
                                display:
                                    selectedNodeDataAction === "modalbox"
                                        ? "none"
                                        : "",
                            }}
                        >
                            <div id="dashboard-inline" style={{
                                pointerEvents: selectedNodeDataAction === "email" ? "initial" : "none",
                                paddingTop: selectedNodeDataAction === "email" ? "40px" : "initial",
                                background: selectedNodeDataAction === "email" ? "#f9f9f9" : "initial" 
                            }}>
                                {selectedNodeDataAction === "email" ? 
                                <EmailPreview 
                                onChange={(data) => {
                                    console.log(emailBody)
                                    setemailBody(data.body);
                                }} 
                                params={selectedNodeDataConfig}
                                />   
                            :<></>}
                                </div>
                            {selectedNodeDataAction.action === "tooltip" ? (
                                <></>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </Accordion>

                <div style={{ marginTop: "20px" }}>
                    <Accordion active={false} header="Goal">
                        <div style={{ marginBottom: "20px" }}>
                            Understand how your message drives people to take
                            action in your product.
                        </div>
                        {formattedNodeGoal ? (
                            <PredicateSelector
                                label="Add goal"
                                predicate={formattedNodeGoal}
                                keyIndex={0}
                                debug={false}
                                dictionary={dictionary}
                                eventDictionary={eventDictionary}
                                onChange={(predicate) => {
                                    handleGoalChange(predicate);
                                }}
                                onDelete={() => {
                                    console.log("Deletedhahaha");
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
                                        value={nodeGoalTime}
                                        onChange={(data) => {
                                            setNodeGoalTime(data);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Accordion>
                </div>

                {!["email", "slack"].includes(selectedNodeDataAction)
                ?
                <div style={{ marginTop: "20px" }}>
                    <Accordion active={false} header="Wait">
                        <div style={{ marginBottom: "20px" }}>
                            Set how long to wait for a person to come online to
                            deliver this message.
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <div>
                                    <InputSimple
                                        placeholder=""
                                        numeric
                                        centerText
                                        padding="2px"
                                        height="33px"
                                        width="60px"
                                        value={
                                            selectedEvaluationValues &&
                                            selectedEvaluationValues.days
                                                ? selectedEvaluationValues.days
                                                : 0
                                        }
                                        margin="0px 10px 0px 0px"
                                        onChange={(data) => {
                                            setselectedEvaluationValues({
                                                ...selectedEvaluationValues,
                                                days: parseFloat(data),
                                            });
                                        }}
                                    />
                                    day
                                    {selectedEvaluationValues &&
                                    selectedEvaluationValues.days > 1
                                        ? "s"
                                        : ""}
                                </div>
                                <div
                                    style={{
                                        marginLeft: "10px",
                                    }}
                                >
                                    <InputSimple
                                        placeholder=""
                                        numeric
                                        centerText
                                        padding="2px"
                                        height="33px"
                                        width="60px"
                                        value={
                                            selectedEvaluationValues &&
                                            selectedEvaluationValues.hours
                                                ? selectedEvaluationValues.hours
                                                : 0
                                        }
                                        margin="0px 10px 0px 0px"
                                        onChange={(data) => {
                                            console.log(data, parseFloat(data));
                                            setselectedEvaluationValues({
                                                ...selectedEvaluationValues,
                                                hours: parseFloat(data),
                                            });
                                        }}
                                    />
                                    hour
                                    {selectedEvaluationValues &&
                                    selectedEvaluationValues.hours > 1
                                        ? "s"
                                        : ""}
                                </div>
                                <div
                                    style={{
                                        marginLeft: "10px",
                                    }}
                                >
                                    <InputSimple
                                        placeholder=""
                                        numeric
                                        centerText
                                        padding="2px"
                                        height="33px"
                                        width="60px"
                                        value={
                                            selectedEvaluationValues &&
                                            selectedEvaluationValues.minutes
                                                ? selectedEvaluationValues.minutes
                                                : 0
                                        }
                                        margin="0px 10px 0px 0px"
                                        onChange={(data) => {
                                            setselectedEvaluationValues({
                                                ...selectedEvaluationValues,
                                                minutes: parseFloat(data),
                                            });
                                        }}
                                    />
                                    minute
                                    {selectedEvaluationValues &&
                                    selectedEvaluationValues.minutes > 1
                                        ? "s"
                                        : ""}
                                </div>
                            </div>
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            If the person still hasn’t come online after{" "}
                            {selectedEvaluationValues.days && selectedEvaluationValues.days > 0? (
                                ` ${selectedEvaluationValues.days}d`
                            ) : (
                                <></>
                            )}
                            {selectedEvaluationValues.hours && selectedEvaluationValues.hours > 0? (
                                ` ${selectedEvaluationValues.hours}h`
                            ) : (
                                <></>
                            )}
                            {selectedEvaluationValues.minutes && selectedEvaluationValues.minutes > 0? (
                                ` ${selectedEvaluationValues.minutes}m`
                            ) : (
                                <></>
                            )}
                            , they will leave this path.
                        </div>
                    </Accordion>
                </div>
                : <></>}
            </StyledBody>
        </StyledSidebar>
    );
};

export default ActionEditor;
