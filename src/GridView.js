import React, { Component } from 'react';
import { observer, inject, Provider } from "mobx-react"
import { Container } from 'reactstrap';
import { action, observable } from 'mobx';


class GridViewState {

    @observable viewMode = 'row';

    path = '';

    formState = null;

    @action.bound
    processAction(action) {
        if (action === 'newRow') {
            this.formState.addRow(this.path);
        } else {
            this.viewMode = action;
        };
    };
  
}

@inject('formState', 'path')
@observer
class GridView extends Component {

    constructor(props) {
        super(props);
        const { formState, path } = this.props;
        this.gridViewState = new GridViewState();
        this.gridViewState.viewState = "row";
        this.gridViewState.path = path;
        this.gridViewState.formState = formState;

    }

    render() {
        const styleContainer = { paddingLeft: '0px', paddingRight: '0px', marginLeft: '0px', marginRight: '0px', };

        return (
            <Provider gridViewState={this.gridViewState} >
                {/*<Container style={styleContainer}>*/}
                             {this.props.children}
                {/*</Container>*/}
                </Provider>
          );
    }


}

export default GridView;
