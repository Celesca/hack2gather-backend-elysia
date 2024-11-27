import { useState, useEffect } from 'react';
import Axios from 'axios';

const Rating = () => {
  const [TeamName, setTeamname] = useState('');
  const [UserName, setUsername] = useState('');
  const [RatingValue, setRatingValue] = useState('');
  const [Comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [UserID, setUserID] = useState(null);

  useEffect(() => {
    const storedUserID = localStorage.getItem('UserID');
    if (storedUserID) {
      setUserID(storedUserID);
    } else {
      console.warn('UserID not found in localStorage');
    }
  }, []);

  const addrating = async () => {
    try {
      if (!UserID) {
        setErrorMessage('คุณต้องล็อกอินก่อนเพื่อให้คะแนน');
        return;
      }

      if (RatingValue < 1 || RatingValue > 5) {
        setErrorMessage('กรุณากรอกคะแนนระหว่าง 1 ถึง 5 เป็นจำนวนเต็ม');
        return;
      }

      // ดึง TeamID จาก TeamName
      const teamResponse = await Axios.get(`http://localhost:3000/team/getTeamID`, {
        params: { TeamName: TeamName },
      });

      const TeamID = teamResponse.data.TeamID;

      if (!TeamID) {
        setErrorMessage('ไม่พบ TeamID ของทีมนี้');
        return;
      }

      // ดึง UserID จาก Username 
      const userResponse = await Axios.get(`http://localhost:3000/user/getUserID`, {
        params: { Username: UserName },
      });

      const ratedUserID = userResponse.data.userID;

      if (!ratedUserID) {
        setErrorMessage('ไม่พบ UserID ของ Username นี้');
        return;
      }

      // ตรวจสอบว่าคนให้คะแนนอยู่ในทีมเดียวกันคนถูกให้คะแนนมั้ย
      const checkTeam = await Axios.post(`http://localhost:3000/team/checkteam`, {
        Teamname: TeamName,
        userID: ratedUserID, // ตรวจสอบ UserID ในทีม
      });

      if (!checkTeam.data.valid) {
        setErrorMessage('คุณไม่ได้อยู่ทีมเดียวกัน กรุณาลองใหม่อีกครั้ง');
        return;
      }

      // เพิ่มข้อมูลลงในตาราง userteam
      await Axios.post(`http://localhost:3000/rating/rateuser`, {
          ratedByID: UserID,
          ratedUserID,
          RatingValue: RatingValue,
          Comment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // รีเซ็ตฟอร์ม
      setTeamname('');
      setUsername('');
      setRatingValue('');
      setComment('');
      setErrorMessage('');
      alert('บันทึกคะแนนสำเร็จ');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-indigo-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-400 to-indigo-600 p-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-1">Rating Teammate</h1>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Team Name"
              value={TeamName}
              onChange={(event) => setTeamname(event.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Enter Username"
              value={UserName}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Enter a score as an integer from 1 to 5"
              value={RatingValue}
              onChange={(event) => setRatingValue(event.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Comment"
              value={Comment}
              onChange={(event) => setComment(event.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errorMessage && (
              <div className="text-red-500 text-center">{errorMessage}</div>
            )}

            <button
              onClick={addrating}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rating;
