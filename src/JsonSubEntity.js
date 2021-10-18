import React, { Component, Fragment } from 'react';
import { observer, inject, Provider } from "mobx-react"
import { Container } from 'reactstrap';

//JMG

@inject('formState', 'path')
@observer
class JsonSubEntity extends Component {

  constructor(props) {
    super(props);

    const { entity, label } = props;

    this.label = label;
    this.entity = entity;
    this.path = '';

    const { formState, path } = this.props;

      
   this.path = path + '.' + this.entity;
   formState.registerPath(path, this.entity, this.path);
    

   }

  render() {

      const { formState } = this.props;

      const content = (formState.objectTree.get(this.path) != undefined && formState.objectTree.get(this.path) != null && formState.objectTree.get(this.path) !== "") ?
          Object.entries(formState.objectTree.get(this.path)).map(([key, value]) => {
              return (<Provider path={this.path} jsonKey={key} >
                  {/*<Container>*/}
                      {this.props.children}
                  {/*</Container>*/}
              </Provider>)
          })
          : "";


      return (
          <Fragment>
              {content}
          </Fragment>
      );
   

  }
}

export default JsonSubEntity;
