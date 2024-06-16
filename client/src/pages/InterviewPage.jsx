import React, { useState, useContext, useEffect, useRef } from 'react';
import '../css/InterviewPage.css';
import FaceRecognition from '../components/FaceRecognition';
import { Bs1CircleFill, Bs2CircleFill,Bs3CircleFill, Bs4CircleFill, Bs5CircleFill } from "react-icons/bs";
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/utils/toastStyle';
import { GlobalContext } from '../components/utils/GlobalState';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import PageVisibility from "../components/utils/PageVisibility";
import { useNavigate } from 'react-router-dom';

function InterviewPage() {
    // access global values
    const { gJobTitle, gQtns, gValidInterview, setGValidInterview } = useContext(GlobalContext);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [skippedQuestions, setSkippedQuestions] = useState([]);
    const [nextQuestions, setNextQuestions] = useState([]);
    const [toastOn, setToastOn] = useState(false);
    const [ recordAttempted, setRecordAttempted] = useState(false);
    const [validUpdated, setValidUpdated] = useState(false);
    const isPageVisible = PageVisibility();
    const firstTimerIdRef = useRef(null);
    const secondTimerIdRef = useRef(null);
    const hasBeenAwayForLong = useRef(false);
    const navigate = useNavigate();

    useEffect(()=>{
        if(gValidInterview !== null) { // to make sure that it only runs once
            setValidUpdated(true);
        }
        if(!validUpdated && gValidInterview === false) {
            window.location.replace('/'); // Re-direct to home page
        }
        setGValidInterview(false);
    },[gValidInterview]);

    const {
        transcript,
        listening,
        resetTranscript,
        isMicrophoneAvailable,
        browserSupportsSpeechRecognition,
        browserSupportsContinuousListening
    } = useSpeechRecognition();

    // DO NOT DELETE THIS CODE IMPORTANT
    // useEffect(()=>{
    //     return () =>{
    //         if(!isSubmitted) {
    //             navigate('/', { replace: true });
    //         }
    //     }
    // },[isSubmitted]);

    // if user changed tab or window
    useEffect(() => {
        if (!isPageVisible) {
            // Start a timer for 10 seconds
            firstTimerIdRef.current = setTimeout(() => {
                if (!isPageVisible) {
                    hasBeenAwayForLong.current = true;
                }
            }, 10000);
        } else {
            // Clear the first timer if the page becomes visible again within 10 seconds
            clearTimeout(firstTimerIdRef.current);
            
            // Check if the user has been away for more than 10 seconds
            if (hasBeenAwayForLong.current) {
                // Start the second timer for 2 seconds
                secondTimerIdRef.current = setTimeout(() => {
                    toast.error("You have been away for too long!", { ...toastErrorStyle(), autoClose: false });
                    navigate('/', { replace: true }); // Re-direct to home page
                }, 0);
                
                // Reset the flag
                hasBeenAwayForLong.current = false;
            }
        }

        // Cleanup both timers when component unmounts or when isPageVisible changes
        return () => {
            clearTimeout(firstTimerIdRef.current);
            clearTimeout(secondTimerIdRef.current);
        };
    }, [isPageVisible, navigate]);

    const handleSkipQuestion = () => {
        resetTranscript()
        if (questionNumber < 5) {
            setSkippedQuestions(prevState => [...prevState, questionNumber]);
            setQuestionNumber(prev => prev + 1);
        } else {
          toast.error("You've reached the last question.", {...toastErrorStyle(),autoClose: 2000});
        }
      };

    const handleNextQuestion = (questionNumber) => {
        resetTranscript()
        if(questionNumber < 5){
            setNextQuestions(prevState => [...prevState, questionNumber]);
            setQuestionNumber(prev => prev + 1);
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        }
        else{
            toast.error("You've reached the last question.", {...toastErrorStyle(), autoClose: 2000});
        }
    };

    // answer stuff ==========================================================
    useEffect(() => {
        if (toastOn) {
            const timer = setTimeout(() => {
                setToastOn(false);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [toastOn]);

    function handleStartListen() {
        if(transcript.length !== 0){
            resetTranscript()
        }
        if (!browserSupportsSpeechRecognition) {
            !toastOn&& toast.error("Please use a different browser to enable speech recognition", {...toastErrorStyle(), autoClose: 1500 });
            setToastOn(true);
            return;
        }
        if (!isMicrophoneAvailable) {
            !toastOn&& toast.error("Please allow microphone permission", {...toastErrorStyle(), autoClose: 1500 });
            setToastOn(true);
            return;
        }
        if (browserSupportsContinuousListening) {
            SpeechRecognition.startListening({ continuous: true });
            setRecordAttempted(true);

            // Stop listening after 2 minutes
            setTimeout(() => {
                SpeechRecognition.stopListening();
            }, 120000); // 120,000 milliseconds = 2 minutes
        } else {
            SpeechRecognition.startListening();
        }
    }

    function handleStopListen() {
        SpeechRecognition.stopListening();
    }
    // ======================================================================

  return (
    <div className='interview-div'>
        <div className='videoDisplay-div'>
            <FaceRecognition/>
        </div>
        <div className='questionDisplay-div'>
            <div className='questionNumber-div'>
            {/* <Bs1CircleFill className={`numberIcon ${questionNumber === 1 ? 'active' : ''}`} /> */}
            <Bs1CircleFill className={`numberIcon ${skippedQuestions.includes(1) ? 'skipped' : ''} ${questionNumber === 1 ? 'active' : ''} ${nextQuestions.includes(1) ? 'next' : ''}`} />
        --------------
        <Bs2CircleFill className={`numberIcon ${skippedQuestions.includes(2) ? 'skipped' : ''} ${questionNumber === 2 ? 'active' : ''} ${nextQuestions.includes(2) ? 'next' : ''}`} />
        --------------
        <Bs3CircleFill className={`numberIcon ${skippedQuestions.includes(3) ? 'skipped' : ''} ${questionNumber === 3 ? 'active' : ''} ${nextQuestions.includes(3) ? 'next' : ''}`}  />
        --------------
        <Bs4CircleFill className={`numberIcon ${skippedQuestions.includes(4) ? 'skipped' : ''} ${questionNumber === 4 ? 'active' : ''} ${nextQuestions.includes(4) ? 'next' : ''}`} />
        --------------
        <Bs5CircleFill className={`numberIcon ${skippedQuestions.includes(5) ? 'skipped' : ''} ${questionNumber === 5 ? 'active' : ''} ${nextQuestions.includes(5) ? 'next' : ''}`}  />
            </div>
            <h3>Question {currentQuestionIndex + 1}</h3>
            <p>{gQtns[currentQuestionIndex]}</p>
        </div>
        
        <div className='answerDisplay-div'>
            {transcript}
        </div>
        <div className='buttonDisplay-div'>
            <button className='Re-recordAnswerButton'  onClick={handleStartListen} disabled={toastOn || listening}>
                { listening ? <>Listening <FontAwesomeIcon icon={faSpinner} spin /></> : 
                transcript.length !==0 ? 'Re-record' : 'Answer'}
            </button>
            { listening && <button className='stopButton' onClick={handleStopListen}>Stop</button> }
            { !listening? !recordAttempted?
                <button className={`skipButton ${questionNumber === 5 ? 'hidden' : ''}`} onClick={handleSkipQuestion}>Skip</button> :
                <>
                    {transcript.length > 0?
                        <>
                            <button className={`skipButton ${questionNumber === 5 ? 'hidden' : ''}`} onClick={handleSkipQuestion}>Skip</button>
                            <button className={`nextButton ${questionNumber === 5 ? 'hidden' : ''}`} onClick={() => handleNextQuestion(questionNumber)}>
                                Next
                            </button>
                        </>
                        : <button className={`skipButton ${questionNumber === 5 ? 'hidden' : ''}`} onClick={handleSkipQuestion}>Skip</button>
                    }
                </>
               : null
            }
            { !listening &&
                <button className={`SubmitButton ${questionNumber === 5 ? 'display' : ''}`}>Submit</button> 
            }
        </div>
        {/* <AnswerQuestion /> */}
    </div>
  );
}

export default InterviewPage;
