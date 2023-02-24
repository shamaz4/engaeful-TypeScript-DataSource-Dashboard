/* eslint-disable @typescript-eslint/no-unsafe-return */
import { FC, useState } from "react";
import { useAppSelector } from "src/redux/hooks";
import { PredicateGroup } from "src/components/predicates/predicategroup/PredicateGroup";
import { IDictionaryItem } from "src/components/campaign/interfaces";
import AccordionEditableMini from "./accordionEditableMini";

interface IHealthScore {
    index: number;
    subIndex: number;
    header: string;
    onDelete?: (i: number, j: number) => void;
    onChange: (i: number, j: number, data: any) => void;
    onNameChange: (i: number, j: number, data: any) => void;
    dictionary: IDictionaryItem[];
    eventDictionary: IDictionaryItem[];
    active: boolean;
    conditions: any;
}

const HealthScore: FC<IHealthScore> = ({
    dictionary,
    header,
    eventDictionary,
    index,
    conditions,
    subIndex,
    active,
    onDelete,
    onChange,
    onNameChange,
}) => {
    const token: string = useAppSelector((state) => state.auth.accessToken);
    const [currentDictionary, setDictionary] = useState<IDictionaryItem[]>(
        dictionary
    );
    const [currentEventDictionary, setEventDictionary] = useState<
        IDictionaryItem[]
    >(eventDictionary);
    const [currentConditions, setconditions] = useState(conditions);

    const onGoodChange = (data: any) => {
        const newVal = {
            ...currentConditions,
            good: data,
        };
        setconditions(newVal);
        onChange(index, subIndex, newVal);
    };

    const onBadChange = (data: any) => {
        const newVal = {
            ...currentConditions,
            bad: data,
        };
        setconditions(newVal);
        onChange(index, subIndex, newVal);
    };

    const changeName = (data: string) => {
        onNameChange(index, subIndex, data);
    };

    return (
        <AccordionEditableMini
            index={index}
            header={header}
            subIndex={subIndex}
            onNameChange={changeName}
            onDelete={onDelete}
            placeholder="Enter measure name..."
            active={active}
        >
            <div
                style={{
                    padding: "10px",
                    borderRadius: "4px",
                    marginBottom: "20px",
                }}
            >
                <div style={{ marginBottom: "20px" }}>
                    <span
                        style={{
                            background: "rgb(11, 192, 120)",
                            color: "white",
                            padding: "6px",
                            fontWeight: 500,
                            borderRadius: "4px",
                            marginRight: "5px",
                        }}
                    >
                        Healthy
                    </span>{" "}
                    If the following conditions are met
                </div>
                <PredicateGroup
                    predicates={currentConditions.good.predicates}
                    noMatchIf
                    dictionary={currentDictionary}
                    eventDictionary={currentEventDictionary}
                    onChange={onGoodChange}
                />
            </div>
            <hr />
            <div
                style={{
                    padding: "10px",
                    borderRadius: "4px",
                    marginBottom: "20px",
                }}
            >
                <div
                    style={{
                        marginBottom: "20px",
                        marginTop: "20px",
                    }}
                >
                    <span
                        style={{
                            background: "#ee5752",
                            color: "white",
                            padding: "6px",
                            fontWeight: 500,
                            borderRadius: "4px",
                            marginRight: "5px",
                        }}
                    >
                        Poor
                    </span>{" "}
                    If the following conditions are met
                </div>
                <PredicateGroup
                    predicates={currentConditions.bad.predicates}
                    noMatchIf
                    dictionary={currentDictionary}
                    eventDictionary={currentEventDictionary}
                    onChange={onBadChange}
                />
            </div>
            <hr />
            <div
                style={{
                    padding: "10px",
                    borderRadius: "4px",
                }}
            >
                <div
                    style={{
                        marginBottom: "20px",
                        marginTop: "20px",
                    }}
                >
                    <span
                        style={{
                            background: "#fcc752",
                            color: "white",
                            padding: "6px",
                            fontWeight: 500,
                            borderRadius: "4px",
                            marginRight: "5px",
                        }}
                    >
                        Concerning
                    </span>{" "}
                    If Poor and Healthy conditions are not met
                </div>
            </div>
        </AccordionEditableMini>
    );
};

export default HealthScore;
