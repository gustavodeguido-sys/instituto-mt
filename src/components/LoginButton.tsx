import { useNavigate } from "react-router-dom";

export default function LoginButton(){
   const navigate = useNavigate()

   const handleLogin = () => {
    navigate('/home')
   }

   return (
    <button onClick={handleLogin}>Entrar</button>
   )
}