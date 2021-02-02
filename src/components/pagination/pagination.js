import react from 'react';

class Pagination extends react.Component{
    constructor(props){
        super(props);
        this.state={
            currentPage:1,
        }
    }
    
    /**
     * returns the page range based on start page and total pages
     */
    fetchPageNumbers() {
        const totalPages = this.props.totalPages;
        const startPage = 1;
        return range(startPage, totalPages);
    }

    /**
     * function sets current page in state and calls the parent onclick
     * @param {Accepts the page number} page 
     */
    handlePageClick(page){
        this.setState({
            currentPage: page
        })
        this.props.onClick(page);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentPage !== this.props.currentPage) {
            this.setState({
                currentPage: this.props.currentPage
            })
        }
    }

    render(){
        const { totalPages, totalRecords } = this.props;
        const { currentPage } = this.state;
        const pages = this.fetchPageNumbers();
        return (
            <div className="paginationContainer mb-2">
                <div className="row d-flex">
                    <div className="w-100 py-2 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <h2>
                                <strong className="text-secondary">{totalRecords}</strong> Records
                            </h2>
                            { currentPage && (
                                <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                                Page <span className="font-weight-bold">{ currentPage }</span> / <span className="font-weight-bold">{ totalPages }</span>
                                </span>
                            ) }
                        </div>
                        <div className="d-flex align-items-center">
                            <nav aria-label="Pagination">
                                <ul className="pagination">
                                    { pages.map((page, index) => {
                                        return (
                                            <li key={index} className={`page-item${ currentPage === page ? ' active' : ''}`}>
                                                <a className="page-link" href="#" onClick={ ()=>this.handlePageClick(page) }>{ page }</a>
                                            </li>
                                        );
                                    }) }
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Pagination;

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
const range = (from, to, step = 1) => {
    let i = from;
    const range = [];
  
    while (i <= to) {
      range.push(i);
      i += step;
    }
  
    return range;
  }