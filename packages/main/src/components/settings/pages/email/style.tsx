/* eslint-disable prettier/prettier */
import styled, { device, themeGet, css, tinycolor } from "@doar/shared/styled";
import { Input, Button } from "@doar/components";

export const StyledButton = styled((props) => <Button {...props} />)`
    text-transform: uppercase !important;
    font-size: 10px !important;
    line-height: 1.773;
    padding-left: 5px;
    margin-left:10px;
    color: white;
    padding-right: 5px;
    font-weight: 600;
    letter-spacing: 0.5px;
    ${device.small} {
        font-size: 11px;
        padding-left: 15px;
        margin-left: 10px;
        padding-right: 15px;
    }
`;

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