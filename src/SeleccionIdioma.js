
 import ReactFlagsSelect from 'react-flags-select';
import { action, observable } from 'mobx';
import { observer, Provider } from "mobx-react";
// //import css module
import 'react-flags-select/css/react-flags-select.css';
import React from 'react'
import i18n from './i18n'


@observer
class LanguageSelector extends React.Component {


    @observable idiomasSeleccionables = [];
    
    constructor(props) {
		super(props);

       this.state = {
            idioma: "ES",
          };

        this.idiomasSeleccionables = [];
        this.controller = "api/config/Idiomas";
        this.start();
	    

    }
    
    cambiarIdiioma  = (event) => {

        this.setState({idioma: event})
     i18n.changeLanguage(event)
    }

    async start() {
        //Hace que en el controller se precompile y se instancien las variables, evitando un efecto de retraso en el primer uso
        const response = await fetch(this.controller, {
            method: 'GET',
        });
        const data = await response.json();
     
        data.map((item, key) => {
            this.idiomasSeleccionables.push(item['StrCodigoIdioma']);
        })

    }

    render() {
        return (
            <ReactFlagsSelect
                countries={JSON.parse(JSON.stringify(this.idiomasSeleccionables))}
                defaultCountry="ES"
                showSelectedLabel={false}
                showOptionLabel={false}
                onSelect={this.cambiarIdiioma}
            />
                );
             }
    }
 

export default LanguageSelector
