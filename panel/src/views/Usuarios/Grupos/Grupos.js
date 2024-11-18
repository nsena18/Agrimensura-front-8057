import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/';

import Modal from "./Modal.js"

import ParadigmaTable from "../../../components/ParadigmaTable/"



class Grupos extends Component {
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
                    accessor: d => d.nombre,
                    show: true,
                },
            ]
        };
    }

    render() {
        const { data, pages, loading } = this.state;
        const { modernTheme } = this.props;
        return (
            <ParadigmaTable
                modernTheme={modernTheme}
                buttons={[
                    {
                        create: true,
                        component: (props) => <Modal {...props} action="CREATE" />,
                        permission: 'grupos_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" />,
                        permission: 'grupos_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" />,
                        permission: 'grupos_detail',
                    },
                    {
                        delete: true,
                        component: (props) => <Modal {...props} action="DELETE" />,
                        permission: 'grupos_delete',
                    }
                ]}
                apiUrl={api.usuarios.grupos}
                columns={this.state.columns}
                exportUrl={api.usuarios.grupos}
                title={"Grupos"}
            />
        );
    }
}

export default Grupos;
