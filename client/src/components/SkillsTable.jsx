import React, { useState, useEffect } from 'react';
import {
  graphTypes,
  skillSubTypes,
  calcBarSize,
  playerFilter,
  calcChartWidth,
  yAxisTickformatter,
} from './Helpers';
import CustomizedAxisTick from './rechart_components/CustomizedAxisTick';
import CustomToolTip from './rechart_components/CustomToolTip';
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

function SkillsTable(props) {
  const { player } = props;
  const skills = playerFilter(player, 'Skill');

  const [graphType, setGraphType] = useState('level');
  const [skillSubType, setSkillSubType] = useState('all');
  const [shownSkills, setShownSkills] = useState(skills);
  const [barSize, setBarSize] = useState(1);

  useEffect(() => {
    const matchingSkills = skills.filter(skill => {
      if (skillSubType === 'all') {
        return skills;
      }
      return skill.subType === skillSubType;
    });

    setShownSkills(matchingSkills);
    setBarSize(calcBarSize(matchingSkills, 1));
  }, [skillSubType]);

  const handleChange = e => {
    const { id, value } = e.target;

    if (id === 'graphType') {
      setGraphType(value);
    }
    if (id === 'skillSubType') {
      setSkillSubType(value);
    }
  }

  const handleHorizontalScroll = (e) => {
    const { scrollLeft } = e.target;
    
    const yAxisEle = document.getElementsByClassName('recharts-yAxis')[0];
    yAxisEle.style = `transform: translateX(${scrollLeft}px)`;
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

      <Row className='barchart-container' onScroll={handleHorizontalScroll}>
        <Col>
            <ResponsiveContainer height={600} minWidth={350} width={calcChartWidth(shownSkills, 350)}>
              <BarChart
                data={shownSkills}
                margin={{
                  top: 5,
                  bottom: 95,
                }}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' tick={<CustomizedAxisTick />} interval={0} />
                  <Tooltip 
                    content={
                      <CustomToolTip 
                      prefix={graphType === 'level'} 
                      suffix={graphType==='experience'} 
                      _label={graphType.charAt(0).toUpperCase() + graphType.slice(1)} 
                      />} 
                    cursor={{fill: 'transparent'}} />
                  <Legend verticalAlign='top' align='left' wrapperStyle={{ position: 'relative', paddingLeft: '50px' }} />
                  {
                    graphType === 'level' && 
                    <Bar
                      name={graphType.charAt(0).toUpperCase() + graphType.slice(1)}
                      dataKey='level'
                      fill='#8884d8'
                      barSize={barSize}
                    />
                  }
                  {
                    graphType === 'experience' && 
                    <Bar
                      name={graphType.charAt(0).toUpperCase() + graphType.slice(1)} 
                      dataKey='experience' 
                      fill='#82ca9d' 
                      barSize={barSize}
                    />
                  }
                  <YAxis tickFormatter={yAxisTickformatter} />
                </BarChart>
            </ResponsiveContainer>
        </Col>
      </Row>
    </>
  )
}

export default SkillsTable;