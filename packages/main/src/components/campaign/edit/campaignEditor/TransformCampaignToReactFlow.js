/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */

const getNodes = (campaign, onChangeFunction) => {
    const nodes = [];
    if (!campaign.nodes) {
        return [];
    }
    campaign.nodes.forEach((n) => {
        if (n.newNode) {
            const nn = {
                id: n._id,
                type: n.type,
                data: {
                    name: "",
                    nodeId: n._id,
                    onChange: onChangeFunction,
                    type: n.type,
                    task: n.type === "taskNode" ? n.task : null,
                    filters:
                        n.type === "entryTriggerNode" ||
                            n.type === "triggerNode"
                            ? [...n.triggerPredicates]
                            : [],
                    filterOperator: n.triggerPredicateOperator,
                    goalPredicate: n.goalPredicate,
                    goalTimeConstraintDays: n.goalTimeConstraintDays,
                    evaluationTime: n.evaluationTime,
                    evaluationValues: n.evaluationValues,
                    action: n.action,
                },
                position: {
                    x: n.position ? n.position.x : 300,
                    y: n.position ? n.position.y : 50,
                },
            };
            nodes.push(nn);
        } else {
            let nnType;
            switch (n.type) {
                case "trigger":
                    // Check if entry
                    if (
                        campaign.edges.filter(
                            (e) => e.successorId.toString() === n._id.toString()
                        ).length === 0
                    ) {
                        nnType = "entryTriggerNode";
                    } else {
                        nnType = "triggerNode";
                    }
                    break;
                case "entryTriggerNode":
                    nnType = "entryTriggerNode";
                    break;
                case "triggerNode":
                    nnType = "triggerNode";
                    break;
                case "message":
                    nnType = "message";
                    break;
                default:
                    nnType = n.type;
            }
            const nn = {
                id: n._id,
                type: nnType,
                data: {
                    name: n.name,
                    nodeId: n._id,
                    type: nnType,
                    onChange: onChangeFunction,
                    filters: [...n.triggerPredicates],
                    task: n.task ? n.task : null,
                    filterOperator: n.triggerPredicateOperator,
                    goalPredicate: n.goalPredicate,
                    goalTimeConstraintDays: n.goalTimeConstraintDays,
                    evaluationTime: n.evaluationTime,
                    evaluationValues: n.evaluationValues,
                    action: n.action,
                    statistics: n.statistics,
                },
                position: {
                    x: n.position ? n.position.x : 300,
                    y: n.position ? n.position.y : 50,
                },
            };
            nodes.push(nn);
        }
    });

    return nodes;
};

const computeEdgeLabel = (campaign, edge) => {
    const sourceNode = campaign.nodes.filter((n) => n._id === edge.source)[0];
    if (sourceNode) {
        if (sourceNode.type === "message") {
            if (edge.sourceHandle === "b") {
                if (sourceNode.action.action === "email") {
                    return "When sent";
                }
                return "When delivered";
            }
            if (edge.sourceHandle === "c") {
                return "If not online after waiting";
            }
            if (sourceNode.action.action === "email") {
                return "When sent";
            }
            return "When delivered";
        }
        if (
            sourceNode.type === "entryTrigger" ||
            sourceNode.type === "trigger" ||
            sourceNode.type === "triggerNode" ||
            sourceNode.type === "entryTriggerNode"
        ) {
            if (edge.sourceHandle === "c") {
                return "If not matched";
            }
            if (edge.sourceHandle === "b") {
                return "When matched";
            }

            return "When matched";
        }
        if (sourceNode.type === "delayNode") {
                return "When passed";
        }
        if (sourceNode.type === "taskNode") {
            if (edge.sourceHandle === "c") {
                return "If due date passed";
            }
            if (edge.sourceHandle === "b") {
                return "When completed";
            }
                return "When completed";
        }

        return `UNKNOWN LABEL TYPE (${sourceNode.type}) (${edge.sourceHandle})`;
    }
    return `UNKNOWN LABEL TYPE (?)`;
};

const getEdges = (campaign) => {
    const edges = [];
    if (!campaign.edges) {
        return [];
    }
    campaign.edges.forEach((e) => {
        let edge = {};
        if (e.type === 1) {
            edge = {
                id: `handle-${e._id}-${e.predecessorId}-${e.successorId}c-text`,
                source: e.predecessorId,
                target: e.successorId,
                sourceHandle: "c",
                label: "When matched",
            };
        } else {
            edge = {
                id: `handle-${e._id}-${e.predecessorId}-${e.successorId}b-text`,
                source: e.predecessorId,
                target: e.successorId,
                label: "When matched",
            };
        }
        const newLabel = computeEdgeLabel(campaign, edge);
        edge.label = newLabel;
        edges.push(edge);
    });
    return edges;
};

export const transformCampaignToReactFlow = (campaign, onChangeFunction) => {
    const nodes = getNodes(campaign, onChangeFunction);
    const edges = getEdges(campaign);

    return [...nodes, ...edges];
};
