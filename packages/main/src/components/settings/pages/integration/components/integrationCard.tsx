/* eslint-disable @typescript-eslint/no-unsafe-return */
import { FC, useEffect, useState } from "react";
import {
    CardSubtitle,
    CardTitle,
    Spinner,
} from "@doar/components";
import { useAppSelector } from "src/redux/hooks";
import ReactTooltip from "react-tooltip";
import { StyledButtonSave } from "../style";

const IntegrationCard: FC = ({name,
    onClick= () => {},
    image,
    description,
    active,
      }) => {
    return <div>
    <div style={{
display: "flex",
flexDirection: "row",
marginTop: "-5px",
alignItems: "center"
}}>
        <img alt="Slack" src={image} style={{
gridArea: "icon",
height: "48px",
width: "48px",
minWidth: "32px",
boxShadow: "0 4px 4px rgb(54 54 54 / 26%)",
borderRadius: "6px",
backgroundColor: "#ffffff",
overflow: "hidden",
marginRight: "15px"
}} />
        <div>
            <p style={{
margin: "unset",
fontSize: "16px",
fontWeight: 500,
marginBottom: "0px",
}} className="actionEditorLabel">
                {name}
            </p>
            <p style={{
margin: "unset",
fontSize: "14px",
color: "#717171"
}} className="actionEditorLabel">
                {description}
            </p>
        </div>
        <div style={{
marginLeft: "auto"
}}>
            {!active ? <StyledButtonSave size="sm" ml="10px" onClick={() => {
                onClick();
}}>
                    Add integration
                </StyledButtonSave> : <StyledButtonSave primary={false} size="sm" ml="10px" onClick={() => {
const {
paragon
} = (window as any);
paragon.connect("slack");
}}>
                    Configure
                </StyledButtonSave>}
        </div>
    </div>
</div>;
};
export default IntegrationCard;