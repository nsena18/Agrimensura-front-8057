import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';
import { formatCurrency } from '../../../functions/functions';

import Modal from "./Modal"

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable";
import moment from 'moment';
import Estados from '../Visaciones/EstadoVisaciones';

class EstadosV extends Component {
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
                    id: "color_fondo",
                    accessor: d => (d.color_fondo)?(<div style={{height: '100%'}}>
                                                            <div
                                                                className="btn py-0"
                                                                style={{
                                                                    background: `#${d.color_fondo}`,
                                                                    width: 30,
                                                                    height: '80%',
                                                                    marginRight: 10,
                                                                }}
                                                            > 
                                                            </div>
                                                        {d.color_fondo}
                                                        </div>
                                                        ):(''),
                    show: true,
                },
                {
                    Header: "Text color",
                    id: "color_texto",
                    accessor: d => (d.color_texto)?(<div style={{height: '100%'}}>
                                                            <div
                                                                className="btn py-0"
                                                                style={{
                                                                    background: `#${d.color_texto}`,
                                                                    width: 30,
                                                                    height: '80%',
                                                                    marginRight: 10,
                                                                }}
                                                            > 
                                                            </div>
                                                        {d.color_texto}
                                                        </div>
                                                        ):(''),
                    show: true,
                }              
            ],
            
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
                        permission: 'objetosdetrabajo_new',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="EDIT" />,
                        permission: 'objetosdetrabajo_edit',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DETAIL" />,
                        permission: 'objetosdetrabajo_detail',
                    },
                    {
                        edit: true,
                        component: (props) => <Modal {...props} action="DELETE" />,
                        permission: 'objetosdetrabajo_delete',
                    },
                ]}
                apiUrl={api.visaciones.controlestados}
                columns={this.state.columns}
               /*  exportUrl={api.expedientes.objetosdetrabajo} */
                title={"Estados Visaciones"}
                outerSort={outerSort}
            />
        );
    }
}

export default EstadosV;
