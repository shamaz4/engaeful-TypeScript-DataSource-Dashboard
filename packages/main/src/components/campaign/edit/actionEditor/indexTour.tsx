/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { FC, useState, useEffect, useReducer } from "react";
import Accordion from "src/components/accordion";
import "./engagefulComponentOverride.css";
import "./toureditor.css";
import PredicateSelector from "src/components/predicates/predicateselector/PredicateSelector";
import { SelectSimple } from "src/components/commoncomponents/SelectSimple";
import { v4 as uuidv4 } from "uuid";
import { InputSimple } from "src/components/commoncomponents/InputSimple";
import {
    StyledSidebar,
    StyledHeader,
    StyledBody,
    StyledButtonSave,
} from "./style";
import { useAppSelector } from "../../../../redux/hooks";
import { IDictionaryItem, INode, IPredicate } from "../../interfaces";
import ControlsManager from "./ControlsManager/ControlsManager";
import TourBlock from "./components/tourBlock";
import TourBlockAddNew from "./components/tourBlockAddNew";

interface IActionEditorTour {
    dictionary: Array<IDictionaryItem>;
    eventDictionary: Array<IDictionaryItem>;
    selectedNodeData: INode;
    onSave?: (e: any) => any;
    onCancel?: (e: any) => any;
}

const ActionEditorTour: FC<IActionEditorTour> = ({
    dictionary,
    eventDictionary,
    selectedNodeData = {
        config: "messagebox",
        goalPredicate: {
            value: [],
            attribute: null,
            additionalData: { inlineFilter: [] },
        },
        evaluationValues: {
            days: 0,
            hours: 1,
            minutes: 0,
        },
        evaluationTime: 3600,
        goalTimeConstraintDays: 259200,
        params: {
            show: true,
            accentColor: "#1e88ec",
            title: "New features!",
            body: "We are releasing our brand new editor this week!",
            position: "bottomLeft",
            videoUrl: "",
            action: "none",
            withLink: true,
            linkText: "Learn more →",
        },
    },
    onSave = () => {},
    onCancel = () => {},
}) => {
    const { sidebar } = useAppSelector((state) => state.ui);
    const [selectedNodeDataConfig, setSelectedNodeDataConfig] = useState(
        selectedNodeData.action.config
    );
    const [selectedNodeDataAction, setSelectedNodeDataAction] = useState(
        selectedNodeData.action.action
    );
    const [nodeName, setNodeName] = useState<string | any>(
        selectedNodeData.name
    );
    const [nodeGoal, setNodeGoal] = useState<IPredicate | any>(
        selectedNodeData.goalPredicate
            ? selectedNodeData.goalPredicate
            : {
                  value: [],
                  additionalData: { inlineFilter: { value: [] } },
              }
    );

    const [selectedEvaluationTime, setselectedEvaluationTime] = useState(selectedNodeData.evaluationTime);
    const [selectedEvaluationValues, setselectedEvaluationValues] = useState(
        selectedNodeData.evaluationValues
            ? selectedNodeData.evaluationValues
            : {
                  days: 0,
                  hours: 1,
                  minutes: 0,
              }
    );

    const [formattedNodeGoal, setFormattedNodeGoal] = useState<
        IPredicate | any
    >(null);
    const [nodeGoalTime, setNodeGoalTime] = useState<number | string | null>(
        selectedNodeData.goalTimeConstraintDays
            ? selectedNodeData.goalTimeConstraintDays
            : null
    );
    const [widgetInitialized, setWidgetInitialized] = useState(false);

    const [showControls, setshowControls] = useState(true);
    const [allCards, setallCards] = useState(
        selectedNodeData.action.config.cards
    );
    const [selectedCard, setselectedCard] = useState(
        selectedNodeData.action.config &&
            selectedNodeData.action.config.cards &&
            selectedNodeData.action.config.cards.length > 0
            ? selectedNodeData.action.config.cards[0]
            : null
    );

    const resetBoxStyles = (type) => {
        const diContainer = document.querySelector(".diContainer");
        if (type === "imageBox") {
            const targetImagebox = document.querySelector(
                ".diContainer .cardImage"
            );
            const targetTooltip = document.querySelector(
                ".diContainer .Engageful-Tooltip"
            );
            if (targetImagebox) {
                targetImagebox.style.display = "initial";
                // Resize diContainer
                if (targetImagebox.offsetHeight > 550) {
                    diContainer.style.height = `${(
                        targetImagebox.offsetHeight + 100
                    ).toString()}px`;
                } else {
                    diContainer.style.height = "initial";
                }
            }
            if (targetTooltip) {
                targetTooltip.style.display = "none";
            }
        } else if (type === "toolTip") {
                    diContainer.style.height = "initial";
            const targetImagebox = document.querySelector(
                ".diContainer .cardImage"
            );
            const targetTooltip = document.querySelector(
                ".diContainer .Engageful-Tooltip"
            );
            if (targetImagebox) {
                targetImagebox.style.display = "none";
            }
            if (targetTooltip) {
                targetTooltip.style.display = "initial";
            }
        }
    };

    const renderMessage = () => {
        const { EngagefulInternal } = window as any;
        if (EngagefulInternal && widgetInitialized) {
            if (allCards.length > 0 && selectedCard) {
                EngagefulInternal(selectedCard.messageType.toLowerCase(), {
                    ...selectedCard,
                    attachTo: "#engageful-attachTo",
                });
                resetBoxStyles(selectedCard.messageType);
            }
        }
    };

    const setallcardsaugment = (ac) => {
        const newArray = [];
        const currentCard = selectedCard;
        let newselected = selectedCard;
        ac.forEach((c: any, index: number) => {
            let nextAvailable = false;
            let previousAvailable = false;
            let skipAvailable = false;
            let doneAvailable = false;

            if (index < allCards.length - 1) {
                nextAvailable = true;
            }
            if (index !== 0) {
                previousAvailable = true;
            }

            skipAvailable = nextAvailable;
            doneAvailable = !nextAvailable;
            const card = {
                ...c,
                nextAvailable,
                previousAvailable,
                skipAvailable,
                doneAvailable
            };
            if (currentCard && card.id === currentCard.id) {
                newselected = card;
            }
            newArray.push(card)
        });
        setallCards(newArray);
        if (newselected) {
            setselectedCard(newselected);
        }
    }


    const formatGoalPredicate = () => {
        const sp = selectedNodeData.goalPredicate;
        if (sp) {
            if (sp.attribute && sp.attribute.includes("event:")) {
                const split = sp.attribute.split(":");
                setFormattedNodeGoal({
                    _id: sp._id,
                    value: sp.value,
                    type: split[0],
                    attribute: split[1],
                    comparison: `${split[2]}:${sp.comparison}`,
                    additionalData: sp.additionalData,
                });
            } else {
                setFormattedNodeGoal(nodeGoal);
            }
        } else {
            setFormattedNodeGoal(nodeGoal);
        }
    };

    const handleSaveChanges = () => {
        if (allCards.length === 0) {
            alert("You need at least one step in the tour to save.");
            return;
        }
        console.log({
            ...selectedNodeDataConfig,
            cards: allCards, 
            currentCard: allCards[0].id, 
            title: nodeName,
        });
        console.log(allCards);
        onSave({
            name: nodeName,
            nodeConfig: {
                ...selectedNodeDataConfig,
                cards: allCards, 
                currentCard: allCards[0].id, 
            },
            goalPredicate: formattedNodeGoal,
            goalTimeConstraintDays: nodeGoalTime,
            evaluationValues: selectedEvaluationValues,
            evaluationTime: selectedEvaluationTime
        });
    };


    const initializeEngageful = () => {
        const { EngagefulInternal } = window as any;
        EngagefulInternal("init_inline", {}, () => {
            setWidgetInitialized(true);
            renderMessage();
        });
        renderMessage();
    };

    useEffect(() => {
        renderMessage();
    }, [widgetInitialized, selectedCard]);

    const arrayMove = (arr, oldIndex, newIndex) => {
        if (newIndex >= arr.length) {
            let k = newIndex - arr.length + 1;
            // eslint-disable-next-line no-plusplus
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return arr;
    };

    const moveCard = (id, direction) => {
        let currentIndex = -1;
        allCards.forEach((b, i) => {
            if (b.id === id) {
                currentIndex = i;
            }
        });

        const tempArray = allCards;
        let newArray = null;

        if (direction === "left") {
            if (currentIndex === 0) {
                return;
            }
            newArray = arrayMove(tempArray, currentIndex, currentIndex - 1);
        } else if (direction === "right") {
            if (currentIndex === tempArray.length - 1) {
                return;
            }
            newArray = arrayMove(tempArray, currentIndex, currentIndex + 1);
        }
        setallcardsaugment(newArray);

    };

    const deleteCard = (id: string) => {
        const newCards = [];
        allCards.forEach((c) => {
            if (c.id !== id) {
                newCards.push(c);
            }
        });
        setallcardsaugment(newCards);
        const lastCard = newCards[newCards.length - 1];
        if (selectedCard.id === id && lastCard) {
            setselectedCard(lastCard);
        }
        if (newCards.length === 0) {
            setselectedCard(null);
        }
    };

    const updateCardInLocation = (newCard: any) => {
        const newCards = [];
        allCards.forEach((c) => {
            if (c.id === newCard.id) {
                newCards.push({
                    ...c,
                    ...newCard,
                });
            } else {
                newCards.push(c);
            }
        });
        setallcardsaugment(newCards);
    };

    const scrollTourBlockDiv = () => {
        const divElem = document.querySelector(".tourNavigationContainer");
        if (divElem) {
            divElem.scrollLeft = divElem.scrollWidth;
        }
    };

    const addNewCard = (type) => {
        const newCards = [...allCards];
        const newId = uuidv4();
        let newCard = {};
        switch (type) {
            case "modal":
                newCard = {
                    id: newId,
                    messageType: "imageBox",
                    show: true,
                    showModal: true,
                    accentColor: "#4B4B4B",
                    width: 550,
                    advanceOn: "navigation",
                    title: "Hello there!",
                    body:
                "Write your text, and remember that **markup** is supported.",
                    action: "none",
                    position: "centered",
                    videoUrl: "",
                    backgroundImage:
                        "https://i.imgur.com/NOoiFMt.png",
                    link: {
                        text: "Learn more →",
                        href: "",
                        newTab: true,
                        dismissOnClick: true,
                    },
                    buttons: [],
                    withLink: false,
                    noThanksButton: false,
                    showPoweredBy: true,
                };
                newCards.push(newCard);
                break;
            case "tooltip":
                newCard = {
                    id: newId,
                    messageType: "toolTip",
                    title:
                        "##### 💜 Invite team \nClick here to add your team members.",
                    position: "top",
                    accentColor: "#4b4b4b",
                    showModal: true,
                    show: true,
                    advanceOn: "navigation",
                    attachTo: "#n_l",
                    buttons: [],
                };
                newCards.push(newCard);
                break;
            default:
                break;
        }

        // Add next/prev buttons
        if (allCards.length === 0) {
            newCard = {
                ...newCard,
                nextAvailable: false,
                previousAvailable: false,
                skipAvailable: false,
                doneAvailable: true,
            };
        } else {
            newCard = {
                ...newCard,
                nextAvailable: false,
                previousAvailable: true,
                skipAvailable: false,
                doneAvailable: true,
            };
        }

        if (allCards.length === 0) {
            setselectedCard(newCard);
            setTimeout(() => {
                initializeEngageful();
            }, 250);
        }

        setallcardsaugment(newCards);
        setselectedCard(newCard);
        scrollTourBlockDiv();
    };

    const handleControlsManagerChange = (data: any) => {
        setselectedCard({
            ...selectedCard,
            ...data,
        });
        updateCardInLocation(data);
    };

    useEffect(() => {
        renderMessage();
    }, [allCards]);

    const handleGoalChange = (data: any) => {
        setFormattedNodeGoal(data);
        setNodeGoal(data);
    };

    useEffect(() => {
        formatGoalPredicate();
        if (allCards.length > 0) {
            initializeEngageful();
        }
    }, []);


    return (
        <StyledSidebar className="sidebar" $sidebar={sidebar}>
            <StyledHeader>
                <div>
                    <input
                        className="sideBarNodeNameInput"
                        type="text"
                        placeholder="Enter name..."
                        onChange={(d) => {
                            setNodeName(d.currentTarget.value);
                        }}
                        value={nodeName}
                    />
                </div>
                <div style={{ marginLeft: "auto" }}>
                    <StyledButtonSave
                        // onClick={onCancel}
                        onClick={() => {
                            renderMessage();
                        }}
                        primary={false}
                        size="sm"
                        ml="10px"
                    >
                        Cancel
                    </StyledButtonSave>
                </div>
                <div style={{}}>
                    <StyledButtonSave
                        onClick={handleSaveChanges}
                        size="sm"
                        ml="10px"
                    >
                        Save changes
                    </StyledButtonSave>
                </div>
            </StyledHeader>
            <StyledBody>
                <Accordion active header="Create your tour">
                    <div
                        className="tourNavigationContainer"
                        style={{
                            paddingBottom:
                                allCards.length === 0 ? "20px" : "40px",
                            marginBottom:
                                allCards.length === 0 ? "10px" : "10px",
                        }}
                    >
                        {allCards.map((c: any, index: number) => {
                            let nextAvailable = false;
                            let previousAvailable = false;
                            let skipAvailable = false;
                            let doneAvailable = false;

                            if (index < allCards.length - 1) {
                                nextAvailable = true;
                            }
                            if (index !== 0) {
                                previousAvailable = true;
                            }

                            skipAvailable = nextAvailable;
                            doneAvailable = !nextAvailable;

                            return (
                                <>
                                    <TourBlock
                                        active={selectedCard.id === c.id}
                                        c={{
                                            ...c
                                        }}
                                        totalLength={allCards.length}
                                        index={index}
                                        key={c.id}
                                        onDelete={() => {
                                            deleteCard(c.id);
                                        }}
                                        onChange={handleControlsManagerChange}
                                        onMove={moveCard}
                                        onClick={() => {
                                            resetBoxStyles(c.messageType);
                                            setselectedCard({
                                                ...c,
                                            });
                                        }}
                                    />
                                </>
                            );
                        })}
                        <TourBlockAddNew
                            onClick={(type) => {
                                addNewCard(type);
                            }}
                        />
                    </div>
                    {selectedCard ? (
                        <div style={{ display: "flex" }}>
                            <div
                                style={{
                                    width: "250px",
                                }}
                            >
                                {showControls ? (
                                    <>
                                        <ControlsManager
                                            update={false}
                                            isTour
                                            allCards={allCards}
                                            params={selectedCard}
                                            action={selectedCard.messageType.toLowerCase()}
                                            onChange={
                                                handleControlsManagerChange
                                            }
                                        />
                                    </>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div
                                className="diContainer"
                                style={{
                                    marginLeft: "auto",
                                    width: "780px",
                                    height:
                                        selectedCard.messageType.toLowerCase() ===
                                        "tooltip"
                                            ? "580px"
                                            : "",
                                }}
                            >
                                <div id="dashboard-inline" />
                                {selectedCard.messageType.toLowerCase() ===
                                "tooltip" ? (
                                    <div
                                        id="engageful-attachTo"
                                        className={selectedCard.position}
                                    />
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </Accordion>

                <div style={{ marginTop: "20px" }}>
                    <Accordion active={false} header="Goal">
                        <div style={{ marginBottom: "20px" }}>
                            Understand how your message drives people to take
                            action in your product.
                        </div>
                        {formattedNodeGoal ? (
                            <PredicateSelector
                                label="Add goal"
                                predicate={formattedNodeGoal}
                                keyIndex={0}
                                debug={false}
                                dictionary={dictionary}
                                eventDictionary={eventDictionary}
                                onChange={(predicate) => {
                                    handleGoalChange(predicate);
                                }}
                                onDelete={() => {}}
                            />
                        ) : (
                            <></>
                        )}
                        <div style={{ marginTop: "15px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <div style={{ marginRight: "10px" }}>
                                    Users have to match within:
                                </div>
                                <div>
                                    <SelectSimple
                                        padding="5px 10px"
                                        values={[
                                            { value: 86400, name: "1 day" },
                                            { value: 259200, name: "3 days" },
                                            { value: 604800, name: "7 days" },
                                            { value: 2592000, name: "30 days" },
                                        ]}
                                        value={nodeGoalTime}
                                        onChange={(data) => {
                                            setNodeGoalTime(data);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Accordion>
                </div>

                <div style={{ marginTop: "20px" }}>
                    <Accordion active={false} header="Wait">
                        <div style={{ marginBottom: "20px" }}>
                            Set how long to wait for a person to come online to
                            deliver this tour.
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <div>
                                    <InputSimple
                                        placeholder=""
                                        numeric
                                        centerText
                                        padding="2px"
                                        height="33px"
                                        width="60px"
                                        value={
                                            selectedEvaluationValues &&
                                            selectedEvaluationValues.days
                                                ? selectedEvaluationValues.days
                                                : 0
                                        }
                                        margin="0px 10px 0px 0px"
                                        onChange={(data) => {
                                            setselectedEvaluationValues({
                                                ...selectedEvaluationValues,
                                                days: parseFloat(data),
                                            });
                                        }}
                                    />
                                    day
                                    {selectedEvaluationValues &&
                                    selectedEvaluationValues.days > 1
                                        ? "s"
                                        : ""}
                                </div>
                                <div
                                    style={{
                                        marginLeft: "10px",
                                    }}
                                >
                                    <InputSimple
                                        placeholder=""
                                        numeric
                                        centerText
                                        padding="2px"
                                        height="33px"
                                        width="60px"
                                        value={
                                            selectedEvaluationValues &&
                                            selectedEvaluationValues.hours
                                                ? selectedEvaluationValues.hours
                                                : 0
                                        }
                                        margin="0px 10px 0px 0px"
                                        onChange={(data) => {
                                            console.log(data, parseFloat(data));
                                            setselectedEvaluationValues({
                                                ...selectedEvaluationValues,
                                                hours: parseFloat(data),
                                            });
                                        }}
                                    />
                                    hour
                                    {selectedEvaluationValues &&
                                    selectedEvaluationValues.hours > 1
                                        ? "s"
                                        : ""}
                                </div>
                                <div
                                    style={{
                                        marginLeft: "10px",
                                    }}
                                >
                                    <InputSimple
                                        placeholder=""
                                        numeric
                                        centerText
                                        padding="2px"
                                        height="33px"
                                        width="60px"
                                        value={
                                            selectedEvaluationValues &&
                                            selectedEvaluationValues.minutes
                                                ? selectedEvaluationValues.minutes
                                                : 0
                                        }
                                        margin="0px 10px 0px 0px"
                                        onChange={(data) => {
                                            setselectedEvaluationValues({
                                                ...selectedEvaluationValues,
                                                minutes: parseFloat(data),
                                            });
                                        }}
                                    />
                                    minute
                                    {selectedEvaluationValues &&
                                    selectedEvaluationValues.minutes > 1
                                        ? "s"
                                        : ""}
                                </div>
                            </div>
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            If the person still hasn’t come online after{" "}
                            {selectedEvaluationValues.days && selectedEvaluationValues.days > 0? (
                                ` ${selectedEvaluationValues.days}d`
                            ) : (
                                <></>
                            )}
                            {selectedEvaluationValues.hours && selectedEvaluationValues.hours > 0? (
                                ` ${selectedEvaluationValues.hours}h`
                            ) : (
                                <></>
                            )}
                            {selectedEvaluationValues.minutes && selectedEvaluationValues.minutes > 0? (
                                ` ${selectedEvaluationValues.minutes}m`
                            ) : (
                                <></>
                            )}
                            , they will leave this path.
                        </div>
                    </Accordion>
                </div>
            </StyledBody>
        </StyledSidebar>
    );
};

export default ActionEditorTour;
