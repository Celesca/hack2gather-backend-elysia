import homebg from './assets/homebg.jpg';


const register_button = () => { 
    window.location.href = "/register"
}

const About_us = () => {
    return (

        <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${homebg})` }}
      >
        
        <div className="flex flex-col justify-center items-center h-screen bg-blue-200 bg-opacity-75">
            <div className="max-w-7xl mx-auto mt-20">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-extrabold text-black tracking-tight hover:scale-105 transition-transform duration-300">
                        About Hack2gather
                    </h1>
                    <p className="text-xl text-black max-w-2xl mx-auto hover:text-gray-800 transition-colors duration-300">
                        Empowering developers to create, collaborate, and innovate together
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="bg-blue-500 p-8 rounded-xl shadow-lg hover:transform hover:scale-105 transition-all duration-300">
                        <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
                        <p className="text-white">
                            Creating a global community where every developer can find their perfect team and bring ideas to life.
                        </p>
                    </div>

                    <div className="bg-blue-500 p-8 rounded-xl shadow-lg hover:transform hover:scale-105 transition-all duration-300">
                        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                        <p className="text-white">
                            Facilitating meaningful connections through technology and shared passion for coding.
                        </p>
                    </div>

                    <div className="bg-blue-500 p-8 rounded-xl shadow-lg hover:transform hover:scale-105 transition-all duration-300">
                        <h2 className="text-2xl font-bold text-white mb-4">Our Values</h2>
                        <ul className="text-white space-y-2">
                            <li>• Innovation First</li>
                            <li>• Collaborative Spirit</li>
                            <li>• Continuous Learning</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    
                    <button onClick={register_button}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 hover:transform hover:scale-105 transition-all duration-300 shadow-lg">
                        Join Our Community
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
};

export default About_us;