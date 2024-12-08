import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function TeamSearch() {
  const [teams, setTeams] = useState([]);  // State to store the teams
  const [filteredTeams, setFilteredTeams] = useState([]); // State for filtered teams
  const [searchQuery, setSearchQuery] = useState('');  // State to track the search query
  const [isLoading, setIsLoading] = useState(false);  // State for loading indicator

  // Function to fetch teams when the user types in the search field
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      setIsLoading(true);
      axios
        .get(`https://livescore-api.com/api-client/teams/listing.json?&key=8pqplWIPeFLJ9fdT&secret=9i4lc8n5Vkae90NipeILbqAp6m8fBm9L`)
        .then((response) => {
          const teamsData = response.data.data.teams;
          setTeams(teamsData);
          
          // Filter teams based on the search query
          const filtered = teamsData.filter((team) =>
            team.team.name.toLowerCase().startsWith(query.toLowerCase())
          );
          setFilteredTeams(filtered);
        })
        .catch((error) => {
          console.error('Error fetching teams:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setFilteredTeams([]);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
      <div className="text-center p-4">
        {/* Sports team header */}
        <h1 className="mb-4">Sports Team</h1>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search teams"
          value={searchQuery}
          onChange={handleSearchChange}
        />

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul className="list-unstyled">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team, index) => (
                <li key={index} className="d-flex align-items-center mb-2">
                  <img
                    src={team.team.logo}
                    alt={team.team.name}
                    width="50"
                    className="mr-2"
                  />
                  {team.team.name} ({team.team.stadium}, {team.country.name})
                </li>
              ))
            ) : (
              searchQuery && <p>No teams found for "{searchQuery}"</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TeamSearch;
