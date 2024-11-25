import './App.css';
import homebg from './assets/homebg.jpg';
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-router-dom';

function App() {

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${homebg})` }}
      >
        <main className="flex flex-col justify-center items-center h-screen bg-blue-200 bg-opacity-75">
          <TypeAnimation
            sequence={[
              'Hack2gather', 
              3000, 
              'Finding connections',
              3000,
              'Finding friends',
              3000,
              'exploring hackathons'
            ]}
            wrapper="h1"
            cursor={true}
            repeat={Infinity}
            className="text-5xl font-bold text-blue-900"
          />
           <Link to="/register">
        <button className="bg-yellow-200 text-blue-900 font-bold py-2 px-8 mt-6 rounded shadow-md">
            Join Us
        </button>
      </Link>
        </main>
      </div>
    </>
  );
}

export default App;