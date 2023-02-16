import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { calcEhb, getEhbByActivity, getEhbTotal } from './Helpers';

function NetActivityComparisonTable(props) {
  const { p1, p2, theme, bothPlayerActivities, ehbRates, modes } = props;
  const { player1Mode, player2Mode } = modes;

  const [p1EhbRates, setP1EhbRates] = useState({});
  const [p2EhbRates, setP2EhbRates] = useState({});

  useEffect(() => {
    const calculatedEhb = calcEhb(ehbRates, player1Mode);
    setP1EhbRates(calculatedEhb);
  }, [player1Mode, ehbRates]);

  useEffect(() => {
    const calculatedEhb = calcEhb(ehbRates, player2Mode);
    setP2EhbRates(calculatedEhb);
  }, [player2Mode, ehbRates]);

  const getTotal = (key) => (
    bothPlayerActivities.reduce((a, b) => (
      typeof b[key] === 'number' && b.include === true? a + Number(b[key]): a + 0
    ), 0)
  );

  const p1Total = getTotal('count_1');
  const p2Total = getTotal('count_2');
  const p1EhbTotal = getEhbTotal('count_1', p1EhbRates, bothPlayerActivities);
  const p2EhbTotal = getEhbTotal('count_2', p2EhbRates, bothPlayerActivities);
  const p1NetEhbTotal = Math.round((p1EhbTotal - p2EhbTotal) * 1000) / 1000;
  const p2NetEhbTotal = Math.round((p2EhbTotal - p1EhbTotal) * 1000) / 1000;
  const p1TotalColor = p1Total > p2Total? 'green': p1Total < p2Total? 'red': 'blue';
  const p2TotalColor = p2Total > p1Total? 'green': p2Total < p1Total? 'red': 'blue';
  const p1TotalEhbColor = p1EhbTotal > p2EhbTotal? 'green': p1EhbTotal < p2EhbTotal? 'red': 'blue';
  const p2TotalEhbColor = p2EhbTotal > p1EhbTotal? 'green': p2EhbTotal < p1EhbTotal? 'red': 'blue';

  return(
    <Table striped bordered hover responsive variant={theme === 'dark'? 'dark': ''}>
      <thead>
        <tr>
          <th>Activity</th>
          <th>Count -- {p1.name}</th>
          <th>Count -- {p2.name}</th>
          <th>Efficient Hours -- {p1.name}</th>
          <th>Efficient Hours -- {p2.name}</th>
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

          const p1Ehb = getEhbByActivity({name, level: count_1}, p1EhbRates);
          const p2Ehb = getEhbByActivity({name, level: count_2}, p2EhbRates);
          const localP1Ehb = typeof p1Ehb === 'number'? p1Ehb : 0;
          const localP2Ehb = typeof p2Ehb === 'number'? p2Ehb : 0;
          const p1CountColor = count_1 > count_2? 'green': count_1 < count_2? 'red': 'blue';
          const p2CountColor = count_2 > count_1? 'green': count_2 < count_1? 'red': 'blue';
          const p1EhbCountColor = localP1Ehb > localP2Ehb? 'green': localP1Ehb < localP2Ehb? 'red': 'blue';
          const p2EhbCountColor = localP2Ehb > localP1Ehb? 'green': localP2Ehb < localP1Ehb? 'red': 'blue';
          const netRankColor = player1_rank - player2_rank === 0? 'blue': '';
          const rankDiff = Math.abs(player1_rank - player2_rank);
          const p1EhbDiff = Math.round((localP1Ehb - localP2Ehb) * 1000) / 1000;
          const p2EhbDiff = Math.round((localP2Ehb - localP1Ehb) * 1000) / 1000;

          return(
            <tr key={idx}>
              <td>{name}</td>
              <td style={{color: p1CountColor}}>{
                count_1 > 0? '+ ' + count_1: '-'}
              </td>
              <td style={{color: p2CountColor}}>
                {count_2 > 0? '+ ' + count_2: '-'}
              </td>
              <td style={{color: p1EhbCountColor}}>{p1EhbDiff > 0? `+ ${p1EhbDiff}`: '-'}</td>
              <td style={{color: p2EhbCountColor}}>{p2EhbDiff > 0? `+ ${p2EhbDiff}`: '-'}</td>
              <td style={{color:netRankColor}}>
                {rankDiff === 0 ? '-' : rankDiff}
              </td>
            </tr>
          );
        })}
        <tr>
          <td>Total</td>
          <td style={{color: p1TotalColor}}>{p1Total > p2Total? `+ ${p1Total}`: p1Total > 0? p1Total: '-'}</td>
          <td style={{color: p2TotalColor}}>{p2Total > p1Total? `+ ${p2Total}`: p2Total > 0? p2Total: '-'}</td>
          <td style={{color: p1TotalEhbColor}}>{p1NetEhbTotal > 0 ? `+ ${p1NetEhbTotal}`: p1NetEhbTotal > 0? p1NetEhbTotal: '-'}</td>
          <td style={{color: p2TotalEhbColor}}>{p2NetEhbTotal > 0? `+ ${p2NetEhbTotal}`: p2NetEhbTotal > 0? p2NetEhbTotal: '-'}</td>
        </tr>
      </tbody>
    </Table>
  );
}

export default NetActivityComparisonTable;