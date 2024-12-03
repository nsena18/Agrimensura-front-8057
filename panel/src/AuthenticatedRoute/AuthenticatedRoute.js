import React from "react"
import PropTypes from 'prop-types';
import { Route, Redirect } from "react-router-dom"
import auth from '../auth/'
import { withRouter } from "react-router";

class AuthenticatedRoute extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoggedIn: null,
		};

		this.loginCheck();
	}

	static propTypes = {
		// callback que retorna una url a la que
		// redirecciona y recibe como parámetro la respusta del servidor al checkear token
		onCheck: PropTypes.func,
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.location.pathname != this.props.location.pathname) {
			this.loginCheck();
		}
	}

	loginCheck() {
		auth.isLoggedIn().then(res => {
			const { onCheck } = this.props;
			if (!res) {
				this.props.history.push('/login');
			} else if (onCheck) {
				const check = onCheck(res);
				console.log(check)
				if (check) {					
					if (/^https?:\/\//i.test(check)) {
						window.location.assign(check); // redirecciona a la url
					} else
						//window.location.assign(check);
						this.props.history.push(check);
				} else {
					this.setState({ isLoggedIn: true });
				}
			} else {
				if (!!res)
					this.setState({ isLoggedIn: !!res });
				else
					this.props.history.push('/login');
			}
		});
	}

	render() {
		if (this.state.isLoggedIn === true) {
			const Compo = this.props.component;
			return <Compo {...this.props} />;
		} else {
			return null;
		}
	}
}

export default withRouter(AuthenticatedRoute)