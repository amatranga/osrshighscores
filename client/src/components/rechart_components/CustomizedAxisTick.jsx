import React from 'react';

function CustomizedAxisTick(props) {
  const { x, y, payload } = props;

  return(
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={0}
        textAnchor='end'
        fill='#666'
        transform='rotate(-90)'>
          {payload.value}
        </text>
    </g>
  );
}

export default CustomizedAxisTick;