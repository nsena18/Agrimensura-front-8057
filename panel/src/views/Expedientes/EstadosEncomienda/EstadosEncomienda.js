import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';

import Modal from "./Modal";
// import Ordenamiento from "./Ordenamiento";s

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable"

class Canales extends Component {
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
                    Header: "Número",
                    id: "numero",
                    accessor: "numero",
                    show: true,
                },
                {
                    Header: "Nombre",
                    id: "nombre",
                    accessor: "nombre",
                    show: true,
                },
                {
                    Header: "BackGround color",
                    id: "background",
                    accessor: d => (d.background)?(<div style={{height: '100%'}}>
                                                            <div
                                                                className="btn py-0"
                                                                style={{
                                                                    background: `#${d.background}`,
                                                                    width: 30,
                                                                    height: '80%',
                                                                    marginRight: 10,
                                                                }}
                                                            > 
                                                            </div>
                                                        {d.background}
                                                        </div>
                                                        ):(''),
                    show: true,
                },
                {
                    Header: "Text color",
                    id: "texto",
                    accessor: d => (d.texto)?(<div style={{height: '100%'}}>
                                                            <div
                                                                className="btn py-0"
                                                                style={{
                                                                    background: `#${d.texto}`,
                                                                    width: 30,
                                                                    height: '80%',
                                                                    marginRight: 10,
                                                                }}
                                                            > 
                                                            </div>
                                                        {d.texto}
                                                        </div>
                                                        ):(''),
                    show: true,
                },
                {
                    Header: "Días Estimados",
                    id: "diasEstimados",
                    accessor: "diasEstimados",
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
                        permission: 'superadmin',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" />,
                        permission: 'estadosencomienda_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" />,
                        permission: 'estadosencomienda_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DELETE" />,
                        permission: 'superadmin',
                    }
                    // {
                    //     edit: true,
                    //     component: (props) => <Ordenamiento {...props} action="DETAIL" />,
                    //     permission: 'estadosencomienda_detail',
                    // },
                ]}
                apiUrl={api.expedientes.estadosencomienda}
                columns={this.state.columns}
                exportUrl={api.expedientes.estadosencomienda}
                title={"Estados Encomienda"}
            />
        );
    }
}

export default Canales;
