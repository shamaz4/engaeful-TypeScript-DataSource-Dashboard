/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { FC, useEffect, useRef } from "react";
import { Grid, _ } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
import "./pagination.css";
import axios from "axios";
import { useAppSelector } from "src/redux/hooks";
import { ApiUrl } from "@doar/shared/data/api-keys";
import { TCell, TDataObjectRow } from "gridjs/dist/src/types";
import { h } from "gridjs";
import { formatDistance } from "date-fns";
import { useHistory } from "react-router-dom";
import { Radio } from "react-feather";
import ReactTooltip from "react-tooltip";

interface IProps {
    onChange: () => any;
    search: string;
}

interface ICampaignData {
    _id: TCell;
    name: TCell;
}

const linkColumn = (text: TCell, _id: TCell) => {
    return h(
        "span",
        {
            style: {
                cursor: "pointer",
            },
            "campaignId": _id
        },
        text
    );
};

const Pagination: FC<IProps> = ({ onChange, search }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const token: string = useAppSelector((state) => state.auth.accessToken);
    const history = useHistory();

    return (
        <div className="gridjscontainer">
            <Grid
                search={{
                    keyword: search,
                }}
                columns={[
                    {
                        id: "displayOrder",
                        name: "Order",
                        sort: {
                            enabled: false
                        }
                        // sort: {
                        //     compare: (a, b) => {
                        //         if (a === "—") {
                        //             return 1;
                        //         }
                        //         if (b === "—") {
                        //             return -1;
                        //         }
                        //     if (a > b) {
                        //         return 1;
                        //     } if (b > a) {
                        //         return -1;
                        //     } 
                        //         return 0;
                            
                        //     }
                        // },
                    },
                    {
                        name: "Name",
                        sort: {
                            enabled: false,
                        },
                        id: "name",
                    },
                    {
                        name: "State",
                        sort: {
                            enabled: false,
                        },
                        id: "state",
                    },
                    {
                        name: "Started",
                        sort: {
                            enabled: false,
                        },
                        id: "started",
                    },
                    {
                        name: "Finished",
                        sort: {
                            enabled: false,
                        },
                        id: "finished",
                    },
                    {
                        name: "Disengaged",
                        sort: {
                            enabled: false,
                        },
                        id: "disengaged",
                    },
                    {
                        name: "Exited",
                        sort: {
                            enabled: false,
                        },
                        id: "exited",
                    },
                    {
                        name: "Goal",
                        sort: {
                            enabled: false,
                        },
                        id: "goal",
                    },
                    {
                        name: "Last edit",
                        sort: {
                            enabled: true,
                        },
                        id: "updatedAt",
                    },
                ]}
                style={{
                    table: {},
                    th: {
                        textAlign: "left",
                    },
                    td: {},
                }}
                pagination={{
                    enabled: true,
                    limit: 10,
                    server: {
                        url: (prev, page, limit) =>
                            `${prev}?limit=${limit}&page=${page+1}`,
                    },
                }}
                sort={{
                    server: {
                        multiColumn: false,
                        url: (prev: any, columns: string | any[]) => {
                            if (!columns.length) return prev;
                            const col = columns[0];
                            const dir = col.direction === 1 ? 'asc' : 'desc';
                            const colName = ['', '', '', '', '', '', '', '', 'updatedAt'][col.index];
                            
                            if (prev.includes("?")) {
                                return `${prev}&sortBy=${colName}:${dir}`;
                            }
                            return `${prev}?sortBy=${colName}:${dir}`;
                        }
                    }
                }}
                server={{
                    url: `${ApiUrl}/websites/${WebsiteId}/campaigns`,
                    data: (opts) => {
                        return new Promise((resolve, reject) => {
                            axios
                                .get(opts.url, {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                })
                                .then((response) => {
                                    const { data } = response;
                                    const result: Array<TDataObjectRow> = [];
                                    data.results.forEach(
                                        (r: TDataObjectRow) => {
                                            let goalPercent = 0;
                                            let finishPercent = 0;
                                            let disengagedPercent = 0;
                                            let exitedPercent = 0;
                                            if (r.statistics) {
                                                if (r.statistics.started > 0 &&  r.statistics.goals > 0) {
                                                    goalPercent = Math.round((r.statistics.goals / r.statistics.started) * 100);
                                                }
                                                if (r.statistics.started > 0 &&  r.statistics.finished > 0) {
                                                    finishPercent = Math.round((r.statistics.finished / r.statistics.started) * 100);
                                                }
                                                if (r.statistics.started > 0 &&  r.statistics.disengaged > 0) {
                                                    disengagedPercent = Math.round((r.statistics.disengaged / r.statistics.started) * 100);
                                                }
                                                if (r.statistics.started > 0 &&  r.statistics.exited > 0) {
                                                    exitedPercent = Math.round((r.statistics.exited / r.statistics.started) * 100);
                                                }
                                            }
                                            result.push({
                                                displayOrder: 
                                                r.throttleSettings ? 
                                                    (r.throttleSettings.deliveryOrder === 0 ? 
                                                        "—" : 
                                                    r.throttleSettings.deliveryOrder) 
                                                : "—",
                                                name: _(
                                                    <>
                                                    <span className="listName" style={{cursor:"pointer"}} role="button" tabIndex={0} onClick={() => {
                                                        const id = r._id ? r._id : "";
                                                        history.replace(`/campaigns/${id.toString()}`);
                                                    }}>{r.name}</span>
                                                    {r.throttleSettings && r.throttleSettings.bypass ? 
                                                    <>
                                                    <Radio size="16px" data-tip="This campaign will override global throttling rules" className="miniIcon"/>
                                                    <ReactTooltip place="top" effect="solid" />
                                                    </>
                                                    : <></>}
                                                    </>
                                                ),
                                                state: _(
                                                <>
                                                    {r.state === "live" ? 
                                                    <span className="stamp live">{r.state}</span>
                                                    : r.state === "draft" || r.state === "paused" ? 
                                                    <span className="stamp draft">{r.state}</span>
                                                    : <></>}
                                                </>
                                                ),
                                                started: r.statistics ? r.statistics.started : 0,
                                                finished: r.statistics ? _(`${finishPercent  }%`) : 0,
                                                disengaged: r.statistics ? _(`${disengagedPercent  }%`) : 0,
                                                exited: r.statistics ? _(`${exitedPercent  }%`) : 0,
                                                goal: r.statistics ? _(`${goalPercent  }%`) : 0,
                                                updatedAtValue: r.updatedAt,
                                                updatedAt: r.updatedAt
                                                    ? formatDistance(
                                                        new Date(
                                                            r.updatedAt
                                                                ? r.updatedAt.toString()
                                                                : ""
                                                        ),
                                                        new Date(),
                                                        { addSuffix: true }
                                                    )
                                                    : formatDistance(
                                                        new Date(
                                                            r.createdAt
                                                                ? r.createdAt.toString()
                                                                : ""
                                                        ),
                                                        new Date(),
                                                        { addSuffix: true }
                                                    )
                                                ,
                                            
                                            });
                                        }
                                    );
                                    resolve({
                                        data: result,
                                        total: data.totalResults,
                                    });
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        });
                    },
                }}
            />
        </div>
    );
};

export default Pagination;
