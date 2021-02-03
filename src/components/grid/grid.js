import logo from '../../logo.svg';
import './grid.scss';
import React from 'react';
import GridRow from '../grid-row/grid-row';
import Pagination from '../pagination/pagination';

class Grid extends React.Component{
    constructor(props){
        super(props);
        this.state={
            error: null,
            isLoaded: false,
            gridData: [],
            currentPage: 1,
            totalPages: null,
            totalRecords: null
        }
    }

    componentDidMount() {
        this.fetchData(this.props.filters);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.filters !== this.props.filters) {
            this.setState({
                totalPages: null,
                totalRecords: null,
            })
            this.fetchData(this.props.filters);
        }
    }

    /**
     * function fetches the data from the api
     * @param { Contains the array of filters } filters 
     * @param { Contains the page number } page 
     * @param { Contains the records per page } perPage 
     */
    fetchData(filters, page=1, perPage=50){
        this.setState({
            isLoaded: false,
            error: null});
        const queryFilters = filters.length? this.generateFiltersQuery(filters):'';
        fetch(`${this.props.api}&page=${page}&per_page=${perPage}${queryFilters}`, {
            "method": "GET",
        })
        .then(response => response.json())
        .then(response => {
            !response[0].message?
            this.setState({
                gridData: response[1],
                isLoaded: true,
                currentPage: response[0].page,
                totalPages: response[0].pages,
                totalRecords: response[0].total,
            }):
            this.setState({
                isLoaded: true,
                error: {message: response[0].message[0].value}
            });
        },        
        (error) => {
            this.setState({
                isLoaded: true,
                error
            });
        })
    }

    /**
     * function calls the fetch data function to get the grid data
     * @param { Contains the page number sent from the Pagination component} page 
     */
    handlePageClick(page){
        this.fetchData(this.props.filters, page);
    }

    /**
     * Generates dynamic query to add the filters
     * @param { Contains an array of object for grid filters} filters 
     */
    generateFiltersQuery(filters){
        let query='';
        filters.forEach((item)=>{
            query+=`&${item.key}=${item.value}`
        })
        return query;
    }

    render(){
        const { 
                error, 
                isLoaded, 
                gridData, 
                currentPage, 
                totalPages, 
                totalRecords } = this.state;
        const { columns, stripped } = this.props;

        if(error){
            return (
                <div className="col">
                  Error: {error.message}
                </div>
            );
        } else{
            return (
                <div className="grid">
                    <Pagination 
                        currentPage= {currentPage}
                        totalPages= {totalPages}
                        totalRecords= {totalRecords}
                        onClick= {(page)=>this.handlePageClick(page)}/>
                    {isLoaded? 
                        <table data-testid={this.props.testId} className={"table " + (stripped ? "table-striped" : "")}>
                            <thead>
                                <tr className='row'>
                                    {columns.map((column) => (
                                    <th className='col-2' key={column.prop}>{column.header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                            {gridData.map((row, i) => (
                                <GridRow 
                                    columns={columns} 
                                    row={row} 
                                    key={i}/>
                            ))}
                            </tbody>
                        </table>:
                        <div className="grid-loader col">
                            <img src={logo} alt="grid loading" />Loading...
                        </div>
                    }
                </div>
            )
        }
    }
}

export default Grid;