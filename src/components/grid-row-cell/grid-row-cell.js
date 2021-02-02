import React from 'react';
import './grid-row-cell.scss';

class GridRowCell extends React.Component{
    render(){   
        const { item } = this.props;
        return (
            <td className='col-2 grid-row-cell'>
                {item.value ? item.value:item}
            </td>
        )
    }
}

export default GridRowCell;