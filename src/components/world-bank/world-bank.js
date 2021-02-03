import './world-bank.scss';
import React from 'react';
import Grid from '../grid/grid';
import Dropdown from '../dropdown/dropdown';

class WorldBank extends React.Component{
    constructor(props){
        super(props);
        this.state={
            gridFilter:[]
        }
    }

    /**
     * function calculates and sets the gridFilter
     * @param { Contains the api query parameter for dropdown } key 
     * @param { Contains selected value for the dropdown } selected 
     */
    drodownSelected(key, selected){
        const filter = this.state.gridFilter.slice();
        let index = filter.findIndex((item)=>{
            return item.key===key
        })
        if(selected!=="unSelected"){
            if(index===-1){
                filter.push({key: key, value: selected});
            } else{
                filter[index].value=selected;
            }
        } else{
            if(index!==-1){
                filter.splice(index, 1);
            }
        }
        this.setState({
            gridFilter: filter
        })
    }

    render(){
        return(
            <div className="world-bank container">
                <div className="row my-3">
                    <div className="col-3">
                    <Dropdown 
                        label="Income Level"
                        api={`http://api.worldbank.org/v2/incomelevel?format=json`}
                        onChange={(selected)=>{this.drodownSelected("incomeLevel", selected)}}
                        property={incomeLevelProperty}
                        testId="incomeLevel"/>
                    </div>
                    <div className="col-3">
                    <Dropdown 
                        label="Lending Type"
                        api={`http://api.worldbank.org/v2/lendingType?format=json`}
                        onChange={(selected)=>{this.drodownSelected("lendingType", selected)}}
                        property={lendingTypeProperty}
                        testId="lendingType"/>
                    </div>
                    <div className="col-3">
                    <Dropdown 
                        label="Region"
                        api={`http://api.worldbank.org/v2/region?format=json`}
                        onChange={(selected)=>{this.drodownSelected("region", selected)}}
                        property={regionProperty}
                        testId="region"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                    <Grid 
                        api={`http://api.worldbank.org/v2/country?format=json`} 
                        columns={coutryColumns}
                        stripped={true}
                        filters={this.state.gridFilter}
                        testId="worldBankTable"/>
                    </div>
                </div>
            </div>
        );
    }
}

export default WorldBank;

const incomeLevelProperty={
    key: 'id',
    value: 'value'
}

const lendingTypeProperty= {
    key: 'id',
    value: 'value'
}

const regionProperty= {
    key: 'code',
    value: 'name'
}

const coutryColumns = [
    { 
        header: 'Country',
        prop: 'name',
    },
    { 
      header: 'ISO2 Code',
      prop: 'iso2Code',
    },
    { 
      header: 'Capital',
      prop: 'capitalCity',
    },
    { 
      header: 'Region',
      prop: 'region',
    },
    { 
      header: 'Lending Type',
      prop: 'lendingType',
    },
    { 
      header: 'Income Level',
      prop: 'incomeLevel',
    },
];