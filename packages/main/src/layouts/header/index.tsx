import { FC, useState, useCallback, useEffect } from "react";
import { Search, Menu, X, ArrowLeft } from "react-feather";
import { Navbar, Button } from "@doar/components";
import { menuData } from "@doar/shared/data";
import { SelectSimple } from "src/components/commoncomponents/SelectSimple";
import ProfileDropdown from "../../components/header/profile-dropdown";
import NavSearch from "../../components/header/nav-search";
import Logo from "../../components/logo";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { toggleSidebar, toggleBody } from "../../redux/slices/ui";
import {
    StyledHeader,
    StyledLogo,
    StyledNavbarWrap,
    StyledNavbarMenu,
    StyleNavbarRight,
    StyledNavbarElement,
    StyledNavbarHeader,
    StyledNavbarBody,
    StyledNavbarTitle,
    StyledMenuBtn,
    StyledSidebarBtn,
    StyledHeaderContainer,
} from "./style";

interface IProps {
    hasSidebar?: boolean;
    hasSearch?: boolean;
    sidebarLayout?: 1 | 2;
}

const Header: FC<IProps> = ({ hasSidebar, sidebarLayout, hasSearch }) => {
    const dispatch = useAppDispatch();
    const { sidebar, isBody } = useAppSelector((state) => state.ui);
    const [searchOpen, setSearchOpen] = useState(false);
    const searchHandler = useCallback(() => {
        setSearchOpen((prev) => !prev);
    }, []);

    const [menuOpen, setMenuOpen] = useState(false);
    const sidebarHandler = useCallback(
        (_, isOpen?: "open") => {
            dispatch(toggleSidebar({ isOpen }));
        },
        [dispatch]
    );

    const bodyHandler = useCallback(() => {
        dispatch(toggleBody());
        dispatch(toggleSidebar({ isOpen: "open" }));
    }, [dispatch]);

    const menuHandler = useCallback(() => {
        setMenuOpen((prev) => !prev);
        if (menuOpen) {
            sidebarHandler(undefined, "open");
        }
    }, [menuOpen, sidebarHandler]);

    useEffect(() => {
        return () => {
            sidebarHandler(undefined, "open");
            bodyHandler();
        };
    }, [sidebarHandler, bodyHandler]);

    return (
        <StyledHeaderContainer>
            <StyledHeader>
                <StyledLogo>
                    <Logo />
                </StyledLogo>
                <StyledNavbarWrap $isOpen={menuOpen} onClick={menuHandler}>
                    <StyledNavbarMenu
                        $isOpen={menuOpen}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <StyledNavbarHeader>
                            <Logo />
                            <Button variant="texted" onClick={menuHandler}>
                                <X
                                    color="#7987a1"
                                    width={20}
                                    strokeWidth="2.5px"
                                />
                            </Button>
                        </StyledNavbarHeader>
                        <StyledNavbarBody>
                            <StyledNavbarTitle>
                                MAIN NAVIGATION
                            </StyledNavbarTitle>
                            <Navbar menus={menuData} />
                        </StyledNavbarBody>
                    </StyledNavbarMenu>
                </StyledNavbarWrap>
                <StyleNavbarRight>
                    {hasSearch ? (
                        <StyledNavbarElement>
                            <Button
                                variant="texted"
                                onClick={searchHandler}
                                className="search-btn"
                            >
                                <Search className="header-icon" />
                            </Button>
                        </StyledNavbarElement>
                    ) : (
                        <></>
                    )}
                    {/* <SelectSimple value="hha" values={[{value:"123", name:"Nimble"}, {value: 321, name: "Engageful"}]} /> */}
                    <StyledNavbarElement ml={["15px", "20px", "30px"]}>
                        <ProfileDropdown />
                    </StyledNavbarElement>
                </StyleNavbarRight>
            </StyledHeader>
            <NavSearch isOpen={searchOpen} onClose={searchHandler} />
        </StyledHeaderContainer>
    );
};

Header.defaultProps = {
    sidebarLayout: 1,
};

export default Header;
