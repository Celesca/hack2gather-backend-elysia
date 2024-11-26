import Axios from 'axios';
import  { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCallback } from "react";
const EventDetail = () => {
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [Teamlist, setTeamlist] = useState([]);
  const [TeamName, setTeamName] = useState('');
  const { HackathonID } = useParams();
  console.log("HackathonID:", HackathonID);
  const [Hackathondetaillist, setHackathondetaillist] = useState([]);

  const getHackathondetail = useCallback(async () => {
    try {
      const response = await Axios.get(`http://localhost:3000/hackathon/${HackathonID}`);
      console.log("API Response:", response.data);
      setHackathondetaillist([response.data]);
    } catch (error) {
      console.error('Error fetching Hackathon data:', error);
    }
  }, [HackathonID]);

  const getteam = useCallback(async () => {
    try {
      const response = await Axios.get(`http://localhost:3000/team/hackathon/${HackathonID}`);
      console.log("team Response:", response.data);
      setTeamlist([response.data]);
    } catch (error) {
      console.error('Error fetching Hackathon data:', error);
    }
  }, [HackathonID]);

useEffect(() => {
  getHackathondetail();
  getteam();
}, [getHackathondetail,getteam]);
  

    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center bg-gradient-to-r from-blue-500 to-indigo-600 p-12 lg:p-24 text-white">
          <div className="flex-1 mb-8 lg:mb-0 lg:mr-12">
            <img
              src="https://via.placeholder.com/600x400"
              alt="Product"
              className="rounded-lg shadow-lg w-full object-cover"
            />
          </div>
          {Hackathondetaillist.map((hackathon) => (
          <div key={hackathon.HackathonID} >
            <div className="flex-1">
              <h2 className="text-6xl font-bold mb-4">{hackathon.Name}</h2>

              <div className="flex items-center gap-2"> 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <span className="text-xl font-semibold mt-8 mb-1">Location {hackathon.Location}</span>
              </div>

              <div className="flex items-center gap-2 mt-3"> 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
              </svg>
                <span className="text-lg font-semibold">{hackathon.StartDate} - {hackathon.EndDate}</span>
              </div>

              {/* <div className="flex items-center space-x-4">
                <p className="text-lg">ประเภทการแข่งขัน:</p>
                <p className="font-semibold text-xl">👫 Team</p>
              </div> */}
            </div>
          </div>
          ))}
        </div>
            
  
        {/* Details Section */}
        {Hackathondetaillist.map((hackathon) => (
          <div key={hackathon.HackathonID} >
            <div className="px-8 py-16 lg:px-24 bg-gray-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">รายละเอียดงาน</h2>
              <p className="text-gray-600 leading-relaxed">
                {hackathon.Description}
              </p>
            </div>
          </div>
        ))}
  
        {/* Reviews Section */}
        {/* <div className="bg-gray-100 px-8 py-16 lg:px-24">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">รีวิว</h2>
          <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="min-w-[300px] bg-white rounded-lg p-6 shadow-lg flex flex-col space-y-2"
              >
                <h3 className="text-xl font-semibold text-gray-700">Review {i + 1}</h3>
                <p className="text-gray-600">This is a review content.</p>
              </div>
            ))}
          </div>
        </div> */}
  
        {/* Teams Section */}
        <div id="teamlist" className="px-8 py-16 lg:px-24 bg-white">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
              ทีมที่เปิดรับสมาชิก
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

              {Teamlist.map((val,key) => (
                  <div key={key} className="relative bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition">
                      <div className="absolute top-4 left-4  text-gray-700 text-sm font-semibold py-1 px-3 rounded-full shadow-md">
                          <span>👥 /4 members</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mt-8">Team {val.TeamName}</h3>
                      <button
                          // onClick={() => handleJoinTeam(i)}
                          className="absolute bottom-4 right-4 px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-full shadow-md hover:from-blue-500 hover:to-blue-600 transition-transform transform hover:-translate-y-1 hover:scale-105"
                      >
                          Join Team
                      </button>
                  </div>
              ))}

          </div>
          <div className="flex justify-center mt-8">
            <button
                onClick={() => setIsCreateTeamModalOpen(true)}
                className="group flex justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 4v16m8-8H4" 
                    />
                </svg>
                Create Your New Team
            </button>
        </div>
        </div>

        {/* Create Team Modal */}
        {isCreateTeamModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="w-full max-w-lg bg-gradient-to-b from-blue-500 to-sky-500 text-white rounded-lg p-6 shadow-lg">
                    <h1 className="text-3xl font-bold text-center mb-6 ">Create New Team</h1>
                    
                    {/* Team Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Team Name</label>
                        <input
                            type="text"
                            placeholder="Enter team name"
                            className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                            onChange={(e) => setTeamName(e.target.value)}
                        />
                    </div>
                    
                    {/* Buttons */}
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={() => setIsCreateTeamModalOpen(false)}
                            className="w-1/3 h-12 bg-gray-300 text-black font-bold rounded-full shadow-md hover:bg-gray-400 transition duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                // Add create team logic here
                                console.log({ TeamName });
                                setIsCreateTeamModalOpen(false);
                            }}
                            className="w-1/3 h-12 bg-green-500 text-white font-bold rounded-full shadow-md hover:bg-green-600 transition duration-300"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        )}


      </div>
    );
  };
  
  export default EventDetail;