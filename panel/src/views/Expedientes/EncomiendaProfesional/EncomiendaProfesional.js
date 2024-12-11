import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';
import apiFunctions from "../../../api/functions.js"
import { formatCurrency } from '../../../functions/functions';

import Modal from "./Modal"
import ModalDiasEstimados from "./ModalDiasEstimados"
import CambioEstado from "./CambioEstado"
import ModalResumenDeuda from "./ModalResumenDeuda"

import ModalEvento from '../../Calendar/Modal'

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable";
import ParadigmaDatePicker from '../../../components/ParadigmaDatePicker/ParadigmaDatePicker';
import ParadigmaAsyncSeeker from '../../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker';
import moment from 'moment';

class EncomiendaProfesional extends Component {
    constructor() {
        super();
        this.state = {
            ar_estados: [],
            usuario_id: null,
            columns: [
                {
                    Header: "id",
                    id: "id",
                    accessor: "id",
                    width: 100,
                    show: false,
                    private: true,
                },
                {
                    Header: "N° Orden",
                    id: "nroOrden",
                    accessor: "nroOrden",
                    width: 150,
                    exportWidth: '8%',
                    show: true,
                },
                {
                    Header: "Fecha",
                    id: "fechaIngreso",
                    accessor: d => (d.fechaIngreso) ? (moment(d.fechaIngreso).format('DD-MM-YYYY')) : (''),
                    width: 120,
                    exportWidth: '7%',
                    show: true,
                    Filter: ({ filter, onChange }) => <div className={"date-filter has-value"}>
                                                        <ParadigmaDatePicker
                                                                dateFormat="DD/MM/YYYY"
                                                                value={filter ? moment(filter.value).format('DD/MM/YYYY') : ''}
                                                                onChange={date => {
                                                                    onChange((moment(date).isValid()) ? (moment(date).format('YYYY-MM-DD')) : (''))}}
                                                            />
                                                        <div className="date-filter__buttons">
                                                            <button
                                                                className="date-filter__button date-filter__button-close"
                                                                onClick={(e) => {onChange('')}}
                                                            >
                                                                <i className={'fa fa-times'}></i>
                                                            </button>
                                                        </div>
                                                    </div>
                },
                {
                    Header: "comitente",
                    id: "comitente_nombre",
                    accessor: 'comitente_nombre',
                    exportWidth: '10%',
                    show: true,
                    Filter: ({ filter, onChange }) =>
                        <ParadigmaAsyncSeeker
                            url={api.comitentes.comitentes}
                            value={filter ? filter.value : ""}
                            onChange={data => (data) ? (onChange(data.apellido_nombre)): ((filter) ? onChange('') : null)}
                            displayField={"apellido_nombre"}
                            valueField={'apellido_nombre'}
                            parameters={{
                                paginationEnabled:false,
                                sort:['apellido_nombre'],
                            }}
                        />
                },
                {
                    Header: "Teléfono",
                    id: "comitente_telefonos",
                    accessor: d => (d.comitente_telefonos!=', , ') ? (d.comitente_telefonos) : (''),
                    width: 150,
                    exportWidth: '7%',
                    show: true,
                },
                {
                    Header: "Domicilio",
                    id: "domicilio",
                    exportWidth: '8%',
                    accessor: "domicilio",
                    show: true,
                },
                {
                    Header: "Tipo de Encomienda",
                    id: "tipoEncomienda__nombre",
                    exportWidth: '8%',
                    accessor: "tipoEncomienda__nombre",
                    show: true,
                    Filter: ({ filter, onChange }) =>
                        <ParadigmaAsyncSeeker
                            url={api.expedientes.tiposdeencomiendaSelect}
                            value={filter ? filter.value : ""}
                            onChange={data => (data) ? (onChange(data.nombre)): ((filter) ? onChange('') : null)}
                            valueField={'nombre'}
                            parameters={{
                                paginationEnabled:false,
                                sort:['nombre'],
                            }}
                        />
                },
                {
                    Header: "Objeto",
                    id: "objeto__nombre",
                    exportWidth: '7%',
                    accessor: "objeto__nombre",
                    show: true,
                    Filter: ({ filter, onChange }) =>
                        <ParadigmaAsyncSeeker
                            url={api.expedientes.objetosdetrabajoSelect}
                            value={filter ? filter.value : ""}
                            onChange={data => (data) ? (onChange(data.nombre)): ((filter) ? onChange('') : null)}
                            valueField={'nombre'}
                            parameters={{
                                paginationEnabled:false,
                                sort:['nombre'],
                            }}
                        />
                },
                {
                    Header: "Cric.",
                    id: "circunscripcion",
                    accessor: "circunscripcion",
                    exportWidth: '2%',
                    width: 60,
                    show: true,
                },
                {
                    Header: "Sect.",
                    id: "sector",
                    accessor: "sector",
                    exportWidth: '2%',
                    width: 60,
                    show: true,
                },
                {
                    Header: "Mza.",
                    id: "manzana",
                    accessor: "manzana",
                    exportWidth: '2%',
                    width: 60,
                    show: true,
                },
                {
                    Header: "Mzo.",
                    id: "macizo",
                    accessor: "macizo",
                    exportWidth: '2%',
                    width: 60,
                    show: true,
                },
                {
                    Header: "Fracc.",
                    id: "fraccion",
                    accessor: "fraccion",
                    exportWidth: '2%',
                    width: 60,
                    show: true,
                },
                {
                    Header: "Lote",
                    id: "lote",
                    accessor: "lote",
                    exportWidth: '2%',
                    width: 60,
                    show: true,
                },
                {
                    Header: "Parcela",
                    id: "parcela",
                    accessor: "parcela",
                    exportWidth: '2%',
                    width: 60,
                    show: true,
                },
                {
                    Header: "Qta.",
                    id: "quinta",
                    accessor: "quinta",
                    exportWidth: '2%',
                    width: 60,
                    show: true,
                },
                {
                    Header: "Alarma",
                    id: "alarma",
                    width: 70,
                    exportWidth: '4%',
                    accessor: (e) => (e.alarma==true) ? <div className={'btn_alarma_table_rojo'}/> : <div className={'btn_alarma_table_verde'}/>,
                    show: true,
                    Filter: ({ filter, onChange }) =>
                        <ParadigmaAsyncSeeker
                            url={undefined}
                            clearable={false}
                            optionDefault={[{nombre: 'Todos', id: ''}, {nombre: 'Si', id: 'True'}, {nombre: 'No', id: 'False'}]}
                            value={filter ? filter.value : ''}
                            onChange={data => (data) ? (onChange(data.id)): (onChange(''))}
                        />
                },
                {
                    Header: "Estado",
                    id: "estado",
                    accessor: e => <div
                                    className="btn py-0"
                                    style={{
                                        background: `#${this.state.ar_estados[e.estado] ? this.state.ar_estados[e.estado].background : 'bbb'}`,
                                        color: `#${this.state.ar_estados[e.estado] ? this.state.ar_estados[e.estado].color : 'fff'}`,
                                        width: 160,
                                        height: 17,
                                        fontSize: '0.8em',
                                        marginTop: '0px',
                                        borderTopWidth: '0px',
                                    }}
                                >
                                    {this.state.ar_estados[e.estado] ? this.state.ar_estados[e.estado].nombre : ''}
                                </div>,
                    width: 160,
                    exportWidth: '5%',
                    show: true,
                    Filter: ({ filter, onChange }) =>
                        <ParadigmaAsyncSeeker
                            url={undefined}
                            optionDefault={this.state.ar_estados}
                            value={filter ? filter.value : ''}
                            onChange={data => (data) ? (onChange(data.id)): (onChange(''))}
                        />
                },
            ]
        };
    }

    componentDidMount = () => {
        // Cargo los estados de la encomienda con sus respectivos colores
        apiFunctions.get(api.expedientes.estadosencomiendaSelect, null, null, {sort:['numero']}, (response) => {
            this.setState({
                ar_estados: response.data.map((d) => { return {id: d.numero.toString(), 
                                                                nombre: d.nombre, 
                                                                background: d.background, 
                                                                color: d.texto, 
                                                                diasEstimados: d.diasEstimados,
                                                                permisosNivel1: d.permisosNivel1,
                                                                permisosNivel2: d.permisosNivel2,
                                                                archivoObligatorio: d.archivoObligatorio,
                                                                labelArchivo: d.labelArchivo,
                                                                proximosEstado: d.proximosEstado,
                                                                sePuedeAvanzar: d.sePuedeAvanzar,
                                                                mensajeError: d.mensajeError,
                                                                primerEstado: d.primerEstado,
                                                                editarEncomienda: d.editarEncomienda,
                                                                tituloModal: d.tituloModal,
                                                                anvazaCliente: d.anvazaCliente,
                                                                numero: d.numero,} })
            })
        });

        apiFunctions.get(api.usuarios.perfil, null, this.props.depth, null, (response) => {
            let usuario_id = (response.data.id) ? (response.data.id) : (null)
            this.setState({
                usuario_id: usuario_id,
            });
        });
    }

    render() {
        const { ar_estados, usuario_id } = this.state;
        const outerSort = [
        //   {
        //     id: 'nombre',
        //     desc: false
        //   },
        ];
        
        return (
            <ParadigmaTable
                buttons={[
                    {
                        create: true,
                        component: (props) => <Modal {...props} action="CREATE" ar_estados={ar_estados} />,
                        permission: 'encomiendaprofesional_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" ar_estados={ar_estados} />,
                        permission: 'encomiendaprofesional_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" ar_estados={ar_estados} />,
                        permission: 'encomiendaprofesional_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DELETE" ar_estados={ar_estados} />,
                        permission: 'encomiendaprofesional_delete',
                    },
                    {
                        edit: true,
                        component: (props) => <ModalDiasEstimados {...props} action="EDIT" ar_estados={ar_estados} />,
                        permission: 'encomiendaprofesional_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <CambioEstado {...props} ar_estados={ar_estados} action="DELETE" />,
                        permission: 'encomiendaprofesional_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <CambioEstado {...props} ar_estados={ar_estados} action="EDIT" />,
                        permission: 'encomiendaprofesional_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <ModalEvento onSubmit={() => {}} encomienda_id={(props.id()!=false ? props.id() : null)} ar_estados={ar_estados} usuario_id={usuario_id} action="CREATEEP" />,
                        permission: 'encomiendaprofesional_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <ModalResumenDeuda {...props} action="DETAIL" /*ar_estados={ar_estados}*/ />,
                        permission: 'encomiendaprofesional_detail',
                    },
                ]}
                apiUrl={api.expedientes.encomiendaprofesional}
                columns={this.state.columns}
                /* exportUrl={api.expedientes.encomiendaprofesional} */
                title={"Encomienda Profesional."}
                outerSort={outerSort}
            />
        );
    }
}

export default EncomiendaProfesional;
