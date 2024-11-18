import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ParadigmaModal from "../../components/ParadigmaModal/ParadigmaModal.js"
import api from "../../api";


import { Row, Col, Label, Input, InputGroup, FormFeedback, Button } from 'reactstrap';

class Ordenamiento extends Component {
    constructor(props) {
        super(props);
        this.state = {
            camposDeEstado:[],
            selectedRow:'0',
        };
    }

    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        label: PropTypes.string,
    }

    getData() {
        const { camposDeEstado } = this.state;

        var i;
        for (i = 0; i < camposDeEstado.length; i++) {
            camposDeEstado[i].ordenamiento = i+1;
        }

        let data = {};
        data.camposDeEstado = camposDeEstado;
        return camposDeEstado
    }

    resetForm(){
        this.setState({
            camposDeEstado:[],
            selectedRow:'0',
        });
    }

    subirPocision = () => {
        const {camposDeEstado, selectedRow} = this.state;
        if (selectedRow!=null){
            if (selectedRow != 0){
                let pos = parseInt(selectedRow);
                let posAux = parseInt(selectedRow)-1;
                let campoSelect = camposDeEstado[pos];
                let campoSelectAux = camposDeEstado[posAux];

                camposDeEstado[pos] = campoSelectAux;
                camposDeEstado[posAux] = campoSelect;

                this.setState({
                    camposDeEstado: camposDeEstado,
                    selectedRow: posAux,
                });
            }

        }
    }


    bajarPocision = () => {
        const {camposDeEstado, selectedRow} = this.state;
        if (selectedRow!=null){
            if (selectedRow != camposDeEstado.length-1){
                let pos = parseInt(selectedRow);
                let posAux = parseInt(selectedRow)+1;
                let campoSelect = camposDeEstado[pos];
                let campoSelectAux = camposDeEstado[posAux];
                camposDeEstado[pos] = campoSelectAux;
                camposDeEstado[posAux] = campoSelect;

                this.setState({
                    camposDeEstado: camposDeEstado,
                    selectedRow: posAux,
                });
            }
        }
    }

    setData(data) {
        this.setState({
            camposDeEstado: data,
        })
    }

    render() {
        const {camposDeEstado, selectedRow} = this.state;
        return (
            <ParadigmaModal
                getUrl={api.configuracion.estadosOrdenamiento}
                submitUrl={api.configuracion.estadosOrdenamiento}
                submitType={'POST'}
                // id={vars.id}
                onGotData={(data) => this.setData(data)}
                onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => this.props.onSubmit(e)}
                onClose={() => this.resetForm()}
                onPreSubmit={() => this.getData()}

                title={"Ordenar Campos del Plan de Trabajo"}

                // danger={vars.danger}
                buttonClass={""}

                // successMessage={vars.successMessage}
                missingIdMessage={"Debe seleccionar una fila."}
                saveButtonLabel={"Guardar"}
                buttonTitle={"Ordenar Campo del Plan de Trabajo"}
                buttonIcon={"fa fa-list-ol fa-lg"}
                saveButton={true}
                closeButton={true}

                escClose={true}
            >
                    <Fragment>
                    <Row className={"mt-3 mb-3"}>
                        <Col className={"col-8 ml-4"}> 
                        
                            <Input type="select" style={{maxWidth: '100%', overflow: 'auto'}} id="multiSelectInput" value={selectedRow} size={(camposDeEstado.length<12) ? (camposDeEstado.length.toString()) : ("12")} onChange={(e) => {this.setState({selectedRow: e.target.value})}}>
                                {camposDeEstado.map(
                                    (campo, i) =>

                                    <option key={i} value={i}>{(i+1)+"- "+campo.nombre}</option>

                                )}
                            </Input>

                        </Col>

                        <Col className={"col-3 pl-0"} style={{marginTop: 'auto', marginBottom: 'auto'}}>

                            <Col className={"col-12 mb-3"}>
                                <Button onClick={() => this.subirPocision()}><i className={"fa fa-arrow-up"}></i></Button>
                            </Col>

                            <Col className={"col-12 mt-3"}>
                                <Button onClick={() => this.bajarPocision()}><i className={"fa fa-arrow-down"}></i></Button>
                            </Col>

                        </Col>
                    </Row>
                    </Fragment>
            </ParadigmaModal>
        );
    }
}

export default Ordenamiento;
