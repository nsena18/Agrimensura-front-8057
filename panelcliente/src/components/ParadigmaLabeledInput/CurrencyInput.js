import React, { Component, Fragment } from 'react';
import Cleave from 'cleave.js/react';
import PropTypes from 'prop-types';

class CurrencyInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cantidadDecimales: 2,
            caracterDecimales: ',',
            caracterMiles: '.',

            cleave: null,
            loaded: false,
            value: 0
        }
    }

    static propTypes = {
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        onChange: PropTypes.func,
        className: PropTypes.string,
        disabled: PropTypes.bool
    }

    componentWillMount() {
        try {
            const config = JSON.parse(localStorage.configuraciones);
            this.setState({
                cantidadDecimales: config.cantidadDecimales,
                caracterDecimales: config.caracterDecimales,
                caracterMiles: config.caracterMiles,
                loaded: true
            });
        } catch(e) {
            this.setState({ loaded: true });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.value !== nextProps.value) {
            this.setState({ value: nextProps.value });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { value } = this.state;
        if (prevState.value !== value) {
            this.state.cleave.setRawValue(value);
        }
    }

    onInit = cleave => {
        this.setState({ cleave });
    }

    handleInputChange = e => {
        e.persist();
        const { value, rawValue } = e.target;

        const { onChange } = this.props;
        if (onChange) onChange(rawValue, value);
    }

    render() {
        const { cantidadDecimales, caracterDecimales, caracterMiles } = this.state;
        return (
            <Fragment>
            {
                this.state.loaded && 
                <Cleave
                    {...this.props}
                    disabled={this.props.disabled}
                    className={this.props.className || 'form-control monto w-100'}
                    options={{
                        numeral: true,
                        numeralDecimalMark: caracterDecimales,
                        delimiter: caracterMiles,
                        numeralDecimalScale: cantidadDecimales
                    }}
                    onInit={this.onInit}
                    onChange={this.handleInputChange}
                    onKeyPress={e => {
                        if (e.key === ',' || e.key === '.') {
                            e.target.value += caracterDecimales;
                        }
                    }}
                />
            }
            </Fragment>
        );
    }
}

export default CurrencyInput;