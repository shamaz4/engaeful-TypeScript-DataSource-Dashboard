import { useHover } from "@doar/shared/hooks";
import { FC, useRef, useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    Delete,
    Trash,
    Trash2,
} from "react-feather";
import "react-perfect-scrollbar/dist/css/styles.css";
import { IconBg, IconBgDelete, StyledHeader, StyledInput } from "./style";

interface IAccordion {
    active: boolean;
    header?: string;
    subtitle?: string;
    placeholder?: string;
    noBorder?: boolean;
    index: number;
    subIndex: number;
    onDelete?: (i: number, j: number) => void;
    onNameChange?: (name: string) => void;
}

const AccordionEditableMini: FC<IAccordion> = ({
    children,
    header,
    subtitle,
    placeholder = "Enter name...",
    active,
    noBorder = false,
    index,
    subIndex,
    onDelete = (i: number, j: number) => {},
    onNameChange = (name: string) => {},
    ...rest
}) => {
    const [isActive, setIsActive] = useState(active);
    const [currentHeader, setCurrentHeader] = useState(header);
    const toggleActive = () => {
        setIsActive((prevActive) => !prevActive);
    };
    const hoverRef = useRef(null);
    const isHover = useHover(hoverRef);

    return (
        <>
            <StyledHeader ref={hoverRef}>
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
                <div
                    style={{
                        marginLeft: "auto",
                        display: "flex",
                    }}
                >
                    <IconBgDelete
                        style={{
                            opacity: isHover ? 1 : "",
                        }}
                        onClick={() => {
                            if (
                                confirm(
                                    "Are you sure you want to delete this measure?"
                                )
                            ) {
                                onDelete(index, subIndex);
                            }
                        }}
                    >
                        <Trash2 size="12px" />
                    </IconBgDelete>
                    <IconBg onClick={toggleActive}>
                        {isActive ? (
                            <ChevronDown size="15px" />
                        ) : (
                            <ChevronRight size="15px" />
                        )}
                    </IconBg>
                </div>
            </StyledHeader>
            <div
                style={{
                    display: !isActive ? "none" : "block",
                    marginTop: isActive ? "20px" : "",
                }}
            >
                {children}
            </div>
        </>
    );
};

export default AccordionEditableMini;
