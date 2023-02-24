import styled, { css, themeGet } from "@doar/shared/styled";
import { Button } from "@doar/components";

export const StyledSidebar = styled.div<{ $sidebar?: boolean }>`
    background-color: #fff;
    z-index: 9;
    position: absolute;
    top: -55px;
    bottom: 0;
    overflow: auto;
    right: 0;
    width: 1150px;
    transition: all 0.3s;
    @media (min-width: 480px) {
        border-left: 1px solid ${themeGet("colors.border")};
    }
    ${({ $sidebar }) =>
        $sidebar &&
        css`
            @media (max-width: 479px) {
                transform: translateX(-100vw);
            }
        `}
    ${(props) =>
        props.theme.name === "dark" &&
        css`
            background-color: ${themeGet("colors.darkdarken5")};
        `}
`;

export const StyledHeader = styled.div`
    display: flex;
    padding: 10px 20px;
    align-content: center;
    align-items: center;
    margin-top: 55px;
    height: 55px;
    border-bottom: 1px solid #485e9029;
    ${(props) => props.theme.name === "dark" && css``};
`;
export const StyledBody = styled.div`
    padding: 20px;
    margin-bottom: 80px;
    display: flex;
    flex-direction: column;
    width: 100%;
`;
export const StyledFooter = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    border-top: 1px solid ${themeGet("colors.border")};
    padding-left: 20px;
    padding-right: 15px;
    ${(props) =>
        props.theme.name === "dark" &&
        css`
            background-color: ${themeGet("colors.darkdarken3")};
        `}
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
    padding-left: 15px !important;
    padding-right: 15px !important;
    text-transform: uppercase !important;
    font-size: 12px !important;
    line-height: 1.773;
    padding-left: 5px;
    color: white;
    padding-right: 5px;
    font-weight: 600;
    letter-spacing: 0.5px;
`;
