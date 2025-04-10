import React, { Component } from 'react';
import axios from "axios";

import api from '../../../api/api';
import apiFunctions from "../../../api/functions.js"
import { formatCurrency } from '../../../functions/functions';

import ParadigmaTable from "../../../components/ParadigmaTable/ParadigmaTable";


class PlantillaVisaciones extends Component {
    constructor() {
        super();
        this.state = {
            ar_estados: [],
            usuario_id: null,
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
                    Header: "N° Orden",
                    id: "nroOrden",
                    accessor: "nroOrden",
                    width: 150,
                    exportWidth: '8%',
                    show: true,
                },
                {
                    Header: "Teléfono",
                    id: "comitente_telefonos",
                    accessor: d => (d.comitente_telefonos!=', , ') ? (d.comitente_telefonos) : (''),
                    width: 150,
                    exportWidth: '7%',
                    show: true,
                },
                {
                    Header: "Domicilio",
                    id: "domicilio",
                    exportWidth: '8%',
                    accessor: "domicilio",
                    show: true,
                },
            ]
        };
    }

    componentDidMount = () => {
        // Cargo los estados de la encomienda con sus respectivos colores
    }

    render() {
        const { ar_estados, usuario_id } = this.state;
        const outerSort = [
        //   {
        //     id: 'nombre',
        //     desc: false
        //   },
        ];
        
        return (
            <ParadigmaTable
                buttons={[
                    
                ]}
                apiUrl={null}
                columns={this.state.columns}
                exportUrl={null}
                title={"Visaciones"}
                outerSort={outerSort}
            />
        );
    }
}

export default PlantillaVisaciones;
