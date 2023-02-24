/* eslint-disable prettier/prettier */
import styled, { device, themeGet, css, tinycolor } from "@doar/shared/styled";
import { Input, Button } from "@doar/components";

export const StyledContainer = styled((props) => <div {...props} />)`
padding: 20px;
    border-radius: 12px;
    box-shadow: 0 0 10px 1px rgb(0 0 0 / 8%);
    position: fixed;
    background: white;
    margin-top: 10px;
    z-index: 9;
    width: fit-content;
`;

export const StyledContainerItem = styled((props) => <div {...props} />)`
    display: flex;
        align-items: center;
    align-content: center;
    &:not(:last-child) {
        margin-bottom: 10px;
    }
`

export const StyledDivValue = styled.div`
    font-size: 13px;
    color: gray;
    width: 45px;
    padding: 10px;
    border-radius: 4px;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
    line-height: 10px;
    font-weight: 500;
`

export const StyledButtonSave = styled((props) => <Button {...props} />)`
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
    float: right;
    margin-top: 10px;
    text-transform: uppercase !important;
    font-size: 12px !important;
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