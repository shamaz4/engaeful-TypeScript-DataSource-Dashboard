// import dotenv from "dotenv";
// import path from "path";

export const MapKey = "AIzaSyB3mMuvl8IUlviRZiizBiX7uhsdIqunx94";
export const MapBoxAccessKey =
    "pk.eyJ1IjoiaHNuY29vbDgiLCJhIjoiY2s5dHRnbGRwMGN5ZTNsbnliNzl0ZDg5MyJ9.P2AEkILzNEgg9ArpzGVPXw";

export const ApiUrl = "https://engageful-app.herokuapp.com/v1";
export const EngagefulWebsiteId = "61fa036e92b5ed76abfbfff2"; // Prod

// export const ApiUrl = "http://localhost:3000/v1";
// export const EngagefulWebsiteId = "61f22014380d22d8f4e710b5"; // Dev

export const defaultTypes = [
    {
        id: "userId",
        type: "string",
        name: "User ID",
    },
    {
        id: "email",
        type: "string",
        name: "Email",
    },
    {
        id: "name",
        type: "string",
        name: "Name",
    },
    {
        id: "createdAt",
        type: "date",
        name: "First seen",
    },
    {
        id: "last_seen",
        type: "date",
        name: "Last seen",
    },
    {
        id: "current_url",
        type: "string",
        name: "Current page URL",
    },
    {
        id: "health",
        type: "string",
        name: "Health",
    },
];

export const defaultEvents = [
    {
        id: "pageVisit",
        type: "event",
        name: "Page visit",
        description:
            "This event is triggered whenever a user navigates to a page inside your app.",
        default: true,
    },
    {
        id: "engageful_new_user_created",
        type: "event",
        name: "New user created",
        description:
            "This event is triggered when a new user is added to Engageful through the API, an integration, or manually.",
        default: true,
    },
    {
        id: "campaign_enroll",
        type: "event",
        name: "Started a campaign",
    },
    {
        id: "campaign_complete",
        type: "event",
        name: "Completed a campaign",
    },
    {
        id: "campaign_disengage",
        type: "event",
        name: "Disengaged from campaign",
    },
    {
        id: "campaign_exit",
        type: "event",
        name: "Exited a campaign",
    },
    {
        id: "campaign_goal",
        type: "event",
        name: "Hit a campaign goal",
    },
    {
        id: "engageful_email_delivered",
        type: "event",
        name: "Received an email",
    },
    {
        id: "engageful_email_opened",
        type: "event",
        name: "Opened an email",
    },
    {
        id: "engageful_email_clicked",
        type: "event",
        name: "Clicked a link in an email",
    },
];
