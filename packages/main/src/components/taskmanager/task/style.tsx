import styled, { device, themeGet } from "@doar/shared/styled";

export const TaskContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-content: center;
    padding: 10px 20px;
    align-items: center;
    &:hover {
        background: #f9f9f9;
    }
    &:not(:last-of-type:not(:only-of-type)) {
        margin-bottom: 10px;
    }
`;

export const TaskContainerCheckContainer = styled.div`
    width: 32px;
    height: 32px;
    display: flex;
    align-content: center;
    align-items: center;
`;

export const TaskContainerCheckContainerUnchecked = styled.div`
    width: 24px;
    height: 24px;
    background: transparent;
    border-radius: 50%;
    border: 1px solid #b9b9b9;
`;

export const TaskContainerNameContainer = styled.div`
    margin-left: 10px;
`;

export const TaskContainerDateContainer = styled.div`
    margin-left: auto;
    color: #e4bb47;
`;

export const TaskContainerIconContainer = styled.div`
    width: 32px;
    height: 32px;
    display: inline-flex;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    align-content: center;
    margin-left: 10px;
    border-radius: 50%;
    color: #6d6d6d;
    &:hover {
        background: rgb(147 133 252 / 14%);
        color: #7b6fd6;
    }
`;
