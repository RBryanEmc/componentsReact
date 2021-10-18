import React, { Component} from 'react';
import { observer, inject } from "mobx-react"
import { NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

@inject('resultRow', 'resultLink', 'resultKeyField') 
@observer
class SearcherResultColumn extends Component {

  constructor(props) {
    super(props);
    const { label, field, className} = props;
    this.label = label;
    this.field = field;
    this.className = className;
  }

  render() {
      const { resultRow, resultLink, resultKeyField } = this.props;
      
      let content = (resultRow === '')
          ? <div>{this.label}</div>
          : <div><NavLink tag={Link} className="text-dark m-0 p-0" to={resultLink + '/' + resultRow[resultKeyField]}>{resultRow[this.field]}</NavLink></div>;
      
      return (
          <div className={this.className}>
              {content}
          </div>);

  }
}

export default SearcherResultColumn;
