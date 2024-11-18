import React, { Component, Fragment } from 'react';
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import currency from 'currency.js';
import PropTypes from 'prop-types';

class ParadigmaCurrencyInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posicion:0, //posicionar el puntero en onChange (0: no hace nada, 1: lo posiciona al final, 2: lo posiciona a la derecha del simbolo decimal)
        }
    }

    static propTypes = {
        maskOptions : PropTypes.object, /** Objeto de configuracion mascara {prefix, suffix, includeThousandsSeparator, thousandsSeparatorSymbol, allowDecimal, 
                                                                            decimalSymbol, decimalLimit, integerLimit, allowNegative, allowLeadingZeroes}*/
        dobleSimboloDecimal: PropTypes.bool, /** Habilita que se pueda ingresar decimales tanto con la , como con el . (default false) */
        selectOnFocus: PropTypes.bool, /** Auto select al seleccionar input (defualt false) */
        onBlurComplete: PropTypes.bool, /** Completar con 2 decimales al sacar el focus del input (default false) */
    }

    handleInputChange = e => {
        const { posicion } = this.state;
        const { onChange, maskOptions, value } = this.props;
        e.persist();
        var valueChange =  e.target.value;
        if (onChange) {
            if(posicion==1){ //En caso de insertar el symbolo de separacion de decimales posiciono el puntero al final del input
                e.target.setSelectionRange(valueChange.length, valueChange.length);
            }else if(posicion==2){ //Si ya estaba ingresado un symbolo de decimales en el value lo posiciono a la derecha del mismo
                let decimal= (maskOptions && maskOptions.decimalSymbol!=undefined) ? (maskOptions.decimalSymbol) : (',');
                let posicionDecimal = value.indexOf(decimal)+1;
                e.target.setSelectionRange(posicionDecimal, posicionDecimal);
            }else{
                if(valueChange==value){
                    e.target.setSelectionRange(e.target.selectionStart+1, e.target.selectionStart+1); //Si ingresa un numero repetido en decimales corre el puntero una posicion para simular que sobre escribe
                }
                onChange(valueChange ? valueChange : '0');
            }
            this.setState({posicion: 0});
        }
    }

    onBlur = (e) => { // AutoCompletar con 2 decimales al quitar focus del input
        const { maskOptions } = this.props;
        let value = e.target.value;

        let includeThousandsSeparator = (maskOptions && maskOptions.includeThousandsSeparator!=undefined) ? (maskOptions.includeThousandsSeparator) : (false);
        let thousandsSeparatorSymbol = (maskOptions && maskOptions.thousandsSeparatorSymbol!=undefined) ? (maskOptions.thousandsSeparatorSymbol) : ('.');
        let allowDecimal = (maskOptions && maskOptions.allowDecimal!=undefined) ? (maskOptions.allowDecimal) : (true);

        if(allowDecimal){
            let formattedNum = currency(value, {
                separator: (includeThousandsSeparator) ? (thousandsSeparatorSymbol) : '',
                decimal: (maskOptions && maskOptions.decimalSymbol!=undefined) ? (maskOptions.decimalSymbol) : (','),
                precision: (maskOptions && maskOptions.decimalLimit!=undefined) ? (maskOptions.decimalLimit) : (2),
            });
            formattedNum = formattedNum.format();
            const { onChange } = this.props;
            if (onChange) {
                onChange(formattedNum);
            }
        }
    }

    /**Funcion para usar tanto el . como la , para ingresar los decimales y posicionar el puntero a la derecha del symbolo de decimales*/
    handleKeyPress = (event) => { 
        const { maskOptions } = this.props;
        if(event.key === '.' || event.key === ','){
            const { onChange, value } = this.props;
            if (onChange) {
                let decimal= (maskOptions && maskOptions.decimalSymbol!=undefined) ? (maskOptions.decimalSymbol) : (',');
                if(value.includes(decimal)){ //Si ya existe el simbolo decimal en el value posiciono el caracter a la derecha del mismo
                    onChange(value);
                    this.setState({posicion: 2});
                }else{ //Si no existe el simbolo lo agrego
                    if(value!=''){
                        onChange(value+decimal);
                    }else{
                        onChange('0'+decimal);
                    }
                    this.setState({posicion: 1}); //Uso el estado posicion para posicionar el puntero en la funcion onChange
                }
            }
        }
    }

    render() {
        const { maskOptions, dobleSimboloDecimal, selectOnFocus, onBlurComplete } = this.props;
        let defaultMaskOptions = {
                                    prefix: (maskOptions && maskOptions.prefix!=undefined) ? (maskOptions.prefix) : (''), //Prefijo al value
                                    suffix: (maskOptions && maskOptions.suffix!=undefined) ? (maskOptions.suffix) : (''), //Sufijo al value
                                    includeThousandsSeparator: (maskOptions && maskOptions.includeThousandsSeparator!=undefined) ? (maskOptions.includeThousandsSeparator) : (false), //Si es true se asigna separacion entre miles
                                    thousandsSeparatorSymbol: (maskOptions && maskOptions.thousandsSeparatorSymbol!=undefined) ? (maskOptions.thousandsSeparatorSymbol) : ('.'), //Symbolo de separacion de miles (defecto '.')
                                    allowDecimal: (maskOptions && maskOptions.allowDecimal!=undefined) ? (maskOptions.allowDecimal) : (true), //Permite ingresar decimales (defecto true)
                                    decimalSymbol: (maskOptions && maskOptions.decimalSymbol!=undefined) ? (maskOptions.decimalSymbol) : (','), //Symbolo de separacion de decimales (defecto ',')
                                    decimalLimit: (maskOptions && maskOptions.decimalLimit!=undefined) ? (maskOptions.decimalLimit) : (2), // Cantidad de decimales que se aceptan (defecto 2)
                                    integerLimit: (maskOptions && maskOptions.integerLimit!=undefined) ? (maskOptions.integerLimit) : (15), // Cantidad de digitos que se pueden ingresar sin contar los decimales (defecto 15)
                                    allowNegative: (maskOptions && maskOptions.allowNegative!=undefined) ? (maskOptions.allowNegative) : (false), //Si acepta negativos (defecto false)
                                    allowLeadingZeroes: (maskOptions && maskOptions.allowLeadingZeroes!=undefined) ? (maskOptions.allowLeadingZeroes) : (false), //Si permite 0 a la izquierda (defecto false)
                                }
        const currencyMask = createNumberMask(defaultMaskOptions);
        return (
            <MaskedInput
                placeholder={(defaultMaskOptions.allowDecimal) ? (('0'+defaultMaskOptions.decimalSymbol).padEnd(defaultMaskOptions.decimalLimit+2, '0')) : ('0')} 
                {...this.props}
                mask={currencyMask}
                onFocus={(e) => { if(selectOnFocus) e.target.select(); if(this.props.onFocus) this.props.onFocus(e);} }
                onBlur={(e) => { if(onBlurComplete) this.onBlur(e); if(this.props.onBlur) this.props.onBlur(e);} }
                onChange={this.handleInputChange}
                onKeyPress={(e) => { if(dobleSimboloDecimal) this.handleKeyPress(e); if(this.props.onKeyPress) this.props.onKeyPress(e);} }
                className={(this.props.className) ? ('form-control '+this.props.className) : ('form-control')}
            />
        );
    }
}

export default ParadigmaCurrencyInput;