import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactQuill, { Quill }  from 'react-quill';

import './ParadigmaEditor.css';

// Para que la alineación sea agregada en inline styles
Quill.register(Quill.import('attributors/style/align'), true);

class ParadigmaEditor extends Component {

    handleChange = value => {
        if (this.props.onChange) this.props.onChange(value);
    }

    static propTypes = {
        disabled: PropTypes.bool,
        value: PropTypes.string,
        onChange: PropTypes.func
    }

    render() {

        const { disabled } = this.props;
        const modules = {
            toolbar: disabled ?
                false :
                [
                    [ 'bold', 'italic', 'underline','strike' ],
                    [{ 'header': [1, 2, false, 5] }],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    ['clean'],
                    ['link']
                ]
        };

        return (
            <ReactQuill
                className={disabled ? 'ql-disabled' : ''}
                value={this.props.value}
                onChange={this.handleChange}
                modules={modules}
                readOnly={disabled}
            />
        );
    }
}

export default ParadigmaEditor;