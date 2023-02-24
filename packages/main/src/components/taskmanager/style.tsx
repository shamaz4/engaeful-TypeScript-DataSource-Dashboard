import styled, { device, themeGet } from "@doar/shared/styled";
import { CardHeader, CardBody, Button } from "@doar/components";

export const StyledHeader = styled(({ ...props }) => <CardHeader {...props} />)`
    display: flex;
    flex-direction: column;
    border-bottom: 0;
    padding: 20px;
    ${device.small} {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
    }
    ${device.large} {
    }
`;

export const StyledBody = styled(({ ...props }) => <CardBody {...props} />)`
    padding: 0px;
`;

export const StyledButton = styled(({ ...props }) => <Button {...props} />)`
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
    line-height: 1.8;
`;
