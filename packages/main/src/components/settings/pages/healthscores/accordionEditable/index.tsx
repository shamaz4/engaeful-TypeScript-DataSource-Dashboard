import { useHover } from "@doar/shared/hooks";
import { FC, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "react-feather";
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
                        <StyledInput
                            value={currentHeader}
                            placeholder={placeholder}
                            onChange={(e) => {
                                setCurrentHeader(e.currentTarget.value);
                                onNameChange(e.currentTarget.value);
                            }}
                        />
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
                    <StyledButtonIconDelete
                        data-tip="Add measure group"
                        primary={false}
                        size="sm"
                        ml="10px"
                        style={{
                            opacity: isHover ? 1 : "",
                        }}
                        onClick={() => {
                            if (
                                confirm(
                                    "Are you sure you want to delete this measure group?"
                                )
                            ) {
                                onDelete(index);
                            }
                        }}
                    >
                        <Trash2 size="16px" />
                    </StyledButtonIconDelete>
                    <StyledButtonIcon
                        onClick={() => {
                            onAddClick(1);
                        }}
                        primary={false}
                        size="sm"
                        ml="10px"
                    >
                        <Plus size="16px" style={{ marginRight: "5px" }} />
                        Add measure
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
