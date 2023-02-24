import { FC } from "react";
import { StyledSidebar, StyledHeader, StyledBody, StyledFooter } from "./style";
import Scrollbar from "../../../scrollbar";
import { useAppSelector } from "../../../../redux/hooks";
import DragAndDropComponents from "./components/dragAndDropComponents";

const Sidebar: FC = () => {
    const { sidebar } = useAppSelector((state) => state.ui);
    return (
        <StyledSidebar className="sidebar" $sidebar={sidebar}>
            <Scrollbar bottom="60px">
                <StyledBody>
                    <DragAndDropComponents />
                </StyledBody>
            </Scrollbar>
        </StyledSidebar>
    );
};

export default Sidebar;
