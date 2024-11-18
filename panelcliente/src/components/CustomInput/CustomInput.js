import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input, Button } from 'reactstrap';
import Cleave from 'cleave.js/react';

class CustomInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: !!props.value,
            showPassword: false,
        }
    }

    static propTypes = {
        label: PropTypes.string,
        type: PropTypes.string,
        onChange: PropTypes.func,
        value: PropTypes.string,
        autoFocus: PropTypes.bool,
        className: PropTypes.string,
    }

    static defaultProp = {
        value: '',
    }

    componentDidMount() {
        const { autoFocus } = this.props;

        if (autoFocus && this.input) {
            this.input.focus();
        }
    }

    /** Se ejecuta cuando se hace focus en el input */
    handleFocus = () => {
        const { focused } = this.state;
        if (!focused) this.setState({ focused: true });
    }

    /** Se ejecuta cuando se quita focus del input */
    handleBlur = () => {
        const { focused } = this.state;
        const { value } = this.props;
        if (focused && !value) this.setState({ focused: false });
    }

    /** Maneja el cambio de valor del input */
    handleChange = e => {
        e.persist();

        const { value } = e.target;
        const { onChange, type } = this.props;
        if (onChange) {
            let isValid = true;

            if (type === 'integer' && !/^\d*$/.test(value)) {
                isValid = false;
            } else if (type === 'float' && !/^\d*\.{0,1}\d*$/.test(value)) {
                isValid = false;
            }
            if (isValid) {
                onChange(value);
            }
        }
    }

    handleCleaveChange = e => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(e.target.rawValue);
        }
    }

    /** Se ejecuta cuando se presiona el ícono para mostrar contraseña */
    handlePressed = e => {
        e.preventDefault();
        this.setState(prevState => ({ showPassword: !prevState.showPassword }));
    };

    render() {
        const { label, type, value, disabled, className } = this.props;
        const { focused, showPassword } = this.state;

        const filteredType = ['integer', 'float'].includes(type) ? 'text' : type;
        return (
            <FormGroup className={`md-input ${className || ''}`}>
                <Label className="position-relative w-100">
                    <span className={`md-input__label ${(focused || disabled) ? 'md-input__label--active' : ''}`}>{label}</span>
                    {
                        type === 'dni' ?
                            <Cleave
                                value={value}
                                onInit={cleave => this.input = cleave.element}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                onChange={this.handleCleaveChange}
                                className="form-control"
                                disabled={disabled}
                                options={{
                                    numeral: true,
                                    numeralThousandsGroupStyle: 'thousand',
                                    numeralPositiveOnly: true,
                                    numeralDecimalMark: ',',
                                    delimiter: '.',
                                    numeralDecimalScale: 0,
                                    numeralIntegerScale: 8,
                                    stripLeadingZeroes: false,
                                }}
                            /> :
                            <Input
                                {...this.props}
                                innerRef={input => this.input = input}
                                value={value}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                onChange={e => this.handleChange(e)}
                                type={
                                    filteredType === 'password' ?
                                        (showPassword ? 'text' : 'password') :
                                        filteredType
                                }
                            />
                    }
                    {
                        type === 'password' &&
                        <Button
                            className="md-input__button"
                            onMouseDown={this.handlePressed}
                            onMouseUp={this.handlePressed}
                            onClick={e => e.preventDefault()}
                        >
                            <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-dark`}></i>
                        </Button>
                    }
                </Label>
            </FormGroup>
        );
    }
}

export default CustomInput;
