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

interface ISettingsEditor {
    campaignName: string;
    dictionary: Array<IDictionaryItem>;
    eventDictionary: Array<IDictionaryItem>;
    goalPredicate: IPredicate;
    goalTimeConstraintDays: number;
    exitPredicates: [IPredicate];
    throttleSettings: IThrottleSettings;
    exitPredicateOperator: string;
    onSave?: (e: any) => any;
    onCancel?: (e: any) => any;
}

const SettingsEditor: FC<ISettingsEditor> = ({
    campaignName = "",
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
        deliveryOrder: 0,
    },
    exitPredicates = [
        {
            value: [],
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

    const [currentGoalPredicate, setcurrentGoalPredicate] = useState(
        goalPredicate
    );
    const [formattedGoalPredicate, setformattedGoalPredicate] = useState();
    const [currentExitPredicates, setcurrentexitPredicates] = useState(
        exitPredicates
    );
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
        const updatedFilters: IPredicate[] = [];
        currentExitPredicates.forEach((tp: IPredicate) => {
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
            name: currentCampaignName,
            goalPredicate: formattedGoalPredicate,
            goalTimeConstraintDays: currentGoalTime,
            throttleSettings: currentThrottleSettings,
            exitPredicates: updatedFilters,
            exitPredicateOperator: currentExitPredicatesOperator,
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
        // TODO: Exit predicates undefined
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
                        onClick={() => {
                            console.log(currentExitPredicates)
                            onCancel();
                        }}
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
                    <Accordion active header="Campaign goal">
                        <div style={{ marginBottom: "20px" }}>
                            Understand how your campaign drives people to take
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
                <div style={{ marginTop: "20px" }}>
                    <Accordion active={false} header="Exit rules">
                        <div style={{ marginBottom: "20px" }}>
                            Choose what type of people should exit the campaign.
                        </div>
                        <PredicateGroup
                            predicates={currentExitPredicates}
                            dictionary={dictionary}
                            eventDictionary={eventDictionary}
                            onChange={handleExitRulesChange}
                        />
                    </Accordion>
                </div>
                <div style={{ marginTop: "20px" }}>
                    <Accordion active={false} header="Delivery settings">
                        <div style={{ marginBottom: "20px" }}>
                            Determine the priority and delivery settings of this
                            campaign.
                        </div>
                        <SwitchSimple
                            value={
                                currentThrottleSettings &&
                                currentThrottleSettings.bypass
                                    ? currentThrottleSettings.bypass
                                    : false
                            }
                            text="Bypass global throttle settings"
                            onChange={(data) => {
                                setcurrentThrottleSettings({
                                    ...currentThrottleSettings,
                                    bypass: data,
                                });
                            }}
                        />
                        <div
                            style={{
                                marginTop: "10px",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <div style={{ marginRight: "10px" }}>
                                Campaign display order
                            </div>
                            <InputSimple
                                placeholder="Enter value"
                                numeric
                                centerText
                                padding="2px"
                                height="33px"
                                width="40px"
                                value={
                                    currentThrottleSettings &&
                                    currentThrottleSettings.deliveryOrder
                                        ? currentThrottleSettings.deliveryOrder
                                        : "0"
                                }
                                margin="0px 10px 0px 0px"
                                onChange={(data) => {
                                    setcurrentThrottleSettings({
                                        ...currentThrottleSettings,
                                        deliveryOrder: parseInt(data, 10),
                                    });
                                }}
                            />
                        </div>
                    </Accordion>
                </div>
            </StyledBody>
        </StyledSidebar>
    );
};

export default SettingsEditor;
