import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group'
import { Button, UncontrolledTooltip } from 'reactstrap';
import './SidebarMenu.css';

class SidebarMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: 0
        }
    }

    componentWillMount() {
        const order = parseInt(localStorage.getItem('sidebar_selected_item'));
        if (order) {
            this.onButtonClick(order);
        }
    }

    componentDidUpdate() {
        localStorage.setItem('sidebar_selected_item', this.state.order);
    }

    onButtonClick = (order) => {
        this.props.onChange(order);
        this.setState({
            order: order
        });
    }

    render() {
        const colors = [
            'success',
            'warning',
            'danger',
            'info'
        ];
        return (
            <div className={'text-center my-1 ' + (this.props.hide ? 'd-none' : '') }>
                {this.props.list.map((superitem, i) => 
                    
                    <CSSTransitionGroup
                        transitionName="example"
                        transitionAppear={true}
                        transitionAppearTimeout={400*i+100}
                        transitionEnter={false}
                        transitionLeave={false}
                        key={i}
                    >
                        <Button
                            className="m-1 btn-primary"
                            active={i === this.state.order}
                            color={colors[i % 4]}
                            onClick={() => this.onButtonClick(i)}
                            id={'id' + i}
                        >
                            <i className={superitem.icon}></i>
                        </Button>
                        <UncontrolledTooltip placement="bottom" target={'id' + i}>
                            {superitem.name}
                        </UncontrolledTooltip>
                    </CSSTransitionGroup>
                )}
                
            </div>
        );
    }
}

export default SidebarMenu;