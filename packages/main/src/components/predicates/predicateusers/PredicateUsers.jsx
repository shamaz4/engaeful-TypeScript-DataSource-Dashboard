/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Spinner } from "@doar/components";
import { ApiUrl } from "@doar/shared/data";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users } from "react-feather";
import { match } from "assert";
import { useAppSelector } from "../../../redux/hooks";

export default function PredicateUsers({
    isEntry = true,
    predicates = [],
    predicatesOperator = "and",
}) {
    const WebsiteId = useAppSelector((state) => state.auth.selectedWebsite);
    const token = useAppSelector((state) => state.auth.accessToken);
    const [selectedPredicates, setSelectedPredicates] = useState(predicates);
    const [
        previousSelectedPredicates,
        setPreviousSelectedPredicates,
    ] = useState([]);
    const [lastPredicateFetch, setLastPredicateFetch] = useState([]);
    const [selectedOperator, setSelectedOperator] = useState(
        predicatesOperator
    );
    const [previousSelectedOperator, setPreviousSelectedOperator] = useState(
        ""
    );
    const [loading, setLoading] = useState(true);
    const [matchedUsers, setMatchedUsers] = useState({ data: [], length: 0 });
    const [matchedFilters, setmatchedFilters] = useState([]);
    const [eventsInPredicate, setEventsInPredicate] = useState(false);

    if (predicates !== previousSelectedPredicates) {
        setSelectedPredicates(predicates);
        setPreviousSelectedPredicates(predicates);
    }
    if (predicatesOperator !== previousSelectedOperator) {
        setSelectedOperator(predicatesOperator);
        setPreviousSelectedOperator(predicatesOperator);
    }

    // Clean up predicates before request to remove empty values etc
    const formatPredicates = (_predicates) => {
        const newPredicates = [];
        _predicates.forEach((p) => {
            if (
                p.attribute &&
                p.type !== "event" &&
                p.attribute !== "current_url"
            ) {
                newPredicates.push(p);
            }
        });
        return newPredicates;
    };

    const objectsAreSame = (o1, o2) => {
        if (o1 && o2) {
            return typeof o1 === "object" && Object.keys(o1).length > 0
                ? Object.keys(o1).length === Object.keys(o2).length &&
                      Object.keys(o1).every((p) => objectsAreSame(o1[p], o2[p]))
                : o1 === o2;
        }

        return false;
    };

    const getUsersThatMatchFilters = () => {
        if (selectedPredicates) {
            // Format predicates
            const newPredicates = formatPredicates(selectedPredicates);
            return new Promise((resolve) => {
                const url = `${ApiUrl}/websites/${WebsiteId}/segments/listUsersByFilter`;
                axios
                    .post(
                        url,
                        {
                            matchPredicates: newPredicates,
                            matchPredicateOperator: selectedOperator,
                            limit: 10,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )
                    .then((response) => {
                        resolve(response.data);
                    })
                    .catch(() => {})
                    .finally(() => {});
            });
        }
        return Promise.resolve([]);
    };

    const handleChange = () => {
        setLoading(true);
        getUsersThatMatchFilters()
            .then((d) => {
                if (d.data) {
                    setMatchedUsers({
                        data: d.data.data,
                        length: d.data.count,
                    });
                    setmatchedFilters(d.data.filter);
                } else {
                    setMatchedUsers({ data: [], length: 0 });
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const checkIfThereAreEventsInPredicates = () => {
        let status = false;
        selectedPredicates.forEach((sp) => {
            if (
                sp.attribute === "current_url" ||
                (sp.type === "event" && sp.comparison !== "notTotal")
            ) {
                status = true;
            }
        });
        setEventsInPredicate(status);
    };

    useEffect(() => {
        // Update if there are no empty values
        let update = true;
        selectedPredicates.forEach((sp) => {
            if (!["set", "notSet", "isTrue", "isFalse"].includes(sp.comparison)) {
                if (sp.value.length === 0) {
                    update = false;
                }
                if (sp.type === "date" && ["between", "notBetween", "on", "notOn"].includes(sp.comparison)) {
                    if (sp.value.length < 2) {
                        update = false;
                    }
                }
            }
        });
        if (
            selectedPredicates.length === 1 &&
            selectedPredicates[0].value &&
            !selectedPredicates[0].comparison
        ) {
            update = true;
        }
        if (update && !objectsAreSame(selectedPredicates, lastPredicateFetch)) {
            handleChange();
            setLastPredicateFetch(selectedPredicates);
        }
        checkIfThereAreEventsInPredicates();
    }, [selectedPredicates]);

    useEffect(() => {
        // Update if there are no empty values
        let update = true;
        selectedPredicates.forEach((sp) => {
            if (!["set", "notSet"].includes(sp.comparison)) {
                if (sp.value.length === 0) {
                    update = false;
                }
            }
        });
        if (update) {
            handleChange();
            setLastPredicateFetch(selectedPredicates);
        }
    }, [selectedOperator]);

    /*
     */

    return (
        <>
        {isEntry ?
        <div
            style={{
                padding: "0px 16px",
                minHeight: "500px",
                marginTop: "20px",
            }}
        >
            {!loading ? (
                <>
                    {matchedUsers.length > 0 ? (
                        <>
                            {eventsInPredicate ? (
                                <>
                                    <span
                                        style={{
                                            fontSize: "14px",
                                            display: "block",
                                            fontWeight: "500",
                                        }}
                                    >
                                        Only those who trigger the defined
                                        events out of {matchedUsers.length}{" "}
                                        {matchedUsers.length > 1
                                            ? "users"
                                            : "user"}{" "}
                                        currently matching your audience rules
                                        will receive the message.
                                    </span>
                                    <span
                                        style={{
                                            marginTop: "10px",
                                            fontSize: "14px",
                                        }}
                                    >
                                        If you set this campaign live, they
                                        would enter it, as well as new people
                                        that start to match your rules.
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span
                                        style={{
                                            fontSize: "14px",
                                            display: "block",
                                            fontWeight: "500",
                                        }}
                                    >
                                        {matchedUsers.length}{" "}
                                        {matchedUsers.length > 1
                                            ? "users are"
                                            : "user in"}{" "}
                                        your audience right now.
                                    </span>
                                    <span
                                        style={{
                                            marginTop: "10px",
                                            fontSize: "14px",
                                        }}
                                    >
                                        If you set this campaign live, they
                                        would enter it, as well as new people
                                        that start to match your rules.
                                    </span>
                                </>
                            )}
                            <table className="predicateUsersTable">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>User ID</th> 
                                    </tr>
                                </thead>
                                <tbody>
                                    {matchedUsers.data.map((mu) => {
                                        return (
                                            <tr key={mu._id}>
                                                <td>
                                                    <img
                                                        src={`https://avatars.dicebear.com/api/initials/${mu.name}.svg`}
                                                        alt={mu.name}
                                                    />
                                                    <span
                                                        style={{
                                                            marginLeft: "7px",
                                                            position:
                                                                "relative",
                                                        }}
                                                    >
                                                        {mu.name}
                                                    </span>
                                                </td>
                                                <td>{mu.userId}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                display: "flex",
                                alignContent: "center",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Users />
                            <span
                                style={{
                                    marginTop: "3px",
                                    marginLeft: "10px",
                                }}
                            >
                                No users match these rules yet
                            </span>
                        </div>
                    )}
                </>
            ) : (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <Spinner color="primary" />
                </div>
            )}
        </div>
        : <>
                <div
            style={{
                padding: "20px 20px",
            }}
        >
                                    <span
                                        style={{
                                            fontSize: "14px",
                                            display: "block",
                                            fontWeight: "500",
                                        }}
                                    >
                                        Audience preview unavailable
                                    </span>
                                    <span
                                        style={{
                                            marginTop: "10px",
                                            fontSize: "14px",
                                        }}
                                    >
                                        You&apos;ll only see an audience preview on entry rules blocks.
                                    </span>
        </div>
        </>
                }
                </>
    );
}
