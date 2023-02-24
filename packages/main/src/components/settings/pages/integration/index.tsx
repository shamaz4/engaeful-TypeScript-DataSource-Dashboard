/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { FC, useEffect, useState } from "react";
import {
    CardSubtitle,
    CardTitle,
    Spinner,
} from "@doar/components";
import { useAppSelector } from "src/redux/hooks";
import ReactTooltip from "react-tooltip";
import Pizzly from 'pizzly-js'
import { StyledButtonSave } from "./style";
import IntegrationCard from "./components/integrationCard";


const IntegrationSettings: FC = () => {
    const token: string = useAppSelector((state) => state.auth.accessToken);
    const websites: [] = useAppSelector((state) => state.auth.websites);
    const selectedWebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const pizzly = new Pizzly({ host: 'integrate.engageful.io' }) // Initialize Pizzly
    const [stripeintegrated, setstripeintegrated] = useState(false);
    const [slackintegrated, setslackintegrated] = useState(false);
    const [selectedWebsite, setselectedWebsite] = useState({});
    const [loading, setloading] = useState(true);

    useEffect(() => {
        const currentSelectedWebsite = websites.filter((w)=>w.id === selectedWebsiteId);
        if (currentSelectedWebsite.length > 0) {
            setselectedWebsite(currentSelectedWebsite[0])
            setloading(false)
            console.log(currentSelectedWebsite[0])
        }
    }, []);

    const authPizzly = (name) => {
        console.log(websites);
        return;
        const myAPI = pizzly.integration(name) // Replace with the API slugname
        myAPI
        .connect()
        .then(({ authId }) => console.log('Sucessfully connected!', authId))
        .catch(console.error)

    }

    return (
        <div style={{ minHeight: "200px" }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <div>
                    <CardTitle as="h5">Integrations</CardTitle>
                    <CardSubtitle>
                        Connect Engageful with your favorite tools
                    </CardSubtitle>
                </div>
                <div style={{ display: "none", marginLeft: "auto" }}>
                    <ReactTooltip place="top" effect="solid" />
                    <StyledButtonSave size="sm" ml="10px" onClick={false}>
                        Save changes
                    </StyledButtonSave>
                </div>
            </div>
            {loading ? (
                    <div
                        style={{
                            display: "flex",
                            alignContent: "center",
                            justifyContent: "center",
                            minHeight: "300px",
                            alignItems: "center",
                        }}
                    >
                        <Spinner color="primary" />
                    </div>
                ) : (
            <div style={{ margin: "40px 0px" }}>
                    <>
                        {/* <IntegrationCard 
                                                onClick={(e) => {
                                                    authPizzly("salesforce")
                                                }}
                        image="https://uploads.concordia.net/2021/05/09135648/Salesforce-square.png" 
                        name="Salesforce" description="Bidirectional sync for your Salesforce accounts, contacts, and activities." active={slackintegrated} />
                        <div style={{padding: "20px"}}/> */}
                        <IntegrationCard 
                        onClick={(e) => {
                            authPizzly("slack")
                        }}
                        image="https://a.slack-edge.com/80588/img/services/api_200.png"
                        name="Slack" description="Send automated messages to a Slack channel or person."  
                        active={selectedWebsite.integrations && selectedWebsite.integrations.filter((i) => i.name === "stripe" && i.enabled).length > 0} />
                        <div style={{padding: "20px"}}/>
                        <IntegrationCard 
                                                onClick={(e) => {
                                                    authPizzly("stripe")
                                                }}
                        image="https://media.glassdoor.com/sqll/671932/stripe-squarelogo-1610580619584.png" 
                        name="Stripe" description="Synchronize subscription data from Stripe." 
                        active={selectedWebsite.integrations && selectedWebsite.integrations.filter((i) => i.name === "slack" && i.enabled).length > 0} />
                        <div style={{padding: "20px"}}/>
                        <IntegrationCard 
                                                onClick={(e) => {
                                                    authPizzly("shopifyPartner")
                                                }}
                        image="https://i.pinimg.com/280x280_RS/fe/d0/8a/fed08a260ca78ba9e54c472b0471968b.jpg" 
                        name="Shopify Partner" description="Synchronize app installs, uninstalls, subscriptions and more from Shopify." 
                        active={selectedWebsite.integrations && selectedWebsite.integrations.filter((i) => i.name === "shopifyPartner" && i.enabled).length > 0} />
                    </>
            </div>
                )}
        </div>
    );
};

export default IntegrationSettings;
