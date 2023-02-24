/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { FC, useEffect, useState } from "react";
import { ApiUrl } from "@doar/shared/data";
import axios from "axios";
import { Anchor } from "@doar/components";
import { useAppSelector } from "src/redux/hooks";
import { useHistory, useParams } from "react-router-dom";
import { LogOut, Sliders } from "react-feather";
import { toast } from "react-toastify";
import { defaultEvents, defaultTypes } from "@doar/shared/data/api-keys";
import Sidebar from "./sidebar/index";
import Layout from "../../../layouts";
import SEO from "../../seo";
import CampaignEditor from "./campaignEditor/CampaignEditor";
import {
    StyledHeader,
    StyledButton,
    StyledButtonSave,
    StyledButtonIcon,
} from "./style";
import NodeEditor from "./nodeEditor";
import {
    ICampaign,
    IDictionaryItem,
    IEdge,
    INode,
    IPredicate,
} from "../interfaces";
import CloseWithoutSavingModal from "./closeWithoutSavingModal";
import ActionEditor from "./actionEditor";
import SettingsEditor from "./settingsEditor";
import TaskEditor from "./taskEditor";
import ActionEditorTour from "./actionEditor/indexTour";
import DelayEditor from "./delayEditor";

export interface IParams {
    id?: string;
}

const CampaignEdit: FC = () => {
    const token: string = useAppSelector((state) => state.auth.accessToken);
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const changesMade = useAppSelector(
        (state) => state.campaignEditor.showExitWarning
    );
    const [campaignData, setCampaignData] = useState<ICampaign>({
        name: "Unnamed campaign",
        nodes: [],
        edges: [],
        exitPredicates: [],
        exitPredicateOperator: "and",
        state: "draft",
    });
    const [dictionary, setDictionary] = useState<IDictionaryItem[]>([]);
    const [eventDictionary, setEventDictionary] = useState<IDictionaryItem[]>(
        []
    );
    const [itemsToDelete, setItemsToDelete] = useState<Array<any>>([]);
    const [asideState, setAsideState] = useState(0);
    const [selectedNodeData, setSelectedNodeData] = useState<any>({});
    const [showCloseWarning, setShowCloseWarning] = useState(false);
    const [publishButtonSaving, setPublishButtonSaving] = useState(false);
    const { id } = useParams<IParams>();
    const history = useHistory();

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

    const getCampaign = () => {
        if (!id) {
            return null;
        }
        const url = `${ApiUrl}/websites/${WebsiteId}/campaigns/${id}`;
        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((d) => {
                setCampaignData(d.data);
            })
            .catch((error) => {
                console.log("Error fetching campaign data", error);
            });
        return null;
    };

    const handleCampaignSettingsSave = (data: any) => {
        let newGoalPredicate: IPredicate | null = null;
        if (data.goalPredicate && data.goalPredicate.type === "event") {
            newGoalPredicate = {
                _id: data.goalPredicate._id,
                attribute: `event:${data.goalPredicate.attribute}:${
                    data.goalPredicate.comparison.split(":")[0]
                }`,
                comparison: data.goalPredicate.comparison.split(":")[1],
                type: "number",
                value: data.goalPredicate.value,
                additionalData: data.goalPredicate.additionalData,
            };
            data.goalPredicate = newGoalPredicate;
        }

        const newExitPredicates: [IPredicate] | [] = [];
        data.exitPredicates.forEach((ep) => {
            if (ep.type === "event") {
                const newExitPredicate = {
                    _id: ep._id,
                    attribute: `event:${ep.attribute}:${
                        ep.comparison.split(":")[0]
                    }`,
                    comparison: ep.comparison.split(":")[1],
                    type: "number",
                    value: ep.value,
                    additionalData: ep.additionalData,
                };
                newExitPredicates.push(newExitPredicate);
            } else {
                const newExitPredicate = ep;
                newExitPredicates.push(newExitPredicate);
            }
        })
        data.exitPredicates = newExitPredicates;    

        console.log(data);
        setCampaignData({
            ...campaignData,
            ...data,
        });
        setAsideState(0);
    };

    const handleSaveChanges = () => {
        console.log(itemsToDelete);
        console.log(campaignData);
    };

    const handlePublishChanges = () => {
        setPublishButtonSaving(true);
        return new Promise((resolve) => {
            const url = `${ApiUrl}/websites/${WebsiteId}/campaigns/full`;
            axios
                .patch(
                    url,
                    {
                        campaignId: id || null,
                        name: campaignData.name,
                        nodes: campaignData.nodes,
                        edges: campaignData.edges,
                        state: campaignData.state,
                        throttleSettings: campaignData.throttleSettings,
                        goalPredicate: campaignData.goalPredicate,
                        goalTimeConstraintDays:
                            campaignData.goalTimeConstraintDays,
                        exitPredicates: campaignData.exitPredicates,
                        exitPredicateOperator: campaignData.exitPredicateOperator,
                        toDelete: itemsToDelete,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((response) => {
                    const { data } = response;
                    if (data.newCampaignId) {
                        history.push(`/campaigns/${data.newCampaignId}`);
                        const { Engageful } = window as any;
                        if (typeof Engageful === "function") {
                            Engageful('event', { name: "new_campaign_created", details: {
                                campaignId: data.newCampaignId
                            } });
                        }
                        toast.success("Successfully saved and published campaign!");
                        return;
                    }
                    setPublishButtonSaving(false);
                    
                    // Assign ids back to state
                    const newNodes: INode[] = [];
                    campaignData.nodes.forEach((e) => {
                        let addedAlready = false;
                        data.newNodes.forEach((nn: INode) => {
                            if (e._id === nn.nodeId && e.newNode) {
                                newNodes.push({
                                    ...e,
                                    _id: nn._id,
                                    newNode: false,
                                });
                                addedAlready = true;
                            }
                        });
                        if (!addedAlready) {
                            newNodes.push(e);
                        }
                    });
                    const newEdges: IEdge[] = [];
                    campaignData.edges.forEach((e) => {
                        let addedAlready = false;
                        data.newEdges.forEach((ne: IEdge) => {
                            if (
                                e.predecessorId === ne.predecessorId &&
                                e.successorId === ne.successorId
                            ) {
                                newEdges.push({
                                    ...e,
                                    _id: ne._id,
                                });
                                addedAlready = true;
                            }
                        });
                        if (!addedAlready) {
                            newEdges.push(e);
                        }
                    });

                    // Add new node ids to existing edges
                    const finalEdges: IEdge[] = [];
                    newEdges.forEach((ne) => {
                        let alreadyAdded = false;
                        data.newNodes.forEach((nn: INode) => {
                            const newNe = ne;
                            if (ne.successorId === nn.nodeId) {
                                newNe.successorId = nn._id;
                            }
                            if (ne.predecessorId === nn.nodeId) {
                                newNe.predecessorId = nn._id;
                            }
                            finalEdges.push(newNe);
                            alreadyAdded = true;
                        });
                        if (!alreadyAdded) {
                            finalEdges.push(ne);
                        }
                    });

                    // Add new predicate ids to existing predicates.
                    const finalNodes: INode[] = [];
                    newNodes.forEach((fn) => {
                        if (fn.triggerPredicates) {
                            const newTriggerPredicates: IPredicate[] = [];
                            fn.triggerPredicates.forEach((tp) => {
                                let alreadyAdded = false;
                                data.newPredicates.forEach((np: IPredicate) => {
                                    if (tp._id === np.oldId) {
                                        newTriggerPredicates.push({
                                            ...tp,
                                            _id: np._id,
                                        });
                                        alreadyAdded = true;
                                    }
                                });
                                if (!alreadyAdded) {
                                    newTriggerPredicates.push(tp);
                                }
                            });
                            finalNodes.push({
                                ...fn,
                                triggerPredicates: newTriggerPredicates,
                            });
                        } else {
                            finalNodes.push(fn);
                        }
                    });

                    let newGoalPredicate = campaignData.goalPredicate;
                    data.newPredicates.forEach((np: IPredicate) => {
                        if (
                            campaignData.goalPredicate &&
                            campaignData.goalPredicate._id === np.oldId
                        ) {
                            newGoalPredicate = {
                                ...campaignData.goalPredicate,
                                _id: np._id,
                            };
                        }
                    });

                    setCampaignData({
                        ...campaignData,
                        goalPredicate: newGoalPredicate,
                        nodes: finalNodes,
                        edges: finalEdges,
                    });
                    setItemsToDelete([]);
                    toast.success("Successfully saved and published campaign!");
                    const { Engageful } = window as any;
                    if (typeof Engageful === "function") {
                        Engageful('event', { name: "campaign_changed", details: {
                            campaignId: id
                        } });
                    }
                    resolve(data);
                })
                .catch((error) => {
                    setPublishButtonSaving(false);
                    console.log("Error saving campaign data", error);
                })
                .finally(() => {
                    setPublishButtonSaving(false);
                });
        });
    };

    const handleNewNodeDrop = (newNode: { data: { _id: any }; id: any }) => {
        newNode.data._id = newNode.id;
        const newNodes = [...campaignData.nodes, newNode.data];
        setCampaignData({
            ...campaignData,
            nodes: newNodes,
        });
    };

    const handleEdgeConnect = (newEdge: {
        sourceHandle: string;
        targetHandle: string;
        source: any;
        target: any;
    }) => {
        // Configure type
        let type = 0;
        if (
            (newEdge.sourceHandle === "a" || newEdge.sourceHandle === "b") &&
            newEdge.targetHandle === "a"
        ) {
            type = 0;
        } else if (
            newEdge.sourceHandle === "c" &&
            newEdge.targetHandle === "a"
        ) {
            type = 1;
        }
        const newEdges = [
            ...campaignData.edges,
            {
                predecessorId: newEdge.source,
                successorId: newEdge.target,
                type,
            },
        ];
        setCampaignData({
            ...campaignData,
            edges: newEdges,
        });
    };

    const handleElementsDelete = (deletedElements: any[]) => {
        const newItemsToDeleteFromDatabase: {
            originalId: any;
            type: string;
            id?: any;
            _id?: any;
            source?: any;
            target?: any;
        }[] = [];
        const newItemsToDeleteNotInDatabase: {
            originalId: any;
            type: string;
        }[] = [];
        deletedElements.forEach(
            (de: {
                data: { nodeId: string | string[] };
                id: string;
                source: any;
                target: any;
            }) => {
                if (de.data && de.data.nodeId) {
                    // Node is being deleted
                    if (!de.data.nodeId.includes("new_added")) {
                        // Not an existing node in the DB
                        newItemsToDeleteFromDatabase.push({
                            originalId: de.id,
                            type: "node",
                            id: de.data.nodeId,
                        });
                    } else {
                        newItemsToDeleteNotInDatabase.push({
                            originalId: de.id,
                            type: "node",
                        });
                    }
                } else if (de.source && de.target) {
                    const newId = de.id.split("-")[1];
                    // Edge is being deleted
                    newItemsToDeleteFromDatabase.push({
                        _id: newId,
                        originalId: de.id,
                        type: "edge",
                        source: de.source,
                        target: de.target,
                    });
                }
            }
        );

        // Delete from state
        const newNodes: any[] = [];
        const newEdges: any[] = [];
        campaignData.nodes.forEach((e) => {
            let doDelete = false;
            newItemsToDeleteFromDatabase.forEach((d) => {
                if (d.type === "node") {
                    if (d.originalId === e._id) {
                        doDelete = true;
                    }
                }
            });
            newItemsToDeleteNotInDatabase.forEach((d) => {
                if (d.type === "node") {
                    if (d.originalId === e._id) {
                        doDelete = true;
                    }
                }
            });
            if (!doDelete) {
                newNodes.push(e);
            }
        });

        campaignData.edges.forEach((e) => {
            let doDelete = false;
            newItemsToDeleteFromDatabase.forEach((d) => {
                if (d.type === "edge") {
                    if (
                        d.source === e.predecessorId &&
                        d.target === e.successorId
                    ) {
                        doDelete = true;
                    }
                }
            });
            if (!doDelete) {
                newEdges.push(e);
            }
        });

        setCampaignData({
            ...campaignData,
            nodes: newNodes,
            edges: newEdges,
        });
        setItemsToDelete([...itemsToDelete, ...newItemsToDeleteFromDatabase]);
    };

    const onNodeMoveEnd = (_id: any, position: any) => {
        const newNodes: any[] = [];
        campaignData.nodes.forEach((n) => {
            if (n._id === _id) {
                newNodes.push({
                    ...n,
                    position,
                });
            } else {
                newNodes.push(n);
            }
        });
        setCampaignData({
            ...campaignData,
            nodes: newNodes,
        });
    };

    const handleNodeChangeDelay = (data: {
        evaluationTime: any;
        evaluationValues: any;
    }) => {
        // Update node data
        const newNodes: Array<INode> = [];
        campaignData.nodes.forEach((n) => {
            if (n._id === selectedNodeData.nodeId) {
                newNodes.push({
                    ...n,
                    evaluationTime: data.evaluationTime,
                    evaluationValues: data.evaluationValues,
                });
            } else {
                newNodes.push(n);
            }
        });

        setCampaignData({
            ...campaignData,
            nodes: newNodes,
        });

        setAsideState(0);
    };

    const handleNodeChangeTask = (data: {
        task: any;
        goalPredicate: IPredicate;
        goalTimeConstraintDays: number;
        name: string;
    }) => {
        // Update node data
        const newNodes: Array<INode> = [];
        campaignData.nodes.forEach((n) => {
            if (n._id === selectedNodeData.nodeId) {
                // Check if there are any event triggerPredicates and format them into the format used in the DB.
                let newGoalPredicate: IPredicate | null = null;
                if (data.goalPredicate && data.goalPredicate.type === "event") {
                    newGoalPredicate = {
                        _id: data.goalPredicate._id,
                        attribute: `event:${data.goalPredicate.attribute}:${
                            data.goalPredicate.comparison.split(":")[0]
                        }`,
                        comparison: data.goalPredicate.comparison.split(":")[1],
                        type: "number",
                        value: data.goalPredicate.value,
                        additionalData: data.goalPredicate.additionalData,
                    };
                } else {
                    newGoalPredicate = data.goalPredicate;
                }

                newNodes.push({
                    ...n,
                    name: data.name,
                    goalPredicate: newGoalPredicate,
                    goalTimeConstraintDays: data.goalTimeConstraintDays,
                    task: data.task,
                });
            } else {
                newNodes.push(n);
            }
        });

        setCampaignData({
            ...campaignData,
            nodes: newNodes,
        });

        setAsideState(0);
    };

    const handleNodeChangeAction = (data: {
        nodeConfig: any;
        goalPredicate: IPredicate;
        goalTimeConstraintDays: number;
        name: string;
        evaluationValues: any;
        evaluationTime: any;
    }) => {
        // Update node data
        const newNodes: Array<INode> = [];
        campaignData.nodes.forEach((n) => {
            if (n._id === selectedNodeData.nodeId) {
                // Check if there are any event triggerPredicates and format them into the format used in the DB.
                let newGoalPredicate: IPredicate | null = null;
                if (data.goalPredicate && data.goalPredicate.type === "event") {
                    newGoalPredicate = {
                        _id: data.goalPredicate._id,
                        attribute: `event:${data.goalPredicate.attribute}:${
                            data.goalPredicate.comparison.split(":")[0]
                        }`,
                        comparison: data.goalPredicate.comparison.split(":")[1],
                        type: "number",
                        value: data.goalPredicate.value,
                        additionalData: data.goalPredicate.additionalData,
                    };
                } else {
                    newGoalPredicate = data.goalPredicate;
                }

                newNodes.push({
                    ...n,
                    name: data.name,
                    goalPredicate: newGoalPredicate,
                    goalTimeConstraintDays: data.goalTimeConstraintDays,
                    evaluationTime: data.evaluationTime,
                    evaluationValues: data.evaluationValues,
                    action: {
                        action: selectedNodeData.action.action,
                        config: data.nodeConfig || {},
                    },
                });
            } else {
                newNodes.push(n);
            }
        });

        console.log(newNodes);
        setCampaignData({
            ...campaignData,
            nodes: newNodes,
        });

        setAsideState(0);
    };

    const handleNodeChange = (data: {
        triggerPredicates: Array<IPredicate>;
        name: string;
        triggerPredicateOperator: string;
        evaluationValues: any;
        evaluationTime: any;
    }) => {
        setSelectedNodeData({
            ...selectedNodeData,
            data,
        });

        // Update node data
        const newNodes: Array<INode> = [];
        campaignData.nodes.forEach((n) => {
            if (n._id === selectedNodeData.nodeId) {
                // Check if there are any event triggerPredicates and format them into the format used in the DB.
                const newTriggerPredicates: Array<IPredicate> = [];
                data.triggerPredicates.forEach((tp) => {
                    if (tp.type === "event") {
                        newTriggerPredicates.push({
                            _id: tp._id,
                            attribute: `event:${tp.attribute}:${
                                tp.comparison.split(":")[0]
                            }`,
                            comparison: tp.comparison.split(":")[1],
                            type: "number",
                            value: tp.value,
                            additionalData: tp.additionalData,
                        });
                    } else if (
                        tp.attribute &&
                        tp.attribute.includes("event:")
                    ) {
                        console.log("HOW TO SAVE", tp);
                        newTriggerPredicates.push(tp);
                    } else {
                        newTriggerPredicates.push(tp);
                    }
                });
                newNodes.push({
                    ...n,
                    name: data.name,
                    triggerPredicates: newTriggerPredicates,
                    triggerPredicateOperator: data.triggerPredicateOperator,
                    evaluationTime: data.evaluationTime,
                    evaluationValues: data.evaluationValues
                });
            } else {
                newNodes.push(n);
            }
        });

        setCampaignData({
            ...campaignData,
            nodes: newNodes,
        });

        setAsideState(0);
    };

    const handleNodeClick = (e: { data: any; type: string }) => {
        console.log(e.data);
        setSelectedNodeData(e.data);

        if (e.type === "entryTriggerNode") {
            setAsideState(1);
        } else if (e.type === "triggerNode") {
            setAsideState(6);
        } else if (e.type === "taskNode") {
            setAsideState(4);
        } else if (e.type === "delayNode") {
            setAsideState(5);
        } else {
            setAsideState(2);
        }
    };

    const handlePaneClick = () => {
        if (asideState !== 0) {
            setShowCloseWarning(true);
        }
    };

    useEffect(() => {
        getCampaign();
        getAttributes();
    }, []);

    return (
        <Layout hideHeader hideFooter hideSearch>
            <SEO titleTemplate="Campaigns" />
            <StyledHeader>
                <div
                    style={{
                        paddingRight: "20px",
                        marginRight: "20px",
                        borderRight: "1px solid #f1f1f1",
                    }}
                >
                    <Anchor path="/campaigns">
                        <StyledButton size="sm" background ml="10px" hasIcon>
                            <LogOut
                                size="16px"
                                style={{
                                    transform: "rotate(-180deg)",
                                    marginRight: "10px",
                                    marginBottom: "2px",
                                }}
                            />
                            Return to dashboard
                        </StyledButton>
                    </Anchor>
                </div>
                <div>{campaignData.name}</div>
                <div style={{ marginLeft: "auto" }}>
                    <StyledButtonIcon
                        onClick={() => {
                            setAsideState(3);
                        }}
                        primary={false}
                        size="sm"
                        ml="10px"
                    >
                        <Sliders size="16px" />
                    </StyledButtonIcon>
                </div>
                <div>
                    <StyledButtonSave
                        onClick={handleSaveChanges}
                        primary={false}
                        size="sm"
                        ml="10px"
                    >
                        Save changes
                    </StyledButtonSave>
                </div>
                <div style={{}}>
                    <StyledButtonSave
                        disabled={publishButtonSaving}
                        onClick={handlePublishChanges}
                        size="sm"
                        ml="10px"
                    >
                        Publish campaign
                    </StyledButtonSave>
                </div>
            </StyledHeader>
            <CampaignEditor
                campaignData={campaignData}
                onNewNodeDrop={handleNewNodeDrop}
                onNodeClick={handleNodeClick}
                onPaneClick={handlePaneClick}
                onNewEdgeConnect={handleEdgeConnect}
                onNodeMoveEnd={onNodeMoveEnd}
                onElementsDelete={handleElementsDelete}
            />
            {asideState === 0 ? (
                <Sidebar />
            ) : asideState === 1 ? (
                <>
                    <NodeEditor
                        selectedNodeData={selectedNodeData}
                        dictionary={dictionary}
                        eventDictionary={eventDictionary}
                        isEntry
                        onSave={handleNodeChange}
                        onCancel={() => {
                            if (changesMade) {
                                setShowCloseWarning(true);
                            } else {
                                setAsideState(0);
                            }
                        }}
                    />
                </>
            ) : asideState === 6 ? (
                <>
                    <NodeEditor
                        campaignData={campaignData}
                        selectedNodeData={selectedNodeData}
                        dictionary={dictionary}
                        eventDictionary={eventDictionary}
                        isEntry={false}
                        onSave={handleNodeChange}
                        onCancel={() => {
                            if (changesMade) {
                                setShowCloseWarning(true);
                            } else {
                                setAsideState(0);
                            }
                        }}
                    />
                </>
            ) : asideState === 2 ? (
                <>
                {selectedNodeData.action.action === "tour" ?
                <ActionEditorTour
                    dictionary={dictionary}
                    eventDictionary={eventDictionary}
                    selectedNodeData={selectedNodeData}
                    onSave={handleNodeChangeAction}
                        onCancel={() => {
                            if (changesMade) {
                                setShowCloseWarning(true);
                            } else {
                                setAsideState(0);
                            }
                        }}
                />
                :
                <ActionEditor
                    dictionary={dictionary}
                    eventDictionary={eventDictionary}
                    selectedNodeData={selectedNodeData}
                    onSave={handleNodeChangeAction}
                        onCancel={() => {
                            if (changesMade) {
                                setShowCloseWarning(true);
                            } else {
                                setAsideState(0);
                            }
                        }}
                />
                }
                </>
            ) : asideState === 4 ? (
                <TaskEditor
                    dictionary={dictionary}
                    eventDictionary={eventDictionary}
                    selectedNodeData={selectedNodeData}
                    goalPredicate={
                        selectedNodeData.goalPredicate
                            ? selectedNodeData.goalPredicate
                            : { value: [] }
                    }
                    goalTimeConstraintDays={
                        selectedNodeData.goalTimeConstraintDays
                    }
                    onSave={handleNodeChangeTask}
                        onCancel={() => {
                            if (changesMade) {
                                setShowCloseWarning(true);
                            } else {
                                setAsideState(0);
                            }
                        }}
                />
            ) : asideState === 5 ? (
                <DelayEditor
                evaluationTime={selectedNodeData.evaluationTime}
                evaluationValues={selectedNodeData.evaluationValues}
                    onSave={handleNodeChangeDelay}
                        onCancel={() => {
                            if (changesMade) {
                                setShowCloseWarning(true);
                            } else {
                                setAsideState(0);
                            }
                        }}
                />
            ) : asideState === 3 ? (
                <SettingsEditor
                    dictionary={dictionary}
                    eventDictionary={eventDictionary}
                    onSave={handleCampaignSettingsSave}
                    campaignName={campaignData.name}
                    throttleSettings={campaignData.throttleSettings}
                    goalPredicate={
                        campaignData.goalPredicate
                            ? campaignData.goalPredicate
                            : { value: [] }
                    }
                    goalTimeConstraintDays={campaignData.goalTimeConstraintDays}
                    exitPredicates={campaignData.exitPredicates && campaignData.exitPredicates.length > 0 ? campaignData.exitPredicates : [{ value: [] }]}
                    exitPredicateOperator={campaignData.exitPredicateOperator}
                />
            ) : (
                <></>
            )}
            <CloseWithoutSavingModal
                onClose={() => {
                    setShowCloseWarning(false);
                }}
                onProceed={() => {
                    if (asideState !== 0) {
                        setShowCloseWarning(false);
                        setAsideState(0);
                    }
                }}
                show={showCloseWarning}
            />
        </Layout>
    );
};

export default CampaignEdit;
