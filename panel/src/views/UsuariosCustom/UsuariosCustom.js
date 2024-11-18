import React, { Component, Fragment } from 'react';

import ParadigmaLabeledInput from '../../components/ParadigmaLabeledInput/ParadigmaLabeledInput';
import ParadigmaAsyncSeeker from "../../components/ParadigmaAsyncSeeker/ParadigmaAsyncSeeker.js";
import api from "../../api";
import Usuarios from '../../views/Usuarios/Usuarios';
import moment from 'moment';
import InputMask from 'react-input-mask';

const UsuariosCustom = props => (
	<Usuarios
		{...props}
		additionalFields={[
			{
				name: 'isStaff',
				onGet: data => ({ isStaff: data.is_staff ? "0" : "1" }), //data from server to state
				onPost: state => ({ is_staff: state.isStaff === '0' }), //data from state to server
				default: '1',
				Input: (state, setIsStaff, disabled, error, setState) => (
					<Fragment>
					<ParadigmaLabeledInput
						label="Tipo de Usuario"
						md={[7, 5]}
						error={error}
						inputComponent={
							<Fragment>
								<label className="mr-2" onClick={() => {
									if (!disabled) {
										setState({ isStaff: '1' })
									}
								}}>
									<input disabled={disabled} type="radio" value="1" checked={state.isStaff === '1'} className="mr-1" />
									Cliente
								</label>
								<label onClick={() => {
									if (!disabled) {
										setState({ isStaff: '0' })
									}
								}}>
									<input disabled={disabled} type="radio" value="0" checked={state.isStaff === '0'} className="mr-1" />
									Administrador
								</label>
							</Fragment>
						}
					/>
					</Fragment>
				)
			},
		]}
	/>
);

export default UsuariosCustom;
