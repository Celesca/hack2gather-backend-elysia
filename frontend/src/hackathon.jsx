import Axios from 'axios'
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import  { useState } from 'react';

const Hackathon = () => {
  const [Hackathonlist, setHackathonlist] = useState([]);
  
  const getHackathon = async () => {
    try {
      const response = await Axios.get('http://localhost:3307/hackathon');
      const data = response.data.map(hackathon => ({
        Name: hackathon.Name,
        HackathonImage: hackathon.HackathonImage
      }));

      setHackathonlist(data);
    } catch (error) {
      console.error('Error fetching Hackathon data:', error);
    }
  };

  useEffect(() => {
    getHackathon();
  }, []); 

  return (
    <div>
      {/* หัวรอใส่รูป */}
      <div className="bg-gray-700 h-60 flex items-center justify-center pt-20">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-white">
            ยินดีต้อนรับสู่ H2G แหล่งรวมงาน Hackathon ที่ใหญ่ที่สุด
          </h1>
          <p className="mt-2 text-gray-300">
            พบกับกิจกรรมมากมาย
          </p>
        </div>
      </div>

      {/* เนื้อหา */}
      <div className="container mx-auto py-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          กิจกรรมแนะนำ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Hackathonlist.map((hackathon) => (
            <div key={hackathon.HackathonID} className="bg-gray-800 rounded shadow overflow-hidden">
              <img
                src={hackathon.HackathonImage}
                alt={hackathon.Name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-white">{hackathon.Name}</h3>
                  <p className="text-sm text-gray-400">รายละเอียด</p>
                  <Link to={`/EventDetail/${hackathon.HackathonID}`}className="text-black hover:underline">
                    <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      ดูรายละเอียด
                    </button>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Hackathon; 