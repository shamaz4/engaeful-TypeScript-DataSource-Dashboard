/* eslint-disable import/extensions */
import PredicateDisplay from "./PredicateDisplay.jsx";

export default function PredicateDisplayGroup({
    _predicates = [],
    _predicatersOperator = "and",
}) {
    let empty = true;
    _predicates.forEach((p) => {
        if (p.attribute) {
            empty = false;
        }
    });
    if (empty) {
        return "Empty rules";
    }
    switch (_predicates.length) {
        case undefined:
        case 0:
            return "Empty rules";
        case 1:
            return <PredicateDisplay _predicate={_predicates[0]} />;
        case 2:
            return (
                <>
                    <PredicateDisplay _predicate={_predicates[0]} /> <br />
                    <span className="predicateGroupOperator">
                        {_predicatersOperator}
                    </span>
                    <br />
                    <PredicateDisplay _predicate={_predicates[1]} />
                </>
            );
        default:
            return (
                <>
                    <PredicateDisplay _predicate={_predicates[0]} />{" "}
                    <span className="predicateGroupOperator">
                        {_predicatersOperator}
                    </span>
                    &nbsp;
                    <PredicateDisplay _predicate={_predicates[1]} />{" "}
                    <span className="predicateGroupOperator">
                        {_predicatersOperator}
                    </span>
                    &nbsp;
                    <u>
                        {_predicates.length - 2} other rule
                        {_predicates.length - 2 === 1 ? "" : "s"}
                    </u>
                </>
            );
    }
}
