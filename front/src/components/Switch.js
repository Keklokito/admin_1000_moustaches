import React from "react";

const Switch = ({ isOn, handleToggle, disabled }) => {
    return (
        <>
            <input
                disabled={disabled}
                checked={isOn}
                onChange={handleToggle}
                className="react-switch-checkbox"
                id={`react-switch-new`}
                type="checkbox"
            />
            <label
                style={{ background: isOn ? "#06D6A0" : "grey" }}
                className="react-switch-label"
                htmlFor={`react-switch-new`}
            >
                <span className={`react-switch-button`} />
            </label>
        </>
    );
};

export default Switch;
