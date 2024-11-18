import React, { Component } from 'react';
import axios from "axios";
import PropTypes from 'prop-types';

import api from '../../../api/';

import Modal from "./Modal.js"

import ParadigmaTable from "../../../components/ParadigmaTable/"

import FormatFunctions from "../../../functions/functions";


class Usuarios extends Component {
    constructor(props) {
        super(props);
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
                    id: "apellido_nombre",
                    accessor: d => d.apellido_nombre,
                    show: true,
                    width: 300,
                },
                {
                    Header: "Email",
                    id: "email",
                    accessor: "email",
                    filterable: true,
                    show: true,
                },
                {
                    Header: "Fecha Registro",
                    id: "date_joined",
                    className: "text-center",
                    accessor: d => FormatFunctions.DateTimeFormatter(d.date_joined),
                    filterable: true,
                    width: 200,
                    show: true,
                },
                {
                    Header: "Activo",
                    id: "is_active",
                    className: "text-center",
                    accessor: d => (d.is_active ? "SI" : "NO"),
                    filterable: true,
                    width: 100,
                    show: true,
                },
            ]
        };
    }

    static propTypes = {
        modernTheme: PropTypes.bool,
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
                        permission: 'usuarios_new',
                        component: (props) => <Modal {...props} action="CREATE" />,
                    },
                    {
                        edit: true,
                        permission: 'usuarios_edit',
                        component: (props) => <Modal {...props} action="EDIT" />,
                    },
                    {
                        detail: true,
                        permission: 'usuarios_detail',
                        component: (props) => <Modal {...props} action="DETAIL" />,
                    },
                    {
                        edit: true,
                        permission: 'usuarios_habilitar',
                        component: (props) => <Modal {...props} action="LOCK" />,
                    },
                    {
                        edit: true,
                        permission: 'usuarios_deshabilitar',
                        component: (props) => <Modal {...props} action="UNLOCK" />,
                    },
                    {
                        edit: true,
                        permission: 'usuarios_delete',
                        component: (props) => <Modal {...props} action="DELETE" />,
                    },
                ]}

                apiUrl={api.usuarios.usuarios}
                columns={this.state.columns}
                exportUrl={api.usuarios.usuarios}
                title={"Usuarios"}
            />
        );
    }
}

export default Usuarios;
