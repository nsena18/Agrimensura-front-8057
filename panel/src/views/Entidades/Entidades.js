import React, { Component } from 'react';
import axios from "axios";

import api from '../../api/api';
import { formatCurrency } from '../../functions/functions';

import Modal from "./Modal"

import ParadigmaTable from "../../components/ParadigmaTable/ParadigmaTable";
import { format } from '../../functions/functions';
import NumericFilter from '../../components/ParadigmaTable/NumericFilter';
import DateFilter from "../../components/ParadigmaTable/DateFilter";
import ParadigmaDatePicker from '../../components/ParadigmaDatePicker/ParadigmaDatePicker';
import moment from 'moment';

class Entidades extends Component {
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
                    Header: "Nombre",
                    id: "nombre",
                    accessor: "nombre",
                    show: true,
                },
                {
                    Header: "Telefono",
                    id: "telefono",
                    accessor: "telefono",
                    show: true,
                }, {
                    Header: "Direccion",
                    id: "direccion",
                    accessor: "direccion",
                    show: true,
                },
                {
                    Header: "Email",
                    id: "email",
                    accessor: "email",
                    show: true,
                },
                {
                    Header: "Tipo de Entidad",
                    id: "tipoEntidad",
                    accessor: "tipoEntidad.nombre",
                    show: true,
                }
            ]
        };
    }

    render() {
        const { data, pages, loading } = this.state;
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
                        create: true,
                        component: (props) => <Modal {...props} action="CREATE" />,
                        permission: 'entidades_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" />,
                        permission: 'entidades_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" />,
                        permission: 'entidades_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DELETE" />,
                        permission: 'entidades_delete',
                    },
                ]}
                apiUrl={api.comitentes.entidades}
                columns={this.state.columns}
                /* exportUrl={api.comitentes.profesiones} */
                title={"Entidades"}
                outerSort={outerSort}
            />
        );
    }
}

export default Entidades;
