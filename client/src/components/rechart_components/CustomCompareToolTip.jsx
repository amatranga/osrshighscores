import React from 'react';

function CustomCompareToolTip(props) {
  const {
    active, 
    payload, 
    label, 
    selectedGraph,
    prefix,
    suffix,
    _label
  } = props;
  if (active && payload && payload.length) {
    const firstPayload = payload[0];
    const { 
      player1_level,
      player1_name,
      player1_xp,
      player2_level,
      player2_name,
      player2_xp
    } = firstPayload.payload;

    const getData = () => {
      switch (selectedGraph) {
        case 'experience': 
          return {p1: player1_xp, p2: player2_xp};
        case 'level': 
          return {p1: player1_level, p2: player2_level};
        default:
          console.warn('invalid selected graph. defaulting to level')
          return {p1: player1_level, p2: player2_level};
      }
    }

    return(
      <div className='custom-tooltip'>
        <p className='label'>{label}</p>
        <div className='intro'>
          <p>
            {player1_name}: {prefix? _label: ''} {getData().p1} {suffix? _label: ''}
          </p>
          <p>
            {player2_name}: {prefix? _label: ''} {getData().p2} {suffix? _label: ''}
          </p>
        </div>
      </div>
    )
  }
}

export default CustomCompareToolTip;