import Axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCallback } from "react";
import Swal from 'sweetalert2'
const EventDetail = () => {
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isjoinTeamModalOpen, setIsjoinTeamModalOpen] = useState([false,'']);
  const [isleaveTeamModalOpen, setleaveTeamModalOpen] = useState([false,'']);
  const [Teamlist, setTeamlist] = useState([]);
  const [userTeamlist, setuserTeamlist] = useState([]);
  const [member, setmember] = useState([]);
  const [teamName, setteamName] = useState('');
  const [maxMember, setmaxMember] = useState('');
  const [role,setrole] = useState('head');
  const { HackathonID } = useParams();
  console.log("HackathonID:", HackathonID);
  const [Hackathondetaillist, setHackathondetaillist] = useState([]);
  const UserID = localStorage.getItem('UserID')
  const [currentUserRole, setCurrentUserRole] = useState('');

   useEffect(() => {
     console.log('Teamlist:', userTeamlist);
   }, [userTeamlist]);
   useEffect(() => {
    console.log('member:', member);
  }, [member]);
  
  const deletefromteam = async (TeamID, UserID) => {
    try {
      const response = await Axios.delete(`http://localhost:3000/team/removeMember`, {
        data: {
          teamID: TeamID,
          userID: UserID
        }
      });
      console.log('Delete response:', response.data);
      Swal.fire({
        title: "Congratulation",
        text: "Delete this member from team!",
        icon: "success"
      });
      setTimeout(() => {
        Swal.close();
      }, 3000);

      await new Promise(resolve => setTimeout(resolve, 2000));

      window.location.href = `/EventDetail/${HackathonID}`;
    } catch (error) {
      console.error("Error deleting from team:", error);
    }
  }

  //list of members
   const showmember = async (TeamID) => {
    try {
      const response = await Axios.get(`http://localhost:3000/team/finduserteam/${TeamID}`);
      const teamMembers = response.data; // Assuming the response contains a list of members
      console.log('Team members:', teamMembers);
      const memberDetails = await Promise.all(teamMembers.map(async (member) => {
        const res = await Axios.get(`http://localhost:3000/user/id/${member.UserID}`);
        return {
          teamID: TeamID,
          userID: member.UserID,
          userName: res.data.UserName,
          role: member.Role
        };
      }));
      
      setmember(memberDetails);

      const currentUser = memberDetails.find(member => member.userID === UserID);
      if (currentUser) {
        setCurrentUserRole(currentUser.role);
      }
      
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const jointeam = async (TeamID,CurrentMember,MaxMember) => {
    try {
      if (CurrentMember == MaxMember){
        Swal.fire({
          title: "Sorry",
          text: "Team is full!",
          icon: "error"
        });
        setTimeout(() => {
          Swal.close();
        }, 3000);
    
        await new Promise(resolve => setTimeout(resolve, 2000));
    
        // localStorage.setItem('UserID', JSON.stringify(response.data.UserID));
        window.location.href = `/EventDetail/${HackathonID}`;
      }
      else{
        Swal.fire({
          title: "Good job!",
          text: "Join team Sucessful!",
          icon: "success"
        });
        setTimeout(() => {
          Swal.close();
        }, 3000);
    
        await new Promise(resolve => setTimeout(resolve, 2000));
    
        // localStorage.setItem('UserID', JSON.stringify(response.data.UserID));
        window.location.href = `/EventDetail/${HackathonID}`;
      
      const payloadt = {
            teamID: TeamID,
            userID: UserID,
            role: role
            };
        console.log('Payload:', payloadt);
        await Axios.post('http://localhost:3000/team/addMember', payloadt);
        setuserTeamlist((prev) => [
            ...prev,
            { teamID: TeamID, userID: UserID, role: role },
        ]);
      }
    } catch (error) {
        console.error("Error joining team:", error);
    }
    
  
  };


const addteam = async () => {
  if (!teamName || !HackathonID || !maxMember || isNaN(maxMember)) {
      console.error('Invalid input');
      return;
  }
  try {
      const payload = {
          teamName : teamName,
          hackathonID: parseInt(HackathonID, 10),
          maxMember: parseInt(maxMember, 10),
      };
      console.log('Payload:', payload);

      const response = await Axios.post('http://localhost:3000/team/create', payload);
      const teamid = response.data.TeamID;

      await Axios.post('http://localhost:3000/team/addMember', {
          teamID : teamid,
          userID: UserID,
          role : role,
      });

      setTeamlist((prev) => [
          ...prev,
          { TeamName: teamName, HackathonID, MaxMember: maxMember, CurrentMember: 0 },
      ]);

      setuserTeamlist((prev) => [
          ...prev,
          { TeamID: teamid, UserID: UserID, Role: role },
      ]);

      console.log('Team created successfully');
  } catch (error) {
      console.error('Error creating team:', error.response?.data || error.message);
  }
};


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
      setTeamlist(response.data);
    } catch (error) {
      console.error('Error fetching Hackathon data:', error);
    }
  }, [HackathonID]);

  useEffect(() => {
    getHackathondetail();
    getteam();
}, [getHackathondetail, getteam]);


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

      {/* Teams Section */}
      <div id="teamlist" className="px-8 py-16 lg:px-24 bg-white">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          ทีมที่เปิดรับสมาชิก
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {Teamlist.map((val, key) => (
            <div key={key} className="relative bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="absolute top-4 left-4  text-gray-700 text-sm font-semibold py-1 px-3 rounded-full shadow-md">
                <span>👥 {val.CurrentMember}/{val.MaxMember}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mt-8">Team {val.TeamName}</h3>
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button
                  onClick={async () => {
                    await setleaveTeamModalOpen([true, val.TeamID])
                    showmember(val.TeamID)
                  }}
                  className="px-3 py-1 bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold rounded-full shadow-md hover:from-red-500 hover:to-red-600 transition-transform transform hover:-translate-y-1 hover:scale-105"
                >
                  Delete Member
                </button>
                <button
                  onClick={() => setIsjoinTeamModalOpen([true, val.TeamID, val.CurrentMember, val.MaxMember])}
                  className="px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-full shadow-md hover:from-blue-500 hover:to-blue-600 transition-transform transform hover:-translate-y-1 hover:scale-105"
                >
                  Join Team
                </button>
              </div>

            </div>
          ))}
          
        {/* leave team popup */}
        {isleaveTeamModalOpen[0] == true && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-lg bg-gradient-to-b from-blue-500 to-sky-500 text-white rounded-lg p-6 shadow-lg">
              <h1 className="text-3xl font-bold text-center mb-6 ">Show member</h1>
              
              {member.filter(val => val.userID !== UserID).map((val,key) => (
                <div key={key} className="flex justify-between items-center">
                <div>
                  <h3>{val.teamID}</h3>
                  <p>UserID: {val.userID}</p>
                  <p>Username: {val.userName}</p>
                </div>

                {currentUserRole === 'head' && (
                  <button
                    onClick={() => deletefromteam(val.teamID, val.userID)}
                    className="px-3 py-1 bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold rounded-full shadow-md hover:from-red-500 hover:to-red-600 transition-transform transform hover:-translate-y-1 hover:scale-105"
                  >
                    Remove
                  </button>
                )}

              </div>
            ))}
              
              {/* Buttons */}
              
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setleaveTeamModalOpen(false)}
                    className="w-1/3 h-12 bg-gray-300 text-black font-bold rounded-full shadow-md hover:bg-gray-400 transition duration-300"
                  >
                    Cancel
                  </button>
                  
                </div>
            </div>
          </div>
        )}  
        
        {/* jointeam popup */}
        {isjoinTeamModalOpen[0] == true && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-lg bg-gradient-to-b from-blue-500 to-sky-500 text-white rounded-lg p-6 shadow-lg">
              <h1 className="text-3xl font-bold text-center mb-6 ">Create New Team</h1>
              
              {/* role */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">role</label>
                <input
                  type="text"
                  placeholder="Enter role"
                  className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                  onChange={(e) => setrole(e.target.value)}
                />
              </div>
              {/* Buttons */}
              
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setIsjoinTeamModalOpen(false)}
                    className="w-1/3 h-12 bg-gray-300 text-black font-bold rounded-full shadow-md hover:bg-gray-400 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await jointeam(isjoinTeamModalOpen[1],isjoinTeamModalOpen[2],isjoinTeamModalOpen[3]);
                      setIsjoinTeamModalOpen(false);

                    }}
                    className="w-1/3 h-12 bg-green-500 text-white font-bold rounded-full shadow-md hover:bg-green-600 transition duration-300"
                  >
                    Join
                  </button>
                </div>
            </div>
          </div>
        )}

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
                onChange={(e) => setteamName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Max member</label>
              <input
                type="number"
                placeholder="Enter Max member"
                className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                onChange={(e) => setmaxMember(parseInt(e.target.value, 10))}
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
                onClick={async () => {
                  await addteam();
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