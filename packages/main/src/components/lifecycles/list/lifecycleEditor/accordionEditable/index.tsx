import { useHover } from "@doar/shared/hooks";
import { FC, useRef, useState } from "react";
import { ChevronDown, ChevronRight, MapPin, Plus, Trash2 } from "react-feather";
import "react-perfect-scrollbar/dist/css/styles.css";
import { IconBgDelete } from "../accordionEditableMini/style";
import {
    IconBg,
    StyledButtonIcon,
    StyledButtonIconDelete,
    StyledContainer,
    StyledDivFlex,
    StyledHeader,
    StyledInput,
} from "./style";

interface IAccordion {
    active: boolean;
    header?: string;
    subtitle?: string;
    placeholder?: string;
    noBorder?: boolean;
    addButtonText?: string;
    index: number;
    onNameChange?: (e: any) => void;
    onDelete?: (e: any) => void;
    onAddClick?: (e: any) => void;
}

const AccordionEditable: FC<IAccordion> = ({
    children,
    header,
    subtitle,
    active,
    placeholder = "Enter name...",
    noBorder = false,
    addButtonText = "Add task",
    index,
    onDelete = () => {},
    onNameChange = () => {},
    onAddClick = () => {},
    ...rest
}) => {
    const [isActive, setIsActive] = useState(active);
    const [currentHeader, setCurrentHeader] = useState(header);
    const hoverRef = useRef(null);
    const isHover = useHover(hoverRef);

    return (
        <StyledContainer active>
            <StyledDivFlex
                style={{
                    marginBottom: isActive ? "10px" : "",
                }}
                ref={hoverRef}
            >
                <div>
                    <StyledHeader>
                        {currentHeader}
                        <div
                            style={{
                                display: isActive ? "none" : "unset",
                                fontSize: "13px",
                                marginLeft: "10px",
                            }}
                        >
                            <span>{subtitle}</span>
                        </div>
                    </StyledHeader>
                </div>
                <div
                    style={{
                        marginLeft: "auto",
                        display: "flex",
                    }}
                >
                    <StyledButtonIcon
                        onClick={() => {
                            onAddClick(1);
                        }}
                        primary={false}
                        size="sm"
                        ml="10px"
                    >
                        <Plus size="16px" style={{ marginRight: "5px" }} />
                        {addButtonText}
                    </StyledButtonIcon>
                </div>
            </StyledDivFlex>
            <div style={{ display: !isActive ? "none" : "unset" }}>
                {children}
            </div>
        </StyledContainer>
    );
};

export default AccordionEditable;
