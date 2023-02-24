import { useEffect, ChangeEvent, FC, useState } from "react";
import {
    Card,
    ButtonGroup,
    Row,
    Col,
    ApexBarChart,
    SectionTitle,
} from "@doar/components";
import { webMetricsChart } from "@doar/shared/data/dashboard-two";
import { useAppSelector } from "src/redux/hooks";
import { Coffee } from "react-feather";
import { StyledHeader, StyledBody, StyledButton } from "./style";
import { ITask } from "./interfaces";
import Task from "./task";

interface IProps {
    id: number;
}

const TaskManager: FC<IProps> = ({ id }) => {
    const [tab, setTab] = useState(0);
    const [items, setItems] = useState<ITask[]>([]);

    useEffect(() => {
        setItems([
            {
                name: "Do laundry",
            },
        ]);
    }, []);

    return (
        <Card>
            <StyledHeader>
                <div
                    style={{
                        position: "relative",
                        top: "8px",
                    }}
                >
                    <SectionTitle title="My to-do list" />
                </div>
                <ButtonGroup mt={["20px", "0px"]}>
                    <StyledButton
                        size="xs"
                        color="white"
                        onClick={() => {
                            setTab(0);
                        }}
                        active={tab === 0}
                    >
                        Today
                    </StyledButton>
                    <StyledButton
                        size="xs"
                        color="white"
                        onClick={() => {
                            setTab(1);
                        }}
                        active={tab === 1}
                    >
                        Overdue
                    </StyledButton>
                    <StyledButton
                        size="xs"
                        color="white"
                        onClick={() => {
                            setTab(2);
                        }}
                        active={tab === 2}
                    >
                        Next
                    </StyledButton>
                </ButtonGroup>
            </StyledHeader>
            <StyledBody>
                {items.length === 0 ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "gray",
                        }}
                    >
                        <img
                            alt=""
                            src="https://app-cdn.clickup.com/sanbath_chill.c222e99cb795da04825a.png"
                            style={{
                                width: "228px",
                                marginTop: "20px",
                                marginBottom: "20px",
                            }}
                        />
                        Tasks and Reminders that are scheduled for Today will
                        appear here.
                    </div>
                ) : (
                    <div>
                        <Task
                            id={1}
                            name="Reach out regarding declined usage"
                            company="Rylio"
                            dueDate="16:30"
                        />
                        <Task
                            id={1}
                            company="Everclear"
                            name="Check if adopted the editing module and if they have questions"
                            dueDate="17:30"
                        />
                    </div>
                )}
            </StyledBody>
        </Card>
    );
};

export default TaskManager;
