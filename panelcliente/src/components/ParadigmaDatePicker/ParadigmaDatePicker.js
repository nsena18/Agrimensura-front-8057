import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Input, InputGroup, InputGroupAddon, Row, Col, FormFeedback, Label } from 'reactstrap';
import InputMask from 'react-input-mask';
import Datetime from 'react-datetime';
import moment from 'moment';
import 'moment/locale/es';

import './styles.scss';
import './react-datetime.css';

class ParadigmaDatePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fecha: this.props.value,
			isOpen: false
		};
	}

	static propTypes = {
		onChange: PropTypes.func,
		disabled: PropTypes.bool,
		fieldName: PropTypes.string,
		datetime: PropTypes.bool,
		className: PropTypes.string,
		value: PropTypes.any,
		placeholder: PropTypes.string,
		showIcon: PropTypes.bool,
		icon: PropTypes.string,
		rtl: PropTypes.bool,
		isValidDate: PropTypes.func,

		clearable: PropTypes.bool,
	}

	onChange(fecha) {
		if (moment.isMoment(fecha)) {
			const differentDay = fecha.diff(this.state.fecha, 'days') !== 0;
			this.setState(
				_ => ({ fecha }),
				_ => {
					if (differentDay) this.refs.picker.closeCalendar()
				}
			);
			if (this.props.onChange) this.props.onChange(fecha);
		}else{
			let encontre = fecha.includes('_');
			let fecha2 = fecha;
			fecha = (this.props.datetime) ? (moment(fecha, "DD/MM/YYYY HH:mm")) : (moment(fecha, "DD/MM/YYYY"));
			if(fecha.isValid() && !encontre){
				const differentDay = fecha.diff(this.state.fecha, 'days') !== 0;
				this.setState(
					_ => ({ fecha }),
					_ => {
						if (differentDay) this.refs.picker.closeCalendar()
					}
				);
				if (this.props.onChange) this.props.onChange(fecha);
			}else if(encontre){
				fecha= fecha2;
				this.setState(
					_ => ({ fecha }),
				);
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value != this.props.value) {
			this.setState({ fecha: nextProps.value });
		}
	}

	render() {
		const { clearable } = this.props;
		let Picker = 
			<Datetime
				locale={'es'}
				value={this.state.fecha}
				name={this.props.fieldName}
				className={(this.props.className ? this.props.className : "form-control")}
				timeFormat={(this.props.datetime ? "HH:mm" : null)}
				dateFormat={(this.props.datetime ? "DD/MM/YYYY HH:mm" : (this.props.monthpicker ? "MM/YYYY" : "DD/MM/YYYY"))}
				onChange={(e) => this.onChange(e)}
				input={true}
				ref="picker"
				viewDate={this.props.viewDate}
				isValidDate={this.props.isValidDate}
				renderInput={ ( props, openCalendar ) => (
					<div className="position-relative">
						<InputMask
							{...props}
							name={this.props.fieldName}
							onClick={openCalendar}
							className="form-control"
							mask={(this.props.datetime ? "99/99/9999 99:99" : (this.props.monthpicker ? "99/9999" : "99/99/9999"))}
							type="text"
							disabled={this.props.disabled}
							placeholder={this.props.placeholder}
							value={moment.isMoment(this.state.fecha) ? ( (this.props.monthpicker ? this.state.fecha.format('MM/YYYY') : this.state.fecha.format('DD/MM/YYYY HH:mm'))) : (this.state.fecha)}
						/>
						{
							clearable &&
							<button className="datetime__clear" onClick={() => this.setState({ fecha: null })}>
								<i className="fa fa-close"></i>
							</button>
						}
					</div>
					)
				}
			/>

		if (this.props.showIcon) {
			if (this.props.rtl)
				return (
					<InputGroup className="w-100">
						{Picker}
						<InputGroupAddon addonType="prepend" className="input-group-text">
							<i className={this.props.icon}></i>
						</InputGroupAddon>
					</InputGroup>
				);
			else {
				return (
					<InputGroup className="w-100">
						<InputGroupAddon addonType="prepend" className="input-group-text">
							<i className={this.props.icon}></i>
						</InputGroupAddon>
						{Picker}
					</InputGroup>
				);
			}
		}
		else
			return (Picker);
	}
};

module.exports = ParadigmaDatePicker;