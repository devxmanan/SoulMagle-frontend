import { useEffect, useState } from 'react';
import useUser from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
const interestsArray = ['Sports', 'Cricket', 'Music', 'Travel', 'Reading'];

const InterestForm = () => {
    const [interests, setInterests] = useState<any>([]);
    const navigate = useNavigate();
    const { userLog } = useUser();
    const genAI = new GoogleGenerativeAI("AIzaSyD-BjFqJdXb1LWIlwla_Ef_wADVObWhlDo");
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    async function generateEmbedding(interests: string[]) {
        const interestsText = interests.join(", ");
        const result = await model.embedContent(interestsText);
        return result.embedding.values
    }

    const handleCheckboxChange = (event: any) => {
        const { value, checked } = event.target;
        if (checked) {
            setInterests([...interests, value]);
        } else {
            setInterests(interests.filter((interest: string) => interest !== value));
        }
    };

    const handleSubmit = async () => {
        const embedding = await generateEmbedding(interests);
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/update-interests`, {
            method: 'POST',
            credentials: "include" as const,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ interests: embedding }),
        });

        const res = await response.json();
        if (res.success) {
            navigate("/")
        } else {
            console.log(res.message)
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
