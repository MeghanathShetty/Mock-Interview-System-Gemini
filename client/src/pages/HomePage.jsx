import React, { useContext, useState } from 'react';
import '../css/HomePage.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/utils/toastStyle';
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { GlobalContext } from '../components/utils/GlobalState';


function HomePage() {
    const { updateGQtnGenerationData, setGValidInterview } = useContext(GlobalContext);
    const [jobInput, setJobInput] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [experienceLevel, setExperienceLevel] = useState('fresher');
    const navigate = useNavigate();

    const handleGetStartedClick = () => {
        setIsVisible(false); // Hide the jobTitle-div
    };

    const handleBackClick = () => {
        setIsVisible(true); // Show the jobTitle-div
        setExperienceLevel('');
        setJobInput('');
    };

    const handleStartInterviewClick = async () => {
        const sendingInput = jobInput.trim();
        if (sendingInput.length > 0) {
            try {
                setIsLoading(true);
                const response = await axios.post('http://localhost:5000/api/get-questions', {
                    job_role: sendingInput,
                    experience_lvl: experienceLevel
                });

                updateGQtnGenerationData(response.data.job_role, response.data.exp_lvl, response.data.qtns);
                setGValidInterview(true); // set as global valid interview as true
                navigate('/interview');
            } catch (error) {
                toast.error(error.response ? error.response.data.errorMsg : error.message || error,
                    { ...toastErrorStyle(), autoClose: 2000 }
                );
                console.log("Something went wrong!", error.response ? error.response.data.errorMsg : error.message || error);
            } finally {
                setIsLoading(false);
            }
        } else {
            toast.error("Please provide job title!", { ...toastErrorStyle(), autoClose: 2000 });
        }
    };

    const handleExperienceChange = (event) => {
        setExperienceLevel(event.target.value);
    };

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setJobInput(inputValue);
    };

    return (
        <div className='Home-div'>
            <div className='header-div'>
                <h1 className='header-text'>MOCK INTERVIEW</h1>
            </div>
            <div className='context-div'>
                <div className='text-div'>
                    <h1 className='typing-effect'>From Practice to Perfection –</h1>
                    <h1 className='typing-effect2'>Your Interview Journey Starts </h1>
                    <h1 className='typing-effect3'>Here!</h1>
                    <button
                        className={`getStartedButton ${!isVisible ? 'hidden' : ''}`}
                        onClick={handleGetStartedClick}>Get Started</button>
                </div>

                <div className='img-div'>
                    <img className='image' src={'/assets/homePagePic3.jpg'} alt="Background" />
                </div>

                <div className={`jobTitle-div ${isVisible ? 'hidden' : ''}`}>
                    <FaArrowLeftLong className='Left-arrow' onClick={handleBackClick} />
                    <label className='joblabel'>Enter job role</label>
                    <input className='jobinput' type='text' value={jobInput} onChange={handleInputChange}
                        maxLength={35} placeholder='Eg: Java Developer' disabled={isLoading} />
                    {/* Radio buttons for experience level */}
                    <div className='radio-div'>
                        <label>
                            <input type='radio' name='experienceLevel' value='fresher' checked={experienceLevel === 'fresher'}
                                onChange={handleExperienceChange} disabled={isLoading} />
                            Fresher
                        </label>
                        <label>
                            <input type='radio' name='experienceLevel' value='intermediate' checked={experienceLevel === 'intermediate'}
                                onChange={handleExperienceChange} disabled={isLoading} />
                            Intermediate
                        </label>
                        <label>
                            <input type='radio' name='experienceLevel' value='experienced' checked={experienceLevel === 'experienced'}
                                onChange={handleExperienceChange} disabled={isLoading} />
                            Experienced
                        </label>
                    </div>

                    <button className='StartInterviewButton' onClick={handleStartInterviewClick} disabled={isLoading}>
                        {isLoading ? <> Preparing Interview <FontAwesomeIcon icon={faSpinner} spin /> </>
                            : 'Start your interview'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
