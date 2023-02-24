/* eslint-disable no-nested-ternary */
import { FC, useState } from "react";
import { ChevronDown, ChevronRight } from "react-feather";
import "react-perfect-scrollbar/dist/css/styles.css";
import { StyledContainer, StyledDivFlex, StyledHeader } from "./style";

interface IAccordion {
    active: boolean;
    header?: string;
    subtitle?: string | Element | FC;
    noBorder?: boolean;
    noExtraMarginBottom?: boolean;
    noToggle?: boolean;
}

const Accordion: FC<IAccordion> = ({
    children,
    header,
    subtitle,
    active,
    noExtraMarginBottom = false,
    noToggle = false,
}) => {
    const [isActive, setIsActive] = useState(active);
    const toggleActive = () => {
        if (!noToggle) {
            setIsActive((prevActive) => !prevActive);
        }
    };

    return (
        <StyledContainer
            active
            style={{
                paddingBottom: noExtraMarginBottom && isActive ? "0px" : "",
            }}
        >
            <StyledDivFlex
                onClick={toggleActive}
                style={{
                    marginBottom: isActive
                        ? noExtraMarginBottom
                            ? "0px"
                            : "20px"
                        : "-20px",
                }}
            >
                <div>
                    <StyledHeader style={{
                    }}>
                        {header}
                        {subtitle?
                        <div
                            style={{
                                display: isActive ? "none" : "unset",
                                fontSize: "13px",
                                marginLeft: "10px",
                            }}
                        >
                            <span>{subtitle}</span>
                        </div>
                        :<></>}
                    </StyledHeader>
                </div>
                <div
                    style={{
                        marginLeft: "auto",
                        display: noToggle ? "none" : "initial"
                    }}
                >
                    {isActive ? <ChevronDown /> : <ChevronRight />}
                </div>
            </StyledDivFlex>
            <div style={{ display: !isActive ? "none" : "unset" }}>
                {children}
            </div>
        </StyledContainer>
    );
};

export default Accordion;
