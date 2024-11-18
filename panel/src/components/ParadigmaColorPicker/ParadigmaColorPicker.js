import React, { Component } from 'react';
import PropTypes from 'prop-types';
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

import { Input, Row, Col, FormFeedback, Label } from 'reactstrap';

class ParadigmaColorPicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			displayColorPicker: false,
			color: this.transformColor(this.props.value),
			value: this.props.value
		};
	}

	static propTypes = {
		onChange: PropTypes.func,
		value: PropTypes.string,
		fieldName: PropTypes.string,
		disabled: PropTypes.bool,
	}

	transformColor(value) {
		let color = {
			r: '255',
			g: '255',
			b: '255',
			a: '1',
		};
		if (value) {
			value = value.replace('#', '');
			color.r = parseInt("0x" + value[0] + value[1]);
			color.g = parseInt("0x" + value[2] + value[3]);
			color.b = parseInt("0x" + value[4] + value[5]);
		}
		return color;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value != this.props.value) {
			if (nextProps.value) {
				let value = nextProps.value;
				let color = this.transformColor(value);
				this.setState({ color: color, value: value });
			}
		}
	}

	handleClick = () => {
		this.setState({ displayColorPicker: !this.state.displayColorPicker })
	};

	handleClose = () => {
		this.setState({ displayColorPicker: false })
	};

	handleChange = (color) => {
		this.setState({ color: color.rgb, value: color.hex }, () => {
			if (this.props.onChange) this.props.onChange(color.hex);
		})
	};

	render() {
		const styles = reactCSS({
			'default': {
				color: {
					width: '36px',
					height: '20px',
					borderRadius: '2px',
					background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`,
				},
				swatch: {
					padding: '5px',
					background: '#fff',
					borderRadius: '1px',
					boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
					display: 'inline-block',
					cursor: (this.props.disabled ? 'default' : 'pointer'),
				},
				popover: {
					position: 'absolute',
					zIndex: '2',
				},
				cover: {
					position: 'fixed',
					top: '0px',
					right: '0px',
					bottom: '0px',
					left: '0px',
				},
			},
		});

		return (
			<div>
				<Input className="d-none" onChange={() => { return; }} name={this.props.fieldName} value={this.state.value} />
				<div style={styles.swatch} onClick={this.props.disabled ? () => { return false; } : this.handleClick} >
					<div style={styles.color} />
				</div>
				{this.state.displayColorPicker ? <div style={styles.popover}>
					<div style={styles.cover} onClick={this.props.disabled ? () => { return false; } : this.handleClose} />
					<SketchPicker color={this.state.color} onChange={this.handleChange} />
				</div> : null}
			</div>
		);
	}
};

module.exports = ParadigmaColorPicker;