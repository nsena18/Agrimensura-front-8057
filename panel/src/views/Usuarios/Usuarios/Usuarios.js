import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from '../../../api/';

import Modal from "./Modal.js"

import ParadigmaTable from "../../../components/ParadigmaTable/"

import FormatFunctions from "../../../functions/functions";


class Usuarios extends Component {
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
                    id: "apellido_nombre",
                    accessor: d => d.apellido_nombre,
                    show: true,
                    width: 300,
                },
                {
                    Header: "Usuario",
                    id: "username",
                    accessor: "username",
                    filterable: true,
                    show: true,
                },
                {
                    Header: "Email",
                    id: "email",
                    accessor: "email",
                    filterable: true,
                    show: true,
                },
                {
                    Header: "Grupo",
                    id: "grupos",                    
                    accessor: d => (d.grupos && d.grupos[0] ? d.grupos[0].nombre : 'Sin Asignar'),
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
        additionalFields: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            onGet: PropTypes.string.isRequired, // (data: data que llega del servidor) => objeto: { key: value } lo que retorna se setea en el estado
            onPost : PropTypes.string.isRequired, // (data: data del estado que se envia al servidor) => objeto: { key: value } lo que se envia al servidor
            Input: PropTypes.func.isRequired, // (state, setThis, disabled, error) => <Input />
        })),
    }

    render() {
        const { data, pages, loading } = this.state;
        const { additionalFields } = this.props;
        const { modernTheme } = this.props;
        return (
            <ParadigmaTable
                modernTheme={modernTheme}
                buttons={[
                    {
                        create: true,
                        permission: 'usuarios_new',
                        component: (props) => <Modal {...props} action="CREATE" additionalFields={additionalFields} />,
                    },
                    {
                        edit: true,
                        permission: 'usuarios_edit',
                        component: (props) => <Modal {...props} action="EDIT" additionalFields={additionalFields} />,
                    },
                    {
                        detail: true,
                        permission: 'usuarios_detail',
                        component: (props) => <Modal {...props} action="DETAIL" additionalFields={additionalFields} />,
                    },
                    {
                        edit: true,
                        permission: 'usuarios_lock',
                        component: (props) => <Modal {...props} action="LOCK" additionalFields={additionalFields} />,
                    },
                    {
                        edit: true,
                        permission: 'usuarios_unlock',
                        component: (props) => <Modal {...props} action="UNLOCK" additionalFields={additionalFields} />,
                    },
                    {
                        delete: true,
                        permission: 'usuarios_delete',
                        component: (props) => <Modal {...props} action="DELETE" additionalFields={additionalFields} />,
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
