import React, { Component } from 'react';

import api from '../../../api/api';
import apiFunctions from "../../../api/functions.js"

import Modal from "./Modal"

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable";

class MediosDePago extends Component {
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
                    Header: "Nombre",
                    id: "nombre",
                    accessor: "nombre",
                    show: true,
                },
            ],
        };
    }

    render() {
        const { asUsuarios, ar_estados } = this.state;
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
                        component: (props) => <Modal {...props} action="CREATE"/>,
                        permission: 'mediosdepago_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT"/>,
                        permission: 'mediosdepago_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL"/>,
                        permission: 'mediosdepago_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DELETE"/>,
                        permission: 'mediosdepago_delete',
                    },
                ]}
                apiUrl={api.cuentasCorrientes.mediosDePago}
                columns={this.state.columns}
                exportUrl={api.cuentasCorrientes.mediosDePago}
                title={"Medios de Pago"}
                outerSort={outerSort}
            />
        );
    }
}

export default MediosDePago;
