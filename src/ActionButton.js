import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"
import { Button } from 'primereact/button';

@inject('formState', 'path', 'entityArrayEnabled')
@observer
class ActionButton extends Component {

  constructor(props) {
      super(props);
    }

    render() {
        
        const { label, className, action, formState, path, icon, enabled = true, entityArrayEnabled=true } = this.props;

        let button = icon.length > 0 ?
            label.length > 0 ?
                <button type="button" className={className} onClick={() => { formState.deleteRow(path) }} disabled={!formState.enabled || !enabled || !entityArrayEnabled}><i className={icon + " mr-1"}></i>{label}</button>
                : <button type="button" className={className} onClick={() => { formState.deleteRow(path) }} disabled={!formState.enabled || !enabled || !entityArrayEnabled}><i className={icon}></i>{label}</button>
            : <button type="button" className={className} onClick={() => { formState.deleteRow(path) }} disabled={!formState.enabled || !enabled || !entityArrayEnabled}>{label}</button>
            
        return (
            <Fragment>{button}</Fragment>            
        );
      
    }

}

export default ActionButton;

