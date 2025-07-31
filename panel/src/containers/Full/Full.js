import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import Dashboard from '../../views/Dashboard/';

import ShortcutsBar from '../../components/ShortcutsBar/ShortcutsBar';

import Usuarios from '../../views/Usuarios/Usuarios/';
import UsuariosCustom from '../../views/UsuariosCustom/UsuariosCustom.js';
import Permisos from '../../views/Usuarios/Permisos/';
import Grupos from '../../views/Usuarios/Grupos/';

import Notas from '../../views/Notas/Notas.js';
import Comitentes from '../../views/Comitentes/Comitentes.js';
import Categorias from '../../views/Categorias/Categorias.js';
import Profesiones from '../../views/Profesiones/Profesiones.js';

import TipoEventos from '../../views/Configuracion/TipoEventos/TipoEventos.js';
import MiCalendario from '../../views/Calendar/MiCalendario.js';

import Provincias from '../../views/Geograficas/Provincias/Provincias.js';
import Localidades from '../../views/Geograficas/Localidades/Localidades.js';

import EstadosEncomienda from '../../views/Expedientes/EstadosEncomienda/EstadosEncomienda.js';
import ObjetosDeTrabajo from '../../views/Expedientes/ObjetosDeTrabajo/ObjetosDeTrabajo.js';
import TiposDeEncomienda from '../../views/Expedientes/TiposDeEncomienda/TiposDeEncomienda.js';
import EstadoLotes from '../../views/Expedientes/EstadoLotes/EstadoLotes.js';
import SituacionLotes from '../../views/Expedientes/SituacionLotes/SituacionLotes.js';
import EncomiendaProfesional from '../../views/Expedientes/EncomiendaProfesional/EncomiendaProfesional.js';

import Plantillas from '../../views/Mails/Plantillas/';
import Casillas from '../../views/Mails/Casillas/';

import HistorialEncomienda from '../../views/Expedientes/Reportes/HistorialEncomienda.js'

import CuentasCorrientes from '../../views/CuentasCorrientes/CuentasCorrientes/CuentasCorrientes.js'
import EstadoDeuda from '../../views/CuentasCorrientes/EstadoDeuda/EstadoDeuda.js'
import CobrosDeudas from '../../views/CuentasCorrientes/CobrosDeudas/CobrosDeudas.js'
import MediosDePago from '../../views/CuentasCorrientes/MediosDePago/MediosDePago.js'

import VisacionesPlantillas from '../../views/Visaciones/Plantillas/Visaciones.js';
import Visaciones from '../../views/Visaciones/Visar/Visaciones.js';

import PlantillasVisaciones from '../../views/Expedientes/Visaciones/EstadoVisaciones.js';
import EstadosVisaciones from '../../views/Expedientes/EstadosVisaciones/Estados.js';

import VisacionesEncomieda from '../../views/Expedientes/VisacionesEncomienda/VisacionesEncomienda.js';
import AgrupacionVisaciones from '../../views/Expedientes/VisacionesAgrupacion/VisacionesAgrupacion.js';
import TiposEntidades from '../../views/TiposEntidades/TiposEntidades.js';
import Entidades from '../../views/Entidades/Entidades.js';
import IdleTimer from 'react-idle-timer';

import auth from '../../auth/auth';

class Full extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idle: false
        }
        this.idleTimer = null;
    }

    onIdle = e => {
        auth.logout();
        this.setState(() => ({
            idle: true
        }));
    }

    render() {
        if (this.state.idle) {
            return <Redirect to="/locked" />
        }

        return (
            <div className="app">
                <IdleTimer
                    ref={ref => { this.idlerTimer = ref }}
                    element={document}
                    onIdle={this.onIdle}
                    timeout={99999 * 60 * 30}
                > {/*30 Minutos*/}
                    <Header />
                    <div className="app-body">
                        <Sidebar {...this.props} />
                        <main className="main">
                            <Container fluid>
                                <Switch>
                                    <Route path="/dashboard" name="Dashboard" component={Dashboard} />

                                    <Route path="/usuarios/usuarios" name="Usuarios" component={UsuariosCustom} />
                                    <Route path="/usuarios/permisos" name="Permisos" component={Permisos} />
                                    <Route path="/usuarios/grupos" name="Grupos" component={Grupos} />

                                    <Route path="/notas" name="Notas" component={Notas} />
                                    <Route path="/comitentes" name="Comitentes" component={Comitentes} />

                                    <Route path="/categorias" name="Categorias" component={Categorias} />
                                    <Route path="/profesiones" name="Profesiones" component={Profesiones} />

                                    <Route path="/provincias" name="Provincias" component={Provincias} />
                                    <Route path="/localidades" name="Localidades" component={Localidades} />

                                    <Route path="/tipoeventos" name="TipoEventos" component={TipoEventos} />
                                    <Route path="/micalendario" name="MiCalendario" component={MiCalendario} />

                                    <Route path="/estadosencomienda" name="EstadosEncomienda" component={EstadosEncomienda} />
                                    <Route path="/objetosdetrabajo" name="ObjetosDeTrabajo" component={ObjetosDeTrabajo} />
                                    <Route path="/tiposdeencomienda" name="TiposDeEncomienda" component={TiposDeEncomienda} />
                                    <Route path="/estadolotes" name="EstadoLotes" component={EstadoLotes} />
                                    <Route path="/situacionlotes" name="SituacionLotes" component={SituacionLotes} />

                                    <Route path="/encomiendaprofesional" name="EncomiendaProfesional" component={EncomiendaProfesional} />

                                    <Route path="/visaciones" name="Visaciones Encomienda" component={VisacionesEncomieda} />

                                    <Route path="/mails/casillas" name="Casillas" component={Casillas} />
                                    <Route path="/mails/plantillas" name="Plantillas" component={Plantillas} />

                                    <Route path="/ctacte/cuentascorrientes" name="CuentasCorrientes" component={CuentasCorrientes} />
                                    <Route path="/ctacte/estadodeuda" name="EstadoDeuda" component={EstadoDeuda} />
                                    <Route path="/ctacte/cobrosdeudas" name="CobrosDeudas" component={CobrosDeudas} />
                                    <Route path="/ctacte/mediosdepago" name="MediosDePago" component={MediosDePago} />

                                    <Route path="/visaciones/plantillas" name="PlantillaVisaciones" component={VisacionesPlantillas} />
                                    <Route path="/visaciones/gestion" name="Visaciones" component={Visaciones} />

                                    <Route path="/estadosvisaciones" name="EstadosVisaciones" component={EstadosVisaciones} />
                                    <Route path="/plantillasvisaciones" name="PlantillasVisaciones" component={PlantillasVisaciones} />

                                    <Route path="/agrupacionvisaciones" name="AgrupacionVisaciones" component={AgrupacionVisaciones} />
                                    <Route path="/tiposentidades" name="TiposEntidades" component={TiposEntidades} />
                                    <Route path="/entidades" name="Entidades" component={Entidades} />


                                    <Redirect from="/" to="/dashboard" />
                                </Switch>
                            </Container>
                        </main>
                    </div>
                    {/* <ShortcutsBar /> */}
                </IdleTimer>
            </div>
        );
    }
}

export default Full;
