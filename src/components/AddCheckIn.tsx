import {useNavigate} from "react-router-dom";

export default function AddCheckIn() {
    const navigate = useNavigate();
    
    const handleAddCheckIn = ( ) => {
        navigate('/resumo.checkin');
    }


return (
    <button onClick={handleAddCheckIn}>Adicionar Check-In</button>
    
)


}