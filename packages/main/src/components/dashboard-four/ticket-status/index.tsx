import { FC, MouseEvent } from "react";
import {
    Card,
    CardBody,
    CardFooter,
    SectionTitle,
    ApexCharts,
    ApexLineChart,
    Row,
    Col,
    Progress,
} from "@doar/components";
import { ticketChart } from "@doar/shared/data/dashboard-four";
import {
    StyledHeader,
    StyledHeaderLeft,
    StyledList,
    StyledListItem,
    StyledListText,
    StyledBullet,
    StyledChart,
    StyledNumb,
    StyleTitle,
    StyledText,
    StyledRate,
} from "./style";

const TicketStatus: FC = () => {
    const { series, options } = ticketChart;
    const chartToggle = (e: MouseEvent<HTMLButtonElement>) => {
        const target = e.currentTarget;
        target.classList.toggle("hidden");
        ApexCharts.exec(options.chart.id, "toggleSeries", target.value);
    };
    return (
        <Card>
            <StyledHeader>
                <StyledHeaderLeft>
                    <SectionTitle
                        title="Health overview"
                        desc="as of the last 30 days"
                    />
                </StyledHeaderLeft>
                <StyledList>
                    {series.map((sr, i) => {
                        const name = sr.name.split(" ");
                        return (
                            <StyledListItem
                                key={sr.name}
                                value={sr.name}
                                onClick={chartToggle}
                            >
                                <StyledBullet bg={options.colors[i]} />
                                <StyledListText>
                                    {name[0]} <span>{name[1]}</span>
                                </StyledListText>
                            </StyledListItem>
                        );
                    })}
                </StyledList>
            </StyledHeader>
            <CardBody pt={[0, 0]}>
                <StyledChart>
                    <ApexLineChart
                        options={ticketChart.options}
                        series={ticketChart.series}
                        width="100%"
                        height="100%"
                    />
                </StyledChart>
            </CardBody>
            <CardFooter px="20px" py="15px">
                <Row gutters={20}>
                    <Col col={6} sm={4} md={3} lg>
                        <StyledNumb style={{ color: "#0bc078" }}>
                            156
                        </StyledNumb>
                        <StyleTitle>Healthy</StyleTitle>
                        <StyledText>
                            <StyledRate color="success">
                                1.2% <i className="fa fa-arrow-up" />
                            </StyledRate>{" "}
                            than yesterday
                        </StyledText>
                    </Col>
                    <Col col={6} sm={4} md={3} lg>
                        <StyledNumb style={{ color: "#d6b05d" }}>86</StyledNumb>
                        <StyleTitle>Concerning</StyleTitle>
                        <StyledText>
                            <StyledRate color="danger">
                                -0.6% <i className="fa fa-arrow-down" />
                            </StyledRate>{" "}
                            than yesterday
                        </StyledText>
                    </Col>
                    <Col col={6} sm={4} md={3} lg mt={["20px", 0]}>
                        <StyledNumb style={{ color: "#ee5752" }}>27</StyledNumb>
                        <StyleTitle>Poor</StyleTitle>
                        <StyledText>
                            <StyledRate color="success">
                                0.3% <i className="fa fa-arrow-up" />
                            </StyledRate>{" "}
                            than yesterday
                        </StyledText>
                    </Col>
                </Row>
            </CardFooter>
        </Card>
    );
};

export default TicketStatus;
