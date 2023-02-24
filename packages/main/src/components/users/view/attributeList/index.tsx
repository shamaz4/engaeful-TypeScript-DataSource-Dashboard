import { Anchor, CardTitle, Spinner } from "@doar/components";
import { ApiUrl } from "@doar/shared/data";
import { defaultTypes, defaultEvents } from "@doar/shared/data/api-keys";
import { useDebounce, useHover } from "@doar/shared/hooks";
import axios from "axios";
import { FC, useRef, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { IDictionaryItem } from "src/components/campaign/interfaces";
import { useAppSelector } from "src/redux/hooks";
import { IWebsiteUser } from "../../interfaces";
import AttributeItem from "./attributeItem";

const AttributeList: FC<{user: IWebsiteUser}> = ({user}) => {
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const token: string = useAppSelector((state) => state.auth.accessToken);
    const [dictionary, setDictionary] = useState<IDictionaryItem[]>([]);
    const [editAttributes, seteditAttributes] = useState(false);
    const containerRef = useRef(null);
    const containerHover = useHover(containerRef);
    const [loading, setloading] = useState(true);

    const { isLoading, error, data } = useQuery(`getAttributes`, () => {
        const url = `${ApiUrl}/websites/${WebsiteId}/users/getAttributes`;
        return axios.get(url, { headers: { Authorization: `Bearer ${token}`, }, })
    }, {
        onSuccess: () => {console.log("nice", data)},
    });

    const getAttributes = () => {
        const url = `${ApiUrl}/websites/${WebsiteId}/users/getAttributes`;
        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((d) => {
                setDictionary([...d.data.attributes]);
                setloading(false);
            })
            .catch((e) => {
                console.log("Error fetching attribute data", error);
            });
        return null;
    };

    useEffect(() => {
        getAttributes();
    }, []);

    return (
        <div ref={containerRef}>
            <CardTitle as="h5" style={{paddingBottom: '10px', marginBottom: '10px'}}>
                <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
                >
                    <div>
                        Attributes
                    </div>
                    <div style={{
                        visibility: containerHover || editAttributes ? "visible" : "hidden"
                    }}>
                        {editAttributes ?
                        <span 
                        onClick={() => {
                            seteditAttributes(false)
                        }}
                        role="button"
                        tabIndex={0}
                        style={{color: '#9385fc', display: 'block', fontSize: '11px', fontWeight: 600, lineHeight: 1, cursor: 'pointer', textTransform: 'uppercase'}}>Done</span>
                    : 
                        <span 
                        onClick={() => {
                            seteditAttributes(true)
                        }}
                        role="button"
                        tabIndex={0}
                        style={{color: '#9385fc', display: 'block', fontSize: '11px', fontWeight: 600, lineHeight: 1, cursor: 'pointer', textTransform: 'uppercase'}}>Edit</span>
}
                    </div>
                </div>
            </CardTitle>
            {
                isLoading ? 
                <div
                style={
        {"position":"relative","padding":"80px","display":"flex","alignItems":"center","justifyContent":"center"}
                }
            >
                <Spinner color="primary" />
            </div>
            : 
            <>
            <div style={{paddingBottom: '10px', borderBottom: '1px solid #ebecf2', marginBottom: '10px'}}>
                <div style={{color: '#6f7488', fontSize: '.75rem', fontWeight: 600}}>User ID</div>
                <div>{user.userId}</div>
            </div>
            {data.data.attributes.map(d => (
                <>
                {user.details && Object.prototype.hasOwnProperty.call(user.details, d.id) ? 
                    <AttributeItem showHidden={editAttributes} key={d.id} data={d} value={user.details[d.id]}/>
                : 
                    <AttributeItem showHidden={editAttributes} key={d.id} data={d} value={undefined}/>
                }
                </>
            ))}
            </>}
        </div>
    );
};

export default AttributeList;
