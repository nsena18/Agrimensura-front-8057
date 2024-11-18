import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ParadigmaModal from "../../../components/ParadigmaModal/ParadigmaModal.js"
import api from "../../../api";

import axios from "axios";

import ParadigmaLabeledInput from "../../../components/ParadigmaLabeledInput/ParadigmaLabeledInput.js"


import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Label, Input, InputGroup, FormFeedback } from 'reactstrap';

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            errors: {},
            postVariables: ['email'],
        };
    }

    static propTypes = {
        onSubmit: PropTypes.func,
        id: PropTypes.func,
        action: PropTypes.oneOf(['CREATE']).isRequired,
    }

    resetForm() {
        this.setState({
            email: "",
            errors: {},
        });
    }

    getData() {
        const { action } = this.props;
        const { email, postVariables } = this.state;

        let data = {};
        postVariables.forEach(x => {
            data[x] = this.state[x];
        });
        return data;
        //return false;
    }

    setData(data) {
        this.setState({
            email: data.email,
        });
    }

    setErrors(errors) {
        this.setState({
            errors: errors,
        });
    }

    modalVars() {
        const { action } = this.props;
        if (action == "CREATE") {
            return {
                get: false,
                submitType: "POST",
                title: "Recuperar contraseña",
                buttonTitle: "",
                danger: false,
                buttonIcon: "",
                buttonLabel: "Olvido su contraseña?",
                showConfirmationMessages: true,
                successMessage: "Se ah enviado un mail para restaurar la contraseña",
                saveButton: true,
                buttonClass: "forgottenPass",
                saveButtonLabel: "Enviar",
                disabled: false,
            };
        } 
    }

    onSubmit = (e) =>{
        return true
    }

    render() {
        const { email, errors } = this.state;
        let vars = this.modalVars();
        return (
            <ParadigmaModal
                getUrl={(vars.get ? api.usuarios.forgottenpass : null)}
                submitUrl={(vars.submitType ? api.usuarios.forgottenpass : null)}
                submitType={vars.submitType}
                // id={() => { return ('forgotten') }}

                onGotData={(data) => this.setData(data)}
                onGotErrors={(errors) => this.setErrors(errors)}
                onSubmit={(e) => this.onSubmit(e)}
                onClose={() => this.resetForm()}
                onPreSubmit={() => this.getData()}
                //onValidation={() => this.validate()}

                title={vars.title}
                danger={vars.danger}
                warning={vars.warning}
                showConfirmationMessages={vars.showConfirmationMessages}
                successMessage={vars.successMessage}
                missingIdMessage={"Debe seleccionar una fila."}
                backdropToggle
                buttonLabel={vars.buttonLabel}
                buttonTitle={vars.buttonTitle}
                buttonClass={vars.buttonClass}
                buttonIcon={vars.buttonIcon}
                saveButton={vars.saveButton}
                saveButtonLabel={vars.saveButtonLabel}
                closeButton={true}
                className="modal-md"

                escClose={true}
            >

                <ParadigmaLabeledInput
                        disabled={vars.disabled}
                        md={[2, 10]}
                        label={"E-mail"}
                        value={email}
                        type={'email'}
                        onChange={(e) => {
                            this.setState({ email: e.target.value });
                        }}
                        error={(this.state.errors ? this.state.errors.email : null)}
                    />

            </ParadigmaModal>
        );
    }
}

export default Edit;

