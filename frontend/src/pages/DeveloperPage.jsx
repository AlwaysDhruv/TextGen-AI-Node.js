import React from 'react';
import DeveloperCard from '../components/DeveloperCard';
import './DeveloperPage.css';

const devs = [
  {
    name: "Dhruv B. Sonavane",
    github: "https://github.com/AlwaysDhruv",
    linkedin: "https://www.linkedin.com/in/dhruv-sonavane-50559b278/",
    img: "https://avatars.githubusercontent.com/AlwaysDhruv"
  },
  {
    name: "Huzefa S. Rawat",
    github: "https://github.com/CYberHuzu18",
    linkedin: "https://www.linkedin.com/in/huzaifa-ravat-556728293/",
    img: "https://avatars.githubusercontent.com/u/198754421?v=4"
  }
];

const DeveloperPage = () => {
  return (
    <>
      <div className="animated-bg"></div>
      <div className="container">
        <div className="cards">
          {devs.map(dev => (
            <DeveloperCard key={dev.name} dev={dev} />
          ))}
        </div>
      </div>
    </>
  );
};

export default DeveloperPage;