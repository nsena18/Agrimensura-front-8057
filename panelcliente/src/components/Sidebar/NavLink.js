import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import NavDropdown from './NavDropdown';
import { NavLink as RrNavLink, matchPath } from 'react-router-dom';
import { Badge, NavItem, NavLink as RsNavLink } from 'reactstrap';
import { DragSource } from 'react-dnd';

/**
 * Crea un NavLink de acuerdo a las propiedades que contenga.
 * @prop item Object
 */
class NavLink extends Component {

    static propTypes = {
        onChildOpen: PropTypes.func,
        item: PropTypes.object,
        path: PropTypes.string,
        connectDragSource: PropTypes.func,
        parentPath: PropTypes.string,
    }

    componentDidMount() {
        const { onChildOpen } = this.props;
        if (this.isActive() && onChildOpen) {
            onChildOpen();
        }
    }

    isActive = () => {
        const { item, path } = this.props;
        return item.url && matchPath(path, {
            path: item.url,
            exact: true
        });
    }

    onChildOpen = () => {
        const { onChildOpen } = this.props;
        if (onChildOpen) onChildOpen();
    }

    render() {
        const { item, connectDragSource } = this.props;
    
        const classes = classNames(item.class);
        const isExternal = (url) => url.substring(0, 4) === 'http';
        const variant = classNames('nav-link', item.variant ? `nav-link-${item.variant}` : '');

        const isActive = this.isActive();
   
        const result = (
            <div> {
                
                // Es un title
                item.title ?
                <li className={ classNames('nav-title', title.class) }>
                    {
                        item.wrapper && item.wrapper.element ?
                        React.createElement(item.wrapper.element, item.wrapper.attributes, item.name) :
                        item.name
                    }
                </li> :
    
                //Es un divider
                item.divider ?
                <li className="divider"></li> :
    
                // Tiene children
                item.children || (item.items && item.items.length) ?
                <NavDropdown
                    item={item}
                    parentPath={(this.props.parentPath ? (this.props.parentPath + ' > ') : '') + item.name}
                    path={this.props.path}
                    isOpen={isActive}
                    onChildOpen={this.onChildOpen}
                /> :
    
                // Es un componente
                item.component ?
                <item.component nav={item} /> :
    
                // Default
                <NavItem className={classes} >
                    {
                        // Si es una url externa
                        !item.url || isExternal(item.url) ?
    
                        // Muestra un tag a
                        <RsNavLink href={item.url} className={variant + ' ' + (!item.icon ? 'no-icon' : '')}>
                            <i className={item.icon}></i>
                            {item.name}
                            {item.badge &&
                                <Badge
                                    className={classNames(item.badge.class)}
                                    color={item.badge.variant}
                                >
                                    {item.badge.text}
                                </Badge>
                            }
    
                        </RsNavLink> :
    
                        // Usa react-router para redirigir internamente
                        <RrNavLink
                            to={item.url}
                            className={variant + ' ' + (!item.icon ? 'no-icon' : '')}
                            activeClassName="active"
                            isActive={() => !!isActive}
                        >
                            <i className={item.icon}></i>
                            {item.name}
                            {item.badge &&
                                <Badge
                                    className={classNames(item.badge.class)}
                                    color={item.badge.variant}
                                >
                                    {item.badge.text}
                                </Badge>
                            }
                        </RrNavLink>
                    }
                </NavItem>
            } </div>
        );
        if (!item.children && !item.items) {
            return connectDragSource(result);
        }
        return result;
    }
}

const cardSource = {
    beginDrag(props) {
        return {
            name: props.item.name,
            icon: props.item.icon,
            url: props.item.url,
            parentIcon: props.parentIcon,
            parentPath: (props.parentPath ? (props.parentPath + ' > ') : '') + props.item.name,
            component: props.item.component
        };
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

export default DragSource('navlink', cardSource, collect)(NavLink);