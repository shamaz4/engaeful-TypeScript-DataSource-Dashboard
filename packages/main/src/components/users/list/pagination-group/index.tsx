/* eslint-disable prettier/prettier */
import { FC, useEffect, useRef } from "react";
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

const PaginationGroup: FC<IProps> = ({ onChange, search }) => {
    const gridRef = useRef<Grid>(null);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const token: string = useAppSelector((state) => state.auth.accessToken);

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
                        width: "32px"
                    },
                    "Name",
                    {
                        name: "Last updated",
                        sort: {
                            enabled: true,
                        },
                        id: "updatedAt",
                    },
                    {
                        name: "Signed up",
                        sort: {
                            enabled: true,
                        },
                        id: "createdAt",
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
                    url: `${ApiUrl}/websites/${WebsiteId}/groups`,
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
                                        (r: TDataObjectRow) => {
                                            result.push({
                                                _id: r._id,
                                                image: _(
                                                    <img
                                                        style={{
                                                            width: "24px",
                                                            height: "24px",
                                                            position: "absolute",
                                                            marginTop: "-13px",
                                                            marginLeft: "0px",
                                                            borderRadius: "50%"
                                                        }}
                                                        alt={r.name ? r.name.toString() : ""}
                                                        src={`https://avatars.dicebear.com/api/initials/${r.name
                                                            ? r.name.toString()
                                                            : ""
                                                            }.svg`}
                                                    />
                                                ),
                                                name: r.name,
                                                updatedAt: r.last_seen ? formatDistance(new Date(r.last_seen ? r.last_seen.toString() : ""), new Date(), { addSuffix: true }) : "never",
                                                createdAt: r.createdAt ? formatDistance(new Date(r.createdAt ? r.createdAt.toString() : ""), new Date(), { addSuffix: true }) : "never",
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

export default PaginationGroup;
