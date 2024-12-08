import React from 'react';

function Team({ team }) {
  return (
    <div>
      <h1>{team.name}</h1>
      <div>
        <div>Country: {team.country}</div>
        <div>Founded: {team.founded}</div>
      </div>
      <img
        src={team.logo}
        alt={`logo of ${team.name}`}
        height="150"
        width="150"
      />
    </div>
  );
}

export default Team;