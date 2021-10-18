import React, { Component, Fragment } from 'react';
import { observer, inject, Provider } from "mobx-react"


@inject('formState', 'path','entityArrayEnabled')
@observer
class ConditionalRender extends Component {

  constructor(props) {
      super(props);

    }

    componentDidUpdate() {
       
    }

    render() {

        const { formState, path, field, equalValue = undefined, notEqualValue = undefined, contains = undefined, notContains = undefined} = this.props;

        let value = formState.objectTree.get(path)[field];

        const equalCondition = (equalValue !== undefined) && (value === equalValue);
        const notEqualCondicion = (notEqualValue !== undefined) && (value !== notEqualValue);
        const containsCondition = (contains !== undefined) && (value.toString().includes(contains.toString()));
        const notContainsCondition = (notContains !== undefined) && (!value.toString().includes(notContains.toString()));

        let show = (
            (equalCondition) ||
            (notEqualCondicion) ||
            (containsCondition && notContains == undefined) ||
            (notContainsCondition && contains == undefined) ||
            (containsCondition && notContainsCondition)
        );
            
        return (

            show ? <Provider path={path} >
                {this.props.children}
            </Provider>
                :
                <Provider path={path} >

                </Provider>
        );

      }

    
    

}

export default ConditionalRender;


