import React, {Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import NavLink from './NavLink';

import auth from "../../auth";

// const NavList = props => {
class NavList extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    static propTypes = {
    // NavList.propTypes = {
        items: PropTypes.arrayOf(PropTypes.object),
        root: PropTypes.arrayOf(PropTypes.object),
        parentIcon: PropTypes.string,
        parentPath: PropTypes.string,
        path: PropTypes.string,
        onChildOpen: PropTypes.func,
    }

    permiso = (item) => {
        let rta = false;
        // valido si tiene permiso el item
        if (item.permission=='' || (item.permission && auth.hasPermission(item.permission))){
            rta=true;
        }else{
            // si no tiene valido si algun hijo tiene permiso
            if (item.items && item.items.length>0){
                let items = item.items;
                for (let i=0; i<items.length; i++){
                    rta = this.permiso(items[i])
                    if (rta==true){
                        break;
                    }
                }
            }
        }
        return rta
    }

    render(){
    const items = this.props.items ? this.props.items : this.props.root;
    return (
        <Fragment>
            { items && items.map((item, i) => {
                let permission = false;
                if (item.permission && auth.hasPermission(item.permission)) {
                    permission = true;
                }else if (!item.permission) {
                    permission = this.permiso(item);
                }
                
                // if (!item.permission || auth.hasPermission(item.permission)) {
                if(permission){
                    return (
                        <NavLink
                            item={item}
                            key={i}
                            parentIcon={this.props.parentIcon}
                            parentPath={this.props.parentPath}
                            path={this.props.path}
                            onChildOpen={this.props.onChildOpen}
                        />
                    );
                }
            }) }
        </Fragment>
        );
    }
}



export default NavList;