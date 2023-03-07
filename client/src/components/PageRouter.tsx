import React from 'react';
import './styles/pages.scss';


interface Props {
    dataLength: number;
    currentPage: number;
    changePage: (page: number) => void;
}

export class PageRouter extends React.Component<Props> {

    handlePageChange = (page: number) => {
        const { changePage } = this.props;
        changePage(page)
    }


    render() {
        const { dataLength, currentPage } = this.props;
        const PAGE_SIZE = 20;
        const pageCount = Math.ceil(dataLength / PAGE_SIZE);

        const pageButtons = [];
        for (let i = 1; i < pageCount+1; i++) {
            pageButtons.push(
                <button key={i} className={i === currentPage ? 'selected-page-btn' : 'page-btn'} onClick={() => this.handlePageChange(i)}>
                    {i}
                </button>
            );
        }
        return (
            <div className='pages-container'>
                {pageButtons}
            </div>
        )
    }
};