import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"
import { Container } from 'reactstrap';

@inject('gridViewState', 'gridBody')
@observer
class RowView extends Component {


    render() {

        const { gridViewState, gridBody } = this.props;
        const styleContainer = { paddingLeft: '0px', paddingRight: '0px', marginLeft: '0px', marginRight: '0px', };

        if (gridViewState.viewMode === 'row' & gridBody ===true) {

            return (
               <Fragment>
                {this.props.children }
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

export default RowView;
