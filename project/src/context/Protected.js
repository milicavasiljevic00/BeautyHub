import { Navigate } from "react-router-dom";
import { useUserContext } from "./UserContext";
import {TailSpin} from 'react-loader-spinner';

const Protected = ({ role, children }) => {

const {loading}=useUserContext();
const {uloga}=useUserContext();


        if(loading)
        {
            return ;
        }
   
        if (uloga!=role) 
        {
            return <Navigate to="/" replace />;
        }
        else
        {
            return children;
        }
    

}

export default Protected;