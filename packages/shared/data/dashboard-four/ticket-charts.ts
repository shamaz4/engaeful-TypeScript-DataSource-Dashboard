import { generateDayWiseTimeSeries } from "../../methods";

const data = {
    options: {
        chart: {
            id: "ticket-chart",
            height: 480,
            type: "line",
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        states: {
            hover: {
                filter: {
                    type: "none",
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 1.5,
        },
        fill: {
            type: "solid",
            opacity: 1,
        },
        grid: {
            borderColor: "#485e9029",
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        xaxis: {
            type: "datetime",
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            tickAmount: 6,
            labels: {
                style: {
                    fontSize: "9px",
                    fontFamily: "Inter UI",
                    fontWeight: 500,
                    cssClass: "apexcharts-xaxis-label",
                },
            },
        },
        yaxis: [
            {
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                min: 0,
                max: 90,
                tickAmount: 6,
                decimalsInFloat: false,
                labels: {
                    style: {
                        colors: ["#67788e"],
                        fontSize: "9px",
                        fontFamily: "Inter UI",
                        fontWeight: 500,
                        cssClass: "apexcharts-xaxis-label",
                    },
                },
            },
        ],
        colors: ["#ee5752", "#fcc752", "#0bc078"],
        legend: {
            show: false,
        },
        tooltip: {
            enabled: true,
        },
        plotOptions: {
            bar: {
                columnWidth: "55%",
            },
        },
    },
    series: [
        {
            name: "Poor",
            type: "column",
            data: generateDayWiseTimeSeries(
                new Date("21 Sep 2021 GMT").getTime(),
                30,
                {
                    min: 1,
                    max: 5,
                }
            ),
        },
        {
            name: "Concerning",
            type: "column",
            data: generateDayWiseTimeSeries(
                new Date("21 Sep 2021 GMT").getTime(),
                30,
                {
                    min: 10,
                    max: 30,
                }
            ),
        },
        {
            name: "Healthy",
            type: "column",
            data: generateDayWiseTimeSeries(
                new Date("21 Sep 2021 GMT").getTime(),
                30,
                {
                    min: 20,
                    max: 30,
                }
            ),
        },
    ],
};

export default data;
