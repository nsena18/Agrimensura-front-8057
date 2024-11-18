import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';
import apiFunctions from "../../../api/functions.js"
import { formatCurrency } from '../../../functions/functions';

import ModalCobros from "./ModalCobros"
import ModalCuentaCorriente from "./ModalCuentaCorriente"

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable";
import { format } from '../../../functions/functions';
import NumericFilter from '../../../components/ParadigmaTable/NumericFilter';
import DateFilter from "../../../components/ParadigmaTable/DateFilter";
import moment from 'moment';

class CobrosDeudas extends Component {
    constructor() {
        super();
        this.state = {
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
                    Header: "apellido",
                    id: "apellido",
                    accessor: "apellido",
                    show:false,
                    private: true,
                },
                {
                    Header: "Nombre",
                    id: "nombre",
                    // accessor: "nombre",
                    accessor: (d) => d.apellido + ' ' + d.nombre,
                    show: true,
                },
                {
                    Header: "Documento",
                    id: "documento",
                    accessor: "documento",
                    show: true,
                },
                {
                    Header: "Teléfono",
                    id: "telefono",
                    accessor: "telefono",
                    show: true,
                },
                {
                    Header: "Dirección",
                    id: "direccion",
                    accessor: "direccion",
                    show: true,
                },
                {
                    Header: "Saldo Cta Cte",
                    id: "totalCtaCte",
                    className: 'text-right',
                    accessor: (d) => formatCurrency(d.totalCtaCte),
                    show: true,
                },
            ],
            ar_estados: [],
        };
    }

    componentWillMount = () =>{
        // Capturo los estados
        apiFunctions.get(api.expedientes.estadosencomiendaSelect, null, null, {sort:['numero']}, 
                        (response) => {
                            this.setState({
                                ar_estados: response.data.map((d) => { return {id: d.numero.toString(), 
                                                                                nombre: d.nombre, 
                                                                                background: d.background, 
                                                                                color: d.texto, 
                                                                                diasEstimados: d.diasEstimados} })
                            })
                        });
    }

    render() {
        const { ar_estados } = this.state;
        const outerSort = [
          {
            id: 'nombre',
            desc: false
          },
        ];
        return (
            <ParadigmaTable
                buttons={[
                    {
                        edit: true,
                        component: (props) => <ModalCobros {...props} action="EDIT" ar_estados={ar_estados}/>,
                        permission: 'comitentes_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <ModalCuentaCorriente {...props} action="DETAIL" ar_estados={ar_estados}/>,
                        permission: 'comitentes_edit',
                    },
                ]}
                apiUrl={api.comitentes.comitentesCtaCte}
                columns={this.state.columns}
                exportUrl={api.comitentes.comitentesCtaCte}
                title={"Cobros Deudas"}
                outerSort={outerSort}
            />
        );
    }
}

export default CobrosDeudas;
