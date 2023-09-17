import { useRef, useState } from 'preact/hooks';
import './multi.css';

export function MultiSelect(props) {
    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const options = ["abc", "def", "ghi", "jkl", "mno", "pqr", "stu", "vwx", "yz"];
    const [filteredOptions, setFilteredOptions] = useState([...options]);

    const inputField = useRef(null);

    const onChange = (event) => {
        if (event.target.value === "") {
            setFilteredOptions([...options]);
            return;
        }

        setFilteredOptions([...options.filter((option) => {
            return option.includes(event.target.value)
        })]);
    };
    const submitOption = (event) => {
        // Only submit on enter or space
        if (event.keyCode !== 13 && event.keyCode !== 32) {
            return;
        }

        // Prevent form submission
        event.preventDefault();

        // Only if the input is not empty
        if (options.includes(event.target.value)) {
            setSelectedOptions([...selectedOptions, event.target.value]);
            inputField.current.value = "";
        }
    };

    const showPopup = () => {
        setPopupVisible(true);
    };

    const hidePopup = () => {
        setPopupVisible(false);
    };

    return (
        <div>
            <div class="multi-select">
                {selectedOptions.map((option) => {
                    return <span class="multi-select-option">{option}</span>;
                })}
                <input
                    ref={inputField}
                    onInput={onChange}
                    onfocusin={showPopup}
                    onfocusout={hidePopup}
                    type="text"
                    onKeyPress={submitOption} />
            </div>
            {popupVisible &&
                (<div class="multi-select-popup">
                    {filteredOptions.map((option) => {
                        return <span>{option}</span>;
                    })}
                </div>)
            }
        </div>
    );
}