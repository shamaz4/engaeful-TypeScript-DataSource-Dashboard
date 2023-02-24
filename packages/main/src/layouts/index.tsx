import React from "react";
import Header from "./header";
import Footer from "./footer";

interface IProps {
    hasSidebar?: boolean;
    hideFooter?: boolean;
    hideSearch?: boolean;
    hideHeader?: boolean;
    hideOverflow?: boolean;
    sidebarLayout?: 1 | 2;
}

const Layout: React.FC<IProps> = ({
    children,
    hasSidebar,
    hideFooter,
    hideSearch,
    hideHeader,
    sidebarLayout,
    hideOverflow,
}) => {
    return (
        <div style={{ overflowY: hideOverflow ? "hidden" : "" }}>
            {!hideHeader && (
                <Header
                    hasSearch={!hideSearch}
                    hasSidebar={hasSidebar}
                    sidebarLayout={sidebarLayout}
                />
            )}
            {children}
            {!hideFooter && <Footer />}
        </div>
    );
};

Layout.defaultProps = {
    hideFooter: false,
};

export default Layout;
