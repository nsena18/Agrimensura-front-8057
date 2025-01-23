import React, { Component } from 'react';
import axios from "axios";

import api from '../../api/api';
import apiFunctions from "../../api/functions.js"
import { formatCurrency } from '../../functions/functions';

import Modal from "./Modal"

import ParadigmaTable from "../../components/ParadigmaTable/ParadigmaTable";
import { format } from '../../functions/functions';
import NumericFilter from '../../components/ParadigmaTable/NumericFilter';
import DateFilter from "../../components/ParadigmaTable/DateFilter";
import ParadigmaDatePicker from '../../components/ParadigmaDatePicker/ParadigmaDatePicker';
import ParadigmaAsyncSeeker from '../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker';
import moment from 'moment';

class Notas extends Component {
    constructor() {
        super();
        this.state = {
            ar_estados: [],
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
                    Header: "Fecha",
                    id: "fecha",
                    // accessor: d => d.fecha,
                    accessor: d => (d.fecha) ? (moment(d.fecha).format('DD-MM-YYYY')) : (''),
                    width: 120,
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
                    Header: "Descripción",
                    id: "descripcion",
                    accessor: "descripcion",
                    show: true,
                },
                {
                    Header: "Autor",
                    id: "autor",
                    accessor: (d) => d.autor ? d.autor.last_name : (''),
                    show: false,
                    private: true,
                },
                {
                    Header: "Autor",
                    id: "autor_id",
                    lookup: "exact",
                    accessor: d => (d.autor) ? (d.autor.last_name+', '+d.autor.first_name) : (''),
                    show: true,
                    Filter: ({ filter, onChange }) =>
                        <ParadigmaAsyncSeeker
                            url={api.usuarios.usuarios}
                            value={filter ? filter.value : ""}
                            onChange={data => (data) ? (onChange(data.id)): ((filter) ? onChange('') : null)}
                            displayField={"apellido_nombre"}
                            parameters={{
                                paginationEnabled:false,
                                sort:['apellido_nombre'],
                                filters:['is_staff=1']
                            }}
                        />
                },
                {
                    Header: "Destinatario",
                    id: "destinatario",
                    accessor: (d) => d.destinatario ? d.destinatario.last_name : (''),
                    show: false,
                    private: true,
                },
                {
                    Header: "Destinatario",
                    id: "destinatario_id",
                    lookup: "exact",
                    accessor: d => (d.destinatario) ? (d.destinatario.last_name+', '+d.destinatario.first_name) : (''),
                    show: true,
                    Filter: ({ filter, onChange }) =>
                        <ParadigmaAsyncSeeker
                            url={api.usuarios.usuarios}
                            value={filter ? filter.value : ""}
                            onChange={data => (data) ? (onChange(data.id)): ((filter) ? onChange('') : null)}
                            displayField={"apellido_nombre"}
                            parameters={{
                                paginationEnabled:false,
                                sort:['apellido_nombre'],
                                filters:['is_staff=1']
                            }}
                        />
                },
                {
                    Header: "encomiendaProfesional",
                    id: "encomiendaProfesional",
                    accessor: (d) => d.encomiendaProfesional ? d.encomiendaProfesional.nroOrden : (''),
                    show: false,
                    private: true,
                },
                {
                    Header: "Encomienda",
                    id: "encomiendaProfesional_id",
                    lookup: "exact",
                    accessor: d => (d.encomiendaProfesional) ? (d.encomiendaProfesional.nroOrden) : (''),
                    show: true,
                    Filter: ({ filter, onChange }) =>
                        <ParadigmaAsyncSeeker
                            url={api.expedientes.encomiendaprofesionalSelect}
                            value={filter ? filter.value : ""}
                            onChange={data => (data) ? (onChange(data.id)): ((filter) ? onChange('') : null)}
                            displayField={"nroOrden"}
                            parameters={{
                                paginationEnabled:false,
                                sort:['fechaIngreso'],
                            }}
                        />
                },
            ],
            asUsuarios: [],
        };
    }

    componentWillMount = () =>{
        apiFunctions.get(api.usuarios.usuarios, null,null, {sort:['apellido_nombre']}, 
                                                    response => {
                                                        var response = response.data;
                                                        this.setState({
                                                            asUsuarios: response,
                                                        });
                                                    });

        apiFunctions.get(api.expedientes.estadosencomiendaSelect, null, null, {sort:['numero']}, (response) => {
                                                        this.setState({
                                                            ar_estados: response.data.map((d) => { return {id: d.numero.toString(), nombre: d.nombre, background: d.background, color: d.texto, diasEstimados: d.diasEstimados} })
                                                        })
                                                    });
    }

    render() {
        const { asUsuarios, ar_estados } = this.state;
        const outerSort = [
          {
            id: 'fecha',
            desc: false
          },
        ];
       
        return (
            <ParadigmaTable
                buttons={[
                    {
                        create: true,
                        component: (props) => <Modal {...props} action="CREATE" asUsuarios={asUsuarios} ar_estados={ar_estados}/>,
                        permission: 'notas_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" asUsuarios={asUsuarios} ar_estados={ar_estados}/>,
                        permission: 'notas_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" asUsuarios={asUsuarios} ar_estados={ar_estados}/>,
                        permission: 'notas_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DELETE" asUsuarios={asUsuarios} ar_estados={ar_estados}/>,
                        permission: 'notas_delete',
                    },
                ]}
                apiUrl={api.notas.notas}
                columns={this.state.columns}
                exportUrl={api.notas.notas}
                title={"Notas"}
                outerSort={outerSort}
            />
        );
    }
}

export default Notas;
