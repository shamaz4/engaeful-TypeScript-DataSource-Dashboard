import styled, { device, themeGet, css } from "@doar/shared/styled";
import { Anchor } from "@doar/components";

export const StyledCampaignList = styled(({ ...rest }) => <Anchor {...rest} />)`
    font-weight: 700;
    line-height: 5px;
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

export const SwitchContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
    background: white;
    border: 1px solid #485e9029;
    border-radius: 4px;
    box-shadow: 0 0 10px rgb(28 39 60 / 5%);
`;

export const SwitchContainerItemLeft = styled.div<{
    active: boolean;
}>`
    background: ${(props) => (props.active ? "#f5f4ff" : "")};
    font-weight: ${(props) => (props.active ? "500" : "")};
    color: ${(props) => (props.active ? "#695ebd" : "")};
    cursor: ${(props) => (props.active ? "default" : "pointer")};
    padding: 10px;
    width: 50%;
    text-align: center;
    border-right: 1px solid #e4e4e4;
    align-content: center;
    align-items: center;
    justify-content: center;
    display: flex;
`;

export const SwitchContainerItemRight = styled(({ ...rest }) => (
    <div {...rest} />
))`
    background: ${(props) => (props.active ? "#f5f4ff" : "")};
    font-weight: ${(props) => (props.active ? "500" : "")};
    color: ${(props) => (props.active ? "#695ebd" : "")};
    cursor: ${(props) => (props.active ? "default" : "pointer")};
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    padding: 10px;
    width: 50%;
    text-align: center;
`;
