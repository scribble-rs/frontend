import { useEffect, useRef, useState } from 'preact/hooks';
import './multi.css';

export function MultiSelect(props) {
    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([...props.options]);
    const inputField = useRef(null);

    const filterAlreadySelected = (option) => {
        return !selectedOptions.includes(option);
    };
    const resetFilteredOptions = () => {
        setFilteredOptions([...props.options.filter(filterAlreadySelected)]);
    };

    useEffect(() => {
        resetFilteredOptions();
    }, [selectedOptions]);

    const onChange = (event) => {
        if (event.target.value === "") {
            resetFilteredOptions();
            return;
        }

        setFilteredOptions([...props.options.
            filter((option) => {
                return props.matchOption(option, event.target.value)
            }).
            filter(filterAlreadySelected)
        ]);
    };
    const selectOption = (option) => {
        setSelectedOptions([...selectedOptions, option]);
        inputField.current.value = "";
        setPopupVisible(false);
    };
    const submitOption = (event) => {
        if (event.key !== "Enter") {
            return;
        }

        // Prevent form submission
        event.preventDefault();

        if (filteredOptions.length === 0) {
            return;
        }

        // FIXME Matches should be sorted by accuracy and the most accurate
        // one should be chosen. There should be no extra code here.
        const matchingOption = filteredOptions.find((option) => props.matchOption(option, event.target.value));
        if (matchingOption) {
            setSelectedOptions([...selectedOptions, matchingOption]);
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
        <div class="multi-select-parent">
            <div class={(popupVisible ? "multi-select-popup-visible multi-select" : "multi-select")}>
                {selectedOptions.map((option) => {
                    return <div class="multi-select-option">
                        {props.renderOptionSimple(option)}
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
                            }}>
                            {props.renderOptionDetailed(option)}
                        </div>;
                    })}
                </div>)
            }
        </div>
    );
}