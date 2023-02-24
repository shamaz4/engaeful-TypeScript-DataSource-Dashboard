/* eslint-disable no-param-reassign */
import React, { FC, useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardSubtitle,
    CardTitle,
    Col,
    Container,
    Row,
} from "@doar/components";
import { Briefcase, User } from "react-feather";
import { useAppSelector } from "src/redux/hooks";
import { ApiUrl } from "@doar/shared/data";
import { defaultTypes, defaultEvents } from "@doar/shared/data/api-keys";
import axios from "axios";
import { IDictionaryItem } from "src/components/campaign/interfaces";
import CloseWithoutSavingModal from "src/components/campaign/edit/closeWithoutSavingModal";
import SearchForm from "./search-form";
import Layout from "../../../layouts";
import Content from "../../../layouts/content";
import SEO from "../../seo";
import Pagination from "./pagination";
import {
    SwitchContainer,
    SwitchContainerItemLeft,
    SwitchContainerItemRight,
} from "./style";
import LifecycleEditor from "./lifecycleEditor";
import { ModalCover } from "./lifecycleEditor/style";
import { ILifecycle } from "../interfaces";

const LifecycleList: FC = () => {
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const token: string = useAppSelector((state) => state.auth.accessToken);
    const [dictionary, setDictionary] = useState<IDictionaryItem[]>([]);
    const [eventDictionary, setEventDictionary] = useState<IDictionaryItem[]>(
        []
    );
    const [showCloseWarning, setShowCloseWarning] = useState(false);
    const [asideState, setasideState] = useState(0);
    const [selectedLifecycle, setselectedLifecycle] = useState(null);

    const selectLifecycle = (data: ILifecycle) => {
        // Format predicates
        if (data.entryConditions.predicates.length === 0) {
            data.entryConditions.predicates = [{ value: [] }];
        }
        if (data.completionConditions.predicates.length === 0) {
            data.completionConditions.predicates = [{ value: [] }];
        }
        setselectedLifecycle(data);
    };

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

    useEffect(() => {
        getAttributes();
    }, []);

    return (
        <>
            <Layout hideFooter hideSearch hideOverflow={asideState === 1}>
                <SEO titleTemplate="Lifecycles" />
                <Content>
                    <Container>
                        <Row mb="15px" mt="0px">
                            <Col col lg={12}>
                                <div style={{ float: "right" }}>
                                    <SearchForm
                                        onButtonPress={() => {
                                            setselectedLifecycle({
                                                name: "New lifecycle",
                                                description: "",
                                                state: "draft",
                                                lifecycleActivationMethod:
                                                    "manual",
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
                                                lifecycleCompletionMethod:
                                                    "manual",
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
                                            });
                                            document
                                                .querySelector("html")
                                                ?.classList.add("noOverflow");
                                            setasideState(1);
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col col>
                                <Card width={["100%", "100%"]}>
                                    <CardBody paddingBottom="0px">
                                        <CardTitle as="h5">
                                            Lifecycles
                                        </CardTitle>
                                        <CardSubtitle>
                                            Manage customers lifecycles
                                        </CardSubtitle>
                                        <Pagination
                                            search=""
                                            onOpen={(data) => {
                                                selectLifecycle(data);
                                                document
                                                    .querySelector("html")
                                                    ?.classList.add(
                                                        "noOverflow"
                                                    );
                                                setasideState(1);
                                            }}
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </Content>
            </Layout>
            {asideState === 1 ? (
                <>
                    <ModalCover />
                    {selectedLifecycle ? (
                        <LifecycleEditor
                            onCancel={() => {
                                setShowCloseWarning(true);
                            }}
                            onSave={() => {
                                console.log("IM");
                                setasideState(0);
                            }}
                            dictionary={dictionary}
                            eventDictionary={eventDictionary}
                            lifecycle={selectedLifecycle}
                        />
                    ) : (
                        <LifecycleEditor
                            onCancel={() => {
                                setShowCloseWarning(true);
                            }}
                            dictionary={dictionary}
                            eventDictionary={eventDictionary}
                        />
                    )}
                </>
            ) : (
                <></>
            )}
            <CloseWithoutSavingModal
                onClose={() => {
                    setShowCloseWarning(false);
                }}
                onProceed={() => {
                    if (asideState !== 0) {
                        document
                            .querySelector("html")
                            ?.classList.remove("noOverflow");
                        console.log();
                        setShowCloseWarning(false);
                        setasideState(0);
                    }
                }}
                show={showCloseWarning}
            />
        </>
    );
};

export default LifecycleList;
