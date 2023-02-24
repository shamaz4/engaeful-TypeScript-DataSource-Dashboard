import { Anchor } from "@doar/components";
import { FC, useState } from "react";
import { Search, File } from "react-feather";
import {
    StyledForm,
    StyledInput,
    StyledButtonSearch,
    StyledButton,
} from "./style";

interface IProps {
    value: string;
    onChange: (s: string) => any;
}

const SearchForm: FC<IProps> = ({ value, onChange }) => {
    const [currentValue, setCurrentValue] = useState(value);
    return (
        <StyledForm>
            <StyledInput
                feedback="haha"
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                    setCurrentValue(e.currentTarget.value);
                    onChange(e.currentTarget.value);
                }}
                value={currentValue}
                id="chat-search"
                name="chat-search"
                placeholder="Search"
                autocomplete="turnoff"
            />
            <StyledButtonSearch type="submit" variant="texted">
                <Search />
            </StyledButtonSearch>
            <Anchor path="/campaigns/new">
                <StyledButton id="newCampaignButton" size="sm" ml="10px" hasIcon>
                    <File />
                    New campaign
                </StyledButton>
            </Anchor>
        </StyledForm>
    );
};

export default SearchForm;
