import React       from 'react';
import moment      from 'moment';
import packageJson from '@/package.json';
import preval      from 'preval.macro';

const buildTimestamp = preval`module.exports = new Date().getTime();`;

class Version extends React.Component {
    getDateString = () => {
        const lastUpdateMoment = moment.unix(buildTimestamp / 1000);
        const formattedDate    = lastUpdateMoment.format('DD.MM.YYYY HH:mm:ss');

        return formattedDate;
    };

    render () {
        return (
               
            <div className="text-xs text-dgrey1">
                {'V'+packageJson.version}
                {'.'}
                {buildTimestamp}
                {' '}
                {'('}
                {this.getDateString()}
                {')'}
            </div>
        );
    }
}

Version.propTypes = {};

Version.defaultProps = {};

export default Version;