import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';


import { ProgressBar } from 'primereact/progressbar';
import React, { Component} from 'react';
import { observer, inject } from "mobx-react"

@inject('formState', 'path', 'entityArrayEnabled')
@observer
class Progreso extends Component {

    render() {

        const { formState, path, totalField, doneField, enabled = true } = this.props;

        var porcentaje = formState.objectTree.get(path)[totalField]>0?(formState.objectTree.get(path)[doneField] / formState.objectTree.get(path)[totalField])*100:100;
        
        return (
            <ProgressBar value={porcentaje} />
        );
    }

}

export default Progreso;
