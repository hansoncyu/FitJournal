import React, { Component } from 'react';
import moment from 'moment';
import './css/JournalHeader.css';

class JournalHeader extends Component {
    render() {

        const today = moment();
        const yesterday = moment().subtract(1, 'day');
        const tomorrow = moment().add(1, 'day');
        var date = moment(this.props.date);

        if (moment(date).isSame(today, 'day')) {
            date = 'Today';
        } else if (moment(date).isSame(yesterday, 'day')) {
            date = 'Yesterday';
        } else if (moment(date).isSame(tomorrow, 'day')) {
            date = 'Tomorrow';
        } else {
            date = moment(this.props.date).format('ddd, MMM DD');
        }

        const header = (
            <div id='headerWrap'>
                <div id='date'>
                    <a id='backDay' onClick={(e) => this.props.handler(e, -1)}>
                        <i className='fa fa-arrow-left' aria-hidden='true' />
                    </a>
                    {date}
                    <a id='forwardDay' onClick={(e) => this.props.handler(e, 1)}>
                        <i className='fa fa-arrow-right' aria-hidden='true' />
                    </a>
                </div>
            </div>
            );

        return(
            <div id='JournalHeader'>
                {header}
            </div>
            );
    }
}

export default JournalHeader;
