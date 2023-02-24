/* eslint-disable no-nested-ternary */
import { Button } from "@doar/components";
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
    padding: 10px 20px;
    padding-bottom: 0px;
`;

export const StyledHeader = styled.h2`
    font-size: 18px;
    margin-bottom: 0px;
    font-weight: 500;
`;

export const StyledDivFlex = styled.div`
    display: flex;
    align-content: center !important;
    flex-wrap: wrap !important;
    flex-direction: row !important;
    align-items: center;
`;

export const IconBg = styled.div`
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    background: #f9f9f9;
    &:hover {
        background: #ececec;
    }
`;

export const StyledInput = styled.input`
    font-size: 16px;
    font-weight: 500;
    border: none;
    border-bottom: dashed 1px transparent !important;
    padding: 10px 0px;
    width: 100%;
    width: 325px;
    &:hover {
        border-bottom: dashed 1px transparent !important;
    }
`;

export const StyledButtonIcon = styled((props) => <Button {...props} />)`
    ${(props) =>
        props.primary === false &&
        css`
            background: #f3f3f3;
            border: 1px solid #f1f1f1;
            color: #505050 !important;
            &:hover {
                background: #d8d8d8;
                border-color: gainsboro;
            }
            &:active,
            :focus {
                background: #d8d8d8;
                border-color: gainsboro;
                box-shadow: 0 0 0 0.2rem rgb(142 142 142 / 10%);
            }
        `}
    padding: 9px 12px !important;
    text-transform: uppercase !important;
    line-height: 1.773;
    padding-left: 5px;
    color: white;
    padding-right: 5px;
    font-weight: 600;
    letter-spacing: 0.5px;
    ${device.small} {
        font-size: 11px;
        padding-left: 15px;
        padding-right: 15px;
    }
`;

export const StyledButtonIconDelete = styled((props) => <Button {...props} />)`
    ${(props) =>
        props.primary === false &&
        css`
            background: rgb(255 217 217);
            color: rgb(165 113 113);
            border: 1px solid #ffd9d9;
            &:hover {
                background: rgb(255 204 204);
                border: 1px solid #ffd9d9;
            }
            &:active,
            :focus {
                background: rgb(255 204 204);
                border: 1px solid #ffd9d9;
                box-shadow: 0 0 0 0.2rem rgb(255 204 204 / 50%);
            }
        `}
    transition: all 0.2s ease-in-out;
    opacity: 0;
    padding: 9px 12px !important;
    text-transform: uppercase !important;
    line-height: 1.773;
    padding-left: 5px;
    padding-right: 5px;
    font-weight: 600;
    letter-spacing: 0.5px;
    ${device.small} {
        font-size: 11px;
        padding-left: 15px;
        padding-right: 15px;
    }
`;
