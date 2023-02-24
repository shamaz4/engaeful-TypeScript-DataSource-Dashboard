/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-nested-ternary */

import { CardTitle } from "@doar/components";
import { useHover } from "@doar/shared/hooks";
import { formatDistance } from "date-fns";
import { FC, useRef, useEffect, useState } from "react";
import { Edit, Edit2, Edit3 } from "react-feather";
import { toast } from "react-toastify";
import HealthItem from "./healthItem";

interface IProps {
    user: any;
}

const HealthList: FC<IProps> = ({ user }) => {
        useEffect(() => {
            console.log(user);
        }, [])
        return (
        <>
        {user.healthScores && user.healthScores.overallHealthScore ?
            <>
            <CardTitle as="h5" style={{borderBottom: '1px solid #ebecf1', paddingBottom: '20px', marginBottom: '20px'}}>
                Health
            </CardTitle>
            <HealthItem name="Overall health" score={user.healthScores.overallHealthScore}/>
            {user.healthScores.healthscores.map((hs, i) => (
                <HealthItem 
                    key={hs.id}
                    name={hs.name} 
                    score={hs.average}
                    scores={hs.measures}
                    weight={hs.weight}
                    lastItem={user.healthScores.healthscores.length-1 === i}
                 />
            ))}
            </>
        :
        <></>
        }
        </>
        )

};

export default HealthList;
