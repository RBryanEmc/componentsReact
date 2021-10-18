import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"
import { createBrowserHistory } from 'history';
import { withRouter } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';


export const SelectorContext = React.createContext();

@inject('formState', 'path','entityArrayEnabled')
@observer
class Selector extends Component {

  constructor(props) {
      super(props);

      this.state = {
          textoBusqueda: '',
          resultadosBusqueda: [],
          resultadoSeleccionado: null,
          sorted: [],
          page: 0,
          pageSize: 10,
          expanded: {},
          resized: [],
          filtered: [],
          totalSize: 0,
          modal: false,
          filter: '',
          loading: false,
          seleccionarResultado: this.seleccionarResultado,
          valor:''
      };
     
    }


    async getResults(filter) {

        this.setState({
            filter: filter,
            loading: true
        });

        const { listController } = this.props; 
        const response = await fetch(listController + '/filter?filter=' + filter, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        const data = await response.json();

        this.setState({
            resultadosBusqueda : data,
            loading : false
        });
    }

    async getAllResults() {

        this.setState({
            loading: true,
            filter: ''
        });

        const { listController } = this.props; 

        const response = await fetch(listController, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        const data = await response.json();

        this.setState({
            resultadosBusqueda: data,
            loading: false
        });

    }

    async getSingleItem(itemId) {
   
        const { listController, listKeyField } = this.props; 

        const url = listController + '/item?itemId=' + itemId;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        const data = await response.json();

        const dataArray = [];
        dataArray.push(data);

        this.setState({
            resultadosBusqueda: dataArray,
            resultadoSeleccionado: data,
            loading: false,
            valor: data[listKeyField]
        });
    }


    componentDidMount() {

        const { field, formState, path } = this.props;
        let value = formState.objectTree.get(path)[field]

        if (this.state.valor !== value) {
            this.getSingleItem(value);
        }
     
    }

    mostrarItem(path, itemId) {
        const browserHistory = createBrowserHistory();
        browserHistory.push(path + "/" + itemId);
    };

  

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    
    seleccionarResultado=(seleccion) =>{
        this.setState({ resultadoSeleccionado: seleccion });

        const { field, listKeyField,formState, path } = this.props;

        formState.updateField(path, field, seleccion[listKeyField], '');
    };

    navegarItem(itemId) {
        const { navigationPath } = this.props;
        this.props.history.push(navigationPath + "/" + itemId);
    };

    
    componentDidUpdate() {

        const { field, listKeyField, formState, path } = this.props;

        let value = formState.objectTree.get(path)[field]

        if (this.state.valor !== value) {
            this.getSingleItem(value);
        }

        //this.state.resultadosBusqueda.map((item, key) => {
        //    if (item[listKeyField] === value && this.state.resultadoSeleccionado != item) {
        //        this.setState({ resultadoSeleccionado: item });
        //    };
        //})
    }
       
    render() {
        
        const { field, listDisplayField, navigationPath, formState, path, placeHolder, enabled = true, navegable = true, entityArrayEnabled=true} = this.props;

        let value = formState.objectTree.get(path)[field]
                      
        let content = this.state.loading
            ? <input
                type="text"
                className="form-control"
                defaultValue="Loading" />
            : <Fragment>
                <div className="input-group">
                    <input className="form-control" value={this.state.resultadoSeleccionado != undefined ? this.state.resultadoSeleccionado[listDisplayField] : ''} placeholder={placeHolder} readOnly />
                    <span className="input-group-append">
                        <button onClick={this.toggle} className="btn btn-blue fa fa-search" disabled={!formState.enabled || !enabled || !entityArrayEnabled} ></button>
                        <a href={navigationPath + '/' + value} className={!navegable ? 'btn btn-blue fa fa-arrow-right invisible' : 'btn btn-blue fa fa-arrow-right'} role="button"></a>
                    </span>
                </div>
                <Dialog header="Selector" visible={this.state.modal} style={{ width: '50vw' }} onHide={() => this.toggle}  closable={false}>
                    <div className="input-group" >
                        <input type="text" className="form-control" placeholder="Escriba un texto de búsqueda" value={this.state.filter} onChange={event => this.getResults(event.currentTarget.value)} />
                    </div>
                    <SelectorContext.Provider value={this.state}>
                        {this.props.children}
                    </SelectorContext.Provider>
                    <div className="d-flex align-items-center justify-content-center p-2">
                        <button className="btn btn-primary m-3" onClick={this.toggle}>Aceptar</button>
                        <button className="btn btn-primary m-3" onClick={this.toggle}>Cancelar</button>
                    </div>
                </Dialog>
                
            </Fragment>
            ;
         

        return (
            <Fragment>
                {content}
            </Fragment>
        );
      
    }

}

export default withRouter(Selector);


