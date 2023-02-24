/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { FC, useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardSubtitle,
    CardTitle,
    Col,
    Container,
    Modal,
    ModalBody,
    ModalClose,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    Row,
    Spinner,
} from "@doar/components";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { ApiUrl } from "@doar/shared/data";
import axios from "axios";
import { toast } from "react-toastify";
import Accordion from "src/components/accordion";
import { File, Mail, Plus, Sliders } from "react-feather";
import { PredicateGroup } from "src/components/predicates/predicategroup/PredicateGroup";
import { IDictionaryItem } from "src/components/campaign/interfaces";
import ReactTooltip from "react-tooltip";
import { defaultTypes } from "@doar/shared/data/api-keys";
import { InputSimple } from "src/components/commoncomponents/InputSimple";
import { size } from "@doar/shared";
import { SelectSimple } from "src/components/commoncomponents/SelectSimple";
import { addSenderProfile } from "src/redux/slices/email";
import { StyledButton, StyledButtonIcon, StyledButtonSave } from "./style";

const EmailSettings: FC = () => {
    const dispatch = useAppDispatch();
    const WebsiteId: string = useAppSelector((state) => state.auth.selectedWebsite);
    const token: string = useAppSelector((state) => state.auth.accessToken);
    const sendingProfiles = useAppSelector((state) => state.email.senderProfiles);
    const domains = useAppSelector((state) => state.email.emailDomains);

    const [domainNames, setdomainNames] = useState([]);    
    const [loading, setloading] = useState(false);
    
    // Modal settings
    const [showModal, setShowModal] = useState(false);
    const [newSenderName, setnewSenderName] = useState("");
    const [newSenderEmail, setnewSenderEmail] = useState("");
    const [newDomainName, setnewDomainName] = useState("mail.engageful.app");


    const toggleModal = () => {
        if (domainNames.length === 0) {
            alert("Add at least one validated domain to proceed");
        } else {
         setShowModal((prev) => !prev);
        }
    };
    
    const addSendingProfile = (payload) => {
        dispatch(addSenderProfile({
            senderProfile: {
                id: 2,
                sendFromEmail: {
                    name: payload.email,
                    domain: payload.domain,
                },
                sendFromName: payload.name,
                valid: true,
            }
        })) 
    }
    
    const getDomains = () => {
        const url = `${ApiUrl}/websites/${WebsiteId}/emailDomains`;
        axios
            .get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((d) => {
                const newDomains = [{
                    value: "mail.engageful.app",
                    name: "mail.engageful.app",
                }];
                const {emailDomains} = d.data;
                emailDomains.forEach((da) => {
                    if (da.status && da.status.dkim_status === "valid" && da.status.ownership_verified) {
                        newDomains.push({
                            value: da.domain,
                            name: da.domain}
                            );
                    }
                })
                setdomains(emailDomains);
                setdomainNames(newDomains);
                setloading(false);
            })
            .catch((error) => {
                console.log(error.response);
                toast.error("Unable to fetch health score data...");
            });
    };

    useEffect(() => {
        const newDomains = [{
            value: "mail.engageful.app",
            name: "mail.engageful.app",
        }]
        domains.forEach((da) => {
            if (da.status && da.status.dkim_status === "valid" && da.status.ownership_verified) {
                newDomains.push({
                    value: da.domain,
                    name: da.domain}
                    );
            }
        })
        setdomainNames(newDomains)
    }, [domains]);
    
    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <div>
                    <CardTitle as="h5">Custom domains</CardTitle>
                    <CardSubtitle>Verify custom addresses and authenticate their domains to improve your email delivery rates.</CardSubtitle>
                </div>
                <div style={{ display: "none", marginLeft: "auto" }}>
                    <ReactTooltip place="top" effect="solid" />
                    <StyledButtonSave size="sm" ml="10px">
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
                            minHeight: "100px",
                            alignItems: "center",
                        }}
                    >
                        <Spinner color="primary" />
                    </div>
                ) : (
            <>
            <div style={{ margin: "20px 0px" }}> 
            {domains.map((d) => {
                return (
            <Accordion key={d.dkim.signing_domain} active={false} subtitle="" header={
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Mail style={{color:"#c2bbfd", width: "16px", marginRight: "10px"}}/>
                <span style={{margin:"0px !important"}}>{d.dkim.signing_domain}</span>
                <span className="stamp live" style={{marginLeft: "10px"}}>{d.status.dkim_status}</span></div>}>
                <span>Please add a <b>DNS TXT</b> record to your domain using the values below.</span>
                <div style={{
                    marginTop: "40px",
                    marginBottom: "40px",
                }}>
                                        <div style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px"
                    }}>

                <span className="actioneditorlabel" style={{
                    fontweight: 500,
                    width: "104px"
                }}>Record type</span>
                <span style={{fontWeight: 500}}>TXT</span>
                </div>
                <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "20px"
                    }}>

                <span className="actioneditorlabel" style={{
                    fontweight: 500,
                    width: "120px"
                }}>Hostname</span>
                    <InputSimple
                        placeholder="Enter value"
                        width="100%"
                        value={`${d.dkim.selector}._domainkey.${d.dkim.signing_domain}`}
                        readOnly
                    />
                    </div>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>

                <span className="actioneditorlabel" style={{
                    fontweight: 500,
                    width: "120px"
                }}>Value</span>
                    <InputSimple
                        placeholder="Enter value"
                        width="100%"
                        value={`v=DKIM1; k=rsa; h=sha256; p=${d.dkim.public}`}
                        readOnly
                    />
                    </div>
                </div>
                <span >Once your domain is verified, we can start sending email from your address.</span> 
            </Accordion>
                )

            })}
            <p style={{fontStyle: "italic",  marginTop: "20px"}}>Need to add an additional domain? Please contact support.</p>
            </div>
            <hr style={{margin: "40px 0px"}}/>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <div>
                    <CardTitle as="h5">Sending profiles</CardTitle>
                    <CardSubtitle>Different profiles that you can send emails from.</CardSubtitle>
                </div>
                <div style={{ display: "", marginLeft: "auto" }}>
                    <ReactTooltip place="top" effect="solid" />
                    <StyledButtonIcon
                        data-tip="Add sending profile"
                        primary={false}
                        size="sm"
                        ml="10px"
                        onClick={toggleModal}
                    >
                        <Plus size="16px" />
                    </StyledButtonIcon>
                </div>
            </div>
                <div style={{ margin: "20px 0px" }}>
                    {sendingProfiles.length === 0 ? 
                    <>
                    <i>No sending profiles</i>
                    </>
                    : <table>
                        <tr>
                            <th style={{padding:"10px"}}>Avatar</th>
                            <th style={{padding:"10px"}}>Name</th>
                            <th style={{padding:"10px"}}>Email</th>
                            <th style={{padding:"10px"}}>Status</th>
                        </tr>
                        {sendingProfiles.map(((sp) => {
                            return (                        
                            <tr key={sp.id}
                            style={{
                        }}
                            >
                                <td style={{padding:"10px"}}><img style={{width:"24px", borderRadius:"50%"}} alt="avatar" src={sp.avatar} /></td>
                                <td style={{padding:"10px"}}>{sp.sendFromName}</td>
                                <td style={{padding:"10px"}}>{sp.sendFromEmail.name}@{sp.sendFromEmail.domain}</td>
                                <td style={{padding:"10px"}}>{sp.valid ? "active" : "inactive"}</td>
                            </tr>)
                        }))}
                    </table>}
                </div>
                </>
                )}
                <Modal
                show={showModal}
                onClose={toggleModal}
                size="md"
                centered
            >
                <ModalHeader>
                    <ModalTitle>Add custom address</ModalTitle>
                    <ModalClose onClose={toggleModal}>x</ModalClose>
                </ModalHeader>
                <ModalBody>
                    <p>
                        Enter an address from the domain you want to send emails from.
                    </p>
                    <div style={{
                    marginTop: "30px",
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "20px"
                    }}>

                <span className="actioneditorlabel" style={{
                    fontWeight: 500,
                    width: "120px"
                }}>Display name</span>
                    <InputSimple
                        placeholder="John Doe"
                        width="100%"
                        value={newSenderName}
                        onChange={(data) => {setnewSenderName(data)}}
                    />
                    </div>
                <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "20px"
                    }}>

                <span className="actioneditorlabel" style={{
                    fontWeight: 500,
                    width: "119px"
                }}>Email</span>
                <div style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "100%"
                }}>
                    <InputSimple
                        placeholder="john.doe"
                        width="100%"
                        value={newSenderEmail}
                        onChange={(data) => {setnewSenderEmail(data)}}
                    />
                    <span style={{margin: "0px 10px"}}>@</span>
                    <SelectSimple
                    style={{maxHeight:"40px"}}
                        placeholder="domain.com"
                        width="100%"
                        value={newDomainName}
                        values={domainNames}
                        onChange={(data) => {setnewDomainName(data)}}
                    />
                    
                    </div>

                </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleModal}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={() => {addSendingProfile({
                        email: newSenderEmail,
                        name: newSenderName,
                        domain: newDomainName,
                    })}}>Add sending profile</Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default EmailSettings;
