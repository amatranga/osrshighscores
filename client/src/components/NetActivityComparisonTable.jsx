import React from 'react';
import { Table } from 'react-bootstrap';

function NetActivityComparisonTable(props) {
  const { p1, p2, theme, bothPlayerActivities } = props;

  const getTotal = (key) => (
    bothPlayerActivities.reduce((a, b) => (
      typeof b[key] === 'number' && b.include === true? a + Number(b[key]): a + 0
    ), 0)
  );

  const p1Total = getTotal('count_1');
  const p2Total = getTotal('count_2');
  const p1TotalColor = p1Total > p2Total? 'green': p1Total < p2Total? 'red': 'blue';
  const p2TotalColor = p2Total > p1Total? 'green': p2Total < p1Total? 'red': 'blue';

  return(
    <Table striped bordered hover responsive variant={theme === 'dark'? 'dark': ''}>
      <thead>
        <tr>
          <th>Activity</th>
          <th>Count -- {p1.name}</th>
          <th>Count -- {p2.name}</th>
          <th>Rank Difference</th>
        </tr>
      </thead>
      <tbody>
        {bothPlayerActivities.map((item, idx) => {
          const {
            name,
            player1_rank, count_1,
            player2_rank, count_2
          } = item;

          const isEqual = count_1 === count_2;

          const p1CountColor = count_1 > count_2? 'green': count_1 < count_2? 'red': 'blue';
          const p2CountColor = count_2 > count_1? 'green': count_2 < count_1? 'red': 'blue';
          const netRankColor = player1_rank - player2_rank === 0? 'blue': '';
          const rankDiff = Math.abs(player1_rank - player2_rank);

          return(
            <tr key={idx}>
              <td>{name}</td>
              <td style={{color: p1CountColor}}>{
                count_1 > 0? '+ ' + count_1: isEqual? 'Equal': '-'}
              </td>
              <td style={{color: p2CountColor}}>
                {count_2 > 0? '+ ' + count_2: isEqual? 'Equal': '-'}
              </td>
              <td style={{color:netRankColor}}>
                {rankDiff === 0 ? '-' : rankDiff}
              </td>
            </tr>
          );
        })}
        <tr>
          <td>Total</td>
          <td style={{color: p1TotalColor}}>{p1Total > p2Total? `+ ${p1Total}`: p1Total}</td>
          <td style={{color: p2TotalColor}}>{p2Total > p1Total? `+ ${p2Total}`: p2Total}</td>
        </tr>
      </tbody>
    </Table>
  );
}

export default NetActivityComparisonTable;