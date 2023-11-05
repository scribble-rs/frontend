import { useRef, useState } from 'preact/hooks';
import "./number.css"

export function NumberInput(props) {
    const input = useRef(null);
    const stepDown = () => input.current && input.current.stepDown();
    const stepUp = () => input.current && input.current.stepUp();
    const [value, setValue] = useState(props.value);

    return (
        <div class="number-input">
            <button class="number-decrement" onClick={stepDown} type="button">-</button>
            <input size={4} ref={input} type="number" name={props.name}
                min={props.min} max={props.max} value={value} onChange={
                    (event) => {
                        setValue(event.currentTarget.value);
                    }} />
            <button class="number-increment" onClick={stepUp} type="button">+</button>
        </div >
    )
}
