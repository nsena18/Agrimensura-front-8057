import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import axios from "axios";

import auth from "../../auth";

import "./scss/default.scss";

import { Input, Row, Col, FormFeedback } from 'reactstrap';

var styleButton = {
	minWidth: "50px"
}

var styleBoxWithButton = {
	maxWidth: "calc(100% - 50px)"
}

var styleBox = {
	maxWidth: "100%"
}

function deepCompare () {
	var i, l, leftChain, rightChain;

	function compare2Objects (x, y) {
		var p;

		// remember that NaN === NaN returns false
		// and isNaN(undefined) returns true
		if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
			return true;
		}

		// Compare primitives and functions.
		// Check if both arguments link to the same object.
		// Especially useful on the step where we compare prototypes
		if (x === y) {
			return true;
		}

		// Works in case when functions are created in constructor.
		// Comparing dates is a common scenario. Another built-ins?
		// We can even handle functions passed across iframes
		if ((typeof x === 'function' && typeof y === 'function') ||
		(x instanceof Date && y instanceof Date) ||
		(x instanceof RegExp && y instanceof RegExp) ||
		(x instanceof String && y instanceof String) ||
		(x instanceof Number && y instanceof Number)) {
			return x.toString() === y.toString();
		}

		// At last checking prototypes as good as we can
		if (!(x instanceof Object && y instanceof Object)) {
			return false;
		}

		if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
			return false;
		}

		if (x.constructor !== y.constructor) {
			return false;
		}

		if (x.prototype !== y.prototype) {
			return false;
		}

		// Check for infinitive linking loops
		if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
			return false;
		}

		// Quick checking of one object being a subset of another.
		// todo: cache the structure of arguments[0] for performance
		for (p in y) {
			if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
				return false;
			}
			else if (typeof y[p] !== typeof x[p]) {
				return false;
			}
		}

		for (p in x) {
			if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
				return false;
			}
			else if (typeof y[p] !== typeof x[p]) {
				return false;
			}

			switch (typeof (x[p])) {
				case 'object':
				case 'function':

				leftChain.push(x);
				rightChain.push(y);

				if (!compare2Objects (x[p], y[p])) {
					return false;
				}

				leftChain.pop();
				rightChain.pop();
				break;

				default:
				if (x[p] !== y[p]) {
					return false;
				}
				break;
			}
		}

		return true;
	}
	if (arguments.length < 1) {
		return true; //Die silently? Don't know how to handle such case, please help...
		// throw "Need two or more arguments to compare";
	}

	for (i = 1, l = arguments.length; i < l; i++) {

		leftChain = []; //Todo: this can be cached
		rightChain = [];

		if (!compare2Objects(arguments[0], arguments[i])) {
			return false;
		}
	}

	return true;
}

class ParadigmaAsyncSeeker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: null,
			pk: null,
			options: [],
			valueField: (this.props.valueField != undefined ? this.props.valueField : 'id'),
			displayField: (this.props.displayField != undefined ? this.props.displayField : 'nombre'),
			changedUrl: false,
		};

		this.getOptions = this.getOptions.bind(this);
		this.getOpts = this.getOpts.bind(this);
	}

	static propTypes = {
		label: PropTypes.string,
		onChange: PropTypes.func,
		onExternalChange: PropTypes.func,
		value: PropTypes.any,
		disabled: PropTypes.bool,
		url: PropTypes.string,
		parameters: PropTypes.object,

		displayField: PropTypes.string,
		valueField: PropTypes.string,

		autoFocus: PropTypes.bool,
		clearable: PropTypes.bool,

		CreateComponent: PropTypes.any,
		DetailComponent: PropTypes.any,

		valueRenderer: PropTypes.func,
		optionRenderer: PropTypes.func,

		multiselect: PropTypes.bool,
		optionDefault: PropTypes.array,
	}

	componentDidMount() {
		var self = this;
		if (this.props.autoFocus) {
			setTimeout(function () {
				self.autoFocusInput.focus();
			}, 200);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.changedUrl) {
			this.setState({ changedUrl: false });
		}
		const { value } = this.state;
		if (value !== prevState.value) {
			if (this.props.onExternalChange) this.props.onExternalChange(value);
		}
	}

	onChange(value) {
		var pk;
		if (this.props.multiselect)
		pk = (value ? value.map(x => x[this.state.valueField]).toString() : []);
		else
		pk = (value ? value[this.state.valueField] : null);
		this.setState({
			value: value,
			pk: pk,
		});
		if (this.props.onChange) this.props.onChange(value);
	}

	resetState() {
		let value;
		if (this.props.multiselect) {
			let pks = this.props.value;
			value = [];
			for (var i = 0; i < pks.length; i++) {
				let pk = pks[i];
				value.push(this.getOption(pk))
			}
			this.setState({
				value: value,
				pk: pks
			});
		} else {
			value = this.getOption(this.props.value);
		}

		this.setState({
			value: value,
			pk: this.props.value,
		});
		if (this.props.onExternalChange) this.props.onExternalChange(value);
	}

	componentWillReceiveProps(nextProps) {
		let value;
		if (this.props.multiselect) {
			let pks = nextProps.value;
			value = [];
			for (var i = 0; i < pks.length; i++) {
				let pk = pks[i];
				value.push(this.getOption(pk))
			}
			this.setState({
				value: value,
				pk: pks
			});
		} else {
			value = this.getOption(nextProps.value);
			this.setState({
				value: value,
				pk: nextProps.value,
			});
		}

		if (this.props.url != nextProps.url || (JSON.stringify(this.props.optionDefault) != JSON.stringify(nextProps.optionDefault)) || deepCompare(this.props.parameters,nextProps.parameters) == false) {
			this.getOpts(nextProps.url, nextProps.parameters);
			this.setState({ changedUrl: true });
		}
	}

	getOpts(url, parameters, callback){
		let getValue = (value) => {
			if (typeof (value) == 'string'){
				return value;
			}
			else if (typeof (value) == 'number'){
				return value.toString();
			}
			else if (typeof (value) == 'function'){
				return value().toString();
			}
		};
		let getLastChar = (string) => {
			let charArray = string.split('');
			if (charArray.length > 0) return charArray[charArray.length - 1];
			else return '';
		};
		let generateUrl = (url, parameters) => {
			let newurl = url;
			if (parameters) {
				let lastChar = getLastChar(newurl);
				if (lastChar != '/') newurl += "/";
				if (parameters.id) {
					if(url.indexOf("$id") != -1)
					newurl = newurl.replace("$id", parameters.id);
					else
					newurl += getValue(id) + "/";
				}
				newurl += "?";
				if (parameters.fields) newurl += "fields=" + parameters.fields.join(',') + "&";
				if (parameters.sort) newurl += "sort=" + parameters.sort.join(',') + "&";
				if (parameters.filters) newurl += parameters.filters.join('&') + "&";
				if (parameters.pageSize) newurl += "pageSize=" + parameters.pageSize + "&";
				if (parameters.page) newurl += "page=" + parameters.page + "&";
				if(parameters.paginationEnabled != undefined) newurl += "paginationEnabled=" + parameters.paginationEnabled + "&";
				if(parameters.concat) newurl += parameters.concat;
			}
			return newurl;
		};
		if(url != undefined && url.length > 0){
			axios.get(generateUrl(url, parameters), auth.header()).then((response) => {
				let data = response.data.data;
				if (data) {
					//Auto completar si hay un solo elemento
					if(this.props.autoselect!=undefined && this.props.autoselect==true && data.length==1 && this.props.value==null){
						this.setState({ options: data, value: data[0].id });
						this.props.onChange(data[0]);
					}else{
						let valueValidation = (this.props.value) ? ((data.filter((e)=>{return (e.id==this.props.value)}).length >=1) ? (this.props.value) : (null)) : null
						this.setState({ options: data, value: valueValidation});
						if(this.props.value != undefined && valueValidation != undefined && this.props.value != valueValidation){
							this.props.onChange(valueValidation);
						}
					}

					if (callback){
						callback(null, {options: data, complete: false});
					}
					if (this.props.value){
						setTimeout(() => this.resetState(), 10);
					}
				}
				else {
					if (callback){
						callback(null, {options: this.state.options, complete: false});
					}
				}
			});
		}else if (callback && this.props.optionDefault){
			let valueValidation = null;
			if(this.props.multiselect){
				valueValidation = (this.props.value!=null && this.props.value!=undefined && this.props.value.length>0) ? ((this.props.optionDefault.filter((e)=>{return (this.props.value.includes(e.id))}).length >=1) ? (this.props.value) : (null)) : null
			}else{
				valueValidation = (this.props.value!=null && this.props.value!=undefined) ? ((this.props.optionDefault.filter((e)=>{return (e.id==this.props.value)}).length >=1) ? (this.props.value) : (null)) : null
			}
			this.setState({ options: this.props.optionDefault, value: valueValidation });
			callback(null, {options: this.props.optionDefault, complete: false});
		}else{
			this.setState({ options: [] });
			if(callback){
				callback(null, {options: [], complete: false});
			}
		}
	}

	getOptions(input, callback){
		if(input==''){
			this.getOpts(this.props.url, this.props.parameters, callback);
		}else{
			callback(null, {options: this.state.options, complete: false});
		}
	};

	getOption(value) {
		for (var i = 0; i < this.state.options.length; i++) {
			if (this.state.options[i][this.state.valueField] == value)
			return this.state.options[i];
		}
	}

	created(value) {
		var self = this;
		this.getOptions("", (res) => {
			setTimeout(() => {
				var pk = value[this.state.valueField];
				var option = this.getOption(pk);
				self.setState({
					value: option,
					pk: pk
				});
				this.onChange(option);
			}, 100);
		});
	}

	id() {
		return this.state.pk;
	}

	render() {
		if (this.props.CreateComponent)
		return (
			<Row>
			<div className="col-11 pr-0" style={styleBoxWithButton}>
			{!this.state.changedUrl &&
				<Select.Async
				clearable={this.props.clearable}
				ref={(input) => { this.autoFocusInput = input; }}
				multi={this.props.multiselect}
				backspaceRemoves={true}
				value={this.state.value}
				onChange={(value) => this.onChange(value)}
				disabled={this.props.disabled}
				valueKey={this.state.valueField}
				labelKey={this.state.displayField}
				loadOptions={this.getOptions} />
			}
			</div>
			<div style={styleButton} className="col-1 pl-0 async-button">
			<this.props.CreateComponent buttonClass={"w-100 px-1 btn-outline-light"} onSubmit={(value) => this.created(value)} />
			</div>
			</Row>
		);
		else if (this.props.DetailComponent)
		return (
			<Row>
			<div className="col-11 pr-0" style={styleBoxWithButton}>
			{!this.state.changedUrl &&
				<Select.Async
				clearable={this.props.clearable}
				ref={(input) => { this.autoFocusInput = input; }}
				multi={this.props.multiselect}
				backspaceRemoves={true}
				value={this.state.value}
				onChange={(value) => this.onChange(value)}
				disabled={this.props.disabled}
				valueKey={this.state.valueField}
				labelKey={this.state.displayField}
				loadOptions={this.getOptions} />
			}
			</div>
			<div style={styleButton} className="col-1 pl-0 async-button">
			<this.props.DetailComponent id={() => this.id()} buttonClass={"w-100 px-1"} />
			</div>
			</Row>
		);
		else
		return (
			<div>
			{!this.state.changedUrl &&
				<Select.Async
				ref={(input) => { this.autoFocusInput = input; }}
				clearable={this.props.clearable}
				multi={this.props.multiselect}
				backspaceRemoves={true}
				value={this.state.value}
				disabled={this.props.disabled}
				onChange={(value) => this.onChange(value)}
				valueKey={this.state.valueField}
				labelKey={this.state.displayField}
				loadOptions={this.getOptions}
				valueRenderer={this.props.valueRenderer}
				optionRenderer={this.props.optionRenderer}
				/>
			}
			</div>
		);
	}
};

module.exports = ParadigmaAsyncSeeker;
