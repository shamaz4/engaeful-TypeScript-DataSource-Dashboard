/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable default-case */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { CardTitle } from "@doar/components";
import { useHover } from "@doar/shared/hooks";
import { format, formatDistance } from "date-fns";
import { FC, useRef, useEffect, useState } from "react";
import { ArrowDown, ChevronDown, ChevronUp, Edit, Edit2, Edit3 } from "react-feather";
import { toast } from "react-toastify";
import { useAppSelector } from "src/redux/hooks";

interface IProps {
    item: any;
    noBottomBorder: boolean
}

const ActivityItem: FC<IProps> = ({ item, noBottomBorder }) => {
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const websites: [] = useAppSelector((state) => state.auth.websites);
    const [dictionary, setdictionary] = useState([]);

    const [type, settype] = useState("");
    const [typeText, setTypeText] = useState("");
    const [additionalType, setadditionalType] = useState("");
    const [name, setname] = useState("");
    const [expanded, setexpanded] = useState(false);
    const [details, setdetails] = useState([]);
    const containerRef = useRef(null);
    const containerHover = useHover(containerRef);

    const getWebsiteDictionaryFromState = () => {
        const currentSelectedWebsite = websites.filter((w)=>w.id === WebsiteId);
        if (currentSelectedWebsite.length > 0) {
            setdictionary(currentSelectedWebsite[0].dictionary)
        }
    }

    const getDictionaryValueById = (_id) => {
        const currentSelectedWebsite = websites.filter((w)=>w.id === WebsiteId);
        if (currentSelectedWebsite.length > 0) {
            const dic = (currentSelectedWebsite[0].dictionary)
            const itemInDic = dic.filter((d) => d.id === _id);
            if (itemInDic.length > 0) {
                return itemInDic[0].name;
            } 
        }
        return _id;
    }

    const configureDetails = () => {
        switch(item.type) {
            case "campaign":
                switch (item.details.action)
                {
                    case "imagebox":
                    {
                        const d = [
                            {"id": 1, "key": "Title", "value": item.details.title},
                            {"id": 2, "key": "Campaign", "value": getDictionaryValueById(item.campaign)},
                        ];
                        if (item.nodeName !== "") {
                            d.push(
                                {"id": 3, "key": "Action name", "value": item.nodeName}
                            )
                        }
                        setdetails(d)
                        break;
                    }
                    case "slack":
                        {
                        const d = [
                            {"id": 1, "key": "Slack Channel", "value": item.details.config.toChannelId},
                            {"id": 2, "key": "Campaign", "value": getDictionaryValueById(item.campaign)},
                        ];
                        if (item.nodeName !== "") {
                            d.push(
                                {"id": 3, "key": "Action name", "value": item.nodeName}
                            )
                        }
                        setdetails(d)
                        break;
                        }
                } 
                break;
            case "pageview":
                setdetails([
                    {"id": 1, "key": "Title", "value": item.details.title},
                    {"id": 2, "key": "URL", "value": `${item.details.location.hostname}${item.details.location.pathname}`},
                    {"id": 3, "key": "Screen resolution", "value": `${item.details.screen.width} x ${item.details.screen.height}`},
                ])
                break;
            case "event":
                switch (item.name) {
                    case "campaign_disengage":
                    case "campaign_enroll":
                    case "campaign_complete":
                    case "campaign_exit":
                    case "campaign_goal":
                        setdetails([
                            {"id": 1, "key": "Campaign ID", "value": item.details.campaignId},
                            {"id": 1, "key": "Campaign Name", "value": getDictionaryValueById(item.details.campaignId)},
                        ])
                        break;
                    default:
                        // All other events
                        const extraDetails = [];
                        let i = 0;
                        if (item && item.details) {
                            for (const [key, value] of Object.entries(item.details)) {
                                extraDetails.push({"id": i, "key": key, "value": value})
                                i += 1;
                            }
                        }
                        setdetails(extraDetails);
                        break;
                }
                break;
            default:
                setdetails([]);
                break;
        }
    }

    const getCampaignActivity = () => {
            console.log(item)
            settype(item.type);
            const tempName = item.nodeName ? item.nodeName : (item.details && item.details.config && item.details.config.title) ? item.details.config.title : (item.details && item.details.action) ? item.details.action : "Unknown"
            setname(tempName);
            if (item && item.details && item.details.action) {
                switch (item.details.action)
                {
                    case "email":
                        setTypeText("Email sent")
                        break;
                    case "tour":
                        setTypeText("Tour sent")
                        break;
                    case "slack":
                        setTypeText("Triggered slack message")
                        setname(item.details.config.message)
                        break;
                    case "message":
                    case "imagebox":
                        setTypeText("In-app message sent")
                        break;
                }
            }
            else {
                setTypeText(item.name)
            }
            if(item.name.includes("delivered")) {
                setadditionalType("delivered")
            }
    }

    const getAdditionalType = () => {
        switch(item.type) {
            case "event": 
                switch (item.name) {
                    case "campaign_enroll":
                        settype("campaign");
                        setTypeText("Campaign enrolled");
                        setname(getDictionaryValueById(item.details.campaignId));
                    break;
                    case "campaign_complete":
                        settype("campaign");
                        setTypeText("Campaign completed");
                        setname(getDictionaryValueById(item.details.campaignId));
                    break;
                    case "campaign_exit":
                        settype("campaign");
                        setTypeText("Campaign exited");
                        setname(getDictionaryValueById(item.details.campaignId));
                        break;
                    case "campaign_goal":
                        settype("campaign");
                        setTypeText("Campaign goal");
                        setname(getDictionaryValueById(item.details.campaignId));
                        break;
                    case "campaign_disengage":
                        settype("campaign");
                        setTypeText("Campaign disengaged");
                        setname(getDictionaryValueById(item.details.campaignId));
                        break;
                    case "tour_step_view":
                        settype("campaign");
                        setTypeText("Tour step viewed");
                        setadditionalType("tourStep")
                        console.log(item.details, "hehehe", item.details.nodeId);
                        setname(getDictionaryValueById(item.details.nodeId));
                        break;
                    default: 
                        settype(item.type);
                        setTypeText("Event triggered");
                        setname(item.name);
                    break;
                } 
            break;
            case "pageview":
                settype(item.type);
                setTypeText("Page viewed");
                setname(item.details.location.pathname);
                break;
             case "campaign":
                 getCampaignActivity();
                 break;
             default: 
                    settype("unknown");
                    setTypeText("Unknown activity");
                    setname("");
                    break;
        }
    }

    useEffect(() => {
        getAdditionalType();
        configureDetails();
        getWebsiteDictionaryFromState();
    }, []);

    return (
    <>
        <div className="activityItem" style={{
            borderBottomColor: noBottomBorder ? "transparent" : ""
        }} ref={containerRef}
        onClick={() => {console.log(item);setexpanded((e) => !e)}}
        >
            <div style={{color:"gray"}}>
                {format(new Date(item.createdAt), "HH:mm")}
            </div>
            <div>
                <div className={`dot ${type} ${additionalType}`}/>
            </div>
            <div style={{fontWeight:500}}>
                {typeText}
            </div>
            <div style={{marginLeft:"10px", marginRight: "10px", color:"gray", fontSize: "14px"}}>
                {name}
                {details.length > 0 ?
                <>
                    {containerHover ?
                    <>
                    {expanded ?
                    <ChevronUp style={{
                        cursor: "pointer",
                        position: "absolute",
                        right: "40px",
                        marginLeft: "-20px",
                        width: "16px",
                        marginTop: "-2px"
                        }}/>
                        : 
                        <ChevronDown style={{
                        cursor: "pointer",
                            position: "absolute",
                            right: "40px",
                            marginLeft: "-20px",
                            width: "16px",
                            marginTop: "-2px"
                            }}/>
                        }
                    </>
                    :<></>
                    }
                </>
                : <></>}
            </div>
        </div>
        {expanded && details.length > 0 ? 
        <div className="activityExpandedContainer"> 
                {details.map(d => (
            <div key={d.id} className="itemExpanded">
                <div style={{fontWeight: 500, marginRight: "10px"}}>{d.key}</div>
                <div style={{
                    background: "rgb(255 255 255)",
                    padding: "4px 10px",
                    fontSize: "13px",
                    borderRadius: "2px",
                    border: "1px solid #eaeaea",
                }}>{d.value}</div>
            </div>
                ))}
        </div>
        : <></>}
    </>
    )
};

export default ActivityItem;
