import React from 'react';
import Team from './Team';

function TeamList({ teams, showTeam }) {
  if (teams.length > 10) {
    return <p>Too many matches, please specify another filter</p>;
  }

  if (teams.length === 1) {
    return <Team team={teams[0]} />;
  }

  return (
    <div>
      {teams.map((team) => (
        <div key={team.id}>
          {team.name}{" "}
          <button onClick={() => showTeam(team.name)}>show</button>
        </div>
      ))}
    </div>
  );
}

export default TeamList;