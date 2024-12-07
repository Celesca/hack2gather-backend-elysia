import Axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EventDetail = () => {
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isJoinTeamModalOpen, setIsJoinTeamModalOpen] = useState([false, '']);
  const [isLeaveTeamModalOpen, setLeaveTeamModalOpen] = useState([false, '']);
  const [isShowTeamModalOpen, setShowTeamModalOpen] = useState([false, '']);
  const [isDeleteTeamModalOpen, setDeleteTeamModalOpen] = useState([false, '']);
  const [teamList, setTeamList] = useState([]);
  const [userTeamList, setUserTeamList] = useState([]);
  const [member, setMember] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [maxMember, setMaxMember] = useState('');
  const [role, setRole] = useState('head');
  const { HackathonID } = useParams();
  console.log("HackathonID:", HackathonID);
  const [hackathonDetailList, setHackathonDetailList] = useState([]);
  const UserID = localStorage.getItem('UserID');
  const [currentUserRoles, setCurrentUserRoles] = useState({}); // Manage roles per team

  useEffect(() => {
    console.log('User Team List:', userTeamList);
  }, [userTeamList]);

  useEffect(() => {
    console.log('Member:', member);
  }, [member]);

  const getUserTeams = useCallback(async () => {
    try {
      const response = await Axios.get(`http://localhost:3000/team/user/${UserID}`);
      setUserTeamList(response.data);
      const roles = {};
      response.data.forEach(team => {
        roles[team.teamID] = team.role ? team.role.trim().toLowerCase() : 'member';
      });
      setCurrentUserRoles(roles);
      console.log('User roles:', roles);
    } catch (error) {
      console.error('Error fetching user teams:', error);
    }
  }, [UserID]);

  useEffect(() => {
    getUserTeams();
  }, [getUserTeams]);

  const checkTeam = async (TeamID) => {
    try {
      const response = await Axios.get(`http://localhost:3000/team/finduserteam/${TeamID}`);
      const team = response.data;
      const currentUser = team.find(member => member.UserID === UserID);
      if (currentUser) {
        Swal.fire({
          title: "Sorry",
          text: "You are already in a team!",
          icon: "error",
          timer: 3000,
          showConfirmButton: false
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        window.location.href = `/EventDetail/${HackathonID}`;
      }
    } catch (error) {
      console.error("Error checking team:", error);
    }
  }

  const deleteteam = async (TeamID) => {
    console.log(`Attempting to delete team with ID: ${TeamID}`);
    try {
      await Axios.delete(`http://localhost:3000/team/delete/${TeamID}`, {
        data: { UserID }, // Ensure UserID is correctly retrieved
        headers: { 'Content-Type': 'application/json' },
      });
  
      Swal.fire({
        title: "Congratulations",
        text: "Team deleted successfully!",
        icon: "success",
        timer: 3000,
        showConfirmButton: false
      });
  
      // Update teamList and userTeamList without reloading
      setTeamList(prev => prev.filter(team => team.TeamID !== TeamID));
      setUserTeamList(prev => prev.filter(team => team.teamID !== TeamID));
      setCurrentUserRoles(prev => {
        const updated = { ...prev };
        delete updated[TeamID];
        return updated;
      });
  
    } catch (error) {
      console.error("Error deleting team:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "There was an issue deleting the team.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false
      });
    }
  }

  // Delete members from team
  const deleteFromTeam = async (TeamID, UserIDToRemove) => {
    try {
      await Axios.delete(`http://localhost:3000/team/removeMember`, {
        data: {
          teamID: TeamID,
          userID: UserIDToRemove
        }
      });
  
      Swal.fire({
        title: "Congratulations",
        text: "Member removed from the team!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
  
      // Update member list
      setMember(prev => prev.filter(member => member.userID !== UserIDToRemove));
  
      // If the removed user is the current user, update userTeamList and roles
      if (UserIDToRemove === UserID) {
        setUserTeamList(prev => prev.filter(team => team.teamID !== TeamID));
        setCurrentUserRoles(prev => {
          const updated = { ...prev };
          delete updated[TeamID];
          return updated;
        });
      }
  
    } catch (error) {
      console.error("Error deleting from team:", error);
      Swal.fire({
        title: "Error",
        text: "There was an issue removing the member from the team.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false
      });
    }
  }

  // List of members
  const showMember = async (TeamID) => {
    try {
      const response = await Axios.get(`http://localhost:3000/team/finduserteam/${TeamID}`);
      const teamMembers = response.data;
      console.log('Team members:', teamMembers);
      const memberDetails = await Promise.all(teamMembers.map(async (member) => {
        const res = await Axios.get(`http://localhost:3000/user/id/${member.UserID}`);
        return {
          teamID: TeamID,
          userID: member.UserID,
          userName: res.data.UserName,
          role: member.Role ? member.Role.trim().toLowerCase() : 'member' // Default role
        };
      }));
  
      setMember(memberDetails);
  
      const currentUser = memberDetails.find(member => member.userID === UserID);
      if (currentUser) {
        setCurrentUserRoles(prev => ({ ...prev, [TeamID]: currentUser.role }));
        console.log(`Current user role in team ${TeamID}:`, currentUser.role);
      }
  
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const joinTeam = async (TeamID, CurrentMember, MaxMember) => {
    try {
      if (CurrentMember >= MaxMember) {
        Swal.fire({
          title: "Sorry",
          text: "Team is full!",
          icon: "error",
          timer: 3000,
          showConfirmButton: false
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        window.location.href = `/EventDetail/${HackathonID}`;
      } else if (userTeamList.length > 0) {
        Swal.fire({
          title: "Error",
          text: "You are already part of a team. Please leave your current team before joining another.",
          icon: "error",
          timer: 3000,
          showConfirmButton: false
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        const payload = {
          teamID: TeamID,
          userID: UserID,
          role: role
        };
        console.log('Payload:', payload);
        await Axios.post('http://localhost:3000/team/addMember', payload);
        setUserTeamList((prev) => [
          ...prev,
          { teamID: TeamID, userID: UserID, role: role },
        ]);

        // Update currentUserRoles
        setCurrentUserRoles(prev => ({ ...prev, [TeamID]: role.trim().toLowerCase() }));

        Swal.fire({
          title: "Good job!",
          text: "Joined the team successfully!",
          icon: "success",
          timer: 3000,
          showConfirmButton: false
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error("Error joining team:", error);
      Swal.fire({
        title: "Error",
        text: "There was an issue joining the team.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false
      });
    }
  };

  const addTeam = async () => {
    if (!teamName || !HackathonID || !maxMember || isNaN(maxMember)) {
      console.error('Invalid input');
      return;
    }
    try {
      // Check if the user is already the head of a team
      const isHead = userTeamList.some(team => team.role.toLowerCase() === 'head');
      if (isHead) {
        Swal.fire({
          title: "Error",
          text: "You have already created a team. Please delete your existing team before creating a new one.",
          icon: "error",
          timer: 3000,
          showConfirmButton: false
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        return;
      }
  
      const payload = {
        teamName: teamName,
        hackathonID: parseInt(HackathonID, 10),
        maxMember: parseInt(maxMember, 10),
      };
      console.log('Payload:', payload);
  
      const response = await Axios.post('http://localhost:3000/team/create', payload);
      const teamID = response.data.TeamID;
  
      await Axios.post('http://localhost:3000/team/addMember', {
        teamID: teamID,
        userID: UserID,
        role: role,
      });
  
      setTeamList((prev) => [
        ...prev,
        { TeamName: teamName, HackathonID, MaxMember: maxMember, CurrentMember: 1 },
      ]);
  
      setUserTeamList((prev) => [
        ...prev,
        { teamID: teamID, userID: UserID, role: role },
      ]);
  
      // Update currentUserRoles
      setCurrentUserRoles(prev => ({ ...prev, [teamID]: role.trim().toLowerCase() }));
      console.log(`Role for team ${teamID} set to ${role.trim().toLowerCase()}`);
  
      Swal.fire({
        title: "Congratulations",
        text: "Team created successfully!",
        icon: "success",
        timer: 3000,
        showConfirmButton: false
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      window.location.href = `/EventDetail/${HackathonID}`;
    } catch (error) {
      console.error('Error creating team:', error.response?.data || error.message);
      Swal.fire({
        title: "Error",
        text: "There was an issue creating the team.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false
      });
    }
  };

  const getHackathonDetail = useCallback(async () => {
    try {
      const response = await Axios.get(`http://localhost:3000/hackathon/${HackathonID}`);
      console.log("API Response:", response.data);
      setHackathonDetailList([response.data]);
    } catch (error) {
      console.error('Error fetching Hackathon data:', error);
    }
  }, [HackathonID]);

  const getTeams = useCallback(async () => {
    try {
      const response = await Axios.get(`http://localhost:3000/team/hackathon/${HackathonID}`);
      console.log("Teams Response:", response.data);
      setTeamList(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  }, [HackathonID]);

  useEffect(() => {
    getHackathonDetail();
    getTeams();
  }, [getHackathonDetail, getTeams]);

  const unjoinTeam = async (TeamID) => {
    try {
      await Axios.delete(`http://localhost:3000/team/removeMember`, {
        data: {
          teamID: TeamID,
          userID: UserID
        }
      });
      setUserTeamList((prev) => prev.filter(team => team.teamID !== TeamID));
      // Remove role from currentUserRoles
      setCurrentUserRoles(prev => {
        const updated = { ...prev };
        delete updated[TeamID];
        return updated;
      });

      Swal.fire({
        title: "Success",
        text: "You have successfully left the team!",
        icon: "success",
        timer: 3000,
        showConfirmButton: false
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      window.location.href = `/EventDetail/${HackathonID}`;
    } catch (error) {
      console.error("Error unjoining team:", error);
      Swal.fire({
        title: "Error",
        text: "There was an issue leaving the team.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center bg-gradient-to-r from-blue-600 to-indigo-700 p-12 lg:p-24 text-white">
        {hackathonDetailList.map((hackathon) => (
          <div key={hackathon.HackathonID} className="flex flex-1 flex-col lg:flex-row items-center">
            <div className="flex-1 mb-8 lg:mb-0 lg:mr-12">
              <img
                src={hackathon.HackathonImage}
                alt={hackathon.Name}
                className="rounded-lg shadow-lg w-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-6xl font-extrabold mb-4">{hackathon.Name}</h2>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0Z" />
                </svg>
                <span className="text-xl font-medium">Location: {hackathon.Location}</span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25 2.25v11.251m-18 0a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                </svg>
                <span className="text-lg font-medium">{hackathon.StartDate} - {hackathon.EndDate}</span>
              </div>

              {/* Details Section */}
              {hackathonDetailList.map((hackathon) => (
                <div key={hackathon.HackathonID} className="px-8 py-16 lg:px-2">
                  <h2 className="text-3xl font-bold text-white-800 mb-6">Hackathon details</h2>
                  <p className="text-white-700 leading-relaxed">
                    {hackathon.Description}
                  </p>
                </div>
              ))}

            </div>
          </div>
        ))}
      </div>

     

      {/* Teams Section */}
      <div id="teamlist" className="px-8 py-16 lg:px-24 bg-white">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">ทีมที่เปิดรับสมาชิก</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamList.map((val, key) => {
            const isUserInTeam = userTeamList.some(team => team.teamID === val.TeamID);
            console.log('User in team:', isUserInTeam);
            const userRoleInTeam = currentUserRoles[val.TeamID] || '';
            console.log('User role in team:', userRoleInTeam);
            return (
              <div key={key} className="relative bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="absolute top-4 left-4 bg-blue-500 text-white text-sm font-semibold py-1 px-3 rounded-full shadow">
                  <span>👥 {val.CurrentMember}/{val.MaxMember}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mt-8">Team {val.TeamName}</h3>

                {isUserInTeam || userRoleInTeam == 'head' && (
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setDeleteTeamModalOpen([true, val.TeamID])}
                  className="ml-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-transform transform hover:rotate-180"
                  title="Delete Team"
                >
                  ✖
                </button>
              </div>
            )}

                <div className="absolute bottom-4 right-4 flex space-x-2">
                  {/* Show Members Button */}
                  <button
                    onClick={() => {
                      setShowTeamModalOpen([true, val.TeamID]);
                      showMember(val.TeamID);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold rounded-full shadow-md hover:from-green-500 hover:to-green-600 transition-transform transform hover:-translate-y-1 hover:scale-105"
                  >
                    Show Members
                  </button>

                  {/* Conditional Join/Unjoin Button */}
                  {isUserInTeam ? (
                    <button
                      onClick={() => unjoinTeam(val.TeamID)}
                      className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold rounded-full shadow-md hover:from-red-500 hover:to-red-600 transition-transform transform hover:-translate-y-1 hover:scale-105"
                    >
                      Unjoin Team
                    </button>
                  ) : (
                    userTeamList.length === 0 && (
                      <button
                        onClick={async () => {
                          setIsJoinTeamModalOpen([true, val.TeamID, val.CurrentMember, val.MaxMember]);
                          await checkTeam(val.TeamID);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-full shadow-md hover:from-blue-500 hover:to-blue-600 transition-transform transform hover:-translate-y-1 hover:scale-105"
                      >
                        Join Team
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}

          {/* Add Team Button */}
          {userTeamList.length === 0 && (
            <button
              onClick={() => setIsCreateTeamModalOpen(true)}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white rounded-xl transition-transform duration-500 transform hover:scale-110 hover:-rotate-2 hover:shadow-xl"
            >
              <span className="text-3xl mb-3">➕</span>
              <span className="font-semibold tracking-wide">Create Your New Team</span>
            </button>
          )}
        </div>
      </div>

      {/* Show Members Modal */}
      {isShowTeamModalOpen[0] && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="w-full max-w-lg bg-gradient-to-b from-blue-600 to-sky-700 text-white rounded-lg p-8 shadow-lg transform transition-transform duration-300">
            <h1 className="text-3xl font-bold text-center mb-6">Members</h1>

            {member.map((val, key) => (
              <div key={key} className="flex justify-between items-center mb-4">
                <p className="font-semibold text-lg">{val.userName}</p>
                <p className="text-lg">{val.role}</p>
              </div>
            ))}

            {/* Close Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowTeamModalOpen([false, ''])}
                className="w-1/3 h-12 bg-gray-300 text-black font-bold rounded-full shadow-md hover:bg-gray-400 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

{isDeleteTeamModalOpen[0] && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <div className="w-full max-w-lg bg-gradient-to-b from-red-600 to-red-700 text-white rounded-lg p-8 shadow-lg transform transition-transform duration-300">
      <h1 className="text-3xl font-bold text-center mb-6">Delete Team</h1>
      <p className="text-center mb-6">Are you sure you want to delete this team?</p>
      
      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setDeleteTeamModalOpen([false, ''])}
          className="w-1/3 h-12 bg-gray-300 text-black font-bold rounded-full shadow-md hover:bg-gray-400 transition duration-300"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            await deleteteam(isDeleteTeamModalOpen[1]);
            setDeleteTeamModalOpen([false, '']);
          }}
          className="w-1/3 h-12 bg-red-500 text-white font-bold rounded-full shadow-md hover:bg-red-600 transition duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

      {/* Leave Team Modal */}
      {isLeaveTeamModalOpen[0] && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="w-full max-w-lg bg-gradient-to-b from-blue-600 to-sky-700 text-white rounded-lg p-8 shadow-lg transform transition-transform duration-300">
            <h1 className="text-3xl font-bold text-center mb-6">Manage Team Members</h1>

            {member.filter(val => val.userID !== UserID).map((val, key) => (
              <div key={key} className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold text-lg">{val.userName}</p>
                  <p className="text-lg">{val.role}</p>
                </div>
                {currentUserRoles[val.teamID] === 'head' && (
                  <button
                    onClick={() => deleteFromTeam(val.teamID, val.userID)}
                    className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold rounded-full shadow-md hover:from-red-500 hover:to-red-600 transition-transform transform hover:-translate-y-1 hover:scale-105"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            {/* Cancel Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setLeaveTeamModalOpen([false, ''])}
                className="w-1/3 h-12 bg-gray-300 text-black font-bold rounded-full shadow-md hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Team Modal */}
      {isJoinTeamModalOpen[0] && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="w-full max-w-lg bg-gradient-to-b from-blue-600 to-sky-700 text-white rounded-lg p-8 shadow-lg transform transition-transform duration-300">
            <h1 className="text-3xl font-bold text-center mb-6">Join Team</h1>

            {/* Role Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Role</label>
              <input
                type="text"
                placeholder="Enter role"
                className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setIsJoinTeamModalOpen([false, ''])}
                className="w-1/3 h-12 bg-gray-300 text-black font-bold rounded-full shadow-md hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await joinTeam(isJoinTeamModalOpen[1], isJoinTeamModalOpen[2], isJoinTeamModalOpen[3]);
                  setIsJoinTeamModalOpen([false, '']);
                }}
                className="w-1/3 h-12 bg-green-500 text-white font-bold rounded-full shadow-md hover:bg-green-600 transition duration-300"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {isCreateTeamModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="w-full max-w-lg bg-gradient-to-b from-blue-600 to-sky-700 text-white rounded-lg p-8 shadow-lg transform transition-transform duration-300">
            <h1 className="text-3xl font-bold text-center mb-6">Create New Team</h1>

            {/* Team Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Team Name</label>
              <input
                type="text"
                placeholder="Enter team name"
                className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>

            {/* Max Members Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Max Members</label>
              <input
                type="number"
                placeholder="Enter Max members"
                className="w-full h-12 px-4 py-2 bg-transparent border border-white rounded-full text-white placeholder-white focus:outline-none focus:border-white"
                onChange={(e) => setMaxMember(parseInt(e.target.value, 10))}
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
                  await addTeam();
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