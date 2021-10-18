import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"
import { Checkbox } from 'primereact/checkbox';

@inject('formState', 'path','entityArrayEnabled')
@observer
class Field extends Component {

  constructor(props) {
      super(props);
      const { field, type, controlType, fieldClass, enabled = true } = props;
     
      this.field = field;
      this.type = type;
      this.controlType = controlType;
      this.fieldClass = fieldClass;
      this.enabled = enabled;

    }

    componentDidUpdate() {
        //Para controles de fecha donde está enlazado el defaultValue, le doy valor al value si no tiene el foco
        //if (this.inputReference !== undefined) {
        //    if (this.inputReference.current.ownerDocument.activeElement !== this.inputReference.current) {
        //        this.inputReference.current.value = this.inputReference.current.defaultValue;
        //    }
        //}
  
    }

    render() {

        const { formState, path, style, entityArrayEnabled = true, lineas = 0, placeHolder='' } = this.props;

        const isValid = (formState.errorTree[path + '.' + this.field] !== undefined) ?
            ((formState.errorTree[path + '.' + this.field] === '') ? true : false) : true;

        const invalidClass = isValid ? ' ' : 'is-invalid ';
        const invalidMessage = isValid ? '' : formState.errorTree[path + '.' + this.field];

      //Tipos de input https://www.w3schools.com/html/html_form_input_types.asp

        if (this.controlType === 'checkbox') {
            
            return (
                <Fragment>
                    <input type="checkbox" onChange={e => {
                        formState.updateField(path, this.field, e.target.checked, this.type);
                        formState.validate();
                    }}
                    checked={formState.objectTree.get(path)[this.field]}
                    className={invalidClass + this.fieldClass}
                        readOnly={!formState.enabled || !this.enabled || !entityArrayEnabled} />
                    <div className="invalid-feedback">{invalidMessage}</div>
                </Fragment>
                
               
            );
        } else if (this.controlType === 'datetime-bootstrap') {
            //https://www.w3schools.com/jsref/dom_obj_datetime-local.asp

            this.inputReference = React.createRef();
            return (


                <input
                    type='datetime-local'
                    className={'form-control ' + this.fieldClass}
                    onChange={e => {
                        //this.control = e.currentTarget;
                        formState.updateField(path, this.field, e.currentTarget.value, this.type);
                    }}
                    onBlur={e => {
                        e.currentTarget.value = e.currentTarget.defaultValue;
                        formState.validate()
                    }}
                    value={formState.objectTree.get(path)[this.field]}
                    readOnly={!formState.enabled || !this.enabled || !entityArrayEnabled} 
                />

                
            );
        } else {


            return (
                lineas===0?
                <Fragment>
                        <input
                        type={this.controlType}
                        className={'form-control ' + invalidClass + this.fieldClass}
                        onChange={e => {
                            formState.updateField(path, this.field, e.currentTarget.value, this.type);
                        }}
                        onBlur={e => {
                            formState.validate();
                        }}
                        value={formState.objectTree.get(path)[this.field]}
                        readOnly={!formState.enabled || !this.enabled || !entityArrayEnabled}
                        placeHolder={ placeHolder}/>
                   <div className="invalid-feedback">{invalidMessage}</div>
                    </Fragment> :
                    <Fragment>
                        <textarea 
                            type={this.controlType}
                            className={'form-control ' + invalidClass + this.fieldClass}
                            onChange={e => {
                                formState.updateField(path, this.field, e.currentTarget.value, this.type);
                            }}
                            onBlur={e => {
                                formState.validate();
                            }}
                            value={formState.objectTree.get(path)[this.field]}
                            readOnly={!formState.enabled || !this.enabled || !entityArrayEnabled}
                            rows={ lineas}/>
                        <div className="invalid-feedback">{invalidMessage}</div>
                    </Fragment> 
              );
      }

    
    }

}

export default Field;

export class NumberField extends Component {

    constructor(props) {
        super(props);
        const { field,  type, fieldClass, enabled =true} = props;
        this.field = field;
        this.type = type;
        this.fieldClass = fieldClass;
        this.enabled=enabled;
    }

    render() {
        const { style } = this.props;

        return (
            <Field field={this.field} type='number' controlType='text' fieldClass={this.fieldClass} enabled={ this.enabled}/>
        );
    }

}

export class BooleanField extends Component {

    constructor(props) {
        super(props);
        const { field, type, fieldClass, enabled=true } = props;
       
        this.field = field;
        this.type = type;
        this.fieldClass = fieldClass;
        this.enabled = enabled;
    }

    render() {
        //const { formState, path } = this.props;
        //<Field field={this.field} type='boolean' controlType='checkbox' />
        return (
            <Field field={this.field} type='boolean' controlType='checkbox' enabled={ this.enabled}/>
        );
    }

}

export class DateField extends Component {

    constructor(props) {
        super(props);
        const {  field, type, fieldClass, enabled=true } = props;
        
        this.field = field;
        this.type = type;
        this.fieldClass = fieldClass;
        this.enabled = enabled;
    }

    render() {
        //const { formState, path } = this.props;
        return (
            <Field field={this.field} type='datetime-local' controlType='datetime-bootstrap' enabled={ this.enabled}/>
        );
    }

}
