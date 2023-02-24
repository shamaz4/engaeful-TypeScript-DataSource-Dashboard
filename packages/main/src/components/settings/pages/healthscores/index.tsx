/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { FC, useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardSubtitle,
    CardTitle,
    Col,
    Container,
    Row,
} from "@doar/components";
import { useAppSelector } from "src/redux/hooks";
import { ApiUrl } from "@doar/shared/data";
import axios from "axios";
import { toast } from "react-toastify";
import Accordion from "src/components/accordion";
import { File, Heart, Plus, Sliders } from "react-feather";
import { PredicateGroup } from "src/components/predicates/predicategroup/PredicateGroup";
import { IDictionaryItem } from "src/components/campaign/interfaces";
import ReactTooltip from "react-tooltip";
import { defaultEvents, defaultTypes } from "@doar/shared/data/api-keys";
import AccordionEditable from "./accordionEditable";
import { StyledButton, StyledButtonIcon, StyledButtonSave } from "./style";
import HealthScore from "./healthscore";
import { SlidersContainer } from "./sliders";

interface IHealthScore {
    id: string;
    name: string;
    conditions: any;
}

interface IHealthCategory {
    id: string;
    name: string;
    scores: IHealthScore[];
    weight: number;
    weightModified: boolean;
}

const HealthScoreSettings: FC = () => {
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const token: string = useAppSelector((state) => state.auth.accessToken);
    const [healthCategories, setHealthCategories] = useState<IHealthCategory[]>(
        []
    );
    const [dictionary, setDictionary] = useState<IDictionaryItem[]>([]);
    const [eventDictionary, setEventDictionary] = useState<IDictionaryItem[]>(
        []
    );
    const getAttributes = () => {
        const url = `${ApiUrl}/websites/${WebsiteId}/users/getAttributes`;
        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((d) => {
                setDictionary([...defaultTypes, ...d.data.attributes]);
                setEventDictionary([...defaultEvents, ...d.data.events]);
            })
            .catch((error) => {
                console.log("Error fetching attribute data", error);
            });
        return null;
    };

    const saveChanges = () => {
        const newHc: [IHealthCategory] = [];
        healthCategories.forEach((hc) => {
            const newScores: any = [];
            hc.scores.forEach((hcs: any) => {
                // Update good
                const newGood: any = [];
                hcs.conditions.good.predicates.forEach((hcg: any) => {
                    if (hcg.type === "event") {
                        newGood.push({
                            id: hcg.id
                                ? hcg.id
                                : hcg._id
                                ? hcg._id
                                : new Date(),
                            attribute: `event:${hcg.attribute}:${
                                hcg.comparison.split(":")[0]
                            }`,
                            comparison: hcg.comparison.split(":")[1],
                            type: "number",
                            additionalData: hcg.additionalData,
                            value: hcg.value,
                        });
                    } else if (
                        hcg.attribute &&
                        hcg.attribute.includes("event:")
                    ) {
                        newGood.push({
                            ...hcg,
                            id: hcg.id
                                ? hcg.id
                                : hcg._id
                                ? hcg._id
                                : new Date(),
                            _id: null,
                        });
                    } else {
                        newGood.push({
                            ...hcg,
                            id: hcg.id
                                ? hcg.id
                                : hcg._id
                                ? hcg._id
                                : new Date(),
                            _id: null,
                        });
                    }
                });

                // Update bad
                const newBad: any = [];
                hcs.conditions.bad.predicates.forEach((hcg: any) => {
                    if (hcg.type === "event") {
                        newBad.push({
                            attribute: `event:${hcg.attribute}:${
                                hcg.comparison.split(":")[0]
                            }`,
                            comparison: hcg.comparison.split(":")[1],
                            type: "number",
                            additionalData: hcg.additionalData,
                            value: hcg.value,
                        });
                    } else if (
                        hcg.attribute &&
                        hcg.attribute.includes("event:")
                    ) {
                        newBad.push({
                            ...hcg,
                            id: hcg.id
                                ? hcg.id
                                : hcg._id
                                ? hcg._id
                                : new Date(),
                            _id: null,
                        });
                    } else {
                        newBad.push({
                            ...hcg,
                            id: hcg.id
                                ? hcg.id
                                : hcg._id
                                ? hcg._id
                                : new Date(),
                            _id: null,
                        });
                    }
                });

                newScores.push({
                    ...hcs,
                    conditions: {
                        good: {
                            ...hcs.conditions.good,
                            predicates: newGood,
                        },
                        bad: {
                            ...hcs.conditions.bad,
                            predicates: newBad,
                        },
                    },
                });
            });
            newHc.push({
                ...hc,
                scores: newScores,
            });
        });

        const url = `${ApiUrl}/websites/${WebsiteId}/healthscores`;
        axios
            .post(
                url,
                {
                    data: newHc,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((d) => {
                const { Engageful } = window as any;
                if (typeof Engageful === "function") {
                    Engageful('event', { name: "healthscore_saved", details: {
                    } });
                }
                toast.success("Health score settings saved successfully!");
            })
            .catch((error) => {
                toast.error(
                    "Something went wrong when saving health score setting."
                );
                console.log("Error saving data", error);
            });
        return null;
    };

    const getHealthScores = () => {
        const url = `${ApiUrl}/websites/${WebsiteId}/healthscores`;
        axios
            .get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((d) => {
                setHealthCategories(d.data);
            })
            .catch((error) => {
                console.log(error.response);
                toast.error("Unable to fetch health score data...");
            });
    };

    useEffect(() => {
        getAttributes();
        getHealthScores();
    }, []);

    const newHealthScore = () => {
        // Add new value
        let newHealthCategories: IHealthCategory[] = healthCategories;
        const nh: IHealthCategory = {
            id: `new_${Date.now()}`,
            name: "",
            scores: [],
            weight: 0,
            weightModified: false,
        };
        newHealthCategories = [...newHealthCategories, nh];

        // Distribute default weights
        let used = 0;
        let valuesWithDefaultWeight = 0;
        newHealthCategories.forEach((v) => {
            if (v.weightModified) {
                used += v.weight;
            } else {
                valuesWithDefaultWeight += 1;
            }
        });

        const left = 100 - used;
        const defValue = left / valuesWithDefaultWeight;
        const newValues: IHealthCategory[] = [];
        newHealthCategories.forEach((v, _i) => {
            if (!v.weightModified) {
                newValues.push({
                    ...v,
                    weight: defValue < 0 ? 0 : Math.floor(defValue),
                });
            } else {
                newValues.push(v);
            }
        });

        setHealthCategories(newValues);
    };

    const changeWeight = (i: number, weight: number) => {
        const newCategories: IHealthCategory[] = [];
        healthCategories.forEach((hc, _i) => {
            if (i === _i) {
                newCategories.push({
                    ...hc,
                    weight,
                    weightModified: true,
                });
            } else {
                newCategories.push(hc);
            }
        });

        setHealthCategories(newCategories);
    };

    const changeName = (i: number, name: string) => {
        const newCategories: IHealthCategory[] = [];
        healthCategories.forEach((hc, _i) => {
            if (i === _i) {
                newCategories.push({
                    ...hc,
                    name,
                });
            } else {
                newCategories.push(hc);
            }
        });

        setHealthCategories(newCategories);
    };

    const addScore = (i: number) => {
        const newCategories: IHealthCategory[] = [];
        healthCategories.forEach((hc, _i) => {
            if (i === _i) {
                newCategories.push({
                    ...hc,
                    scores: [
                        ...hc.scores,
                        {
                            id: `new_cond_${Date.now()}`,
                            name: "",
                            conditions: {
                                good: {},
                                bad: {},
                            },
                        },
                    ],
                });
            } else {
                newCategories.push(hc);
            }
        });

        setHealthCategories(newCategories);
    };

    const deleteHealthScoreGroup = (groupNumber: number) => {
        const newCategories: IHealthCategory[] = [];
        healthCategories.forEach((hc, _i) => {
            if (groupNumber !== _i) {
                newCategories.push(hc);
            }
        });

        // Recalculate weights
        let used = 0;
        let valuesWithDefaultWeight = 0;
        newCategories.forEach((v) => {
            if (v.weightModified) {
                used += v.weight;
            } else {
                valuesWithDefaultWeight += 1;
            }
        });

        const left = 100 - used;
        const defValue = left / valuesWithDefaultWeight;
        const newValues: IHealthCategory[] = [];
        newCategories.forEach((v, _i) => {
            if (!v.weightModified) {
                newValues.push({
                    ...v,
                    weight: defValue < 0 ? 0 : Math.floor(defValue),
                });
            } else {
                newValues.push(v);
            }
        });

        setHealthCategories(newValues);
    };

    const deleteHealthScore = (groupNumber: number, itemNumber: number) => {
        const newCategories: IHealthCategory[] = [];
        healthCategories.forEach((hc, _i) => {
            if (groupNumber === _i) {
                const newScores: IHealthScore[] = [];
                hc.scores.forEach((hcc, _j) => {
                    if (itemNumber !== _j) {
                        newScores.push(hcc);
                    }
                });
                newCategories.push({
                    ...hc,
                    scores: newScores,
                });
            } else {
                newCategories.push(hc);
            }
        });

        setHealthCategories(newCategories);
    };

    const updateHealthScoreName = (
        groupNumber: number,
        itemNumber: number,
        data: any
    ) => {
        const newCategories: IHealthCategory[] = [];
        healthCategories.forEach((hc, _i) => {
            if (groupNumber === _i) {
                const newScores: IHealthScore[] = [];
                hc.scores.forEach((hcc, _j) => {
                    if (itemNumber === _j) {
                        newScores.push({
                            ...hcc,
                            name: data,
                        });
                    } else {
                        newScores.push(hcc);
                    }
                });
                newCategories.push({
                    ...hc,
                    scores: newScores,
                });
            } else {
                newCategories.push(hc);
            }
        });

        setHealthCategories(newCategories);
    };

    const updateHealthScoreConditions = (
        groupNumber: number,
        itemNumber: number,
        data: any
    ) => {
        const newCategories: IHealthCategory[] = [];
        healthCategories.forEach((hc, _i) => {
            if (groupNumber === _i) {
                const newScores: IHealthScore[] = [];
                hc.scores.forEach((hcc, _j) => {
                    if (itemNumber === _j) {
                        newScores.push({
                            ...hcc,
                            conditions: data,
                        });
                    } else {
                        newScores.push(hcc);
                    }
                });
                newCategories.push({
                    ...hc,
                    scores: newScores,
                });
            } else {
                newCategories.push(hc);
            }
        });

        setHealthCategories(newCategories);
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <div>
                    <CardTitle as="h5">Health scores</CardTitle>
                    <CardSubtitle>
                        Customize how Engageful evaluate customers health
                    </CardSubtitle>
                </div>
                <div style={{ marginLeft: "auto" }}>
                    <ReactTooltip place="top" effect="solid" />
                    <SlidersContainer
                        values={healthCategories}
                        onChange={changeWeight}
                    />
                    <StyledButtonIcon
                        onClick={newHealthScore}
                        data-tip="Add measure group"
                        primary={false}
                        size="sm"
                        ml="10px"
                    >
                        <Plus size="16px" />
                    </StyledButtonIcon>
                    <StyledButtonSave onClick={saveChanges} size="sm" ml="10px">
                        Save changes
                    </StyledButtonSave>
                </div>
            </div>
            <div style={{ margin: "20px 0px" }}>
                {healthCategories.map((hs, i) => {
                    return (
                        <>
                            {i > 0 ? (
                                <div style={{ marginTop: "20px" }} />
                            ) : (
                                <></>
                            )}
                            <AccordionEditable
                                key={hs.id}
                                placeholder="Enter measure group name..."
                                onAddClick={() => {
                                    addScore(i);
                                }}
                                index={i}
                                onDelete={deleteHealthScoreGroup}
                                onNameChange={(newName: string) => {
                                    changeName(i, newName);
                                }}
                                active
                                header={hs.name}
                            >
                                {hs.scores.map((hss, j) => {
                                    return (
                                        <HealthScore
                                            index={i}
                                            header={hss.name}
                                            dictionary={dictionary}
                                            eventDictionary={eventDictionary}
                                            subIndex={j}
                                            conditions={hss.conditions}
                                            onChange={
                                                updateHealthScoreConditions
                                            }
                                            active={false}
                                            onNameChange={updateHealthScoreName}
                                            onDelete={deleteHealthScore}
                                            key={hss.id}
                                        />
                                    );
                                })}
                            </AccordionEditable>
                        </>
                    );
                })}
                {/*
                <div style={{ marginTop: "40px" }}>
                    <pre>{JSON.stringify(healthCategories, null, 2)}</pre>
                </div>
                 */}
                 {healthCategories.length === 0 ? 
                 <div style={{
                     textAlign: "center",
                     margin: "100px"
                 }}>
                 <Heart style={{
                     color: "#d7d7d7",
                     width: "48px",
                     height: "48px"
                 }}/>
                 <h5>No health score measure groups have been added</h5>
                 </div>
                 : <></>
}
            </div>
        </>
    );
};

export default HealthScoreSettings;
