import { doc,  updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import useUser from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const interestsArray = ['Sports', 'Cricket', 'Music', 'Travel', 'Reading'];

const InterestForm = () => {
    const [interests, setInterests] = useState<any>([]);
    const navigate = useNavigate();
    const { user, userLog } = useUser();

    const handleCheckboxChange = (event: any) => {
        const { value, checked } = event.target;
        if (checked) {
            setInterests([...interests, value]);
        } else {
            setInterests(interests.filter((interest: string) => interest !== value));
        }
    };

    const handleSubmit = () => {
        console.log(interests);
        try {
            updateDoc(doc(firestore, "users", user.id), {
                interests
            }).then(() => {
                navigate("/", { replace: true })
            })
        } catch (error) {
            console.log("Error while uploading interests to database", error);
        }
    };
    useEffect(() => {
        if (!userLog) {
            navigate("/login", { replace: true })
        }
    }, [userLog])

    return (
        <div className="interests-container">
            <h2>Select Your Interests</h2>
            {interestsArray.map((interest) => (
                <label key={interest} className="interest-item">
                    <input
                        type="checkbox"
                        value={interest}
                        onChange={handleCheckboxChange}
                    />{' '}
                    {interest}
                </label>
            ))}
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default InterestForm;
