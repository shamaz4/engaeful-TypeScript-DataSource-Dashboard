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
    Spinner,
} from "@doar/components";
import { useAppSelector } from "src/redux/hooks";
import { ApiUrl } from "@doar/shared/data";
import axios from "axios";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import { InputSimple } from "src/components/commoncomponents/InputSimple";
import { SelectSimple } from "src/components/commoncomponents/SelectSimple";
import { SwitchSimple } from "src/components/commoncomponents/SwitchSimple";
import { StyledButton, StyledButtonIcon, StyledButtonSave } from "./style";

const ThrottleSettings: FC = () => {
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const token: string = useAppSelector((state) => state.auth.accessToken);
    const [loading, setloading] = useState(true);
    const [enablethrottling, setenablethrottling] = useState(false);
    const [guideinterval, setguideinterval] = useState("day");
    const [guideintervalvalue, setguideintervalvalue] = useState(1);
    const [guidems, setguidems] = useState(86400000);
    const getWebsite = () => {
        const url = `${ApiUrl}/websites/${WebsiteId}/`;
        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((d) => {
                const throttle = d.data.campaignThrottle;
                setenablethrottling(throttle.enabled);
                if (throttle.interval) {
                    setguideinterval("days");
                    setguideinterval(throttle.interval);
                }
                if (throttle.intervalValue) {
                    setguideintervalvalue(throttle.intervalValue);
                }
                if (throttle.intervalMilliseconds) {
                    setguidems(throttle.intervalMilliseconds);
                }
                setloading(false);
            })
            .catch((error) => {
                console.log("Error fetching attribute data", error);
            });
        return null;
    };

    useEffect(() => {
        getWebsite();
    }, []);

    useEffect(() => {
        let newMs = 86400000;
        switch (guideinterval) {
            case "month":
                newMs = 30 * 86400000 * guideintervalvalue;
                break;
            case "week":
                newMs = 7 * 86400000 * guideintervalvalue;
                break;
            case "day":
                newMs = 86400000 * guideintervalvalue;
                break;
            case "hour":
                newMs = 3600000 * guideintervalvalue;
                break;
            default:
                newMs = 86400000;
                break;
        }
        setguidems(newMs);
    }, [guideinterval, guideintervalvalue]);

    const saveChanges = () => {
        const url = `${ApiUrl}/websites/${WebsiteId}/`;
        axios
            .patch(
                url,
                {
                    campaignThrottle: {
                        enabled: enablethrottling,
                        interval: guideinterval,
                        intervalValue: guideintervalvalue,
                        intervalMilliseconds: guidems,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((d) => {
                toast.success("Throttle settings saved successfully!");
            })
            .catch((error) => {
                toast.error(
                    "Something went wrong when saving throttle settings"
                );
            });
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
                    <CardTitle as="h5">Throttle</CardTitle>
                    <CardSubtitle>
                        Configure how often a user/group gets enrolled in a
                        campaign
                    </CardSubtitle>
                </div>
                <div style={{ marginLeft: "auto" }}>
                    <ReactTooltip place="top" effect="solid" />
                    <StyledButtonSave size="sm" ml="10px" onClick={saveChanges}>
                        Save changes
                    </StyledButtonSave>
                </div>
            </div>
            <div style={{ margin: "20px 0px" }}>
                {loading ? (
                    <div
                        style={{
                            display: "flex",
                            alignContent: "center",
                            justifyContent: "center",
                            minHeight: "100px",
                            alignItems: "center",
                        }}
                    >
                        <Spinner color="primary" />
                    </div>
                ) : (
                    <>
                        <p
                            style={{
                                margin: "unset",
                                fontSize: "14px",
                                fontWeight: 500,
                                marginBottom: "10px",
                                color: "#717171",
                            }}
                            className="actionEditorLabel"
                        >
                            Enable campaign throttling
                        </p>
                        <SwitchSimple
                            value={enablethrottling}
                            text=""
                            onChange={(data) => {
                                setenablethrottling(data);
                            }}
                        />
                        {enablethrottling ? (
                            <>
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
                                        Users can only enter one campaign every
                                    </span>
                                    <InputSimple
                                        placeholder="Enter value"
                                        numeric
                                        centerText
                                        value={guideintervalvalue}
                                        margin="0px 10px 0px 0px"
                                        onChange={(data) => {
                                            setguideintervalvalue(data);
                                        }}
                                    />
                                    <SelectSimple
                                        placeholder="anytime"
                                        values={[
                                            {
                                                value: "hour",
                                                name:
                                                    guideintervalvalue > 1
                                                        ? "hours"
                                                        : "hour",
                                            },
                                            {
                                                value: "day",
                                                name:
                                                    guideintervalvalue > 1
                                                        ? "days"
                                                        : "day",
                                            },
                                            {
                                                value: "week",
                                                name:
                                                    guideintervalvalue > 1
                                                        ? "weeks"
                                                        : "week",
                                            },
                                            {
                                                value: "month",
                                                name:
                                                    guideintervalvalue > 1
                                                        ? "months"
                                                        : "month",
                                            },
                                        ]}
                                        height="40px"
                                        value={guideinterval}
                                        onChange={(data) => {
                                            setguideinterval(data);
                                        }}
                                    />
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default ThrottleSettings;
