import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"


@inject('formState', 'path')
@observer
class ActionButtonBackend extends Component {

  constructor(props) {
      super(props);
    }

    render() {
        
        const { label, className, action, formState, path, icon, enabled = true, entityArrayEnabled=true } = this.props;

        let button = icon !==undefined && icon.length > 0 ?
            label.length > 0 ?
                <button type="button" className={className} onClick={() => { formState.doAction(path, action) }} disabled={!formState.enabled || !enabled || !entityArrayEnabled}><i className={icon + " mr-1"}></i>{label}</button>
                : <button type="button" className={className} onClick={() => { formState.doAction(path, action) }} disabled={!formState.enabled || !enabled || !entityArrayEnabled}><i className={icon}></i>{label}</button>
            : <button type="button" className={className} onClick={() => { formState.doAction(path, action) }} disabled={!formState.enabled || !enabled || !entityArrayEnabled}>{label}</button>
            
        return (
            <Fragment>{button}</Fragment>            
        );
      
    }

}

export default ActionButtonBackend;

