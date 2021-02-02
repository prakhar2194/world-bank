import React from 'react';
import './grid-row.scss';
import GridRowCell from '../grid-row-cell/grid-row-cell';

class GridRow extends React.Component{
    render(){
        const { row, columns } = this.props;
        return (
                <tr className='row grid-row'>
                    {columns.map((column) => (
                        <GridRowCell item={row[column.prop]} key={column.prop}/>
                    ))}
                </tr>
        );
    }
}

export default GridRow;