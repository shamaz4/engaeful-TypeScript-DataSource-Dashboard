/* eslint-disable no-nested-ternary */
import styled, { themeGet, css, device } from "@doar/shared/styled";

export const StyledHeader = styled.div`
    margin: 0px -20px;
    padding: 0px 20px;
    background: #f7f7f7;
    border-top: 1px solid #d4d4d4;
    display: flex;
    align-items: center;
`;

export const StyledInput = styled.input`
    border: none;
    border-bottom: dashed 1px transparent !important;
    padding: 5px 0px;
    width: 100%;
    width: 325px;
    &:hover {
        border-bottom: dashed 1px transparent !important;
    }
`;

export const IconBg = styled.div`
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    background: #f3f3f3;
    border: 1px solid #dadada;
    &:hover {
        background: #ececec;
    }
`;

export const IconBgDelete = styled.div`
    opacity: 0;
    width: 24px;
    height: 24px;
    margin-right: 5px;
    background: #ffb6b6;
    color: #9a4646;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    background: rgb(255 217 217);
    color: rgb(165 113 113);
    border: 1px solid #ffd9d9;
    &:hover {
        background: rgb(255 204 204);
        border: 1px solid #ffd9d9;
    }
`;
