/* eslint-disable no-nested-ternary */
import styled, { themeGet, css, device } from "@doar/shared/styled";

export const StyledContainer = styled.div<{
    active: boolean;
    noBorder: boolean;
}>`
    border: ${(props) =>
        props.noBorder
            ? "none"
            : props.active
            ? "1px solid rgb(230 230 230);"
            : "1px solid transparent"}
    border-radius: 4px;
    padding: 20px;
`;

export const StyledHeader = styled.h2`
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: 500;
`;

export const StyledDivFlex = styled.div`
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    flex-direction: row;
    margin-left: -20px;
    margin-right: -20px;
    margin-top: -20px;
    padding: 20px;
padding-bottom: 0px;
    margin-bottom: 20px;
    cursor: pointer;
    &:hover {
        background: #f9f9f9;
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
    }
`;
