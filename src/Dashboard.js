import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token == null || token == '') {    
            navigate('/login', {replace: true});    
        }
    }, []);
    return(
        <div>
            Dashboard
        </div>
    )
};

export default Dashboard;