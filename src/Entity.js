import React, { Component, Fragment } from 'react';
import { observer, inject, Provider } from "mobx-react"

@inject('formState', 'path')
@observer
class Entity extends Component {

  constructor(props) {
    super(props);

    const { entity, label} = props;

    this.label = label;
    this.entity = entity;
    this.path = '';

    const { formState, path } = this.props;

    this.path = path + '.' + this.entity;

    formState.registerPath(path, this.entity, this.path);


    }

  render() {



    return (
      <Fragment>
        <Provider path={this.path} >
            {this.props.children}
        </Provider>
      </Fragment>
    );
  }
}

export default Entity;
