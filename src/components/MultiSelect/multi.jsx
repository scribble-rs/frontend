import { useEffect, useRef, useState } from 'preact/hooks';
import './multi.css';

export function MultiSelect(props) {
    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const options = ["abc", "def", "ghi", "jkl", "mno", "pqr", "stu", "vwx", "yz"];
    const [filteredOptions, setFilteredOptions] = useState([...options]);

    const inputField = useRef(null);
    const filterDupes = (option) => {
        return !selectedOptions.includes(option);
    };
    const resetFilteredOptions = () => {
        setFilteredOptions([...options.filter(filterDupes)]);
    };

    useEffect(() => {
        resetFilteredOptions();
    }, [selectedOptions]);

    const onChange = (event) => {
        if (event.target.value === "") {
            resetFilteredOptions();
            return;
        }

        setFilteredOptions([...options.
            filter((option) => {
                return option.includes(event.target.value)
            }).
            filter(filterDupes)
        ]);
    };
    const selectOption = (option) => {
        setSelectedOptions([...selectedOptions, option]);
        inputField.current.value = "";
        setPopupVisible(false);
    };
    const submitOption = (event) => {
        // Only submit on enter or space
        if (event.keyCode !== 13 && event.keyCode !== 32) {
            return;
        }

        // Prevent form submission
        event.preventDefault();

        if (filteredOptions.length === 0) {
            return;
        }

        if (filteredOptions.includes(event.target.value)) {
            setSelectedOptions([...selectedOptions, event.target.value]);
        } else {
            setSelectedOptions([...selectedOptions, filteredOptions[0]]);
        }

        inputField.current.value = "";
    };

    const inputFocusGained = () => {
        setPopupVisible(true);
    };

    const inputFocusLost = (event) => {
        const classList = event.explicitOriginalTarget.classList;
        if (!classList || (
            !classList.contains("multi-select-popup-option")
            && !classList.contains("multi-select-option-remove"))) {
            setPopupVisible(false);
        }
    };

    return (
        <div>
            <div class={(popupVisible ? "multi-select-popup-visible multi-select" : "multi-select")}>
                {selectedOptions.map((option) => {
                    return <div class="multi-select-option">
                        <span>{option}</span>
                        <span class="multi-select-option-remove" onClick={() => {
                            setSelectedOptions([...selectedOptions.filter((selectedOption) => {
                                return selectedOption !== option;
                            })]);
                            inputField.current.focus();
                        }}>x</span>
                    </div>;
                })}
                <input
                    class="multi-select-input"
                    ref={inputField}
                    onInput={onChange}
                    onfocusin={inputFocusGained}
                    onfocusout={inputFocusLost}
                    type="text"
                    placeholder={props.placeholder}
                    onKeyPress={submitOption} />
            </div>
            {
                popupVisible &&
                (<div class="multi-select-popup">
                    {filteredOptions.map((option) => {
                        return <div
                            class="multi-select-popup-option"
                            onClick={(event) => {
                                event.preventDefault();
                                selectOption(option);
                            }}>{option}</div>;
                    })}
                </div>)
            }
        </div >
    );
}