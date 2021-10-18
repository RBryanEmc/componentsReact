import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"
import { action, observable } from 'mobx';
import { NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { createBrowserHistory } from 'history';

//JMG

class ComboState {

    @observable filter = '';

    controller = '';

    method = '';

    @observable results = [];

    @observable loading = false;

    async getResults(filter) {

        const response = await fetch(this.controller + '/filter?filter=' + filter, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        const data = await response.json();
        this.results = data;
        this.loading = false;

    }

    async getAllResults() {

        const response = await fetch(this.controller, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        const data = await response.json();
        this.results = data;
        this.loading = false;

    }

    async getCustomResults(formState) {

        const response = await fetch(this.controller + '/' + this.method, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify(formState.objectTree.get(formState.rootEntity))
        });

        const data = await response.json();
        this.results = data;
        this.loading = false;

    }

    async start() {
        //Hace que en el controller se precompile y se instancien las variables, evitando un efecto de retraso en el primer uso
        const response = await fetch(this.controller + '/start', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });
        const data = await response.json();
    }

}

@inject('formState', 'path','entityArrayEnabled')
@observer
class ComboField extends Component {

  constructor(props) {
      super(props);
      const {listController, listMethod =''} = props;

      this.comboState = new ComboState();
      this.comboState.controller = listController;
      this.comboState.method = listMethod;
     
    }

    componentDidMount() {
        this.comboState.loading = true;

        if (this.comboState.method == '') {
            this.comboState.getAllResults();
        } else {
            //invoca un método personalizado pasando el item principal del formState
            const {  formState } = this.props;
            this.comboState.getCustomResults(formState);
        }
        
    }

    mostrarItem(path, itemId) {
        const browserHistory = createBrowserHistory();
        browserHistory.push(path + "/" + itemId);
    };

   
    render() {

        const { label, field, listKeyField, listDisplayField, navigationPath, formState, path, placeHolder='', enabled = true, entityArrayEnabled = true, forceValidation=false } = this.props;

        let value = formState.objectTree.get(path)[field]

        //validaciones
        const isValid = (formState.errorTree[path + '.' + field] !== undefined) ?
            ((formState.errorTree[path + '.' + field] === '') ? true : false) : true;
        const invalidClass = isValid ? ' ' : 'is-invalid ';
        const invalidMessage = isValid ? '' : formState.errorTree[path + '.' + field];

        let content = this.comboState.loading
            ? <input
                type="text"
                className="form-control"
                defaultValue="Loading" />
            :
            <Fragment>
                <select className={'form-control ' + invalidClass} value={value || ''} onChange={e => { formState.updateField(path, field, e.target.value || null, "string", forceValidation) }} onBlur={e => { formState.validate(); }} placeHolder={placeHolder} disabled={!formState.enabled || !enabled || !entityArrayEnabled}  >
                    <option value={null} hidden >{ placeHolder}</option>
                    {/*<option value={''}></option>*/}
                    {
                        this.comboState.results.map((item, key) => {

                            return (<option key={key} value={item[listKeyField]}>{item[listDisplayField]}</option>);
                        })


                    }
                </select>
                 <div className="invalid-feedback">{invalidMessage}</div>
            </Fragment>
            ;


        return (
            <Fragment>
                {content}
            </Fragment>
        );

    }

}

export default ComboField;

