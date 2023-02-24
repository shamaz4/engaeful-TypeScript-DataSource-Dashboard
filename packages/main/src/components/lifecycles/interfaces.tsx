import { IPredicate } from "../campaign/interfaces";
import { ITask } from "../taskmanager/interfaces";

export interface IAchievement {
    id: string;
    name: string;
    required: boolean;
    achievementCompletesWhen: ["manual" | "conditions"];
    completionConditions: {
        predicates: [IPredicate];
        predicatesOperator: "and" | "or";
    };
    status: number;
}

export interface ILifecycleMilestone {
    id: string;
    order: number;
    name: string;
    description: string;
    milestoneBeginsWhen: [
        "manual" | "previousMilestoneComplete" | "whenLifecycleBegins"
    ];
    milestoneCompletesWhen: ["manual" | "whenTasksFinished"];
    daysToComplete: {
        days: number;
        progressCycle: {
            onTrack: number;
            behind: number;
        };
    };
    tasks: [ITask];
    achievements: [IAchievement];
}

export interface ILifecycle {
    _id: string;
    name: string;
    description: string;
    state: ["draft" | "active" | "paused"];
    lifecycleActivationMethod: ["manual" | "throughCampaign" | "conditions"];
    entryConditions: {
        predicates: [IPredicate];
        predicatesOperator: "and" | "or";
    };
    reentrySettings: {
        enabled: boolean;
        reentryInterval: {
            interval: string;
            intervalValue: number;
            intervalMilliseconds: number;
        };
        capNumberOfEntries: {
            enabled: boolean;
            maxEntries: number;
        };
    };
    lifecycleCompletionMethod: ["manual" | "throughMilestones" | "conditions"];
    completionConditions: {
        predicates: [IPredicate];
        predicatesOperator: "and" | "or";
    };
    daysToComplete: {
        days: number;
        progressCycle: {
            onTrack: number;
            behind: number;
        };
    };
    milestones: [ILifecycleMilestone];
    tasks: [ITask];
    website: string;
}
