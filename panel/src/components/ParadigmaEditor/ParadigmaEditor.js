import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './ParadigmaEditor.css';

class ParadigmaEditor extends Component {
    constructor(props) {
      super(props);
      this.editorRef = React.createRef();
      this.quill = null;
    }
  
    componentDidMount() {
        if (window.Quill) {
            this.quill = new window.Quill(this.editorRef.current, {
                theme: 'snow',
                readOnly: this.props.disabled,
                modules: {
                  toolbar: this.props.disabled
                    ? false
                    : [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ header: [1, 2, false, 5] }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ color: [] }, { background: [] }],
                        [{ align: [] }],
                        ['clean'],
                        ['link'],
                      ],
                  clipboard: true, // Asegura que el clipboard no está bloqueado
                },
              });
      
          // Set initial value
          if (this.props.value) {
            this.quill.clipboard.dangerouslyPasteHTML(this.props.value);
          }
      
          this.quill.on('text-change', () => {
            if (this.props.onChange) {
              this.props.onChange(this.quill.root.innerHTML);
            }
          });
        }
    }
  
    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value && this.quill) {
          const currentRange = this.quill.getSelection();
          if (this.props.value !== this.quill.root.innerHTML) {
            this.quill.clipboard.dangerouslyPasteHTML(this.props.value || '');
            if (currentRange) {
              this.quill.setSelection(currentRange);
            }
          }
        }
    }
      
  
    render() {
      return <div ref={this.editorRef} className="quill-editor-container" />;
    }
  }
  
  ParadigmaEditor.propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
  };
  
  export default ParadigmaEditor;