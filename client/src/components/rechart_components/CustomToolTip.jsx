import React from 'react';

function CustomToolTip(props) {
  const {active, payload, label, prefix, suffix, _label} = props;
  if (active && payload && payload.length) {
    return(
      <div className='custom-tooltip'>
        <p className='label'>
          {`${label}: ${prefix? _label: ''} ${payload[0].value} ${suffix? _label: ''}`}
        </p>
      </div>
    );
  }
  return null;
}

export default CustomToolTip;