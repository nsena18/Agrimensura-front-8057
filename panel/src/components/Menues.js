import EditMailConfig from '../views/Mails/Edit.js';

export default {
	root: [{
		name: 'General',
		items: [
			{
				name: 'Expedientes',
				icon: 'fa fa-file-text-o',
				items: [
					{
						name: 'Encomienda',
						url: '/encomiendaprofesional',
						// icon: 'fa fa-user',
						permission: 'encomiendaprofesional_view'
					},
					{
						name: 'Historial Enc.',
						url: '/historialencomienda',
						// icon: 'fa fa-user',
						permission: 'encomiendaprofesional_view'
					},
					
				]
			},
			{
				name: 'Cta Cte',
				icon: 'fa fa-dollar',
				items: [
					/*{
						name: 'Cuentas Corrientes',
						url: '/ctacte/cuentascorrientes',
						// icon: 'fa fa-dollar',
						// permission: 'usuarios_view'
					},*/	
					{
						name: 'Estado de Deuda',
						url: '/ctacte/estadodeuda',
						// icon: 'fa fa-dollar',
						permission: 'cuentascorrientes_view'
					},	
					{
						name: 'Cobros de Deuda',
						url: '/ctacte/cobrosdeudas',
						// icon: 'fa fa-dollar',
						permission: 'cuentascorrientes_view'
					},	
					{
						name: 'Medios de Pago',
						url: '/ctacte/mediosdepago',
						// icon: 'fa fa-dollar',
						permission: 'mediosdepago_view'
					},	
				]
			},
			{
				name: 'Comitentes',
				url: '/comitentes/',
				icon: 'fa fa-user-circle-o',
				permission: 'comitentes_view'
			},
			{
				name: 'Notas',
				url: '/notas/',
				icon: 'fa fa-sticky-note-o',
				permission: 'notas_view'
			},
			{
				name: 'Calendario',
				url: '/micalendario/',
				icon: 'fa fa-calendar',
				permission: 'eventoscalendar_view'
			},
			{
				name: 'Configuración',
				icon: 'fa fa-cogs',
				items: [
					{
						name: 'Encomiendas',
						items: [
							{
								name: 'Tipos de Encomienda',
								url: '/tiposdeencomienda',
								// icon: 'fa fa-user',
								permission: 'tiposdeencomienda_view'
							},
							{
								name: 'Objetos de Trabajo',
								url: '/objetosdetrabajo',
								// icon: 'fa fa-user',
								permission: 'objetosdetrabajo_view'
							},
							{
								name: 'Estado Lotes',
								url: '/estadolotes',
								// icon: 'fa fa-user',
								permission: 'estadolotes_view'
							},
							{
								name: 'Situacion Lotes',
								url: '/situacionlotes',
								// icon: 'fa fa-user',
								permission: 'situacionlotes_view'
							},
							{
								name: 'Estados Encomienda',
								url: '/estadosencomienda',
								// icon: 'fa fa-user',
								permission: 'estadosencomienda_view'
							},
						]
					},
					/*{
						name: 'Categorias',
						url: '/categorias/',
						// icon: 'fa fa-cubes',
						// permission: 'usuarios_view'
					},*/
					{
						name: 'Profesiones',
						url: '/profesiones/',
						// icon: 'fa fa-university',
						permission: 'profesiones_view'
					},
					{
						name: 'Geograficas',
						// icon: 'fa fa-globe',
						items: [
							{
								name: 'Provincias',
								url: '/provincias',
								// icon: 'fa fa-user',
								permission: 'provincias_view'
							},
							{
								name: 'Localidad',
								url: '/localidades',
								// icon: 'fa fa-lock',
								permission: 'localidades_view'
							},
						]
					},
					{
						name: 'Tipos de Eventos',
						url: '/tipoeventos',
						// icon: 'fa fa-user',
						permission: 'tipoeventos_view'
					},
				]
			},
			{
				name: 'Mails',
				icon: 'fa fa-envelope-o',
				// permission: 'config_mail',
				items: [
					{
						name: 'Configuración',
						className: 'nav-link',
						component: EditMailConfig,
						permission: 'email_configuracionmail_view'
					},
					{
						name: 'Casillas',
						url: '/mails/casillas',
						permission: 'email_casillas_view'
					},
					{
						name: 'Plantillas',
						url: '/mails/plantillas',
						permission: 'email_plantillas_view'
					}
				]
			},
			{
				name: 'Usuarios',
				icon: 'fa fa-user',
				items: [
					{
						name: 'Usuarios',
						url: '/usuarios/usuarios/',
						icon: 'fa fa-user',
						permission: 'usuarios_view'
					},
					{
						name: 'Permisos',
						url: '/usuarios/permisos/',
						icon: 'fa fa-lock',
						permission: 'superadmin'
					},
					{
						name: 'Grupos',
						url: '/usuarios/grupos/',
						icon: 'fa fa-users',
						permission: 'grupos_view'
					}
				]
			},
		]
	}]
};
