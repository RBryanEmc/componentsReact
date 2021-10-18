import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"

//JMG

@inject('jsonKey')
@observer
class JsonKey extends Component {

  constructor(props) {
      super(props);
    
    }

  
    render() {
        
        const { jsonKey } = this.props;

        var label = jsonKey.startsWith('Obj') || jsonKey.startsWith('Str') || jsonKey.startsWith('Dbl') || jsonKey.startsWith('Int') || jsonKey.startsWith('Dtm')? jsonKey.substring(3, jsonKey.length ) : jsonKey;
 
        return (
            <label className="mt-2">{label}</label>
         );
      
    }

}

export default JsonKey;

