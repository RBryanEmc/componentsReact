import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"
import { Button } from 'primereact/button';

@inject('gridViewState', 'gridBody', 'formState', 'entityArrayEnabled')
@observer
class GridActionButton extends Component {

  constructor(props) {
      super(props);
    }

    render() {
        
        const { gridViewState, action, label, className, gridBody, showInBody, icon, formState, enabled = true, entityArrayEnabled = true } = this.props;

        if (gridBody === false || showInBody === 'true') {

            //controla cuando se muestra el botón
            let button = icon.length > 0 ?
                label.length > 0 ?
                    <button type="button" className={className} onClick={() => { gridViewState.processAction(action) }} disabled={!formState.enabled || !enabled || !entityArrayEnabled}><i className={icon + " mr-1"}></i>{label}</button>
                    : <button type="button" className={className} onClick={() => { gridViewState.processAction(action) }} disabled={!formState.enabled || !enabled || !entityArrayEnabled}><i className={icon}></i>{label}</button>
                : <button type="button" className={className} onClick={() => { gridViewState.processAction(action) }} disabled={!formState.enabled || !enabled || !entityArrayEnabled}>{label}</button>

            
            return (
                <Fragment>{button}</Fragment>
            );
        } else {
            
            return (
                <Fragment>
                </Fragment>
            );
        }
      
    }

}

export default GridActionButton;

