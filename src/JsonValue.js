import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"
import Field, { NumberField, BooleanField, DateField } from './Fields';
import JsonSubEntity from 'comun/components/JsonSubEntity';
import JsonKey from 'comun/components/JsonKey';
import JsonValue1 from 'comun/components/JsonValue';

//JMG

@inject('jsonKey')
@observer
class JsonValue extends Component {

  constructor(props) {
      super(props);
    
    }

  
    render() {

        const { jsonKey} = this.props;

        
            if (jsonKey.startsWith('Bln')) {
                return (<div className="box" style={{ "textAlign": "center", }}><BooleanField field={jsonKey} controlType='checkbox' type='boolean' /></div>);
            } else if (jsonKey.startsWith('Int')) {
                return (<NumberField field={jsonKey} />);
            } else if (jsonKey.startsWith('Dtm')) {
                return (<DateField field={jsonKey} />);
            } else if (jsonKey.startsWith('Obj')) {
                return (
                    <JsonSubEntity entity={jsonKey}>
                        <div className="row mb-1">
                            <div className="col-xl-3">
                                <JsonKey />
                            </div>
                            <div className="col-xl-9">
                                <JsonValue1 />
                            </div>
                        </div>
                    </JsonSubEntity>);
            } else {
                return (<Field field={jsonKey} controlType='text' />);
            }
        

    }

}

export default JsonValue;

