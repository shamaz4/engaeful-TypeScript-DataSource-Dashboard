import { FC } from "react";
import loginImage from "@doar/shared/images/img15.png";
import { Card } from "@doar/components";
import Logo from "src/components/logo";
import SigninForm from "../../components/signin-form";
import {
    StyledMedia,
    StyledMediaBody,
    StyledImage,
    StyledImgText,
    StyledSignin,
} from "./style";

const AuthContainer: FC = () => {
    return (
        <StyledMedia>
            <Card p="40px" mt="-60px">
                <Logo noLink />
                <StyledSignin>
                    <SigninForm />
                </StyledSignin>
            </Card>
        </StyledMedia>
    );
};

export default AuthContainer;
