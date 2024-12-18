import Axios from 'axios';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [skills, setSkills] = useState([]);
  const [hackathons, setHackathons] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await Axios.get('http://localhost:3000/skill/all');
        setSkills(response.data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    const fetchHackathons = async () => {
      try {
        const response = await Axios.get('http://localhost:3000/hackathon');
        setHackathons(response.data);
      } catch (error) {
        console.error('Error fetching hackathons:', error);
      }
    };

    fetchSkills();
    fetchHackathons();
  }, []);

  const createSkill = async (skillName) => {
    try {
      await Axios.post('http://localhost:3000/skill/create', {
        skillName,
      });

      Swal.fire({
        title: "Good job!",
        text: `${skillName} created successfully!`,
        icon: "success"
      });
      setTimeout(() => {
        Swal.close();
      }, 3000);

      // Refresh skills list
      const response = await Axios.get('http://localhost:3000/skill/all');
      setSkills(response.data);
    } catch (error) {
      console.error(`Error creating ${skillName}:`, error);
      Swal.fire({
        title: "Error",
        text: `There was an error creating ${skillName}.`,
        icon: "error"
      });
    }
  };

  const deleteSkill = async (skillID) => {
    try {
      await Axios.delete(`http://localhost:3000/skill/deleteSkill/${skillID}`);

      Swal.fire({
        title: "Deleted!",
        text: "Skill deleted successfully!",
        icon: "success"
      });
      setTimeout(() => {
        Swal.close();
      }, 3000);

      // Refresh skills list
      const response = await Axios.get('http://localhost:3000/skill/all');
      setSkills(response.data);
    } catch (error) {
      console.error('Error deleting skill:', error);
      Swal.fire({
        title: "Error",
        text: "There was an error deleting the skill.",
        icon: "error"
      });
    }
  };

  const createHackathon = async (hackathonData) => {
    try {
      await Axios.post('http://localhost:3000/hackathon/create', hackathonData);

      Swal.fire({
        title: "Good job!",
        text: `${hackathonData.name} created successfully!`,
        icon: "success"
      });
      setTimeout(() => {
        Swal.close();
      }, 3000);

      // Refresh hackathons list
      const response = await Axios.get('http://localhost:3000/hackathon');
      setHackathons(response.data);
    } catch (error) {
      console.error(`Error creating ${hackathonData.name}:`, error);
      Swal.fire({
        title: "Error",
        text: `There was an error creating ${hackathonData.name}.`,
        icon: "error"
      });
    }
  };

  const handleAddSkill = async () => {
    const { value: skillName } = await Swal.fire({
      title: 'Enter Skill Name',
      input: 'text',
      inputPlaceholder: 'Enter skill name',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      }
    });

    if (skillName) {
      createSkill(skillName);
    }
  };

  const handleAddHackathon = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Enter Hackathon Details',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Name">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Description">' +
        '<input id="swal-input3" class="swal2-input" placeholder="Location">' +
        '<input id="swal-input4" class="swal2-input" type="date" placeholder="Start Date">' +
        '<input id="swal-input5" class="swal2-input" type="date" placeholder="End Date">' +
        '<input id="swal-input6" class="swal2-input" placeholder="Image URL">',
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          name: document.getElementById('swal-input1').value,
          description: document.getElementById('swal-input2').value,
          location: document.getElementById('swal-input3').value,
          startDate: document.getElementById('swal-input4').value,
          endDate: document.getElementById('swal-input5').value,
          hackathonImage: document.getElementById('swal-input6').value,
        };
      }
    });

    if (formValues) {
      createHackathon(formValues);
    }
  };

  const all_user = () => { 
    window.location.href = '/AllUsers';
  }


  // Add the following function inside the Dashboard component

const deleteHackathon = async (hackathonID, hackathonName) => {
  const result = await Swal.fire({
    title: `Delete ${hackathonName}?`,
    text: "Are you sure you want to delete this hackathon?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await Axios.delete('http://localhost:3000/hackathon/delete', {
        data: { id: hackathonID },
      });

      Swal.fire({
        title: "Deleted!",
        text: `${hackathonName} has been deleted.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Refresh hackathons list
      const response = await Axios.get('http://localhost:3000/hackathon');
      setHackathons(response.data);
    } catch (error) {
      console.error(`Error deleting ${hackathonName}:`, error);
      Swal.fire({
        title: "Error",
        text: `There was an error deleting ${hackathonName}.`,
        icon: "error",
      });
    }
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Admin Dashboard
        </h1>
        
        {/* Skills Section */}
        <div className="bg-white rounded-xl shadow-xl p-8 transform hover:shadow-2xl transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4 relative">
            Skill Management
            <span className="absolute bottom-0 left-0 w-1/4 h-1 bg-gradient-to-r from-green-400 to-teal-500"></span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {skills.map((skill) => (
              <div key={skill.Skill_ID} className="relative group perspective-1000">
                <button 
                  onClick={createSkill}
                  className="w-full group flex flex-col items-center justify-center p-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-teal-500 text-white rounded-xl transition-all duration-500 transform hover:scale-110 hover:rotate-2 hover:shadow-xl backdrop-blur-sm"
                >
                  <span className="text-3xl mb-3 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                    {skill.Skill_Name.toLowerCase().includes('python') ? '🐍' :
                      skill.Skill_Name.toLowerCase().includes('java') ? '☕' :
                      skill.Skill_Name.toLowerCase().includes('react') ? '⚛️' :
                      skill.Skill_Name.toLowerCase().includes('node') ? '📦' :
                      skill.Skill_Name.toLowerCase().includes('sql') ? '🗄️' :
                      skill.Skill_Name.toLowerCase().includes('html') ? '🌐' :
                      skill.Skill_Name.toLowerCase().includes('css') ? '🎨' :
                      skill.Skill_Name.toLowerCase().includes('javascript') ? '💛' :
                      skill.Skill_Name.toLowerCase().includes('analytics skills') ? '📊' :
                      skill.Skill_Name.toLowerCase().includes('machine learning') ? '🤖' :
                      skill.Skill_Name.toLowerCase().includes('data science') ? '📈' :
                      skill.Skill_Name.toLowerCase().includes('cloud') ? '☁️' :
                      skill.Skill_Name.toLowerCase().includes('security') ? '🔐' :
                      skill.Skill_Name.toLowerCase().includes('devops') ? '🚢' :
                      skill.Skill_Name.toLowerCase().includes('blockchain') ? '⛓️' :
                      skill.Skill_Name.toLowerCase().includes('ai') ? '🧠' :
                      skill.Skill_Name.toLowerCase().includes('mobile') ? '📱' :
                      skill.Skill_Name.toLowerCase().includes('network') ? '🌐' :
                      skill.Skill_Name.toLowerCase().includes('testing') ? '🧪' :
                      skill.Skill_Name.toLowerCase().includes('web') ? '🌐' :
                      skill.Skill_Name.toLowerCase().includes('design') ? '🎨' :
                      skill.Skill_Name.toLowerCase().includes('problem solving') ? '🧩' :
                      skill.Skill_Name.toLowerCase().includes('team collaboration ') ? '🤝' :
                      skill.Skill_Name.toLowerCase().includes('code review ') ? '🔍' :
                      skill.Skill_Name.toLowerCase().includes('communication') ? '💬' :
                      skill.Skill_Name.toLowerCase().includes('mentoring ') ? '🧑‍🏫' :
                      skill.Skill_Name.toLowerCase().includes('time management ') ? '🧑‍🏫' :
                      skill.Skill_Name.toLowerCase().includes('continuous learning ') ? '📚' :
                      skill.Skill_Name.toLowerCase().includes('community ') ? '🤝' :
                      '💡'}
                  </span>
                  <span className="font-semibold tracking-wide group-hover:text-green-100">
                    {skill.Skill_Name}
                  </span>
                </button>
                <button
                  onClick={() => deleteSkill(skill.Skill_ID)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-red-600 hover:rotate-90 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button 
              onClick={handleAddSkill}
              className="group flex flex-col items-center justify-center p-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-green-500 text-white rounded-xl transition-all duration-500 transform hover:scale-110 hover:-rotate-2 hover:shadow-xl"
            >
              <span className="text-3xl mb-3 transform group-hover:rotate-180 transition-transform duration-500">➕</span>
              <span className="font-semibold tracking-wide group-hover:text-teal-100">
                Add more skill
              </span>
            </button>
          </div>
        </div>


{/* Hackathons Section */}
<div className="bg-white rounded-xl shadow-xl p-8 transform hover:shadow-2xl transition-all duration-300">
  <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4 relative">
    Hackathon Management
    <span className="absolute bottom-0 left-0 w-1/4 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></span>
  </h2>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {hackathons.map((hackathon) => (
      <div key={hackathon.HackathonID} className="relative group perspective-1000">
        <button 
          className="w-full group flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-xl transition-all duration-500 transform hover:scale-110 hover:rotate-2 hover:shadow-xl backdrop-blur-sm"
        >
          <span className="text-3xl mb-3 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
            🏆
          </span>
          <span className="font-semibold tracking-wide group-hover:text-blue-100">
            {hackathon.Name}
          </span>
        </button>
        <button
          onClick={() => deleteHackathon(hackathon.HackathonID, hackathon.Name)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-red-600 hover:rotate-90 shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    ))}
    <button 
      onClick={handleAddHackathon}
      className="group flex flex-col items-center justify-center p-6 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-blue-500 text-white rounded-xl transition-all duration-500 transform hover:scale-110 hover:-rotate-2 hover:shadow-xl"
    >
      <span className="text-3xl mb-3 transform group-hover:rotate-180 transition-transform duration-500">➕</span>
      <span className="font-semibold tracking-wide group-hover:text-indigo-100">
        Add more hackathon
      </span>
    </button>
  </div>
</div>

        {/* Users Section */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">
            User Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={all_user}
              className="flex items-center justify-center p-6 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <span className="text-2xl mr-3">👥</span>
              <span className="text-lg font-semibold">View All Users</span>
            </button>
            <button 
              className="flex items-center justify-center p-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <span className="text-2xl mr-3">📊</span>
              <span className="text-lg font-semibold">User Statistics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;