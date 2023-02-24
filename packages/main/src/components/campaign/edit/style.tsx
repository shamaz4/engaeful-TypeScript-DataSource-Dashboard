import styled, { device, themeGet, css, tinycolor } from "@doar/shared/styled";
import { Anchor, Button } from "@doar/components";

export const StyledCampaignList = styled(({ ...rest }) => <Anchor {...rest} />)`
    font-weight: 700;
    font-size: 22px;
    letter-spacing: -1px;
    color: inherit;
    display: flex;
    align-items: center;
    position: relative;
    color: ${themeGet("colors.gulf")};
    margin-top: -4px;
    span {
        display: inline-block;
        font-weight: 400;
        color: ${themeGet("colors.primary")};
    }
    ${device.small} {
        font-size: 22px;
    }
    ${device.large} {
        font-size: 24px;
    }
    ${({ theme }) =>
        theme.name === "dark" &&
        css`
            color: ${themeGet("colors.white")};
        `}
`;

export const StyledHeader = styled.div`
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 55px;
    border-bottom: 1px solid ${themeGet("colors.border")};
    padding: 0 20px;
    display: flex;
    align-items: center;
    z-index: 9;
    width: 100%;
    ${(props) =>
        props.theme.name === "dark" &&
        css`
            background-color: ${tinycolor(themeGet("colors.gray900")(props))
                .darken(3)
                .toString()};
        `}
`;

export const StyledHeaderContainer = styled.div`
    width: 1140px;
    margin: auto;
`;

interface ILinkProps {
    $active?: boolean;
}
export const StyledButton = styled(({ ...rest }) => (
    <button type="button" {...rest} />
))<ILinkProps>`
    border: none;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
    padding: 4px 10px;
    &:hover {
        border-radius: 4px;
        text-decoration: underline;
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
