import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';

import Modal from "./Modal"

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable"

class TipoEventos extends Component {
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
                    Header: "Background color",
                    id: "backgroundColor",
                    accessor: d => (d.backgroundColor)?(<div style={{height: '100%'}}>
                                                        <div
                                                            className="btn py-0"
                                                            style={{
                                                                background: `#${d.backgroundColor}`,
                                                                width: 30,
                                                                height: '80%',
                                                                marginRight: 10,
                                                            }}
                                                        > 
                                                        </div>
                                                        {d.backgroundColor}
                                                        </div>
                                                        ):(''),
                    width: 200,
                    show: true,
                },
                {
                    Header: "Text color",
                    id: "color",
                    accessor: d => (d.color)?(<div style={{height: '100%'}}>
                                                <div
                                                    className="btn py-0"
                                                    style={{
                                                        background: `#${d.color}`,
                                                        width: 30,
                                                        height: '80%',
                                                        marginRight: 10,
                                                    }}
                                                > 
                                                </div>
                                                {d.color}
                                                </div>
                                                ):(''),
                    width: 200,
                    show: true,
                },
            ]
        };
    }
    render() {
        const { data, pages, loading } = this.state;
        return (
            <ParadigmaTable
                buttons={[
                    {
                        create: true,
                        component: (props) => <Modal {...props} action="CREATE" />,
                        permission: 'tipoeventos_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" />,
                        permission: 'tipoeventos_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" />,
                        permission: 'tipoeventos_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DELETE" />,
                        permission: 'tipoeventos_delete',
                    }
                ]}
                apiUrl={api.calendar.tipoEventos}
                columns={this.state.columns}
                exportUrl={api.calendar.tipoEventos}
                title={"Tipos de Eventos"}
            />
        );
    }
}

export default TipoEventos;
