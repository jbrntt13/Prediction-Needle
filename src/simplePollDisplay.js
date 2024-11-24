import React, { useState, useEffect } from 'react';
import ReactSpeedometer from "react-d3-speedometer";

function SimplePollDisplay() {
    const [combinedData, setCombinedData] = useState({ data: '', matches: [] });
    const [countdown, setCountdown] = useState(60);  // Countdown timer state
    const [showWeekly, setShowWeekly] = useState(false);  // State to track toggle
    const [isLoading, setIsLoading] = useState(false);  // State to track loading

    const fetchCurrentOdds = () => {
        //setIsLoading(true);
        console.log('Fetching Current Odds');
        fetch('https://abstracts-authors-father-aurora.trycloudflare.com/currentodds')
            .then(response => response.json())
            .then(data => {
                console.log('Data:', data);
                const matches = data.map(match => ({
                    homeTeam: match[0],
                    homeScore: match[1],
                    homeChance: match[2],
                    awayTeam: match[3],
                    awayScore: match[4],
                    awayChance: match[5]
                }));
                setCombinedData({ data: data.value, matches: matches });
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    };

    const fetchWeeklyPredictions = () => {
        setIsLoading(true);
        console.log('Fetching weekly predictions');
        fetch('https://abstracts-authors-father-aurora.trycloudflare.com/weeklyblindprojections')
            .then(response => response.json())
            .then(data => {
                console.log('Weekly Data:', data);
                const matches = data.map(match => ({
                    homeTeam: match[0],
                    homeScore: match[1],
                    homeChance: match[2],
                    awayTeam: match[3],
                    awayScore: match[4],
                    awayChance: match[5]
                }));
                setCombinedData({ data: data.value, matches: matches });
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching weekly data:', error);
                setIsLoading(false);
            });
    };

    const togglePredictions = () => {
        if (showWeekly) {
            fetchCurrentOdds();
        } else {
            fetchWeeklyPredictions();
        }
        setShowWeekly(!showWeekly);
    };

    const kayleighFix = (name) => {
        if(name.includes("Booker?")){
            return "Booker";
        }
        return name;
    }

    const getCurrentValueText = (value, match) => {
        let winningTeam;
        if(value < 49){
            winningTeam = match.homeTeam;
        }else if(value > 51){
            winningTeam = match.awayTeam;
        }
        if (value >= 37 && value <= 63) {
            return "Toss Up";
        } else if ((value >= 20 && value <= 36) || (value >= 64 && value <= 80)) {
            return "Leaning to " + winningTeam;
        } else if ((value >= 0 && value <= 19) || (value >= 81 && value <= 100)) {
            return "Heavily Leaning to " + winningTeam;
        }
        return "";
    };

    const renderSpeedometers = () => {
        return combinedData.matches.map((match, index) => {
            let value = Math.round(match.awayChance * 100);
            let chanceValue = value;
            if (value < 50) {
                chanceValue = 100 - value;

            }
            const currentValueText = getCurrentValueText(value, match);

            const homeName = kayleighFix(match.homeTeam);
            const awayName = kayleighFix(match.awayTeam);

            const homeImage = process.env.PUBLIC_URL + `/mii/${homeName}.JPG`;
            const awayImage = process.env.PUBLIC_URL + `/mii/${awayName}.JPG`;

            return (
                <div
                    key={index}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: '50px',
                        paddingBottom: '20px',
                        borderBottom: '2px solid #ccc',
                        borderRight: '2px solid #ccc',
                        borderLeft: '2px solid #ccc',
                        borderTop: '2px solid #ccc',
                        borderRadius: '10px',
                    }}
                >
                    {/* Match Title */}
                    <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>
                        {match.homeTeam} VS {match.awayTeam}
                    </div>

                    {/* Images and Scores */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: '400px',
                        }}
                    >
                        {/* Home Team */}
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={homeImage}
                                alt={`${match.homeTeam} logo`}
                                style={{
                                    height: '75px',
                                    width: '55px',
                                    borderRadius: '50%',
                                    border: '2px solid blue',
                                    marginBottom: '5px',
                                }}
                            />
                            <div style={{ fontWeight: 'bold', color: 'blue' }}>{match.homeScore}</div>
                        </div>

                        {/* Speedometer */}
                        <div style={{ flex: '1', margin: '0 10px' }}>
                            <ReactSpeedometer
                                minValue={0}
                                maxValue={100}
                                value={value}
                                currentValueText={chanceValue + '%'}
                                needleColor={'mediumblue'}
                                needleTransitionDuration={4000}
                                needleTransition="easeElastic"
                                segmentColors={['orangered']}
                                customSegmentStops={[0, value, 100]}
                                width={200} // Smaller width for mobile compatibility
                                height={140} // Adjust height to keep the proportions
                                maxSegmentLabels={0}
                            />
                        </div>

                        {/* Away Team */}
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={awayImage}
                                alt={`${match.awayTeam} logo`}
                                style={{
                                    height: '75px',
                                    width: '55px',
                                    borderRadius: '50%',
                                    border: '2px solid red',
                                    marginBottom: '5px',
                                }}
                            />
                            <div style={{ fontWeight: 'bold', color: 'red' }}>{match.awayScore}</div>
                        </div>
                    </div>

                    {/* Result Text */}
                    <div style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '16px' }}>
                        {currentValueText}
                    </div>
                </div>
            );
        });
    };


    const getTitle = () => {
        return showWeekly ? "Weekly Predictions" : "Daily Predictions";
    };

    useEffect(() => {
        //setIsLoading(true);
        fetchCurrentOdds();
        const intervalId = setInterval(fetchCurrentOdds, 60000); //This should be 60000
        const countdownIntervalId = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown === 1) {
                    return 60;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => {
            clearInterval(intervalId);
            clearInterval(countdownIntervalId);
        };
    }, []);

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Fantom™</h1>
            <p>These needles try to give a guess on who will score the most fantasy points.</p>
            <p>The farther to one side, the more likely that team will win</p>
            <h2>{getTitle()}</h2>
            {/*<button onClick={togglePredictions}>*/}
            {/*    {showWeekly ? 'Show Daily Predictions' : 'Show Weekly Predictions'}*/}
            {/*</button>*/}
            {isLoading ? <p>Loading...</p> : (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                    {combinedData.matches.length > 0 ? renderSpeedometers() : <p>No chances available</p>}
                </div>
            )}
        </div>
    );
}

export default SimplePollDisplay;