/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { FC, useEffect, useState } from "react";
import { PredicateGroup } from "src/components/predicates/predicategroup/PredicateGroup";
import Accordion from "src/components/accordion";
import { setShowExitWarning } from "src/redux/slices/campaignEditor";
import PredicateUsers from "src/components/predicates/predicateusers/PredicateUsers";
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
import { IDictionaryItem, INode, IPredicate } from "../../interfaces";

interface INodeEditor {
    campaignData: any;
    dictionary: Array<IDictionaryItem>;
    eventDictionary: Array<IDictionaryItem>;
    selectedNodeData: INode;
    isEntry: boolean;
    onSave?: (e: any) => any;
    onCancel?: (e: any) => any;
}

const NodeEditor: FC<INodeEditor> = ({
    campaignData = false,
    dictionary = [],
    eventDictionary = [],
    selectedNodeData = {
        evaluationValues: {
            days: 1,
            hours: 0,
            minutes: 0,
        },
    },
    isEntry = true,
    onSave = () => {},
    onCancel = () => {},
}) => {
    const { sidebar } = useAppSelector((state) => state.ui);
    const [selectedNodeDataFilters, setSelectedNodeDataFilters] = useState<
        IPredicate[] | any
    >(selectedNodeData.filters);
    const [selectedNodeDataAction, setSelectedNodeDataAction] = useState(
        selectedNodeData.action
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
    const [nodeName, setNodeName] = useState<string | any>(
        selectedNodeData.name
    );

    const [
        selectedPredicatesOperator,
        setSelectedPredicatesOperator,
    ] = useState(selectedNodeData.filterOperator);
    const [accordionState, setAccordionState] = useState<number>(0);
    const dispatch = useAppDispatch();

    const handleChange = (data: any) => {
        setSelectedNodeDataFilters(data.predicates);
        setSelectedPredicatesOperator(data.operator);
    };

    const handleSaveChanges = () => {
        const updatedFilters: IPredicate[] = [];
        selectedNodeDataFilters.forEach((tp: IPredicate) => {
            if (!tp._id) {
                updatedFilters.push({
                    ...tp,
                    _id: `new_predicate_${Date.now()}`,
                });
            } else {
                updatedFilters.push(tp);
            }
        });
        onSave({
            name: nodeName,
            triggerPredicates: updatedFilters,
            triggerPredicateOperator: selectedPredicatesOperator,
            evaluationValues: selectedEvaluationValues,
            evaluationTime: selectedEvaluationTime
        });
    };

    useEffect(() => {
        const newEv =
            selectedEvaluationValues.days * 86400 +
            selectedEvaluationValues.hours * 3600 +
            selectedEvaluationValues.minutes * 60;
            setselectedEvaluationTime(newEv);
    }, [selectedEvaluationValues]);

    return (
        <StyledSidebar className="sidebar" $sidebar={sidebar}>
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
                <div style={{ padding: "20px" }}>
                    <PredicateGroup
                    // debug
                        campaignData={campaignData}
                        predicates={selectedNodeDataFilters}
                        predicateOperator={selectedPredicatesOperator}
                        dictionary={dictionary}
                        eventDictionary={eventDictionary}
                        onChange={handleChange}
                    />
                </div>
                <PredicateUsers
                    isEntry={isEntry}
                    predicatesOperator={selectedPredicatesOperator}
                    predicates={selectedNodeDataFilters}
                />
                {!isEntry ? 
                <div style={{ padding: "20px" }}>
                        <div style={{ marginBottom: "20px" }}>
                        <span
                                        style={{
                                            fontSize: "14px",
                                            display: "block",
                                            fontWeight: "500",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        Wait rules
                                        </span>
                            Set how long to keep trying to match the rules.
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
                        {selectedEvaluationValues.days === 0 && selectedEvaluationValues.hours === 0 && selectedEvaluationValues.minutes === 0 ?
                        <div style={{ marginBottom: "20px" }}>
                            If the person does not match the rules, they will leave this path.
                        </div>
                        :
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
                        }
                        </div>
                : <></>
                }
            </StyledBody>
        </StyledSidebar>
    );
};

export default NodeEditor;
