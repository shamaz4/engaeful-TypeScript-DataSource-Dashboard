/* eslint-disable @typescript-eslint/no-unsafe-return */
import { FC, useEffect, useState } from "react";
import { User, Plus } from "react-feather";
import { Badge, Nav, NavLink } from "@doar/components";
import axios from "axios";
import { toast } from "react-toastify";
import { ApiUrl } from "@doar/shared/data/api-keys";
import { useAppSelector } from "src/redux/hooks";
import NewSegmentModal from "./new-segment-modal";
import { StyledWrap } from "./style";

interface ISegment {
    _id: string;
    name: string;
}

const SegmentList: FC = () => {
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const token: string = useAppSelector((state) => state.auth.accessToken);
    const [segments, setSegments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const handleModal = () => {
        setShowModal((prev) => !prev);
    };

    const getSegments = () => {
        const url = `${ApiUrl}/websites/${WebsiteId}/segments`;
        axios
            .get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((d) => {
                setSegments(d.data.results);
            })
            .catch((error) => {
                console.log(error.response);
                toast.error("Unable to fetch segment data...");
            });
    };

    useEffect(() => {
        getSegments();
    }, []);

    return (
        <StyledWrap>
            <Nav customStyle="sidebar" fontSize="13px">
                <NavLink path="#!" active>
                    <User />
                    <span>All users</span>
                    <Badge>9</Badge>
                </NavLink>
                {segments.map((s: ISegment) => {
                    return (
                        <NavLink key={s._id} path="#!">
                            <User />
                            <span>{s.name}</span>
                            <Badge>20</Badge>
                        </NavLink>
                    );
                })}
                <NavLink onClick={handleModal} path="#">
                    <Plus />
                    <span>New segment</span>
                </NavLink>
            </Nav>
            <NewSegmentModal show={showModal} onClose={handleModal} />
        </StyledWrap>
    );
};

export default SegmentList;
