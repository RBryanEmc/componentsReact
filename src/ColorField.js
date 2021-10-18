import { ColorPicker } from 'primereact/colorpicker';
import React, { Component} from 'react';
import { observer, inject } from "mobx-react"

@inject('formState', 'path', 'entityArrayEnabled')
@observer
class ColorField extends Component {

    render() {

        const { formState, path, field, enabled=true } = this.props;
        
        return (
            <ColorPicker value={formState.objectTree.get(path)[field]} onChange={(e) => {
                formState.updateField(path, field, e.value);
                formState.validate();
            }} disabled={!enabled} ></ColorPicker>
        );
    }

}

export default ColorField;
