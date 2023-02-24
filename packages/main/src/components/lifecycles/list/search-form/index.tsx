import { Anchor } from "@doar/components";
import { useDebounce } from "@doar/shared/hooks";
import { FC, useEffect, useState } from "react";
import { Search, File, Plus } from "react-feather";
import {
    StyledForm,
    StyledInput,
    StyledButtonSearch,
    StyledButton,
} from "./style";

interface IProps {
    value?: string;
    onButtonPress?: (s: string) => any;
    onChange?: (s: string) => any;
}

const SearchForm: FC<IProps> = ({ value, onChange, onButtonPress }) => {
    const [currentValue, setCurrentValue] = useState(value);

    return (
        <StyledForm>
            <StyledButton size="sm" ml="10px" hasIcon onClick={onButtonPress}>
                <Plus />
                New lifecycle
            </StyledButton>
        </StyledForm>
    );
};

export default SearchForm;
