import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ParadigmaEditor.css';
import auth from  "../../auth";

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
                ['image'],
                [{ color: [] }, { background: [] }],
                [{ align: [] }],
                ['clean'],
                ['link'],
              ],         
        },
      });

      if(this.quill) {
        let toolbar = this.quill.getModule("toolbar");
        if (toolbar) {
            toolbar.addHandler("image", () => {
              if (!this.quill) {
                console.error("Quill no está inicializado.");
                return;
              }
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
            
              input.addEventListener("change", async () => {
                const file = input.files[0];
                if (file) {
                  const formData = new FormData();
                  formData.append('image', file);
                  
                  try {
                    // Asegúrate de cambiar la URL por tu servidor
                    const response = await fetch( this.props.urlImage , {
                      method: 'POST',
                      body: formData,
                      ...auth.header()
                    });
      
                    const result = await response.json();
                    console.log(result)
                    if (result) {
                      const imageUrl = result.data; 
                      const range = this.quill.getSelection();
                      this.quill.insertEmbed(range.index, 'image', imageUrl);
                    } else {
                      console.error('Error al subir la imagen:', result.error);
                    }
                  } catch (error) {
                    console.error('Error al subir la imagen:', error);
                  }
                }
              });
              
              input.click();
            });
        } else {
            console.error("El módulo 'toolbar' no está disponible en Quill.");
        }       
      }      

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

  handleImageUpload() {
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
  urlImage: PropTypes.string,
};

export default ParadigmaEditor;
