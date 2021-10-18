import React from 'react';
import FullCalendar from 'fullcalendar-reactwrapper';
import 'fullcalendar/dist/fullcalendar.min.css';
import { Link } from 'react-router-dom';
import { observer, inject } from "mobx-react"

@inject('formState', 'path', 'entityArrayEnabled')
@observer
class Calendario extends React.Component {

	

    constructor(props) {
        super(props);

        const { formState, path, field = 'Planificaciones', entityArrayEnabled = true  } = props;
       
        this.path = path + '.' + field;
       
        formState.registerPath(path, field, this.path);
    }
	
    render() {

        const { formState, path, field = 'Planificaciones', entityArrayEnabled = true } = this.props;

        var events=[];
        formState.objectTree.get(this.path).map((item, key) => {
            events.push({title:item.StrNombre, start: item.DtmFechaInicio, end:item.DtmFechaFin, color:'#'+item.StrColor}) 
        });
        
		return (
			<FullCalendar
					id = "myCalendar"
					header = {{
						left: 'month,basicWeek,basicDay',
						center: 'title',
						right: 'prev,today,next'
					}}
					navLinks= {true}
					editable= {false}
					eventLimit= {true} 
					events = {events}
				/>
		)
	}
}

export default Calendario;
