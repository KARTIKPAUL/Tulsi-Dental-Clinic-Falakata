import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHome from '../pages/Home';

const dentalFacts = [
  {
    title: "Teeth are as unique as fingerprints",
    description: "Your teeth are completely unique to you, just like your fingerprints. No two sets of teeth are alike."
  },
  {
    title: "Tooth enamel is the hardest substance in the human body",
    description: "Enamel is the protective outer layer of your teeth and is the hardest and most highly mineralized substance in your body."
  },
  {
    title: "Brushing twice a day can reduce the risk of tooth decay by 40%",
    description: "Regular brushing helps reduce plaque and prevent cavities, which are among the most common dental issues."
  },
  {
    title: "Flossing is just as important as brushing",
    description: "Flossing cleans the areas between your teeth that your toothbrush can’t reach, reducing the risk of gum disease."
  }
];

// Function to get a random index ensuring it's different from the current fact
const getRandomIndex = (length, currentIndex) => {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * length);
  } while (randomIndex === currentIndex);
  return randomIndex;
};

// Function to calculate display time based on the length of title and description
const calculateDisplayTime = (title, description) => {
  const combinedLength = title.length + description.length;
  const minTime = 3000; // 3 seconds
  const maxTime = 6000; // 6 seconds
  const timePerChar = 50; // Display time per character
  return Math.min(maxTime, Math.max(minTime, combinedLength * timePerChar));
};

const Home = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
      // Navigate to the dashboard
      navigate('/dashboard/');
    };
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    const currentFact = dentalFacts[currentFactIndex];
    const displayTime = calculateDisplayTime(currentFact.title, currentFact.description);

    const interval = setInterval(() => {
      setCurrentFactIndex(getRandomIndex(dentalFacts.length, currentFactIndex));
    }, displayTime);

    return () => clearInterval(interval);
  }, [currentFactIndex]);

  const currentFact = dentalFacts[currentFactIndex];

  return (


    <MainHome />

    // <div className="min-h-screen bg-blue-50 flex items-center justify-center">
    //   <div className="container mx-auto p-8">
    //     <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Interesting Dental Facts</h1>
        
    //     <div className="bg-white p-6 rounded-lg shadow-md text-center">
    //       <h2 className="text-xl font-semibold text-blue-800 mb-2">{currentFact.title}</h2>
    //       <p className="text-gray-700">{currentFact.description}</p>
    //     </div>
    //     <div className="mt-6 flex justify-center">
    //         <button
    //           onClick={handleButtonClick}
    //           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    //         >
    //           Dashboard
    //         </button>
    //       </div>
    //   </div>
      
    // </div>
  );
};

export default Home;
