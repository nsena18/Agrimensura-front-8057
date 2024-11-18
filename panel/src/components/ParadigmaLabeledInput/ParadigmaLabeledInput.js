import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Input, Row, Col, FormFeedback, Label } from 'reactstrap';

import ArrayLengthOf from "../../Paradigma/PropValidators/arrays";
import CurrencyInput from "./CurrencyInput.js";
import ParadigmaAsyncSeeker from '../ParadigmaAsyncSeeker/ParadigmaAsyncSeeker';


class ParadigmaLabeledInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value,
			error: null,
		};
	}

	static propTypes = {
		onChange: PropTypes.func,
		onExternalChange: PropTypes.func,

		type: PropTypes.string,
		value: PropTypes.any,
		label: PropTypes.string,
		inputComponent: PropTypes.any,

		disabled: PropTypes.bool,
		rows: PropTypes.number,

		error: PropTypes.any,

		classNames: PropTypes.arrayOf(PropTypes.string),

		xs: PropTypes.arrayOf(ArrayLengthOf(2)),
		sm: PropTypes.arrayOf(ArrayLengthOf(2)),
		md: PropTypes.arrayOf(ArrayLengthOf(2)),
		lg: PropTypes.arrayOf(ArrayLengthOf(2)),
		xl: PropTypes.arrayOf(ArrayLengthOf(2)),

		maxLength: PropTypes.number
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.value != nextProps.value || this.props.error != nextProps.error) {
			this.setState({ value: nextProps.value, error: nextProps.error });
		}
	}

	getError() {
		let error = this.state.error;
		if (typeof (error) == 'function') error = error();
		if (error) {
			return error.map(x => x.detail).join(' ');
		} else {
			return null;
		}
	}

	hangleInputChange = e => {
		e.persist();
		const { value } = e.target;
		const { type, onChange } = this.props;

		let isValid = true;

		if (type === 'integer' && !/^\d*$/.test(value)) {
			isValid = false;
		} else if (type === 'float' && !/^\d*\.{0,1}\d*$/.test(value)) {
			isValid = false;
		}

		if (isValid) {
			this.setState({ value });
			if (onChange) onChange(e);
		}
	}
	// Lista de propiedades válidas de asyncseeker
	asyncSeekerProps = [
		'label',
		'onExternalChange',
		'disabled',
		'url',
		'displayField',
		'valueField',
		'autoFocus',
		'clearable',
		'CreateComponent',
		'DetailComponent',
		'valueRenderer',
		'optionRenderer',
		'multiselect',
	]

	// Filtra las propiedades
	filterProps = allowed => {
		const { props } = this;

		const filtered = Object.keys(props)
			.filter(key => allowed.includes(key))
			.reduce((obj, key) => {
				obj[key] = props[key];
				return obj;
			}, {});

		return filtered;
	}

	// Permite preservar el estado del asyncseeker en este componente
	handleAsyncSeekerChange = data => {
		const { multiselect, valueField, onChange } = this.props;
		if (multiselect) {
			this.setState({ value: data ? data.map(elem => elem[valueField || 'id']) : null });
		} else {
			this.setState({ value: data ? data[valueField || 'id'] : null });
		}
		if (onChange) onChange(data);
	}

	render() {
		const { xs, sm, md, lg, xl, rows, type, inputComponent, disabled, onChange, label, maxLength, classNames } = this.props;
		const { value } = this.state;
		var drawInputComponent;

		if (type == "currency") {
			drawInputComponent = <CurrencyInput
				value={value}
				onChange={value => { this.setState({ value }); if (onChange) { onChange(value); } }}
				disabled={disabled}
			/>
		} else if (type === 'asyncSeeker') {
			drawInputComponent = <ParadigmaAsyncSeeker
				{...this.filterProps(this.asyncSeekerProps)}
				value={value ? value : null}
				onChange={this.handleAsyncSeekerChange}
			/>
		} else {
			drawInputComponent = <Input
				maxLength={maxLength}
				invalid={(error ? true : false)}
				value={(value ? value : "")}
				checked={(type === 'checkbox') ? value : null}
				disabled={disabled}
				type={(type ? type : "text")}
				rows={rows ? rows : null}
				onChange={this.hangleInputChange}
				onFocus={(e) => this.props.onFocus ? this.props.onFocus(e) : null}
				onBlur={(e) => this.props.onBlur ? this.props.onBlur(e) : null}
			></Input>;
		}
		if (inputComponent) drawInputComponent = inputComponent;

		let error = this.getError();

		return (
			<Row className="mt-sm-1">
				{
					label &&
					<Col className={classNames && classNames.length > 0 ? classNames[0] : null} xs={(xs ? xs[0] : 12)} sm={(sm ? sm[0] : null)} md={(md ? md[0] : null)} lg={(lg ? lg[0] : null)} xl={(xl ? xl[0] : null)}>
						<Label>{label}</Label>
					</Col>
				}
				<Col className={classNames && classNames.length > 1 ? classNames[1] : null} xs={(xs ? xs[1] : 12)} sm={(sm ? sm[1] : null)} md={(md ? md[1] : null)} lg={(lg ? lg[1] : null)} xl={(xl ? xl[1] : null)}>
					{drawInputComponent}
					<FormFeedback className={(error ? "d-block" : "")}>{error}</FormFeedback>
				</Col>
			</Row>
		);
	}
};

module.exports = ParadigmaLabeledInput;