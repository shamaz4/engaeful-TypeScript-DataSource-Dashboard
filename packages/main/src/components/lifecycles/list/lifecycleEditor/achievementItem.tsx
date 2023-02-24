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
import { IAchievement } from "src/components/achievementmanager/interfaces";
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

interface IAchievementItem {
    _achievement: IAchievement;
    dictionary: Array<IDictionaryItem>;
    eventDictionary: Array<IDictionaryItem>;
    onChange?: any;
    onDelete?: any;
}

const AchievementItem: FC<IAchievementItem> = ({
    _achievement = {
        id: "",
        name: "",
        achievementCompletesWhen: "conditions",
        completionConditions: {
            predicates: [
                {
                    value: [],
                },
            ],
            predicatesOperator: "and",
        },
        required: true,
        status: 0,
    },
    dictionary = [],
    eventDictionary = [],
    onChange = () => {},
    onDelete = () => {},
}) => {
    const [achievement, setachievement] = useState(_achievement);

    useEffect(() => {
        onChange(achievement.id, achievement);
    }, [achievement]);

    return (
        <AccordionEditableMini
            placeholder="Enter achievement name..."
            onDelete={onDelete}
            onNameChange={(newname) => {
                setachievement({
                    ...achievement,
                    name: newname,
                });
            }}
            header={achievement.name}
            active={false}
            index={0}
            subIndex={0}
        >
            <div style={{ display: "inline-block" }}>
                <p
                    style={{
                        fontWeight: 500,
                        marginRight: "20px",
                    }}
                    className="actionEditorLabel"
                >
                    Achieved when
                </p>
                <SelectSimple
                    placeholder="manual"
                    values={[
                        {
                            value: "manual",
                            name: "Marked manually",
                        },
                        {
                            value: "conditions",
                            name: "Conditions are met",
                        },
                    ]}
                    height="40px"
                    value={achievement.achievementCompletesWhen}
                    onChange={(data) => {
                        setachievement({
                            ...achievement,
                            achievementCompletesWhen: data,
                        });
                    }}
                />
            </div>
            {achievement.achievementCompletesWhen === "conditions" ? (
                <div>
                    <p
                        style={{
                            marginTop: "10px",
                            fontWeight: 500,
                        }}
                        className="actionEditorLabel"
                    >
                        Completion conditions
                    </p>
                    <PredicateGroup
                        noMatchIf
                        predicates={achievement.completionConditions.predicates}
                        predicateOperator={
                            achievement.completionConditions.predicatesOperator
                        }
                        dictionary={dictionary}
                        eventDictionary={eventDictionary}
                        onChange={(data) => {
                            setachievement({
                                ...achievement,
                                completionConditions: {
                                    ...achievement.completionConditions,
                                    predicates: data.predicates,
                                    predicatesOperator: data.operator,
                                },
                            });
                        }}
                    />
                </div>
            ) : (
                <></>
            )}
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "20px",
                    marginBottom: "20px",
                }}
            >
                <div>
                    <p
                        className="actionEditorLabel"
                        style={{ fontWeight: 500 }}
                    >
                        Required
                    </p>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <SwitchSimple
                            onChange={(data) => {
                                setachievement({
                                    ...achievement,
                                    required: data,
                                });
                            }}
                            value={achievement.required}
                            text=""
                        />
                    </div>
                </div>
            </div>
        </AccordionEditableMini>
    );
};

export default AchievementItem;
