import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import api from "../../../api";
import { formatCurrency } from '../../../functions/functions';

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
            nroOrden: '',
            
            //Cambio Estado
            estadoAnterior: 0,
            estado: 0,
            observaciones: '',
            
            archivoAdjunto: null,
            
            estadoARetroceder: '',
            postVariables: ['estadoAnterior', 'estado', 'observaciones', 'archivoAdjunto'],
            errors: [],

            importePresupuesto: '0,00',
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
            nroOrden: '',
            
            //Cambio Estado
            estadoAnterior: 0,
            estado: 0,
            observaciones: '',
            archivoAdjunto: null,

            estadoARetroceder: '',

            errors: [],

            importePresupuesto: '0,00',
        });
    }

    getData() {
        const { precioUnitario, postVariables, estado, importePresupuesto } = this.state;
        let data = {};
        postVariables.forEach(x => {
            data[x] = this.state[x];
        });

        if(estado==2){
            data['importePresupuesto'] = parseFloat(importePresupuesto.replace('.','').replace(',','.'));
        }

        return data;
    }

    setData(data) {
        const { action, ar_estados } = this.props;
        if (data.success) {
            let estadoARetroceder = '';
            if(action!='DELETE'){

                // Si no se puede avanzar el estado devuelvo mensaje de error (mensajeError)
                if((ar_estados.filter((f) => f.id==data.estado).length>0) && (ar_estados.filter((f) => f.id==data.estado)[0].sePuedeAvanzar==false)){
                    return {
                        allowed: false,
                        message: ar_estados.filter((f) => f.id==data.estado)[0].mensajeError
                    }
                }

                // permisos Nivel 1
                // let estadosNivel1 = [1, 2, 3, 4, 5, 6]
                let estadosNivel1 = ar_estados.filter((f) => f.permisosNivel1==true).map((e) => {return parseInt(e.id)})
                let permisosN1=((estadosNivel1.includes(data.estado) && !localStorage.permisos.includes('nivel1')) && !localStorage.permisos.includes('administrador'));
                if(permisosN1==true){
                    return {
                        allowed: false,
                        message: 'No tienes permisos para avanzar de estado',
                    }
                }
                
                //permisos Nivel 2
                // let estadosNivel2 = [1, 2, 3, 4, 5, 6]
                let estadosNivel2 = ar_estados.filter((f) => f.permisosNivel1==true).map((e) => {return parseInt(e.id)})
                let permisosN2 = (estadosNivel2.includes(data.estado) && !localStorage.permisos.includes('nivel2') && !localStorage.permisos.includes('administrador'));
                if(permisosN2==true){
                    return {
                        allowed: false,
                        message: 'No tienes permisos para avanzar de estado',
                    }
                }

            }else{
                if(ar_estados.find((a) => {return (a.proximosEstado && a.proximosEstado.filter(f => {return f.numero == data.estado}).length>0)})){
                    let estadoAnt = ar_estados.find((a) => {return (a.proximosEstado && a.proximosEstado.filter(f => {return f.numero == data.estado}).length>0)})
                    
                    estadoARetroceder = (!estadoAnt.primerEstado) ? estadoAnt.nombre : '';
                }
            }

            this.setState({
                id: data.id,

                fechaIngreso: data.fechaIngreso,
                nroOrden: data.nroOrden,

                // estado: data.estado+1,
                estado: (ar_estados && ar_estados.filter((f) => f.id==data.estado).length>0 && ar_estados.filter((f) => f.id==data.estado)[0].proximosEstado.length>0) ? (ar_estados.filter((f) => f.id==data.estado)[0].proximosEstado[0].numero) : (null),
                estadoAnterior: data.estado,

                estadoARetroceder: estadoARetroceder,
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
        const { estado, estadoAnterior, estadoARetroceder } = this.state;
        const { action, ar_estados } = this.props;
        
        if (action == "EDIT") {
            return {
                get: true,
                submitType: "PUT",
                // asigno el titulo del modal dependiendo el estado (tituloModal)
                title: (ar_estados && ar_estados.filter((f) => f.id==estadoAnterior).length>0 && ar_estados.filter((f) => f.id==estadoAnterior)[0].sePuedeAvanzar==true) ? (ar_estados.filter((f) => f.id==estadoAnterior)[0].tituloModal) : ('Avanzar'),
                buttonTitle: "Avanzar",
                danger: false,
                buttonIcon: "fa fa-share fa-lg",
                successMessage: "ha sido editado con éxito.",
                saveButton: true,
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
                title: 'Retroceder Encomienda',
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
        const { estadoAnterior, estado, observaciones, archivoAdjunto } = this.state;
        const { action, ar_estados } = this.props;

        let errors = {};
        let valid = true;
        if(action=='EDIT'){
            // Valido si el cambio de estado exige un archivo
            if(archivoAdjunto==null && (ar_estados && ar_estados.filter((f) => f.id==estadoAnterior).length>0 && ar_estados.filter((f) => f.id==estadoAnterior)[0].archivoObligatorio==true)){
                errors['archivoAdjunto'] = [{code: "blank", detail: "Seleccione un archivo"}]
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

    render() {
        let vars = this.modalVars();
        const { action, ar_estados } = this.props;
        const { estadoAnterior, estado, observaciones, archivoAdjunto, estadoARetroceder, importePresupuesto } = this.state;
        let obj_estadoAnterior = ar_estados.filter((f) => f.id==estadoAnterior);
        
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.expedientes.encomiendaprofesional : null)}
                submitUrl={(vars.submitType ? api.expedientes.encomiendaCambioEstado : null)}
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
                {action!='DELETE' ?
                <Fragment>
                    {/* Si se puede avanzar a mas de un estado, se muestra un asyncseeker para elegir el estado a avanzar */} 
                    {(ar_estados && obj_estadoAnterior.length>0 && obj_estadoAnterior[0].proximosEstado.length>1) &&
                        <ParadigmaLabeledInput
                            label={'Avanzar a'}
                            md={[4, 8]}
                            inputComponent={
                                <ParadigmaAsyncSeeker
                                    url={undefined}
                                    clearable={false}
                                    optionDefault={obj_estadoAnterior[0].proximosEstado.map(e => {return {nombre: ((e.numero==estadoAnterior) ? 'Reenviar Presupuesto' : e.nombre), id: e.numero,}})}
                                    value={estado}
                                    onChange={data => (data) ? (this.setState({estado: data.id})): (this.setState({estado: null}))}
                                />
                            }
                            error={() => this.getError('selectestado')}
                        />
                    }

                    <ParadigmaLabeledInput
                        // Asigno el label segun el estado (labelArchivo) y si es obligatorio (archivoObligatorio) agrego un *
                        label={(ar_estados && obj_estadoAnterior.length>0) ? (obj_estadoAnterior[0].labelArchivo+((obj_estadoAnterior[0].archivoObligatorio==true) ? (' *') : (''))) : ('Archivo')}
                        md={[4, 8]}
                        inputComponent={
                            <Input 
                                id={'inp_arch'} 
                                onChange={e => this.setState({ archivoAdjunto: e.target.files[0] })} 
                                type="file" 
                                disabled={vars.disabled} 
                            />
                        }
                        error={() => this.getError('archivoAdjunto')}
                    />

                    {estado==2 &&
                    <ParadigmaLabeledInput
                        md={[4, 8]}
                        label={"Importe"}
                        error={() => this.getError('importe')}
                        inputComponent={
                            <ParadigmaCurrencyInput 
                                type="text"
                                disabled={vars.disabled}
                                value={importePresupuesto}
                                onChange={(data) => this.onChangeField('importePresupuesto', data)}
                                className={'monto'}
                                dobleSimboloDecimal={true}
                                selectOnFocus={true}
                                onBlurComplete={true}
                            />}
                    />}
    
                    <ParadigmaLabeledInput
                        md={[4, 8]}
                        type={'textarea'}
                        label={"Observaciones"}
                        classNames={['','ta_m_movil']}
                        value={observaciones}
                        maxLength={1000}
                        onChange={(e) => this.onChangeField('observaciones', e.target.value)}
                        error={() => this.getError('observaciones')}
                    />
                </Fragment>
                :
                <h2 className={'text-center'}>{(estadoARetroceder!='') ? 'Retroceder al estado "'+estadoARetroceder+'"' : ('No se puede retroceder la encomienda')}</h2>}

            </ParadigmaModal>
        );
    }
}

export default Modal;
