import Axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Hackathon = () => {
  const [hackathonList, setHackathonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8; // Number of hackathons per page

  const location = useLocation();

  const getHackathons = async (query = '', page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await Axios.get('http://localhost:3000/hackathon', {
        params: { search: query, page: page.toString(), limit: limit.toString() },
      });

      if (response.data.data) {
        const data = response.data.data.map((hackathon) => ({
          HackathonID: hackathon.HackathonID,
          Name: hackathon.Name,
          HackathonImage: hackathon.HackathonImage,
          StartDate: hackathon.StartDate,
          EndDate: hackathon.EndDate,
          Location: hackathon.Location,
          Description: hackathon.Description,
        }));

        setHackathonList(data);
        setTotalPages(response.data.meta.totalPages);
        setCurrentPage(response.data.meta.page);
      } else {
        // Fallback if pagination is not implemented
        const data = response.data.map((hackathon) => ({
          HackathonID: hackathon.HackathonID,
          Name: hackathon.Name,
          HackathonImage: hackathon.HackathonImage,
          StartDate: hackathon.StartDate,
          EndDate: hackathon.EndDate,
          Location: hackathon.Location,
          Description: hackathon.Description,
        }));

        setHackathonList(data);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Error fetching Hackathon data:', err);
      setError('Failed to fetch hackathons. Please try again later.');
    }
    setLoading(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    const page = parseInt(params.get('page'), 10) || 1;
    getHackathons(search, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    window.history.pushState({}, '', `/hackathon?search=${encodeURIComponent(search)}&page=${newPage}`);
    getHackathons(search, newPage);
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-gray-700 h-64 flex items-center justify-center">
        <div className="container mx-auto text-center mt-20">
          <h1 className="text-3xl font-bold text-white">
            Welcome to H2G: The Largest Hackathon Platform
          </h1>
          <p className="mt-2 text-gray-300">
            Discover Amazing Events
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-6 px-4">
        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">
              Featured Events
            </h2>
            {hackathonList.length === 0 ? (
              <div className="text-center text-gray-300">No hackathons found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {hackathonList.map((hackathon) => (
                  <div
                    key={hackathon.HackathonID}
                    className="bg-gray-800 rounded shadow overflow-hidden transform transition-transform duration-300 hover:scale-105"
                  >
                    <img
                      src={hackathon.HackathonImage}
                      alt={hackathon.Name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-2xl font-bold text-white">{hackathon.Name}</h3>
                      <p className="text-lg text-gray-400">
                        Location: {hackathon.Location}
                      </p>
                      <p className="text-lg text-gray-400">
                        Registration Starts: {new Date(hackathon.StartDate).toLocaleDateString()}
                      </p>
                      <p className="text-lg text-gray-400">
                        Registration Ends: {new Date(hackathon.EndDate).toLocaleDateString()}
                      </p>
                      <Link to={`/EventDetail/${hackathon.HackathonID}`} className="text-black hover:underline">
                        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transform transition-transform duration-300 hover:scale-110">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded ${
                    currentPage === 1
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Hackathon;