import { Anchor } from "@doar/components";
import { useDebounce } from "@doar/shared/hooks";
import { FC, useEffect, useState } from "react";
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
    const debouncedValue = useDebounce<string>(currentValue, 500);

    useEffect(() => {
        onChange(debouncedValue);
    }, [debouncedValue]);

    return (
        <StyledForm>
            <StyledInput
                feedback="haha"
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                    setCurrentValue(e.currentTarget.value);
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
        </StyledForm>
    );
};

export default SearchForm;
