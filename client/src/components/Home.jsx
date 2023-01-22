import React, { useEffect, useState } from 'react';
import { Container, Tab, Tabs, Row, Col } from 'react-bootstrap';
import PlayerLookup from './PlayerLookup';
import SkillsTable from './SkillsTable';
import ActivitiesTable from './ActivitiesTable';
import NavbarHeader from './NavbarHeader';
import SkillComparionChart from './SkillComparisonChart';
import ActivityComparisonTable from './ActivityComparisonTable';
import ErrorModal from './ErrorModal';
import { playerFilter } from './Helpers';
import { getHighScoreByMode } from '../API';

function Home(props) {
  const [player1, setPlayer1] = useState([]);
  const [player2, setPlayer2] = useState([]);
  const [bothPlayerSkills, setBothPlayerSkills] = useState([]);
  const [bothPlayerActivities, setBothPlayerActivities] = useState([]);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);

  const { theme } = props;

  useEffect(() => {
    setShow1(false);
    setTimeout(() => {
      setShow1(true);
    }, 0);
  }, [player1]);

  useEffect(() => {
    setShow2(false);
    setTimeout(() => {
      setShow2(true);
    }, 0);
  }, [player2]);

  useEffect(() => {
    const hasPlayer1 = player1.length > 0;
    const hasPlayer2 = player2.length > 0;

    if (hasPlayer1 && hasPlayer2) {
      const player1Skills = playerFilter(player1, 'Skill');
      const player2Skills = playerFilter(player2, 'Skill');
      const player1Activities = playerFilter(player1, 'Activity');
      const player2Activities = playerFilter(player2, 'Activity');
      const player1Info = playerFilter(player1, 'Info')[0];
      const player2Info = playerFilter(player2, 'Info')[0];
      
      const allSkills = player1Skills.map((skill, idx) => {
        const player2Skill = player2Skills[idx];
        return {
          name: skill.name, 
          type: skill.type,
          subType: skill.subType,
          player1_xp: skill.experience,
          player1_rank: skill.rank,
          player1_level: skill.level,
          player1_name: player1Info.name,
          player1_mode: player1Info.mode,
          player2_xp: player2Skill.experience,
          player2_rank: player2Skill.rank,
          player2_level: player2Skill.level,
          player2_name: player2Info.name,
          player2_mode: player2Info.mode,
        }
      });
      const allActivities = player1Activities.map((activity, idx) => {
        const player2Activity = player2Activities[idx];
        return {
          name: activity.name,
          type: activity.type,
          subType: activity.subType,
          player1_count: activity.level,
          player1_rank: activity.rank,
          player2_count: player2Activity.level,
          player2_rank: player2Activity.rank,
        }
      });
      setBothPlayerSkills(allSkills);
      setBothPlayerActivities(allActivities);
    }
  }, [player1, player2]);

  const handleTabSelect = k => {
    if (k === 'Player 1') {
      setShow1(true);
      setShow2(false);
      setShowActivities(false);
      setShowSkills(false);
    }
    if (k === 'Player 2') {
      setShow1(false);
      setShow2(true);
      setShowActivities(false);
      setShowSkills(false);
    }
    if (k === 'Compare') {
      setShow1(false);
      setShow2(false);
      setShowActivities(true);
      setShowSkills(true);
    }
  }

  const clearError = () => {
    setIsError(false);
    setErrorMessage(undefined);
  }

  const handleSubmit = (player, name, mode) => {
    getHighScoreByMode(mode, name).then(res => {
      const { status, data } = res;
      if (status === 200) {
        clearError();
        if (player === 1) {
          setPlayer1(data);
        } else {
          setPlayer2(data);
        }
      } else {
        setIsError(true);
        setErrorMessage(data);
      }
    })
    .catch(err => console.error(err));
  }

  const switchTheme = (e) => {
    props.switchTheme();
  }

  const rowClassName='mb-5';

  return (
    <>
      <NavbarHeader theme={theme} switchTheme={switchTheme} />

      <Container fluid>
        <Tabs
          onSelect={handleTabSelect}
          defaultActiveKey='Player 1'
          id='uncontrolled-tab'
          className='mb-3'>
            <Tab eventKey='Player 1' title='Player 1'>
              <PlayerLookup playerId={1} handleSubmit={handleSubmit} />
              <Row className={rowClassName}>
                <Col>
                  {
                    player1.length > 0 && 
                    show1 &&
                    <SkillsTable player={player1} />
                  }
                </Col>
              </Row>
              <Row>
                <Col>
                  {
                    player1.length > 0 && 
                    show1 &&
                    <ActivitiesTable player={player1} theme={theme} />
                  }
                </Col>
              </Row>
            </Tab>
            
            <Tab eventKey='Player 2' title='Player 2'>
              <PlayerLookup playerId={2} handleSubmit={handleSubmit} />
              <Row className={rowClassName}>
                <Col>
                  {
                    player2.length > 0 && 
                    show2 &&
                    <SkillsTable player={player2} theme={theme} />
                  }
                </Col>
              </Row>
              <Row>
                <Col>
                  {
                    player2.length > 0 && 
                    show2 &&
                    <ActivitiesTable player={player2} theme={theme} />
                  }
                </Col>
              </Row>
            </Tab>
            <Tab eventKey='Compare' title='Compare'>
              <Row className={rowClassName}>
                <Col>
                  {
                    bothPlayerSkills.length > 0 &&
                    showSkills &&
                    <SkillComparionChart
                      allSkills={bothPlayerSkills}
                      players={{p1: playerFilter(player1, 'Info')[0], p2: playerFilter(player2, 'Info')[0]}} 
                    />
                  }
                </Col>
              </Row>
              <Row>
                <Col>
                  {
                    bothPlayerActivities.length > 0 &&
                    showActivities && 
                    <ActivityComparisonTable
                      allActivities={bothPlayerActivities}
                      players={{p1: playerFilter(player1, 'Info')[0], p2: playerFilter(player2, 'Info')[0]}}
                      theme={theme}
                    />
                  }
                </Col>
              </Row>
            </Tab>
        </Tabs>
        {
          isError && 
          <ErrorModal
            close={clearError} 
            show={isError} 
            title='Error' 
            body={errorMessage}
          />
        }
      </Container>
    </>
  );
}

export default Home;