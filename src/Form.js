import React, { Component, Fragment } from 'react';
import { Container } from 'reactstrap';
import { action, observable } from 'mobx';
import { observer, Provider, inject } from "mobx-react" 
import { HubConnectionBuilder, HubConnectionState } from '@aspnet/signalr';
import { Dialog } from 'primereact/dialog';


class FormState {

    rootEntity = '';

    controller = '';

    uniqueKey = '';

    url = '';

    pendingUpdates = new Map();

    @observable item = new Map();

    @observable objectTree = new Map();

    @observable errorTree = new Object();

    @observable loading = true;

    @observable changed = false;

    @observable valid = true;

    @observable notFound = false;

    @observable enabled = true;

    @observable currentAction = '';

    @observable currentActionMessage = '';

    @observable currentActionImage = '';

    @observable errorMessage = '';

    @action.bound
    updateField(path, field, value, type, forceValidation = false) {
        if (!this.loading) {
            switch (type) {
                case 'number':
                    if (value !== null && value !== '') {
                        if (value.endsWith(",") || value.endsWith(".")) {
                            this.objectTree.get(path)[field] = value;
                        } else {
                            this.objectTree.get(path)[field] = parseFloat(value);
                        }
                    } else {
                        this.objectTree.get(path)[field] = null;
                    }
                    break;
                case 'boolean':
                    this.objectTree.get(path)[field] = Boolean(value);
                    break;
                case 'datetime':
                    this.objectTree.get(path)[field] = value;
                    break;
                case undefined:
                    this.objectTree.get(path)[field] = value;
                    break;
                case 'string':
                    this.objectTree.get(path)[field] = value;
                    break;
                default:
                    this.objectTree.get(path)[field] = value;
            }

        };
        //Para campos de BBDD donde se almacena JSON como string se debe actualizar el campo no parseado en base al parseado
        if (path.includes('.jsonParsed')) {
            const pathArray = path.split('.');
            var i = 1;
            var parentPath = pathArray[0];
            var jsonField = parentPath;
            var parsedPath = '';
            do {
                parentPath += '.' + pathArray[i];
                jsonField = pathArray[i];
                i++;
            } while (pathArray[i] !== 'jsonParsed');
            parentPath = parentPath.replace('.' + jsonField, '');//Quita el nombre del campo serializado del path
            parsedPath = parentPath + '.' + jsonField + '.jsonParsed';
            //modificar la propiedad del elemento raíz del elemento no parseado
            this.objectTree.get(parentPath)[jsonField] = JSON.stringify(this.objectTree.get(parsedPath));
        };

        if (forceValidation) {
            this.validateRegister();
        }
        this.changed = true;
    };

    @action.bound
    registerRootEntity() {
        this.objectTree.set(this.rootEntity, this.item);
        //update objectTree recursively

        //Evitar que desencadene múltiples actualizaciones por invocar dos action bound
        this.pendingUpdates = new Map();;//Inicializa la colección de actualizaciones fuera de @actionBound pendientes
        var pathItems = [];
        var parentPath = '';
        var field = '';

        for (var objectKey of this.objectTree.keys()) {
            if (objectKey !== this.rootEntity) {

                pathItems = objectKey.split('.');//elementos de la clave descompuestos
                parentPath = '';//Contendrá la clave del objeto padre en el objectTree
                field = pathItems[pathItems.length - 1];//El field es el último elemento del array

                var itemIndex = 0;

                for (itemIndex = 0; itemIndex < (pathItems.length - 1); itemIndex++) {

                    if (parentPath !== '') { parentPath += '.'; };

                    parentPath += pathItems[itemIndex];//La clave del parent es todo menos el último elemento
                }

                //Actualiza el elemento de objectTree
                if (field.startsWith('jsonParsed')) {//if (field === 'jsonParsed') {
                    if (field === 'jsonParsed') {
                        //Descarta el campo si es jsonParsedType
                        this.registerPathParsed(parentPath, objectKey);
                    }
                } else {
                    this.registerPath(parentPath, field, objectKey);
                }
            };
        }
    };

    @action.bound
    registerPath(parentPath, field, newPath) {
        if (!this.loading) {
            if (this.objectTree.get(parentPath) != null) {
                this.objectTree.set(newPath, this.objectTree.get(parentPath)[field]);
            } else {
                this.objectTree.set(newPath, undefined);
            }

        };
    };


    @action.bound
    registerPathParsed(parentPath, parsedPath) {
        //Para campos de BBDD donde se almacena JSON como string se debe crear un nuevo path parseado
        if (!this.loading) {
            if (this.objectTree.get(parentPath) != null) {
                //this.objectTree.set(parsedPath, undefined);

                //extraer el tipo de la clase parseada
                var tipoPath = parsedPath + '.jsonParsedType';
                var objectPath = parsedPath + '.jsonParsedObject';
                var objetoConTipo = JSON.parse(this.objectTree.get(parentPath));
                var tipo = objetoConTipo == undefined ? '' : Object.keys(objetoConTipo)[0];
                var objeto = objetoConTipo == undefined ? null : Object.values(objetoConTipo)[0];

                if (this.objectTree.get(tipoPath) === undefined || this.objectTree.get(tipoPath) === '' || this.objectTree.get(tipoPath) === tipo) {
                    //Si nunca se había establecido el tipo, o no tiene tipo o no ha cambiado desde la última actualización se establece el valor directamente
                    this.objectTree.set(parsedPath, JSON.parse(this.objectTree.get(parentPath)));//this.objectTree.set(parsedPath, JSON.parse(this.objectTree.get(parentPath)));
                    this.objectTree.set(objectPath, this.objectTree.get(parsedPath)[tipo]);
                } else {
                    //Si el tipo ha cambiado se tiene que añadir a una lista para actualizaciones diferidas que primero establecerán un undefined y luego el valor
                    //Esto se hace para evitar el error del mobx cuando se cambia el tipo del objeto enlazado
                    this.pendingUpdates.set(parsedPath, parentPath);
                }

                //guardar el tipo de la clase parseada
                this.objectTree.set(tipoPath, tipo);

            } else {
                this.objectTree.set(parsedPath, undefined);
            }
        };
    };

    procesarPendingUpdates() {
        //Se invocará sin el @action.bound para todos los campos serializados json cuyos tipos hayan cambiado.
        //Para evitar el error de mobx primero se tienen que setear como undefined y luego con el valor correpondiente
        for (var parsedPath of this.pendingUpdates.keys()) {

            var objectPath = parsedPath + '.jsonParsedObject';
            var objetoConTipo = JSON.parse(this.objectTree.get(this.pendingUpdates.get(parsedPath)));
            var tipo = objetoConTipo == undefined ? '' : Object.keys(objetoConTipo)[0];
            //var objeto = objetoConTipo == undefined ? null : Object.values(objetoConTipo)[0];

            this.objectTree.set(parsedPath, undefined);//Para hacer limpieza forzando los refresh
            this.objectTree.set(objectPath, undefined);

            this.objectTree.set(parsedPath, JSON.parse(this.objectTree.get(this.pendingUpdates.get(parsedPath))));
            this.objectTree.set(objectPath, this.objectTree.get(parsedPath)[tipo]);
           
        }

        this.pendingUpdates.clear();
        
    }



    @action.bound
    registerArrayItemPath(parentPath, index, newPath) {
        if (!this.loading) {
            this.objectTree.set(newPath, this.objectTree.get(parentPath)[index]);
        };
    };

    @action.bound
    validate() {
        if (this.changed) {
            this.validateRegister();
        }
    };

    @action.bound
    async save() {
        this.errorMessage = '';
        await this.saveRegister();
        this.changed = false;
     };

    @action.bound
    async delete() {
        this.loading = true;
        await this.deleteRegister();
        this.changed = false;
    };

    @action.bound
    updateReceived(item) {
        if (this.itemId !== '0') {
            //New items not for signalR
            this.item = item;
            this.registerRootEntity();
            this.procesarPendingUpdates();
            this.changed = false;
            console.log('Update Received Processed ' + JSON.stringify(item));
        }
        
    };

    @action.bound
    fetch(itemId) {
        this.fetchRegister(itemId);
        this.changed = false;
    }

    @action.bound
    broadcast() {
        if (this.itemId !== '0' & this.signalrConnection !==undefined) {
            //New items not for signalR
            this.signalrConnection.invoke('BroadcastItem', this.uniqueKey, this.item);
        }
    }

    async validateRegister() {

        const response = await fetch(this.controller + '/validate', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify(this.objectTree.get(this.rootEntity))
        });

               
        const data = await response.json();

        this.item = data.item;
        this.errorTree = data.errorTree;

        if (Object.keys(this.errorTree).length > 0) {
            this.valid = false;
        } else {
            this.valid = true;
        }


        this.registerRootEntity();
        this.procesarPendingUpdates();
    }

 
    async addRow(destinationCollectionPath) {

        const payload = { item: this.objectTree.get(this.rootEntity), destinationCollectionPath: destinationCollectionPath };

        const response = await fetch(this.controller + '/addRow', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        this.changed = true;
        this.item = data;
        this.registerRootEntity();
        this.procesarPendingUpdates();
    }

    async deleteRow(rowPath) {

        const payload = { item: this.objectTree.get(this.rootEntity), rowPath: rowPath} ;

        const response = await fetch(this.controller + '/deleteRow', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        this.changed = true;
        this.item = data;
        this.registerRootEntity();
        this.procesarPendingUpdates();
    }


    async doAction(rowPath, action) {

        this.currentAction = action;

        this.doActionInternal(rowPath, action);

        this.procesarPendingUpdates();
    }

    @action.bound
    async doActionInternal(rowPath, action) {

        
        //20/05/2021 JMG const payload = { item: this.objectTree.get(this.rootEntity), rowPath: rowPath };
        const payload = { item: this.objectTree.get(this.rootEntity), context: this.objectTree.get(rowPath)};

        const response = await fetch(this.controller + '/' + action, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        this.currentAction=''
        this.changed = true;
        this.item = data;
        this.registerRootEntity();
        //this.procesarPendingUpdates();
    }

    async saveRegister() {

        const response = await fetch(this.controller + '/save', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify(this.objectTree.get(this.rootEntity))
        });

        const data = await response.json();

        //03/05/2021 this.item = data;
        this.item = data.item;
        this.errorMessage = data.strError;

        this.registerRootEntity();
        this.procesarPendingUpdates();
    }

    async deleteRegister() {

        const response = await fetch(this.controller + '/delete', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify(this.objectTree.get(this.rootEntity))
        });

        try {
            const data = await response.json();
            this.item = data;
            this.registerRootEntity();
            this.procesarPendingUpdates();
        } catch (err) {
            this.notFound = true;
        }
      
        this.loading = false;
    }

    

    async fetchRegister(itemId) {

        const url = this.controller + '/item?itemId=' + itemId;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        try
        { 
     
            const data = await response.json();
            this.item = data;
            this.registerRootEntity(this.path);
            this.notFound = false;
        } catch (err) {
            this.notFound = true;
        }
       
        this.loading = false;
    }

    async handleUploadDocument(e, datosAdicionales, mensaje, imagen) {

        this.currentAction = 'importando'
        this.currentActionMessage = mensaje
        this.currentActionImage = imagen

        let formData = new FormData();
        
        formData.append('Item', JSON.stringify(this.objectTree.get(this.rootEntity)));

        formData.append('File', e.target.files[0]);

        formData.append('Datos', datosAdicionales);

        await this.uploadDocument(formData);
    }

  
    @action.bound
    async uploadDocument(formData) {

        const response = await fetch(this.controller + '/fileupload', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: formData});

        const data = await response.json();

        this.currentAction = ''
        this.currentActionMessage = '';
        this.currentActionImage = '';

        this.changed = true;
        this.item = data;
        this.registerRootEntity();
        this.procesarPendingUpdates();
    }

}

@observer
class Form extends Component {


    constructor(props) {
        super(props);

        const { title, controller, entity, itemId, parentProps, enabled, showButtons=true} = props;

        this.title = title;
        this.controller = controller;
        this.path = entity;

        
        this.formState = new FormState();
        this.formState.rootEntity = entity;
        this.formState.enabled = enabled;
        this.itemId = itemId;

        this.url = parentProps.match.path;

        this.parentProps = parentProps;

        this.uniqueKey = this.controller + this.itemId;
                
        //SignalR
        this.setUpSignalRConnection = async (uniqueKey) => {

            //.withUrl('https://localhost:44345/signalrhub')
            const connection = new HubConnectionBuilder()
                .withUrl('signalrhub')
                .withAutomaticReconnect()
                .build();
           
            connection.on('Message', (message) => {
                console.log('Message', message);
            });
            connection.on('ReceiveUpdate', (item) => {
                console.log('ReceiveUpdate', item);
                this.formState.updateReceived(item);
            });

            try {
                await connection.start();
                this.formState.signalrConnection = connection;
            } catch (err) {
                console.log(err);
            }

            if (connection.state === HubConnectionState.Connected) {
             

                connection
                    .invoke('SubscribeItem', uniqueKey)
                    .catch((err) => {
                        return console.error(err.toString());
                    });
            }

            return connection
        };

        this.cleanUpSignalRConnection = async (itemId, connection) => {
            if (connection.state === HubConnectionState.Connected) {
                
                try {
                    await connection.invoke('UnsubscribeItem', itemId);
                } catch (err) {
                    return console.error(err.toString());
                }
                connection.off('Message');
                connection.off('ReceiveUpdate');
                connection.stop();
            } else {
                connection.off('Message');
                connection.off('ReceiveUpdate');
                connection.stop();
            }
        };

        this.save = async function () {

            await this.formState.save();

            this.afterSave();

            this.formState.broadcast();

        }

        this.delete = async function () {

            await this.formState.delete();

            if (this.itemId !== '0') {
                ////On new element save, change the url  to force reload with the new id
                //this.url = this.url.replace(':itemId', this.formState.item.IntId);
                ////Buscar la manera de inhabilitar la actualización de observers
                //this.parentProps.history.replace(this.url);
            };

            this.formState.broadcast();

        }

        this.afterSave = function () {
            if (this.itemId === '0') {
                //On new element save, change the url  to force reload with the new id
                this.url = this.url.replace(':itemId', this.formState.item.IntId);
                //Buscar la manera de inhabilitar la actualización de observers
                this.parentProps.history.replace(this.url);

            };
        }

        this.watchId = function () {
            //evento de feedback de las acciones para verificar que un nuevo registro no se ha convertido en definitivo
            if (this.itemId === '0' && this.formState.item.IntId != undefined && this.formState.item.IntId.toString() !== this.itemId.toString()) {
                this.url = this.url.replace(':itemId', this.formState.item.IntId);
                //Buscar la manera de inhabilitar la actualización de observers
                this.parentProps.history.replace(this.url);
            };
        }

    }

    
    componentDidMount() {

        this.formState.loading = true;
        this.formState.controller = this.controller;
        this.formState.uniqueKey = this.uniqueKey;
        this.formState.fetch(this.itemId);
        if (this.itemId !== '0') {
            //New items not for signalR
            this.setUpSignalRConnection(this.uniqueKey);
        }    
    }

    
    componentWillUnmount() {
        if (this.itemId !== '0') {
            this.cleanUpSignalRConnection(this.uniqueKey, this.formState.signalrConnection);
        }
    }

    render() {
        {/*<div className="overflow-y-scroll overflow-x-hidden" style={{ maxHeight: "800px", height:"100%" }}>*/ }
        const { showButtons = true } = this.props;
        
         let buttons = showButtons?
            <div>
                <div className="row mb-1">
                    <div className="col-xl-4">
                    </div>
                    <div className="col-xl-2">
                        <button icon="fas fa-check" className="btn btn-primary" onClick={() => { this.save() }} disabled={!this.formState.enabled && (!this.formState.changed || !this.formState.valid)} data-toggle="tooltip" data-placement="top" title="Se guardará el registro"><i className="fas fa-check mr-1"></i>Guardar</button>
                    </div>
                    <div className="col-xl-2">
                        <button icon="fas fa-times" className="btn btn-danger" onClick={() => { this.delete() }} data-toggle="tooltip" data-placement="top" title="Se eliminará el registro" disabled={!this.formState.enabled}><i className="fas fa-times  mr-1"></i>Eliminar</button>
                    </div>
                    <div className="col-xl-4">
                    </div>

                </div>
            </div> : <Fragment />;
        
            let errorMessage = this.formState.errorMessage != '' ? <div className="d-flex mb-3 justify-content-center my-auto"><div className="mr-5 text-center alert alert-primary"><p>{this.formState.errorMessage}</p></div></div>:<Fragment/>

          let content = this.formState.loading || this.formState.notFound
            ? this.formState.loading ? <p><em>Loading...</em></p> : <p><em>Not found</em></p>
              : 
              <div className="contenedor">
                 
                  <Dialog header="Espere mientras se completa la operación" visible={this.formState.currentAction !== ''} style={{ width: '50vw' }} onHide={() => { }} closable={ false}>
                      <label>{this.formState.currentActionMessage}</label><i className="fas fa-cog fa-spin"></i>
                      {/*<label>{this.formState.currentActionMessage}</label><img src={this.formState.currentActionImage} width="350" height="496" /><i className="fas fa-cog fa-spin"></i>*/}
                  </Dialog>

                
                  <Provider formState={this.formState} path={this.path} entityArrayEnabled={this.formState.enabled} watchId={this.watchId} ownerForm={this} parentPath={this.path}>
                             
                      <div className="rellenar" >  
                         {this.props.children}
                      </div>  
                      {errorMessage}
                      {buttons}


                  </Provider>
                     
                
              </div>
            ;

        

        return (
            <Fragment>
                {/*<p>{JSON.stringify(this.formState.objectTree)}</p>*/}
                {content}
            </Fragment>
        );
    }

    

};
  


export default Form;

