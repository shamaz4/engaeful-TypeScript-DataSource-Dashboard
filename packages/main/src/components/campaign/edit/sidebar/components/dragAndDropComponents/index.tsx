import { FC, useState, MouseEvent } from "react";
import Label from "../label";
import Item from "./item";
import { StyledWrap, StyledList } from "./style";

const DragAndDropComponents: FC = () => {
    const [activeId, setActiveId] = useState("");
    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        let targetId = activeId;
        if (!target.classList.contains("media")) {
            const id = target.closest(".media")?.id;
            targetId = id || activeId;
        } else {
            targetId = target.id || activeId;
        }
        setActiveId(targetId);
    };

    return (
        <StyledWrap>
            <div id="audienceToTarget">
            <Label mb="10px" pl="10px">
                Audience to target
            </Label>
            <StyledList>
                <Item name="Entry rules" nodeType="entryTriggerNode" />
                <Item name="Rules" nodeType="triggerNode" />
            </StyledList>
            </div>
            <Label mb="10px" pl="10px" mt="10px">
                Messages to send
            </Label>
            <StyledList>
                <Item
                    name="Email"
                    nodeType="message"
                    params="email"
                />
                <Item
                    name="In-app message"
                    nodeType="message"
                    params="imagebox"
                />
                <Item
                    name="Banner"
                    nodeType="message"
                    params="announcementbar"
                />
                <Item name="Tour" nodeType="message" params="tour" />
                <Item name="Slack message" nodeType="message" params="slack" />
            </StyledList>
            {/* <Label mb="10px" pl="10px" mt="10px">
                Playbooks
            </Label>
            <StyledList>
                <Item name="Create a task" nodeType="playbook" params="task" />
                <Item
                    name="Add to lifecycle"
                    nodeType="playbook"
                    params="task"
                />
                <Item
                    name="Remove from lifecycle"
                    nodeType="playbook"
                    params="task"
                />
            </StyledList> */}
            <Label mb="10px" pl="10px" mt="10px">
                Actions to take
            </Label>
            <StyledList>
                <Item name="Wait" nodeType="extra" params="delay" />
                {/* <Item name="Trigger event" nodeType="extra" params="event" />
                <Item name="Call a webhook" nodeType="extra" params="webhook" /> */}
            </StyledList>
        </StyledWrap>
    );
};

export default DragAndDropComponents;
