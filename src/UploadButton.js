import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"
import { FileUpload } from 'primereact/fileupload';

@inject('formState', 'path', 'ownerForm')
@observer
class UploadButton extends Component {

  constructor(props) {
      super(props);
    }

    async executeAction(e) {

        const { formState, ownerForm, datosAdicionales = '', mensaje='', imagen='' } = this.props;

        await formState.handleUploadDocument(e, datosAdicionales,mensaje, imagen);

        //después de ejecutar la acción se notifica al form para que gestione el posible cambio de Id
        ownerForm.watchId();
       
    }

    
    render() {
        
        const { label, className} = this.props;

            
        return (

            <label className={ className}>{label}<input type="file" hidden onChange={(e) => this.executeAction(e)}/>
            </label>
        );
 
    }

}

export default UploadButton;




