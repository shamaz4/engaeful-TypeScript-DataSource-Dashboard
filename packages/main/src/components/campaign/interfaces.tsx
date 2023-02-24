export interface ICampaign {
    name?: string;
    nodes: Array<any>;
    edges: Array<any>;
    state: string;
    throttleSettings: IThrottleSettings;
    goalPredicate?: IPredicate;
    goalTimeConstraintDays?: number;
    exitPredicates?: [IPredicate];
    exitPredicateOperator?: string;
}

interface IThrottleSettings {
    bypass: boolean;
    deliveryOrder: number;
}

export interface IPredicate {
    _id?: string;
    oldId?: string;
    value: string[];
    attribute: string;
    comparison: string;
    additionalData?: {
        inlineFilter: IPredicate;
        dateFilter: {
            milliseconds: number;
            period: string;
            range: string;
            value: string | number;
        };
    };
    type: string;
    campaign?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface INode {
    _id?: string;
    nodeId?: string;
    name?: string;
    type?: string;
    triggerPredicates?: Array<IPredicate>;
    evaluationTime: any;
    evaluationValues: any;
    goalPredicate?: IPredicate;
    goalTimeConstraintDays?: number;
    additionalData: { inlineFilter: [IPredicate] };
    filters?: Array<IPredicate>;
    filterOperator?: string;
    action?: any;
    config?: any;
    onChange?: any;
}

export interface IEdge {
    _id?: string;
    predecessorId?: string;
    successorId?: string;
}

export interface IDictionaryItem {
    id: string;
    type: string;
    name?: string;
}
