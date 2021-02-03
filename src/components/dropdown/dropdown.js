import './dropdown.scss';
import React from 'react';

class Dropdown extends React.Component{

    constructor(props){
        super(props);
        this.state={
            error: null,
            isLoaded: false,
            data: [],
        }
    }

    componentDidMount(){
        this.fetchData();
    }

    /**
     * function fetches the dropdown data from the api
     */
    fetchData(){
        this.setState({isLoaded: false});
        fetch(`${this.props.api}`, {
            "method": "GET",
        })
        .then(response => response.json())
        .then(response => {
            this.setState({
                data: response[1],
                isLoaded: true,
            })
        },        
        (error) => {
            this.setState({
                isLoaded: true,
                error
            });
        })
    }

    /**
     * function calls the onChange of the parent
     * @param {conatins the event of dropdown selected value } e 
     */
    dropdownSelected(e){
        this.props.onChange(e.target.value);
    }

    render(){
        const { error, isLoaded, data } = this.state;
        const { key, value } = this.props.property;
        let options = [{[key]: 'unSelected', [value]: 'Please Select'}, ...data];

        if(error){
            return (
                <select class="form-control" style={{color: 'red'}}>
                    <option>Server error</option>
                </select>
            );
        } else{
            return(
                <div className="form-group">
                    <label className="d-flex text-align-left">
                        <b>{this.props.label}</b>
                    </label>
                    <select 
                        className="form-control" 
                        onChange={(e) => this.dropdownSelected(e)}
                        data-testid={this.props.testId}>
                        { !isLoaded ?
                            <option>Loading...</option>:
                            options.map((listItem)=>
                                <option value={listItem[key]} key={listItem[key]}>{listItem[value]}</option>
                            )
                        }
                    </select>
                </div>
            )
        }
    }
}

export default Dropdown;