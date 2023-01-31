import React, { useState, useEffect } from 'react';
import {
  graphTypes,
  skillSubTypes,
  calcBarSize,
  calcChartWidth,
} from './Helpers';
import CustomizedAxisTick from './rechart_components/CustomizedAxisTick';
import { Form, Row, Col } from 'react-bootstrap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import CustomCompareToolTip from './rechart_components/CustomCompareToolTip';

function SkillComparionChart(props) {
  const { allSkills, players } = props;
  const { p1, p2 } = players;

  const [graphType, setGraphType] = useState('level');
  const [skillSubType, setSkillSubType] = useState('all');
  const [bothPlayerSkills, setBothPlayerSkills] = useState([]);
  const [barSize, setBarSize] = useState(1);

  useEffect(() => {
    const matchingSkills = allSkills.filter(skill => (
      skillSubType === 'all'? allSkills: skill.subType === skillSubType
    ));

    setBothPlayerSkills(matchingSkills);
    setBarSize(calcBarSize(matchingSkills, 1.7));

  }, [skillSubType]);

  const handleChange = e => {
    const { id, value } = e.target;

    switch(id) {
      case 'graphType':
        setGraphType(value);
        break;
      case 'skillSubType':
        setSkillSubType(value);
        break;
      default:
        console.warn('invalid selected id in SkillComparisonChart');
    }
  }

  return(
    <>
      <Row>
        <Col>
          <Form>
            <div className='mb-3'>
              {graphTypes.map((item, idx) => (
                <Form.Check
                  id='graphType'
                  key={idx}
                  label={item.display}
                  name={item.display}
                  value={item.id}
                  type={item.type}
                  checked={graphType === item.id}
                  onChange={handleChange} />
              ))}
            </div>
          </Form>
          </Col>
          <Col>
          <Form>
            <div className='mb-3'>
              {skillSubTypes.map((item, idx) => (
                <Form.Check
                  id='skillSubType'
                  key={idx}
                  label={item.display}
                  name={item.display}
                  value={item.id}
                  type={item.type}
                  checked={skillSubType === item.id}
                  onChange={handleChange} />
              ))}
            </div>
          </Form>
        </Col>
      </Row>

      <Row className='barchart-container'>
        <Col>
        <ResponsiveContainer height={600} minWidth={500} width={calcChartWidth(bothPlayerSkills, 500)}>
          <BarChart
            data={bothPlayerSkills}
            margin={{
              top: 5,
              bottom: 95,
            }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' tick={<CustomizedAxisTick />} interval={0} />
              <YAxis width={120} />
              <Tooltip
                content={
                  <CustomCompareToolTip 
                    selectedGraph={graphType}
                    prefix={graphType === 'level'}
                    suffix={graphType === 'experience'}
                    _label={graphType.charAt(0).toUpperCase() + graphType.slice(1)}
                  />
              }
                cursor={{fill: 'transparent'}}
              />
              <Legend verticalAlign='top' wrapperStyle={{position: 'relative'}} />
              {graphType === 'level' && <Bar name={p1.name} dataKey='player1_level' fill='#8884d8' barSize={barSize} />}
              {graphType === 'level' && <Bar name={p2.name} dataKey='player2_level' fill='#82ca9d' barSize={barSize} />}

              {graphType === 'experience' && <Bar name={p1.name} dataKey='player1_xp' fill='#8884d8' barSize={barSize} />}
              {graphType === 'experience' && <Bar name={p2.name} dataKey='player2_xp' fill='#82ca9d' barSize={barSize} />}
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </>
  );
}

export default SkillComparionChart;