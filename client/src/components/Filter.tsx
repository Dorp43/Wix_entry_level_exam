import React from 'react';
import './styles/filter.scss';


interface Props {
    handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export class Filter extends React.Component<Props> {

    render() {
        const { handleFilterChange } = this.props;
        const today = new Date().toISOString();
        return (<main>
            <header className='filter-toolbar'>
                <input className='search-input' type="search" name='search' placeholder="&#x1F50E; Search..." onChange={(e) => handleFilterChange(e)} />
                <div className='date-filter'>
                    <label className='input-legends' htmlFor="startDate"> From Dates:</label>
                    <input className='date-input' type="date" id="start" name="startDate" min="2010-01-01" max={today} onChange={(e) => handleFilterChange(e)} />
                    <label className='input-legends' htmlFor="endDate"> &#x27A8; </label>
                    <input className='date-input' type="date" id="end" name="endDate" min="2010-01-01" max={today} onChange={(e) => handleFilterChange(e)} />
                    <label className='input-legends' htmlFor="email"> &#x1F4E8; Email</label>
                    <input className='date-input' type="email" id="emailInput" name="email" placeholder="Email" onChange={(e) => handleFilterChange(e)} />
                    <label className='input-legends' htmlFor="tags"><span id='tags-symbol'>&#x1F3F7;</span> Tags</label>
                    <input className='date-input' type="text" id="tagsInput" name="tags" placeholder="example: tag1, tag2..." onChange={(e) => handleFilterChange(e)} />
                </div>
            </header>
        </main>)
    }
}

