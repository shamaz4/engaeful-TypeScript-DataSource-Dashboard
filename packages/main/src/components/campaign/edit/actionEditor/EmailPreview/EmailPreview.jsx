/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/naming-convention */
import { FC, useReducer, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "rich-markdown-editor"
import PersonalTemplate from "./templates/personal";
import { useAppSelector } from "../../../../../redux/hooks";
import PlainTemplate from "./templates/plain";

export default function EmailPreview({
    params = {
        title: "",
        sendFromName: "",
        sendFromEmail: "",
        body: [], 
    },
    onChange = (a) => {},
}) {
    const websiteName = useAppSelector((state) => state.auth.websites[0].name);
    const [selectedParams, setselectedParams] = useState({...params, companyName: websiteName});
    const handleChange = (data) => {
        onChange({
            ...params,
            ...data,
        });
    };

    useEffect(() => {
        setselectedParams({...params, companyName: websiteName});
    }, [params, websiteName]);

    return (
        <>
            {/* <PlainTemplate params={selectedParams} onChange={(data) => {handleChange({body: data})}}/> */}
            <PersonalTemplate params={selectedParams} onChange={(data) => {handleChange({body: data})}}/>
        </>
    );
}
