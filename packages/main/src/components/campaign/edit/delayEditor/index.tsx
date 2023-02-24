/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { FC, useState, useEffect, useCallback } from "react";
import { PredicateGroup } from "src/components/predicates/predicategroup/PredicateGroup";
import Accordion from "src/components/accordion";
import { SelectSimple } from "src/components/commoncomponents/SelectSimple";
import { setShowExitWarning } from "src/redux/slices/campaignEditor";
import PredicateUsers from "src/components/predicates/predicateusers/PredicateUsers";
import PredicateSelector from "src/components/predicates/predicateselector/PredicateSelector";
import { SwitchSimple } from "src/components/commoncomponents/SwitchSimple";
import { InputSimple } from "src/components/commoncomponents/InputSimple";
import { minutesToHours } from "date-fns";
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
    INode,
    IPredicate,
} from "../../interfaces";

interface IDelayEditor {
    evaluationValues: any;
    evaluationTime: number;
    onSave?: (e: any) => any;
    onCancel?: (e: any) => any;
}

const DelayEditor: FC<IDelayEditor> = ({
    evaluationValues = {
        days: 0, hours: 1, minutes: 0
    },
    evaluationTime = 3600,
    onSave = () => {},
    onCancel = () => {},
}) => {
    const { sidebar } = useAppSelector((state) => state.ui);

    const [selectedEvaluationValues, setselectedEvaluationValues] = useState(
        evaluationValues
);
    const [selectedEvaluationTime, setselectedEvaluationTime] = useState(evaluationTime);

    const handleSaveChanges = () => {
        const newEv =
            selectedEvaluationValues.days * 86400 +
            selectedEvaluationValues.hours * 3600 +
            selectedEvaluationValues.minutes * 60;
        onSave({
            evaluationTime: newEv,
            evaluationValues: selectedEvaluationValues
        });
    };

    useEffect(() => {
    }, []);

    return (
        <StyledSidebar className="sidebar delay" $sidebar={sidebar}>
            <StyledHeader>
                <div>
                    Wait
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
                    <Accordion noToggle active header="Time">
                <div style={{ marginTop: "20px" }}>
                        <div style={{ marginBottom: "20px" }}>
                            Choose how long people should wait for
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
                </div>
                    </Accordion>
                </div>
            </StyledBody>
        </StyledSidebar>
    );
};

export default DelayEditor;
