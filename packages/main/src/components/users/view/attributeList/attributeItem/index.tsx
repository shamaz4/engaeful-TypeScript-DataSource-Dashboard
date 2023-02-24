/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { ApiUrl } from "@doar/shared/data";
import { useHover } from "@doar/shared/hooks";
import axios from "axios";
import { formatDistance } from "date-fns";
import { FC, useRef, useEffect, useState } from "react";
import { Edit, Edit2, Edit3 } from "react-feather";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { setWebsites } from "src/redux/slices/auth";

interface IProps {
    data: any;
    value: any;
    showHidden: boolean
}

const AttributeItem: FC<IProps> = ({ data, value, showHidden }) => {
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const websites: [] = useAppSelector((state) => state.auth.websites);
    const dispatch = useAppDispatch();
    const [dictionary, setdictionary] = useState([]);
    const token: string = useAppSelector((state) => state.auth.accessToken);
    const [mode, setmode] = useState("display");
    const [currentData, setcurrentData] = useState(data);
    const [hide, sethide] = useState(false);

    // Edit title
    const titleEditRef = useRef(null);
    const titleInputRef = useRef(null);
    const titleEditHover = useHover(titleEditRef);
    const [titleName, settitleName] = useState(currentData.name);

    const setWebsiteDictionaryInState = (newDictionary) => {
        const newWebsites = [];
        for (const w of websites) {
            if (w.id === WebsiteId) {
                newWebsites.push({
                    ...w,
                    dictionary: newDictionary
                });
            } else {
                newWebsites.push(w);
            }
            console.log(newWebsites)
        }
        dispatch(setWebsites({websites: newWebsites}));
    } 

    const getWebsiteDictionaryFromState = () => {
        const currentSelectedWebsite = websites.filter((w)=>w.id === WebsiteId);
        if (currentSelectedWebsite.length > 0) {
            setdictionary(currentSelectedWebsite[0].dictionary)
        }
    }

    useEffect(() => {
        const itemInDic = dictionary.filter((d) => d.id === currentData.id);
        if (itemInDic.length > 0) {
            setcurrentData({
                ...currentData,
                name: itemInDic[0].name, 
            });
            if (itemInDic[0].hideInProfileView) {
                sethide(itemInDic[0].hideInProfileView);
            }
        } 
    }, [dictionary]);

    useEffect(() => {
        getWebsiteDictionaryFromState();
    }, []);

    const saveVisibility = (_hide) => {
        const url = `${ApiUrl}/websites/${WebsiteId}/dictionaries`;
        axios
            .patch(url, 
                {
                    id: currentData.id,
                    hideInProfileView: _hide
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
            .then((d) => {
                setWebsiteDictionaryInState(d.data)
                toast.success("Successfully changed visibility of attribute", {
                    autoClose: 2500 
                 })
            })
            .catch((error) => {
                console.log("Error fetching attribute data", error);
            });
        return null;
    };

    const saveTitle = () => {
        const url = `${ApiUrl}/websites/${WebsiteId}/dictionaries`;
        axios
            .patch(url, 
                {
                    id: currentData.id,
                    name: titleName,
                    category: "attribute",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
            .then((d) => {
                setWebsiteDictionaryInState(d.data)
                toast.success("Successfully changed name of attribute", {
                    autoClose: 2500 
                 })
            })
            .catch((error) => {
                console.log("Error fetching attribute data", error);
            });
        return null;
    };

    const displayString = (_value: string ) => {
        if (_value === undefined || !_value) {
            return <span style={{color: "#c8c9cf"}}>—</span>
        }
        return _value.toString()
    }

    const displayBoolean = (_value) => {
        if (_value) {
            return <i>true</i>
        }
            return <i>false</i>
    }

    const displayDate = (_value) => {
        if (_value) {
            return <>{formatDistance(new Date(_value), new Date(), {addSuffix: true})}</>
        }
            return <span style={{color: "#c8c9cf"}}>—</span>
    }

    const displayConditionally = (_id, _value, _type) => {
        switch (_type) {
            case "string":
                return displayString(_value);
            case "date":
                return displayDate (_value);
            case "bool":
            case "boolean":
                return displayBoolean(_value);
            default: 
                return displayString(_value);
        }
    }

    const editTitle = () => {
        if (currentData.name && currentData !== "") {
            settitleName(currentData.name)
        } else {
            settitleName("");
        }
        setmode("editTitle")
    }

        return (
            <>
            {mode === "display" ? 
            <div className="attributeItem" style={{paddingBottom: '10px', borderBottom: '1px solid #ebecf2', marginBottom: '10px',
    alignItems: "center",
    opacity: hide ? 0.4 : 1,
    display: hide && !showHidden ? "none" : "flex"
            }}>
                <div style={{width: "80%"}} ref={titleEditRef}>
                <div onDoubleClick={() => {editTitle()}}  style={{ color: '#6f7488', fontSize: '.75rem', fontWeight: 600}}>
                    {currentData.name ? currentData.name : currentData.id}
                    {titleEditHover && mode==="display" ? 
                    <svg 
                    onClick={() => {editTitle()}}
                    style={{width: "14px", marginLeft: "5px", position: "absolute", marginTop: "2px", cursor:"pointer"}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                    : <></>}
                </div>
                <div>
                    <div style={{marginTop: "5px"}}>
                        <div>
                            {displayConditionally(currentData.id, value, currentData.type)}
                        </div>
                    </div>
                </div>
                </div>
                {showHidden ?
                <div style={{position: "absolute", right: "40px"}}>
                    {!hide ? 
                    <svg 
                    onClick={() => {
                        sethide(true)
                        saveVisibility(true);
                    }}
                    style={{width: "16px", cursor: "pointer", color: "rgb(111, 116, 136)"}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    : 
                    <svg 
                    onClick={() => {
                        sethide(false)
                        saveVisibility(false);
                    }}
                    style={{width: "16px", cursor: "pointer", color: "rgb(111, 116, 136)"}}
                    xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                    }
                </div>
                : <></>}
            </div>
            : mode === "editTitle" ? 
            <div  className="attributeItem" style={{paddingBottom: '10px', borderBottom: '1px solid #ebecf2', marginBottom: '10px'}}>
                <div style={{color: '#6f7488', fontSize: '.75rem', fontWeight: 600}}>
                    <input className="editAttributeTitleText"
                     onChange={(d) => {
                     settitleName(d.target.value)
                     }}
                     onKeyUp={(event) => {
                        if (event.keyCode === 13) {
                            event.target.blur();
                            setcurrentData({
                                ...currentData,
                                name: titleName
                            })
                            setmode("display");

                            // Axios
                            saveTitle()
                        } else if (event.keyCode === 27) {
                            settitleName(currentData.name);
                            setmode("display");
                        }
                     }}
                     ref={titleInputRef}
                     autoFocus
                     onBlur={() => {
                        settitleName(currentData.name);
                        setmode("display");
                     }}
                     type="text" 
                     placeholder="enter custom name"
                     value={titleName}
                     />
                </div>
                <div>
                    <div style={{marginTop: "5px"}}>
                        {displayConditionally(currentData.id, value, currentData.type)}
                    </div>
                </div>
            </div>
            : <></>}
        </>
        )

};

export default AttributeItem;

