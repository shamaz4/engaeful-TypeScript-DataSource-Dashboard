/* eslint-disable prettier/prettier */
import styled, { themeGet, device, css } from "@doar/shared/styled";
import { Input, Button } from "@doar/components";

export const StyledButtonSearch = styled(({ ...rest }) => <Button {...rest} />)`
    display: flex;
    align-items: center;
    border: 1px solid ${themeGet("colors.text4")};
    border-left-width: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    color: ${themeGet("colors.text3")};
    min-height: 0;
    transition-duration: 0s;
    padding: 0 10px;
    height:35px;
    height: 100%;
    svg {
        width: 18px;
        height: 18px;
        stroke-width: 2.5px;
    }
    ${(props) =>
        props.theme.name === "dark" &&
        css`
            border-color: rgba(255, 255, 255, 0.08);
            &:hover,
            &:focus {
                color: #fff;
            }
        `}
`;


export const StyledButton = styled((props) => <Button {...props} />)`
    text-transform: uppercase !important;
    font-size: 10px !important;
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

export const StyledInput = styled(({ ...rest }) => <Input {...rest} />)`
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right-width: 0;
    font-size: inherit;
    width: 150px;
    border-color: #c0ccda !important;
    height: 100%;
    min-height: 0;
    background-color: transparent;
    ${(props) =>
        props.theme.name === "dark" &&
        css`
            border-color: rgba(255, 255, 255, 0.08);
        `}
`;

export const StyledForm = styled.div`
    display: none;
    ${device.small} {
        flex: 1;
        display: flex;
        align-items: center;
        margin-left: 15px;
        height: 34px;
    }
    input {
        &:hover,
        &:focus,
        &:active {
                outline: none;
                box-shadow: none;
        },
    }
`;
