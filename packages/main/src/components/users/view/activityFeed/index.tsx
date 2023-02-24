/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { CardTitle, Spinner } from "@doar/components";
import { ApiUrl } from "@doar/shared/data";
import { useHover } from "@doar/shared/hooks";
import axios from "axios";
import { format, formatDistance } from "date-fns";
import { FC, useRef, useEffect, useState } from "react";
import { Edit, Edit2, Edit3 } from "react-feather";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {useQuery } from 'react-query'
import { useAppSelector } from "src/redux/hooks";
import { IWebsiteUser } from "../../interfaces";
import ActivityItem from "./activityItem";
import CactusIcon from "./svg/cactus";

interface IProps {
    user: IWebsiteUser;
}

const ActivityFeed: FC<IProps> = ({ user }) => {
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const token: string = useAppSelector((state) => state.auth.accessToken);
    const history = useHistory();
    const [loading, setloading] = useState(true);
    const [filters, setfilters] = useState(["Page views", "Events", "Campaigns"]);
    const [morePages, setMorePages] = useState(false);
    const [morePagesLoading, setMorePagesLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(200);

    const { isLoading, error, data, isFetching } = useQuery(`getActivity-${user._id}`, () => {
        const url = `${ApiUrl}/websites/${WebsiteId}/users/${user._id}/getActivity?limit=${limit}&page=${page}&include=${filters.join(",")}`; 
        return axios.get(url, { headers: { Authorization: `Bearer ${token}`, }, })
    })

    if (isLoading) {
        return (
            <div style={
                {
                    "position":"relative",
                    "padding":"80px",
                    "display":"flex",
                    "alignItems":"center",
                    "justifyContent":"center"
                }
            }>
                    <Spinner color="primary" />
            </div>
        )
    }


        let lastDate = new Date();
        let firstRun = true;
        return (
        <>
            <CardTitle as="h5" style={{}}>
                Activity
            </CardTitle>
            {data?.data.results.length > 0 ?
            <div style={{opacity: isFetching ? 0.3 : "1", pointerEvents: isFetching ? "none" : "all" }}>
            {data?.data.results.map((item, i) => {
               let addSeparator = false;
               if (firstRun) {
                lastDate = item.createdAt;
                addSeparator = true;
                firstRun = false;
               }
               else if (format(new Date(item.createdAt), "MMM dd, yyy") !== format(new Date(lastDate), "MMM dd, yyy")) {
                lastDate = item.createdAt;
                addSeparator = true;
               }

              return (
                   <>
                   {addSeparator ? 
                    <div className="activityTitle">
                   {format(new Date(item.createdAt), "MMM dd, yyy")}
                    </div>
                    : <></>
                   }
                        <ActivityItem key={item._id} item={item} />
                   </>
               );
           })}
           </div> : 
           <div style={{padding: "20px", "display":"flex","justifyContent":"center","alignItems":"center","flexDirection":"column"}}>
            <CactusIcon/>
            <h5 style={{marginTop: "20px"}}>There&apos;s no activity to show</h5>
           </div>
            }
            </>
        )

};

export default ActivityFeed;
