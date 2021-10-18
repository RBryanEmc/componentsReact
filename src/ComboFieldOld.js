import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"
import { action, observable } from 'mobx';
import { NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

class ComboState {

    @observable filter = '';

    controller = '';

    @observable results = [];

    @observable loading = false;

    async getResults(filter) {

        const response = await fetch(this.controller + '/filter?filter=' + filter, {
            method: 'GET',
        });

        const data = await response.json();
        this.results = data;
        this.loading = false;

    }

    async getAllResults() {

        const response = await fetch(this.controller, {
            method: 'GET',
        });

        const data = await response.json();
        this.results = data;
        this.loading = false;

    }

    async start() {
        //Hace que en el controller se precompile y se instancien las variables, evitando un efecto de retraso en el primer uso
        const response = await fetch(this.controller + '/start', {
            method: 'GET',
        });
        const data = await response.json();
    }

}

@inject('formState', 'path')
@observer
class ComboFieldOld extends Component {

  constructor(props) {
      super(props);
      const {listController } = props;

      this.comboState = new ComboState();
      this.comboState.controller = listController;
     
    }

    componentDidMount() {
        this.comboState.loading = true;
        this.comboState.getAllResults();
    }

    render() {
        
        const { label, field, listKeyField, listDisplayField, navigationPath, formState, path } = this.props;

        let value = formState.objectTree.get(path)[field]

        let content = this.comboState.loading
            ? <input
                type="text"
                className="form-control"
                defaultValue="Loading" />
            : <div className="input-group">
                <select className="form-control" onChange={e => { formState.updateField(path, field, e.currentTarget.value, "number"); }} onBlur={e => { formState.validate(); }}>
                    <option value="0" key={0} ></option>
                    {
                        this.comboState.results.map((item, key) => {
                            return (
                                <option value={item[listKeyField]} key={key} selected={item[listKeyField] == value}>
                                    {item[listDisplayField]}</option>
                            );
                        })
                    }
                </select>
                <div className="input-group-append">
                    <span className="input-group-text badge"><NavLink tag={Link} to={navigationPath + '/'+value}></NavLink></span>
                </div>
            </div>      
            ;

        return (
            <Fragment>
                {content}
            </Fragment>
        );
      
    }

}

export default ComboFieldOld;

