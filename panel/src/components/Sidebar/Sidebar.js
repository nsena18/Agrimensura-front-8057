import React, { Component } from 'react';
import SidebarMenu from './SidebarMenu';
import NavList from './NavList';
import SidebarMinimizer from '../SidebarMinimizer/SidebarMinimizer';
import menues from '../Menues';
import { Nav, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';

import './Sidebar.css';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
            collapsed: false
        }
    }

    onSidebarMenuChange = (order) => {
        this.setState({
            selected: order
        });
    }

    onSidebarMinimize = (collapsed) => {
        this.setState({
            collapsed
        });
    }

    render() {
        const list = menues.root.map((superitem) => ({ icon: superitem.icon, name: superitem.name }));
        return (
            <div className="sidebar">
                <nav className="sidebar-nav">
                    <Nav>
                        {list.length > 1 &&
                            <SidebarMenu
                                list={list}
                                hide={this.state.collapsed}
                                onChange={this.onSidebarMenuChange}
                            />
                        }
                        <NavList
                            items={(!this.state.collapsed || list.length === 1) && menues.root[this.state.selected].items}
                            root={this.state.collapsed ? menues.root : null}
                            path={this.props.location.pathname}
                        />
                    </Nav>
                </nav>
                <SidebarMinimizer
                    onSidebarMinimize={this.onSidebarMinimize}
                />
                <span className="author-brand mx-auto"><a href="#">Agrimensura </a> &copy; {new Date().getFullYear()}</span>
            </div>
        );
    }
}

export default Sidebar;
