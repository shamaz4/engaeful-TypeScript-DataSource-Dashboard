import { useClickOutside } from "@doar/shared/hooks";
import React, { useEffect, useState, FC, useCallback } from "react";
import { Sliders } from "react-feather";
import Slider from "react-input-slider";
import { StyledButtonIcon } from "../style";
import {
    StyledButtonSave,
    StyledContainer,
    StyledContainerItem,
    StyledDivValue,
} from "./style";

interface IInputSimple {
    values: IHealthCategory[];
    onChange: (i: number, weight: number) => void;
}

interface IHealthCategory {
    id: string;
    name: string;
    scores: any;
    weight: number;
    weightModified: boolean;
}

export const SlidersContainer: FC<IInputSimple> = ({
    values,
    onChange = () => {},
}) => {
    const [state, setState] = useState({ x: 10, y: 10 });
    const [showSelector, setShowSelector] = useState(false);
    const [weightValues, setweightValues] = useState(values);
    const [maxDefault, setmaxDefault] = useState<number>();
    const [totalAssignedWeight, setTotalAssignedWeight] = useState(0);

    const closeSelector = useCallback(() => {
        setShowSelector(false);
    }, []);
    const containerRef = useClickOutside<HTMLDivElement>(closeSelector);

    useEffect(() => {
        setweightValues(values);
        let total = 0;
        values.forEach((v) => {
            total += v.weight;
        });
        setTotalAssignedWeight(total);
    }, [values]);

    const changeTotal = (weight: number) => {
        const difference = totalAssignedWeight - weight;
    };

    const changeWeight = (i: number, weight: number) => {
        const newValues: IHealthCategory[] = [];
        weightValues.forEach((hc, _i) => {
            if (i === _i) {
                newValues.push({
                    ...hc,
                    weight,
                    weightModified: true,
                });
            } else {
                newValues.push(hc);
            }
        });

        let total = 0;
        newValues.forEach((v) => {
            total += v.weight;
        });
        if (total <= 100) {
            setTotalAssignedWeight(total);
            setweightValues(newValues);
            onChange(i, weight);
        }
    };

    return (
        <div ref={containerRef} style={{ display: "inline" }}>
            <StyledButtonIcon
                disabled={weightValues.length === 0}
                onClick={() => {
                    setShowSelector(true);
                }}
                style={
                    showSelector
                        ? {
                              background: "#d8d8d8",
                              borderColor: "gainsboro",
                              boxShadow: "0 0 0 0.2rem rgb(142 142 142 / 10%)",
                          }
                        : {}
                }
                data-tip="Weight settings"
                primary={false}
                size="sm"
                ml="10px"
            >
                <Sliders size="16px" />
            </StyledButtonIcon>
            {showSelector ? (
                <StyledContainer>
                    <p
                        style={{
                            fontWeight: 500,
                            marginBottom: "10px",
                        }}
                    >
                        Default weights
                    </p>
                    <p
                        style={{
                            maxWidth: "400px",
                            marginBottom: "20px",
                        }}
                    >
                        The overall health is calculated using a weighted
                        average of all health scores defined. Be sure your total
                        weight equals 100%
                    </p>
                    <StyledContainerItem
                        style={{
                            borderBottom: "1px solid #f3f3f3",
                            paddingBottom: "15px",
                            marginBottom: "15px",
                        }}
                    >
                        <div style={{ marginRight: "20px", fontWeight: 500 }}>
                            Total
                        </div>
                        <div
                            style={{ marginLeft: "auto", marginRight: "20px" }}
                        >
                            <Slider
                                axis="x"
                                x={totalAssignedWeight}
                                onChange={(v) => {
                                    changeTotal(v.x);
                                }}
                                xmax={100}
                            />
                        </div>
                        <StyledDivValue>{totalAssignedWeight}%</StyledDivValue>
                    </StyledContainerItem>
                    {weightValues.map((wv, i) => {
                        return (
                            <StyledContainerItem key={wv.id}>
                                <div
                                    style={{
                                        marginRight: "20px",
                                        maxWidth: "150px",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {wv.name ? wv.name : <i>Unnamed measure</i>}
                                </div>
                                <div
                                    style={{
                                        marginLeft: "auto",
                                        marginRight: "20px",
                                    }}
                                >
                                    <Slider
                                        axis="x"
                                        x={wv.weight}
                                        xmax={100}
                                        onChange={(v) => {
                                            changeWeight(i, v.x);
                                        }}
                                    />
                                </div>
                                <StyledDivValue>{wv.weight}%</StyledDivValue>
                            </StyledContainerItem>
                        );
                    })}
                </StyledContainer>
            ) : (
                <></>
            )}
        </div>
    );
};
