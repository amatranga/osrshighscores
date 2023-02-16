import React, { useState, useEffect } from 'react';
import { playerFilter, activitySubTypes, calcEhb, getEhbByActivity } from './Helpers';
import { Form, Table } from 'react-bootstrap';

function ActivitiesTable(props) {
  const { player, theme, ehbRates, mode } = props;
  const activities = playerFilter(player, 'Activity');

  const [activitySubType, setActivitySubType] = useState('all');
  const [shownActivity, setShownActivity] = useState(activities);
  const [ehb, setEhb] = useState({});

  useEffect(() => {
    const calculatedEhb = calcEhb(ehbRates, mode);
    setEhb(calculatedEhb);
  }, [ehbRates, mode]);

  useEffect(() => {
    const matchingActivities = activities.filter(activity => {
      if (activitySubType === 'all') {
        return activities;
      }
      return activity.subType === activitySubType;
    });

    setShownActivity(matchingActivities);
  }, [activitySubType]);

  const handleChange = e => {
    const { id, value } = e.target;

    switch(id) {
      case 'activitySubType':
        setActivitySubType(value);
        break;
      default:
        console.warn('invalid selected id in ActivitiesTable');
    }
  }

  return (
    <>
      <Form>
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
      
      <Table striped bordered hover responsive variant={theme === 'dark'? 'dark': ''}>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Count</th>
            <th>Efficient Hours</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {shownActivity.map((activity, idx) => (
            <tr key={idx}>
              <td>{activity.name}</td>
              <td>{activity.level === 0 ? '-': activity.level}</td>
              <td>{getEhbByActivity(activity, ehb)}</td>
              <td>{activity.rank === 0 ? '-': activity.rank}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default ActivitiesTable;