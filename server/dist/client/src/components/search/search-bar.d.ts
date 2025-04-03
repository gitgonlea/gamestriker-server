interface SearchBarProps {
    initialSelectedValue?: string;
    initialSearchValue?: string;
    isVariable?: string;
    onVariableChange?: (value: string) => void;
    onSearch?: (value: string, type: string) => void;
}
export default function SearchBar({ initialSelectedValue, initialSearchValue, isVariable, onVariableChange, onSearch, }: SearchBarProps): import("react").JSX.Element;
export {};
