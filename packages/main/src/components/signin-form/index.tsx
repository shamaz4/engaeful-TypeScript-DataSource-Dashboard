/* eslint-disable jsx-a11y/tabindex-no-positive */
import { useEffect, FC } from "react";
import { FormGroup, Label, Input, Anchor, Button } from "@doar/components";
import { useForm } from "react-hook-form";
import { hasKey } from "@doar/shared/methods";
import { ApiUrl } from "@doar/shared/data/api-keys";
import axios from "axios";
import { useAppDispatch } from "src/redux/hooks";
import { setAuthenticated } from "src/redux/slices/auth";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { addEmailDomain, addSenderProfile, resetEmailState } from "src/redux/slices/email";
import {
    StyledWrap,
    StyledTitle,
    StyledDesc,
    StyledLabelWrap,
    StyledDivider,
    StyledBottomText,
} from "./style";

interface IFormValues {
    email: string;
    password: string;
}

interface IAuthResponse {
    tokens: {
        access: {
            expires: string;
        };
    };
}

const SigninForm: FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const dispatch = useAppDispatch();
    const history = useHistory();

    const onSubmit = (inputData: IFormValues) => {
        axios
            .post(`${ApiUrl}/auth/login`, {
                email: inputData.email,
                password: inputData.password,
            })
            .then((response) => {
                const { data } = response;
                if (data.user) {
                    dispatch(
                        setAuthenticated({
                            authenticated: true,
                            userObject: data.user,
                            websites: data.websites,
                            accessToken: data.tokens.access.token,
                            refreshToken: data.tokens.refresh.token,
                            accessTokenExpires: new Date(
                                data.tokens.access.expires
                            ),
                            refreshTokenExpires: new Date(
                                data.tokens.refresh.expires
                            ),
                        })
                    );
                    dispatch(resetEmailState());
                    if (data.websites[0].senderProfiles) {
                        data.websites[0].senderProfiles.forEach(sp => {
                            dispatch(addSenderProfile({
                                senderProfile: sp
                            }));
                        })
                    }
                    if (data.websites[0].emailDomains) {
                        data.websites[0].emailDomains.forEach(ed => {
                            dispatch(addEmailDomain({
                                emailDomain: ed
                            }));
                        })
                    }
                    localStorage.setItem(
                        "accessToken",
                        data.tokens.access.token
                    );
                    localStorage.setItem(
                        "refreshToken",
                        data.tokens.refresh.token
                    );
                    localStorage.setItem(
                        "accessTokenExpires",
                        data.tokens.access.expires
                    );
                    localStorage.setItem(
                        "refreshTokenExpires",
                        data.tokens.refresh.expires
                    );
                    history.replace("/");
                } else {
                    alert("Invalid log in!");
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    switch (error.response.status) {
                        case 401:
                            toast.error(error.response.data.message);
                            break;
                        default:
                            toast.error(
                                "Unknown error, please try again later."
                            );
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                            console.log("The fk? 2");
                    toast.error("Unknown error, please try again later.");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    toast.error("Unknown error, please try again later.");
                }
            });
    };
    return (
        <StyledWrap>
            <StyledTitle>Welcome back!</StyledTitle>
            <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormGroup mb="20px">
                    <Label display="block" mb="5px" htmlFor="email">
                        Email address
                    </Label>
                    <Input
                        tabIndex={0}
                        type="email"
                        id="email"
                        placeholder="yourname@yourmail.com"
                        feedbackText={errors?.email?.message}
                        state={hasKey(errors, "email") ? "error" : "success"}
                        showState={!!hasKey(errors, "email")}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "invalid email address",
                            },
                        })}
                    />
                </FormGroup>
                <FormGroup mb="20px">
                    <StyledLabelWrap>
                        <Label display="block" mb="5px" htmlFor="password">
                            Password
                        </Label>
                        {/* <Anchor tabIndex={-1} path="/forgot-password" fontSize="13px">
                            Forgot password?
                        </Anchor> */}
                    </StyledLabelWrap>
                    <Input
                        tabIndex={0}
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        feedbackText={errors?.password?.message}
                        state={hasKey(errors, "password") ? "error" : "success"}
                        showState={!!hasKey(errors, "password")}
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Minimum length is 6",
                            },
                        })}
                    />
                </FormGroup>
                <Button type="submit" color="primary" fullwidth>
                    Sign In
                </Button>
                {false && (
                    <>
                        <StyledDivider>or</StyledDivider>
                        <Button variant="outlined" color="facebook" fullwidth>
                            Sign In With Facebook
                        </Button>
                        <Button
                            variant="outlined"
                            color="twitter"
                            mt="0.5rem"
                            fullwidth
                        >
                            Sign In With Twitter
                        </Button>
                    </>
                )}
                {/* <StyledBottomText>
                    Don&apos;t have an account?{" "}
                    <Anchor path="/signup">Create an Account</Anchor>
                </StyledBottomText> */}
                <StyledBottomText>
                    <Anchor target="_self" path="https://www.engageful.io">Return to homepage</Anchor>
                </StyledBottomText>
            </form>
        </StyledWrap>
    );
};

export default SigninForm;
