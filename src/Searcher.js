import React, { Component, Fragment } from 'react';
import { Container } from 'reactstrap';
import { action, observable } from 'mobx';
import { observer, Provider } from "mobx-react"
import { NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

class SearcherState {

    @observable filter = '';

    controller = '';

    @observable results = [];

    @observable loading = false;

    @action.bound
    updateFilter(value) {

        this.filter = value;
        if (this.filter === "") {
            this.results = [];
        }
        else {
            this.loading = true;
            this.getResults(this.filter);
        }
    };
    

    async getResults(filter) {

        const response = await fetch(this.controller + '/filter?filter=' + filter, {
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

@observer
class Searcher extends Component {

    constructor(props) {
        super(props);

        const { title, controller, resultLink, resultKeyField } = props;

        this.title = title;

        this.controller = controller;

        this.resultLink = resultLink;

        this.resultKeyField = resultKeyField;
        
        this.searcherState = new SearcherState();

        this.searcherState.controller = controller;

        this.searcherState.start();
    }
        
    
    render() {

        let content = this.searcherState.loading
            ? <div className="loader">Loading...</div>
            : <div><Provider resultLink={this.resultLink} resultKeyField={this.resultKeyField} resultRow='' >
                        <Container>
                            <div className="container-fluid">
                        <div className="row justify-content-md-left">
                                    {this.props.children}
                                </div>
                            </div>
                        </Container>
              </Provider>
            {
                this.searcherState.results.map((item, key) => {
                    return (
                        <Provider resultLink={this.resultLink} resultKeyField={this.resultKeyField} resultRow={item} key={key}>
                            <Container>
                                <div className="container-fluid">
                                    <div className="row justify-content-md-left" >
                                        {this.props.children}
                                    </div>
                                </div>
                            </Container>
                        </Provider>);
                })
            }</div>;

        return (
            <div>
                <h6>{this.title}</h6>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Buscar</span>
                    </div>
                    <input
                        type="text"
                        className="form-control "
                        onChange={e => {this.searcherState.updateFilter(e.currentTarget.value);}}
                        value={this.searcherState.filter} />
                    <div className="input-group-append">
                        <span className="input-group-text badge"><NavLink tag={Link} to={this.resultLink + '/0'}>Nuevo</NavLink></span>
                    </div>
                </div>
                 {content}
            </div>
        );
    }
}

export default Searcher;

