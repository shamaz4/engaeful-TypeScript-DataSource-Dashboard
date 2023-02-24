import { FC } from "react";
import { StyledLogo } from "./style";

interface IProps {
    noLink?: boolean;
}

const Logo: FC<IProps> = ({ noLink }) => {
    return (
        <StyledLogo 
        style={{marginTop: "3px"}}
        target="_self" path={noLink ? "/" : "/"}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.0"
                width="32px"
                height="32px"
                viewBox="0 0 3200 3200"
                preserveAspectRatio="xMidYMid meet"
                style={{
                    width: "32px",
                }}
            >
                <g
                    id="layer101"
                    fill="#000000"
                    stroke="none"
                    style={{
                        fill: "transparent",
                    }}
                >
                    <path d="M0 1600 l0 -1600 1600 0 1600 0 0 1600 0 1600 -1600 0 -1600 0 0 -1600z" />
                </g>
                <g id="layer102" fill="#7b6fd6" stroke="none">
                    <path d="M84 1958 c-15 -24 -8 -162 10 -218 62 -185 173 -297 405 -409 l96 -46 985 0 985 0 9 49 c17 97 -36 265 -115 363 -57 71 -156 141 -288 206 l-126 62 -977 3 c-755 2 -978 0 -984 -10z" />
                </g>
                <g id="layer103" fill="#9385fc" stroke="none">
                    <path d="M1109 2841 c-120 -50 -240 -124 -316 -195 -59 -55 -82 -85 -113 -150 -47 -98 -68 -202 -54 -272 l9 -49 975 0 975 0 95 44 c207 96 324 195 389 330 46 95 66 194 54 267 l-8 49 -970 2 -970 2 -66 -28z" />
                    <path d="M635 1020 c-14 -22 -17 -114 -5 -172 36 -188 159 -332 377 -441 166 -84 58 -77 1140 -77 907 0 962 1 967 17 24 83 7 194 -48 308 -58 121 -145 201 -312 288 -187 96 -70 87 -1156 87 -611 0 -959 -4 -963 -10z" />
                </g>
            </svg>
        </StyledLogo>
    );
};

export default Logo;
