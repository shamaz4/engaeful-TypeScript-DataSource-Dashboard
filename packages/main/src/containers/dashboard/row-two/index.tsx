import { FC } from "react";
import { Card, Col } from "@doar/components";
import TaskManager from "src/components/taskmanager";
import Wrapper from "src/containers/apps/calendar/wrapper";
import SessoionsChannel from "src/components/dashboard-two/sessions-channel";
import { conversions } from "@doar/shared/data/dashboard-one";
import Conversion from "src/components/dashboard-one/conversion";
import { User, PlusCircle } from "react-feather";
import Main from "../../apps/calendar/main/indexVertical";

const RowTwo: FC = () => {
    return (
        <>
            <Col sm={6} lg={3} mb="10px" mt={["10px", null, null, "0px"]}>
                <Conversion
                    title="Onboarding"
                    rate="62"
                    change={conversions[0].change}
                    chart={conversions[0].chart}
                />
            </Col>
            <Col sm={6} lg={3} mb="10px" mt={["10px", null, null, "0px"]}>
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                        position: "absolute",
                        filter: "blur(1px)",
                        zIndex: 99999999,
                        background: "#f5f6fa85",
                    }}
                />
                <PlusCircle
                    style={{
                        position: "absolute",
                        zIndex: 99,
                        left: "calc(50% - 12px)",
                        top: "39%",
                    }}
                />
                <Conversion
                    title="Engagement"
                    rate="DEFINE"
                    change={null}
                    /* change={conversions[0].change} */
                    chart={conversions[1].chart}
                />
            </Col>
            <Col sm={6} lg={3} mb="10px" mt={["10px", null, null, "0px"]}>
                <div
                    style={{
                        cursor: "pointer",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        filter: "blur(1px)",
                        zIndex: 99999999,
                        background: "#f5f6fa85",
                    }}
                />
                <PlusCircle
                    style={{
                        position: "absolute",
                        zIndex: 99,
                        left: "calc(50% - 12px)",
                        top: "39%",
                    }}
                />
                <Conversion
                    title="Adoption"
                    rate="DEFINE"
                    change={null}
                    chart={conversions[2].chart}
                />
            </Col>
            <Col sm={6} lg={3} mb="10px" mt={["10px", null, null, "0px"]}>
                <div
                    style={{
                        cursor: "pointer",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        filter: "blur(1px)",
                        zIndex: 99,
                        background: "#f5f6fa85",
                    }}
                />
                <PlusCircle
                    style={{
                        position: "absolute",
                        zIndex: 99,
                        left: "calc(50% - 12px)",
                        top: "39%",
                    }}
                />
                <Conversion
                    title="Champion"
                    rate="DEFINE"
                    change={null}
                    chart={conversions[3].chart}
                />
            </Col>
        </>
    );
};

export default RowTwo;
