import React from 'react';

const DeveloperCard = ({ dev }) => {
  return (
    <div className="card">
      <img src={dev.img} alt={dev.name} />
      <h2>{dev.name}</h2>
      <div className="card-links">
        <a href={dev.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href={dev.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
    </div>
  );
};

export default DeveloperCard;