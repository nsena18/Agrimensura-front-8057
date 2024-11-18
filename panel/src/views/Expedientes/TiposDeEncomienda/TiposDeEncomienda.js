import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';
import { formatCurrency } from '../../../functions/functions';

import Modal from "./Modal"

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable";
import moment from 'moment';

class TiposDeEncomienda extends Component {
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
                    Header: "Abreviatura",
                    id: "abreviatura",
                    accessor: "abreviatura",
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
                        permission: 'tiposdeencomienda_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" />,
                        permission: 'tiposdeencomienda_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" />,
                        permission: 'tiposdeencomienda_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DELETE" />,
                        permission: 'tiposdeencomienda_delete',
                    },
                ]}
                apiUrl={api.expedientes.tiposdeencomienda}
                columns={this.state.columns}
                exportUrl={api.expedientes.tiposdeencomienda}
                title={"Tipo de Encomienda"}
                outerSort={outerSort}
            />
        );
    }
}

export default TiposDeEncomienda;
