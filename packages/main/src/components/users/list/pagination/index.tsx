/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
import { FC, useEffect, useRef } from "react";
import { Grid, _ } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
import "./pagination.css";
import axios from "axios";
import { useAppSelector } from "src/redux/hooks";
import { ApiUrl } from "@doar/shared/data/api-keys";
import { TCell, TDataObjectRow } from "gridjs/dist/src/types";
import { formatDistance, format } from "date-fns";
import { h } from "gridjs";
import { Image } from "@doar/components";
import { relative } from "path";
import { Heart } from "react-feather";
import HealthScoreCard from "src/components/healthscorecard";
import { useHistory } from "react-router-dom";

interface IProps {
    onChange: () => any;
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

const Pagination: FC<IProps> = ({ onChange, search }) => {
    const gridRef = useRef<Grid>(null);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const token: string = useAppSelector((state) => state.auth.accessToken);
    const selectedViews: string[] = useAppSelector((state) => state.userView.selected);
    const history = useHistory();

    useEffect(() => {
       // Transform selectedViews into columns 
    }, [selectedViews]);

    useEffect(() => {
        const grid = gridRef.current?.getInstance();
        grid?.on("rowClick", (...args) => {
            console.log(args);
        });
    }, []);

    return (
        <div className="gridjscontainer">
            <Grid
                ref={gridRef}
                columns={[
                    {
                        name: "",
                        id: "image",
                        width: "32px",
                    },
                    "Name",
                    {
                        id: "email",
                        name: "Email",
                        sort: {
                            enabled: false,
                        }
                    },
                    {
                        id: "health",
                        name: "Health",
                        sort: {
                            enabled: false,
                        }
                    },
                    {
                        name: "Last seen",
                        sort: {
                            enabled: true,
                        },
                        id: "lastSeen",
                    },
                    {
                        name: "Signed up",
                        sort: {
                            enabled: true,
                        },
                        id: "createdAt",
                    },
                ]}
                sort={{
                    server: {
                        multiColumn: false,
                        url: (prev: any, columns: string | any[]) => {
                            if (!columns.length) return prev;
                            const col = columns[0];
                            const dir = col.direction === 1 ? 'asc' : 'desc';
                            const colName = ['avatar', 'name', 'email', 'health', 'last_seen', 'createdAt'][col.index];
                            
                            if (prev.includes("?")) {
                                return `${prev}&sortBy=${colName}:${dir}`;
                            }
                            return `${prev}?sortBy=${colName}:${dir}`;
                        }
                    }
                }
            }
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
                                return `${prev}&limit=${limit}&page=${page+1}`;
                            }
                            return `${prev}?limit=${limit}&page=${page+1}`;
                        },
                    },
                }}
                server={{
                    url: `${ApiUrl}/websites/${WebsiteId}/users`,
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
                                    data.results.forEach((r: any) => {
                                        result.push({
                                            _id: r._id,
                                            health:
                                                r.healthScores &&
                                                r.healthScores
                                                    .overallHealthScore ? (
                                                    _(
                                                        <HealthScoreCard
                                                        healthscores={r.healthScores.healthscores}
                                                            score={
                                                                r.healthScores
                                                                    .overallHealthScore
                                                            }
                                                            lastUpdated={
                                                                r.healthScores
                                                                    .overallHealthScoreLastChanged
                                                            }
                                                        />
                                                    )
                                                ) : (
                                                    _(<HealthScoreCard 
                                                    healthscores={r.healthScores.healthscores}
                                                    score="0"
                                                    lastUpdated="0"/>)
                                                ),
                                            image: _(
                                                <img
                                                    style={{
                                                        width: "24px",
                                                        height: "24px",
                                                        position: "absolute",
                                                        marginTop: "-13px",
                                                        marginLeft: "0px",
                                                        borderRadius: "50%",
                                                    }}
                                                    alt={
                                                        r.name
                                                            ? r.name.toString()
                                                            : ""
                                                    }
                                                    src={`https://avatars.dicebear.com/api/initials/${
                                                        r.name
                                                            ? r.name.toString()
                                                            : ""
                                                    }.svg`}
                                                />
                                            ),
                                            name: _(
                                                <a href={`/users/${r._id.toString()}`} className="listName" style={{cursor:"pointer", color: "black"}} role="button" tabIndex={0} onClick={(e) => {
                                                    e.preventDefault();
                                                    const id = r._id ? r._id : "";
                                                    history.replace(`/users/${id.toString()}`);
                                                }}>{r.name}</a>),
                                            email: r.email,
                                            astSeenValue: r.last_seen,
                                            lastSeen: r.last_seen
                                                ? formatDistance(
                                                      new Date(
                                                          r.last_seen
                                                              ? r.last_seen.toString()
                                                              : ""
                                                      ),
                                                      new Date(),
                                                      { addSuffix: true }
                                                  )
                                                : "never",
                                            createdAtValue: r.createdAt,
                                            createdAt: r.createdAt
                                                ? formatDistance(
                                                      new Date(
                                                          r.createdAt
                                                              ? r.createdAt.toString()
                                                              : ""
                                                      ),
                                                      new Date(),
                                                      { addSuffix: true }
                                                  )
                                                : "never",
                                        });
                                    });
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
                        },
                    },
                }}
            />
        </div>
    );
};

export default Pagination;
