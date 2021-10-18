import React, { Component, Fragment } from 'react';
import { observer, inject, Provider } from "mobx-react"
import { Container } from 'reactstrap';

//JMG

@inject('formState', 'path')
@observer
class JsonEntity extends Component {

  constructor(props) {
    super(props);

    const { entity, label} = props;

    this.label = label;
    this.entity = entity;
    this.path = '';
    this.typeName = '';
    this.objectPath = '';

    const { formState, path } = this.props;

    this.path = path + '.' + this.entity;

    formState.registerPath(path, this.entity, this.path);

    //Para campos de BBDD donde se almacena JSON como string se debe crear un nuevo path parseado
     formState.registerPathParsed(this.path, this.path + ".jsonParsed");
     this.parsedPath = this.path + ".jsonParsed";
     this.objectPath = this.parsedPath + '.jsonParsedObject';
    }


  render() {

      const { formState } = this.props;

      const content = (formState.objectTree.get(this.objectPath) != undefined && formState.objectTree.get(this.objectPath) != null && formState.objectTree.get(this.objectPath) !== "")?
          Object.entries(formState.objectTree.get(this.objectPath)).map(([key, value]) => {
              return (<Provider path={this.objectPath} jsonKey={key} >
                  {/*<Container>*/}
                              {this.props.children}
                  {/*</Container>*/}
                      </Provider>)})
           : "";
     

    return (
        <Fragment>
            {content}
      </Fragment>
    );
  }
}

export default JsonEntity;
