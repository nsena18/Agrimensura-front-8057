import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import api from "../../../api";
import { formatCurrency } from '../../../functions/functions';
import apiFunctions from "../../../api/functions.js"
import { Row, Col, Label, Input, InputGroup, FormFeedback } from 'reactstrap';
import moment from 'moment';

import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import ParadigmaAsyncSeeker from "../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js"
import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"
import ParadigmaCurrencyInput from "../../../components/ParadigmaCurrencyInput/ParadigmaCurrencyInput.js"


class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            // Expedientes
            objeto_id: null,
            fechaIngreso: moment(),
            //Cambio Estado
            estado: 0,
            observaciones: '',
            archivo: null,
            postVariables: [ 'estado', 'observaciones', 'archivo', 'fecharegistrada'],
            errors: [],
            lista_estados: ['Previa', 'Observada', 'Definitiva'],
            tituloModal : '',
            labelarchivo : '',
            listVisacionesEncomiendaPrevia: [],
            isGoProcess : true,
            encomiendaRef: ''
        };
    }

    static propTypes = {
        onSubmit: PropTypes.func,
        id: PropTypes.func,
        action: PropTypes.oneOf(['CREATE', 'EDIT', 'DETAIL', 'DELETE']).isRequired,
    }


    resetForm() {
        this.setState({
            id: null,
            fechaIngreso: moment(),            
            //Cambio Estado
            estado: 0,
            observaciones: '',
            archivo: null,
            errors: [],
            lista_estados: ['Previa', 'Observada', 'Definitiva'],
            tituloModal : '',
            labelarchivo : '',
            listVisacionesEncomiendaPrevia: [],
            isGoProcess : true,
            encomiendaRef: ''
        });
    }

    getData() {
        const { precioUnitario, postVariables,fechaIngreso, estado, importePresupuesto, mostrarImporte } = this.state;
        let data = {};
        postVariables.forEach(x => {
            data[x] = this.state[x];
        });
        data['fecharegistrada'] = fechaIngreso.format('YYYY-MM-DD')
        return data;
    }

    filtrarDesdePosicion(array, elementoInicial) {
        const indice = array.indexOf(elementoInicial);        
        if (indice === -1) {
          console.log(`El elemento "${elementoInicial}" no existe en el array`);
          return [];
        }
        
        return array.slice(indice);
      }

    setData(data) {
        const { action, ar_estados } = this.props;
        const { lista_estados } = this.state;
        if (data.success) {
            let estado = data.estado;
            let indice = lista_estados.indexOf(estado);
            let filtr =  lista_estados.slice(indice);
            let idEncomiendaPadre = data.encomiendaprofesional.id;

            if(action!='DELETE'){
                let list_correlativos = data.lista_correlativos == null ? [] : data.lista_correlativos;
                apiFunctions.get(api.visaciones.listadovisacionesencomiendas , idEncomiendaPadre, null, null, (response) => {
                    let registros =  response.data
                    let visacionesFormateada = registros
                        .filter(registro => registro.id && list_correlativos.includes(registro.id))
                        .map((e) => ({
                            id: e.id,
                            nombre: e.estadosplantillas.nombre,
                            numero: e.estadosplantillas.numero,
                            estado: e.estado
                        }));
                    if(visacionesFormateada.length > 0) {
                        let existe = visacionesFormateada.some(e => 
                            e.estado == 'Previa' || 
                            e.estado == 'Observada'
                          );
                        this.setState({
                            listVisacionesEncomiendaPrevia:visacionesFormateada,
                            isGoProcess : !existe,
                            encomiendaRef: data.encomiendaprofesional.nroOrden
                        })
                    }

                   
                });

            }
            this.setState({
                id: data.id,
                estado: data.estado,
                lista_estados: filtr,
                tituloModal : data.estadosplantillas.titulomodal,
                labelarchivo : data.estadosplantillas.labelarchivo
            });


        }
    }

    setErrors(errors) {
        this.setState({
            errors: errors,
        });
    }

    onChangeField(field, value) {
        this.setState(prevState => {
            let errors = prevState.errors;
            if (errors) errors[field] = null;
            prevState.errors = errors;
            prevState[field] = value;
            return prevState;
        });
    }

    getError(field) {
        let errors = this.state.errors;
        if (errors) return errors[field];
        else return null;
    }

    modalVars() {
        const { estado, estadoAnterior, estadoARetroceder, lista_estados, tituloModal, isGoProcess } = this.state;
        const { action, ar_estados } = this.props;
        
        if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                // asigno el titulo del modal dependiendo el estado (tituloModal)
                title:  tituloModal == '' ? 'Avanzar visación' : tituloModal,
                buttonTitle: "Avanzar",
                danger: !isGoProcess,
                buttonIcon: "fa fa-share fa-lg",
                successMessage: "ha sido editado con éxito.",
                saveButton: isGoProcess,
                saveButtonLabel: "Guardar",
                buttonClass: "",
                disabled: false,
                id: this.props.id,
            };
        }
        else if (action == "DELETE") {
            return {
                get: true,
                submitType: "DELETE",
                // asigno el titulo del modal dependiendo el estado (tituloModal)
                // title: (ar_estados && ar_estados.filter((f) => f.id==estadoAnterior).length>0 && ar_estados.filter((f) => f.id==estadoAnterior)[0].sePuedeAvanzar==true) ? (ar_estados.filter((f) => f.id==estadoAnterior)[0].tituloModal) : ('Avanzar'),
                title: 'Retroceder Visación',
                buttonTitle: "Retroceder",
                danger: true,
                buttonIcon: "fa fa-mail-reply fa-lg",
                successMessage: "ha sido editado con éxito.",
                saveButton: (estadoARetroceder!=''),
                saveButtonLabel: "Confirmar",
                buttonClass: "",
                disabled: true,
                id: this.props.id,
            };
        }
    }

    onValidation = () => {
        const { estadoAnterior, estado, observaciones, archivo } = this.state;
        const { action, ar_estados } = this.props;

        let errors = {};
        let valid = true;
        if(action=='EDIT'){
            // Valido si el cambio de estado exige un archivo
            if(archivo==null){
                errors['archivo'] = [{code: "blank", detail: "Seleccione un archivo"}]
                valid = false;
            }
        }

        this.setState({errors: errors})

        return valid
    }

    selectComitente = (data) =>{
        this.setState({
            comitente_id: (data) ? (data.id) : (null),
            telefono: (data) ? (data.telefono) : (''),
            telefono2: (data) ? (data.telefono2) : (''),
            telefono3: (data) ? (data.telefono3) : (''),
        })
    }

    changeValuesSelect = (data, listStatus) => {
        let res = listStatus.find(objeto => objeto.id == data.id);
        let valRes = false;
        if (res) {
            valRes = res.mostrarImporte;
        } 
        this.setState({estado: data.id, mostrarImporte: valRes})
    }

    render() {
        let vars = this.modalVars();
        const { action, ar_estados } = this.props;
        const { lista_estados, estadoAnterior, estado, observaciones,encomiendaRef, archivo, isGoProcess, labelarchivo, listVisacionesEncomiendaPrevia } = this.state;

        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.visaciones.encomienda : null)}
                submitUrl={(vars.submitType ? api.visaciones.cambioestado : null)}
                submitType={vars.submitType}
                id={vars.id}

                onGotData={(data) => this.setData(data)}
                onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => this.props.onSubmit(e)}
                onClose={() => this.resetForm()}
                onPreSubmit={() => this.getData()}
                onValidation={() => this.onValidation()}

                cancelButtonLabel={vars.cancelButtonLabel}

                title={vars.title}

                danger={vars.danger}
                buttonClass={vars.buttonClass}

                successMessage={vars.successMessage}
                missingIdMessage={"Debe seleccionar una fila."}
                saveButtonLabel={vars.saveButtonLabel}
                buttonTitle={vars.buttonTitle}
                buttonIcon={vars.buttonIcon}
                saveButton={vars.saveButton}
                closeButton={true}

                // className={'modal-lg'}
                fileUploader
                escClose={true}
            >
                { (action!='DELETE' && isGoProcess ) ?

                    <Fragment>
                        {/* Si se puede avanzar a mas de un estado, se muestra un asyncseeker para elegir el estado a avanzar */} 
                        <ParadigmaLabeledInput
                                label={'Avanzar a'}
                                md={[4, 8]}
                                inputComponent={
                                    <ParadigmaAsyncSeeker
                                        url={undefined}
                                        clearable={false}
                                        optionDefault={lista_estados.map(e => {return {nombre: e, id: e }})}
                                        value={estado}
                                        onChange={e => this.setState({ estado: e.id })}
                                    />
                                }
                                error={() => this.getError('estado')}
                            />

                        <ParadigmaLabeledInput
                            // Asigno el label segun el estado (labelArchivo) y si es obligatorio (archivoObligatorio) agrego un *
                            label={labelarchivo}
                            md={[4, 8]}
                            inputComponent={
                                <Input 
                                    id={'inp_arch'} 
                                    onChange={e => this.setState({ archivo: e.target.files[0] })} 
                                    type="file" 
                                    disabled={vars.disabled} 
                                />
                            }
                            error={() => this.getError('archivo')}
                        />
                        <ParadigmaLabeledInput
                            md={[4, 8]}
                            type={'textarea'}
                            label={"Observaciones"}
                            classNames={['','ta_m_movil']}
                            value={observaciones}
                            maxLength={255}
                            onChange={(e) => this.onChangeField('observaciones', e.target.value)}
                            error={() => this.getError('observaciones')}
                        />
                    </Fragment>
                :

                   (!isGoProcess) ?
                   <Fragment>
                        <h4 className='text-center' >Listado de visaciones</h4><br></br>
                        <h5 className='text-center' > Encomienda Ref: {encomiendaRef} </h5><br></br>
                        <strong className={'text-center'}>No se puede completar la operación solicitada. Existen visaciones previas pendientes de finalización en el registro actual.</strong>
                        <ul className="list-group">
                         {Array.isArray(listVisacionesEncomiendaPrevia) && listVisacionesEncomiendaPrevia.length > 0 ? (
                                listVisacionesEncomiendaPrevia.map((data, i) => (
                                    <li  key={i} className="list-group-item d-flex justify-content-between align-items-center">
                                        {data.numero} - {data.nombre}
                                        <span className={
                                            'badge ' + 
                                            (data.estado === 'Definitiva' 
                                              ? 'badge-primary' 
                                              : 'badge-danger')
                                          }>{data.estado}</span>
                                    </li>
                                ))
                                ) : (
                                <div className="text-muted text-center py-3">
                                    No hay visaciones registradas
                                </div>
                            )}                           
                        </ul>    

                    </Fragment>
                    :
                    <h2 className={'text-center'}>{(estado!='Previa') ? 'Retroceder al estado "'+( estado == 'Definitiva' ? 'Observada' : 'Previa'  )+'"' : ('No se puede retroceder la visación')}</h2>
                    
                }
            
                

            </ParadigmaModal>
        );
    }
}

export default Modal;
