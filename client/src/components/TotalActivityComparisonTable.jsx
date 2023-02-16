import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { calcEhb, getEhbByActivity, getEhbTotal } from './Helpers';

function TotalActivityComparisonTable(props) {
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

  const determineRankColor = (rankA, rankB) => {
    const a = Number(rankA);
    const b = Number(rankB);
  
    if (a === b) {
      return 'blue';
    }
    if (a > 0 && b === 0) {
      return 'green';
    }
    if (a === 0 && b > 0) {
      return 'red';
    }
    if (a < b) {
      return 'green';
    }
    if (a > b) {
      return 'red';
    }
  }

  const determineEhbColor = (rankA, rankB) => {
    if (typeof rankA === 'number' && typeof rankB === 'number') {
      return rankA > rankB? 'green': rankA < rankB? 'red': 'blue';
    }

    if (typeof rankA === 'number' && typeof rankB !== 'number') {
      return 'green';
    }

    if (typeof rankA !== 'number' && typeof rankB === 'number') {
      return 'red';
    }

    if (typeof rankA !== 'number' && typeof rankB !== 'number') {
      return 'blue';
    }
  }

  const getTotal = (key) => (
    bothPlayerActivities.reduce((a, b) => (
      typeof b[key] === 'number' && b.include === true? a + b[key]: a + 0
    ), 0)
  );

  const p1Total = getTotal('count_1');
  const p2Total = getTotal('count_2');
  const p1EhbTotal = getEhbTotal('count_1', p1EhbRates, bothPlayerActivities);
  const p2EhbTotal = getEhbTotal('count_2', p2EhbRates, bothPlayerActivities);
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
          <th>Rank -- {p1.name}</th>
          <th>Rank -- {p2.name}</th>
        </tr>
      </thead>
      <tbody>
        {bothPlayerActivities.map((item, idx) => {
          const {
            name,
            player1_rank, count_1,
            player2_rank, count_2,
          } = item;

          const p1Ehb = getEhbByActivity({name, level: count_1}, p1EhbRates);
          const p2Ehb = getEhbByActivity({name, level: count_2}, p2EhbRates);
          const p1EhbColor = determineEhbColor(p1Ehb, p2Ehb);
          const p2EhbColor = determineEhbColor(p2Ehb, p1Ehb);
          const p1CountColor = count_1 > count_2? 'green': count_1 < count_2? 'red': 'blue';
          const p2CountColor = count_2 > count_1? 'green': count_2 < count_1? 'red': 'blue';
          const p1RankColor = determineRankColor(player1_rank, player2_rank);
          const p2RankColor = determineRankColor(player2_rank, player1_rank);
          
          return(
            <tr key={idx}>
              <td>{name}</td>
              <td style={{color: p1CountColor}}>{count_1 > 0? count_1: '-'}</td>
              <td style={{color: p2CountColor}}>{count_2 > 0? count_2: '-'}</td>
              <td style={{color: p1EhbColor}}>{p1Ehb}</td>
              <td style={{color: p2EhbColor}}>{p2Ehb}</td>
              <td style={{color: p1RankColor}}>{player1_rank > 0? player1_rank: '-'}</td>
              <td style={{color: p2RankColor}}>{player2_rank > 0? player2_rank: '-'}</td>
            </tr>
          );
        })}
        <tr>
          <td>Total</td>
          <td style={{color: p1TotalColor}}>{p1Total}</td>
          <td style={{color: p2TotalColor}}>{p2Total}</td>
          <td style={{color: p1TotalEhbColor}}>{p1EhbTotal}</td>
          <td style={{color: p2TotalEhbColor}}>{p2EhbTotal}</td>
        </tr>
      </tbody>
    </Table>
  );
}

export default TotalActivityComparisonTable;