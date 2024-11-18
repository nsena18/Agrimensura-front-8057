import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Checkbox extends Component {

    static propTypes = {
        checked: PropTypes.bool.isRequired,
        onChange: PropTypes.func,
        onClick: PropTypes.func,
        className: PropTypes.string,
        disabled: PropTypes.bool,
    }

    handleChange = e => {
        e.preventDefault();
        const { checked, onChange, onClick, disabled } = this.props;
        if (!disabled) {
            if (onChange) onChange(!checked);
            if (onClick) onClick();
        }
    }

    render() {
        const { checked, label, className, disabled } = this.props;
        return (
            <label onClick={this.handleChange} className={`${className} ${disabled ? 'checkbox--disabled' : ''}`}>
                <button
                    type="button"
                    disabled={disabled}
                    className="checkbox__button mr-1"
                >
                    <i className={`fa fa-lg ${checked ? 'fa-check-square-o' : 'fa-square-o'}`}></i>
                </button>
                <input
                    disabled={disabled}
                    className="d-none"
                    type="checkbox"
                    checked={checked}
                    onChange={this.handleChange}
                />
                <span className="checkbox__label">{ label }</span>
            </label>
        );
    }
}

export default Checkbox;