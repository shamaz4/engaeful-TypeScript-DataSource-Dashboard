/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from "react";
import { HelpCircle, Settings, LogOut } from "react-feather";
import { DropdownToggle, Dropdown, AvatarInitial } from "@doar/components";
import { useAppSelector } from "src/redux/hooks";
import {
    StyledDropMenu,
    StyledAuthorName,
    StyledAuthorRole,
    StyledDropItem,
    StyledDivider,
    StyledAvatar,
} from "./style";

const ProfileDropdown: React.FC = () => {
    const userObject = useAppSelector((state) => state.auth.userObject);

    const nameToInitials = () => {
        if (!userObject) {
            return "N/A";
        }
        const {name} = userObject;
        const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

        let initials = [...name.matchAll(rgx)] || [];

        initials = (
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
        ).toUpperCase();

        return initials;
    }

    console.log(userObject);
    return (
        <Dropdown direction="down" className="dropdown-profile">
            <DropdownToggle variant="texted">
                <StyledAvatar size="sm" shape="circle">
                    <AvatarInitial>{nameToInitials()}</AvatarInitial>
                </StyledAvatar>
            </DropdownToggle>
            <StyledDropMenu>
                <StyledAuthorName>{userObject.name}</StyledAuthorName>
                <StyledAuthorRole>{userObject.email}</StyledAuthorRole>
                <StyledDropItem path="/settings/general" mt="10px">
                    <Settings size="24" />
                    Account Settings
                </StyledDropItem>
                <StyledDropItem
                    path="https://docs.engageful.io/"
                    mt="10px"
                >
                    <HelpCircle size="24" />
                    Help Center
                </StyledDropItem>
                <StyledDivider />
                <StyledDropItem path="/signout" mt="10px">
                    <LogOut size="24" />
                    Sign Out
                </StyledDropItem>
            </StyledDropMenu>
        </Dropdown>
    );
};

export default ProfileDropdown;
