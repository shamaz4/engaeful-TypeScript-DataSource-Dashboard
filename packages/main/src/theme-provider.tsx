import { FC } from "react";
import { ThemeProvider, themes } from "@doar/shared/styled";
import { GlobalStyle } from "@doar/shared/css";
import { useAppSelector } from "./redux/hooks";

const Theme: FC = ({ children }) => {
    const { theme } = useAppSelector((state) => state.ui);

    return (
        <ThemeProvider theme={themes[theme]}>
            <GlobalStyle />
            {children}
        </ThemeProvider>
    );
};

export default Theme;
