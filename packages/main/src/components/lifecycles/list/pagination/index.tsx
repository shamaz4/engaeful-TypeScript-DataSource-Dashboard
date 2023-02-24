/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
import { FC, memo, useEffect, useRef } from "react";
import { Grid, _ } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
import "./pagination.css";
import axios from "axios";
import { useAppSelector } from "src/redux/hooks";
import { ApiUrl } from "@doar/shared/data/api-keys";
import { TCell, TDataObjectRow } from "gridjs/dist/src/types";
import { formatDistance, format } from 'date-fns'
import { h } from "gridjs";
import { Image } from "@doar/components";
import { relative } from "path";
import { Heart } from "react-feather";
import HealthScoreCard from "src/components/healthscorecard";

interface IProps {
    onOpen: () => any;
    search: string;
}

interface ICampaignData {
    _id: TCell;
    name: TCell;
    avatar: TCell;
}

const linkColumn = (text: TCell) => {
    return h(
        "span",
        {
            style: {
                cursor: "pointer",
            },
        },  
        text
    );
};

const Pagination: FC<IProps> = ({ onOpen, search }) => {
    const gridRef = useRef<Grid>(null);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const token: string = useAppSelector((state) => state.auth.accessToken);

    return (
        <div className="gridjscontainer">
            <Grid
                ref={gridRef}
                columns={[
                    {
                        name: "Name",
                        id: "name",
                    },
                    {
                        name: "Description",
                        id: "description",
                    },
                    {
                        name: "State",
                        id: "state",
                    },
                    {
                        name: "In progress",
                        id: "inprogress",
                    },
                    {
                        name: "On track",
                        id: "ontrack",
                    },
                    {
                        name: "Behind",
                        id: "behind",
                    },
                    {
                        name: "Stuck",
                        id: "stuck",
                    },
                    {
                        name: "Completed",
                        id: "completed",
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
                        url: (prev, page, limit) => {
                            if (prev.includes("?")) {
                                return `${prev}&limit=${limit}&page=${page+1}`
                            }
                            return `${prev}?limit=${limit}&page=${page+1}`
                        }
                    },
                }}
                server={{
                    url: `${ApiUrl}/websites/${WebsiteId}/lifecycles`,
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
                                    console.log(data.results);
                                    data.results.forEach(
                                        (r: any) => {
                                            result.push({
                                                _id: r._id,
                                                state: _(
                                                <>
                                                    {r.state === "live" ? 
                                                    <span className="stamp live">{r.state}</span>
                                                    : r.state === "draft" || r.state === "paused" ? 
                                                    <span className="stamp draft">{r.state}</span>
                                                    : <></>}
                                                </>
                                                ),
                                                name: _(
                                                    <>
                                                    <span className="listName" style={{cursor:"pointer"}} role="button" tabIndex={0} onClick={() => {
                                                        onOpen(r)
                                                    }}>{r.name}</span>
                                                    </>
                                                ),
                                                description: r.description,
                                                inprogress: _(<span style={{fontWeight: 500}}>{r.statistics.inprogress}</span>),
                                                ontrack: r.statistics.ontrack,
                                                behind: r.statistics.behind,
                                                stuck: r.statistics.stuck,
                                                completed: r.statistics.completed,
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
                search={{
                    keyword: search,
                    debounceTimeout: 1000,
                    server: {
                        url: (prev, keyword) => {
                            return `${prev}?name=${keyword}:contains&email=${keyword}:contains`;
                        }
                    }
                }}
            />
        </div>
    );
};

export default memo(Pagination);
