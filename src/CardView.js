import React, { Component, Fragment } from 'react';
import { observer, inject, Provider } from "mobx-react"
import { Container } from 'reactstrap';

@inject('gridViewState', 'gridBody')
@observer
class CardView extends Component {

    constructor(props) {
        super(props);
 
    }

    render() {

        const { gridViewState, gridBody } = this.props;
        const styleContainer = { paddingLeft: '0px', paddingRight: '0px', marginLeft: '0px', marginRight: '0px', };

        if (gridViewState.viewMode === 'card' & gridBody===true) {

            return (
                <Fragment>
                    {this.props.children}
                </Fragment>
                );
        }
        else {
            return (
                <Fragment>
                </Fragment>
            );
            }
    }


}

export default CardView;
