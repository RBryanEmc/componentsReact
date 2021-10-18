import React, { Component, Fragment } from 'react';
import { observer, inject, Provider } from "mobx-react"
import { Container } from 'reactstrap';
import GridView from './GridView';

@inject('formState', 'path')
@observer
class EntityArray extends Component {

    constructor(props) {
        super(props);

        const { field, label, formState, path, className } = props;

        this.label = label;
        this.field = field;
        this.originalPath = this.path;
        this.path = path + '.' + this.field;
        this.className = className;
       
        formState.registerPath(path, this.field, this.path);
    }

    render() {
        const { formState, enabled=true } = this.props;
        const styleContainer = { paddingLeft: '0px', paddingRight: '0px', marginLeft: '0px', marginRight: '0px', };

        formState.objectTree.get(this.path).map((item, key) => {
            const itemPath = this.path + '.' + key;
            formState.registerArrayItemPath(this.path, key, itemPath);
            return key;
        })

        return (
            
            <Fragment>
                    
                
                   {
                        formState.objectTree.get(this.path).map((item, key) => {

                            if (item.BlnEliminado !== true) {
                                const itemPath = this.path + '.' + key;

                                
                                return (
     
                                    <Provider path={itemPath} key={itemPath} gridBody={true} entityArrayEnabled={ enabled}>
                                        {/*<p>{itemPath}</p>*/}
                                        {/*<Container style={styleContainer}>*/}
                                            <GridView>
                                                {this.props.children}
                                            </GridView>
                                        {/*</Container>*/}
                                    </Provider>  );

                            }})
                        }
                <Provider path={this.path} key={''} gridBody={false} entityArrayEnabled={enabled}>
                    {/*para mostrar los botones de acción*/}
                         <GridView>
                            {this.props.children}
                        </GridView>
                  </Provider>   
                {/*<div className="p-1">
                    <button className="btn btn-primary" onClick={() => { formState.addRow(this.path) }} >Nuevo</button>
                </div>*/}
            </Fragment>
        );
    }

}

export default EntityArray;
