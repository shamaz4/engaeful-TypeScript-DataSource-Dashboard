/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
import { FC, useEffect, useRef } from "react";
import { Grid, _ } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
import "./pagination.css";
import axios from "axios";
import { useAppSelector } from "src/redux/hooks";
import { ApiUrl, defaultTypes } from "@doar/shared/data/api-keys";
import { TCell, TDataObjectRow } from "gridjs/dist/src/types";
import { h } from "gridjs";
import { formatDistance } from "date-fns";
import { useHistory } from "react-router-dom";
import { Activity, Calendar, Hash, Plus, Type } from "react-feather";
import StringIcon from "src/components/predicates/predicateselector/PropertySelectorContainer/icons/StringIcon";
import NumberIcon from "src/components/predicates/predicateselector/PropertySelectorContainer/icons/NumberIcon";
import BoolIcon from "src/components/predicates/predicateselector/PropertySelectorContainer/icons/BoolIcon";
import DateIcon from "src/components/predicates/predicateselector/PropertySelectorContainer/icons/DateIcon";
import ListIcon from "src/components/predicates/predicateselector/PropertySelectorContainer/icons/ListIcon";

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

const DictionaryPagination: FC<IProps> = ({ onChange, search }) => {
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
                        name: "Event name",
                        sort: {
                            enabled: true,
                        },
                        id: "id",
                    },
                    {
                        name: "Display name",
                        sort: {
                            enabled: true,
                        },
                        id: "name",
                    },
                    {
                        name: "Type",
                        sort: {
                            enabled: false,
                        },
                        id: "type",
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
                    limit: 200,
                    server: {
                        url: (prev, page, limit) =>
                            `${prev}?limit=${limit}&page=${page+1}`,
                    },
                }}
                server={{
                    url: `${ApiUrl}/websites/${WebsiteId}/users/getAttributes`,
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
                                    const events = [...defaultTypes,...data.attributes, ...data.events];
                                    const result: Array<TDataObjectRow> = [];
                                    events.forEach(
                                        (r: TDataObjectRow) => {
                                            result.push({
                                                id: r.id,
                                                name: _(
                                                   <span>{r.name}</span> 
                                                ),
                                                type: _(
                                                    <div style={{ display: "flex",
  flexDirection: "row",
  alignItems: "center"}}>
                                                    {r.type === "string" ? <StringIcon/> :
                                                        r.type === "number" ? <NumberIcon/> :
                                                            r.type === "boolean" || r.type === "bool" ? <BoolIcon/> :
                                                            r.type === "date" ? <DateIcon/> :
                                                            r.type === "array" ? <ListIcon/> :
                                                                r.type === "event" ? <Activity  size="18px" /> :
                                                        <></>
                                                    } <span style={{marginLeft: "5px"}}>
                                                        {r.type.charAt(0).toUpperCase() + r.type.slice(1)}
                                                        </span>
                                                    </div>
                                                )
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

export default DictionaryPagination;
