import { formatDistanceStrict } from "date-fns";
import formatDistance from "date-fns/formatDistance";
import { FC } from "react";
import { Heart } from "react-feather";

interface IProps {
    healthscores: [any];
    score: string;
    lastUpdated: string;
}

const HealthScoreCard: FC<IProps> = ({ healthscores, score, lastUpdated }) => {
    const getColor = (_score: number) => {
        if (healthscores.length > 0 && _score >= 0 && _score <= 3.3333333333333333333333) {
            return "#ee5752";
        }
        if (_score >= 3.4 && _score <= 6.66666666666666666666) {
            return "#fcc752";
        }
        if (_score >= 6.7 && _score <= 10) {
            return "#0bc078";
        }
        return "rgb(209 209 209)";
    };

    const getScoreTag = (_score: number) => {
        if (healthscores.length > 0 && _score >= 0 && _score <= 3.3333333333333333333333) {
            return "Poor";
        }
        if (_score >= 3.4 && _score <= 6.66666666666666666666) {
            return "Concerning";
        }
        if (_score >= 6.7 && _score <= 10) {
            return "Healthy";
        }
        return "Unknown";
    };

    const getTimeAgo = () => {
        return formatDistanceStrict(new Date(lastUpdated), new Date(), {
            addSuffix: false,
        });
    };

    return (
        <div
            style={{
                display: "inline-flex",
                flexDirection: "column",
                alignContent: "center",
            }}
        >
            <div>
                <div
                    style={{
                        padding: "2px 8px",
                        background: getColor(parseFloat(score)),
                        borderRadius: "16px",
                        color: "white",
                        fontWeight: 500,
                        display: "inline-flex",
                        marginTop: "5px",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {score === "0" && healthscores.length === 0 ? "—" : parseFloat(score).toFixed(2)}
                    <Heart
                        style={{
                            marginLeft: "5px",
                        }}
                        size="12px"
                    />
                </div>
            </div>
            <div
                style={{
                    marginTop: "5px",
                    fontSize: "13px",
                }}
            >{
            healthscores.length > 0 ?
            `${getScoreTag(parseFloat(score))} for ${getTimeAgo()}` : "Unknown score"}</div>
        </div>
    );
};

export default HealthScoreCard;
