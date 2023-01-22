import React, { useState, useEffect } from 'react';
import TotalActivityComparisonTable from './TotalActivityComparisonTable';
import NetActivityComparisonTable from './NetActivityComparisonTable';
import { activitySubTypes, tableTypes } from './Helpers';
import { Form } from 'react-bootstrap';

function ActivityComparisonTable(props) {
  const { allActivities, players, theme } = props;
  const { p1, p2 } = players;

  const [activitySubType, setActivitySubType] = useState('all');
  const [tableType, setTableType] = useState('total');
  const [bothPlayerActivities, setBothPlayerActivities] = useState([]);
  
  const calcActivities = (_activitySubType, _tableType) => {
    
    return allActivities.filter(activity => (
      _activitySubType === 'all'? allActivities: activity.subType === activitySubType
      )).map(activity => {
        const excludedFromRunningTotal = [
          'Clue Scrolls (all)',
        ];

        const {
          name,
          player1_count, player2_count, 
          player1_rank, player2_rank,
        } = activity;

        const myObj = {
          name,
          include: excludedFromRunningTotal.indexOf(name) < 0,
          player1_rank: player1_rank,
          player2_rank: player2_rank,
          count_1: _tableType === 'total'? player1_count: player1_count - player2_count,
          count_2: _tableType === 'total'? player2_count: player2_count - player1_count,
        };

        return myObj;
    });
  }

  useEffect(() => {
    const matchingActivities = calcActivities(activitySubType, tableType);

    setBothPlayerActivities(matchingActivities);
  }, [activitySubType, tableType]);


  const handleChange = e => {
    const { id, value } = e.target;

    switch(id) {
      case 'tableType':
        setTableType(value);
        break;
      case 'activitySubType':
        setActivitySubType(value);
        break;
      default:
        console.warn('invalid selected id in ActivityComparisonTable');
    }
  }

  return(
    <>
      <Form>
        <div className='mb-3'>
          {tableTypes.map((item, idx) => (
            <Form.Check
              id='tableType'
              key={idx}
              inline
              label={item.display}
              name={item.display}
              value={item.id}
              type={item.type}
              checked={tableType === item.id}
              onChange={handleChange} />
          ))}
        </div>
        <div className='mb-3'>
          {activitySubTypes.map((item, idx) => (
            <Form.Check
              id='activitySubType'
              key={idx}
              inline
              label={item.display}
              name={item.display}
              value={item.id}
              type={item.type}
              checked={activitySubType === item.id}
              onChange={handleChange} />
          ))}
        </div>
      </Form>

      {
        tableType === 'total' &&
        <TotalActivityComparisonTable
          p1={p1} p2={p2} 
          theme={theme} 
          bothPlayerActivities={bothPlayerActivities}
        />
      }
      {
        tableType === 'net' &&
        <NetActivityComparisonTable
          p1={p1} p2={p2}
          theme={theme}
          bothPlayerActivities={bothPlayerActivities}
        />
      }
    </>
  );
}

export default ActivityComparisonTable;