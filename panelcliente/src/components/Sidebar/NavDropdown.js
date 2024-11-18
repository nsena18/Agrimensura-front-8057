import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import NavList from './NavList';

import './NavDropdown.css';

class NavDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        }
    }

    static propTypes = {
        isOpen: PropTypes.bool,
        onChildOpen: PropTypes.func,
        item: PropTypes.object,
        parentPath: PropTypes.string,
        path: PropTypes.string
    }

    componentDidMount() {
        this.setState({ isOpen: this.props.isOpen });
    }

    onToggleDropdown = (e) => {
        e.preventDefault();
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }));
    }

    onChildOpen = () => {
        this.setState({ isOpen: true });
        if (this.props.onChildOpen) {
            this.props.onChildOpen();
        }
    }

    render() {
        const { item } = this.props;
        const children = item.children ? item.children : item.items;
        return (
            <div className="nav">
                {
                    children.filter(c => c !== '').length &&
                    <li className={'nav-item nav-dropdown ' + (this.state.isOpen ? 'open' : '')} >
                        <a
                            href="#"
                            className="nav-link nav-dropdown no-drag"
                            onClick={this.onToggleDropdown}
                        >
                            <i className={item.icon}></i>
                            {item.name}
                        </a>
                        <ul className="nav-dropdown-items">
                            <NavList
                                items={children}
                                parentIcon={item.icon}
                                parentPath={this.props.parentPath}
                                path={this.props.path}
                                onChildOpen={this.onChildOpen}
                            />
                        </ul>
                    </li>
                }
            </div>
        );
    }
}

export default NavDropdown;