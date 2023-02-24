import { FC } from "react";
import { Card, Col } from "@doar/components";
import TaskManager from "src/components/taskmanager";
import Wrapper from "src/containers/apps/calendar/wrapper";
import SessoionsChannel from "src/components/dashboard-two/sessions-channel";
import TicketStatus from "src/components/dashboard-four/ticket-status";
import Main from "../../apps/calendar/main/indexVertical";

const RowOne: FC = () => {
    return (
        <>
            <Col lg={6} xl={6}>
                <TaskManager id={1} />
            </Col>
            <Col lg={6}>
                <TicketStatus />
            </Col>
        </>
    );
};

export default RowOne;
