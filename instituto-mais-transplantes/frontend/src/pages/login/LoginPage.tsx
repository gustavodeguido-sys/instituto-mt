import './LoginPage.css'
import React, {useState} from 'react';

export default function Login() {
    const [usuario, setUsuario] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!usuario || !senha) {
        setError("Preencha os campos")
        return;
    }

    if(senha != '1404'){
        setError("Senha inválida")
        return;
    }
}

    return (
        <main className='min-h-dvh bg-gradient-to-b from-[#0bb8a9] to-[#05524b] text-white'>
            <div className='mx-auto flex min-h-dhv w-full max-w-[586px] flex-col px-6 pt-[116px] sm:px-12 md:pt-[156px]'>
                <div className='relative mx-auto h-[139px] w-[151px] overflow-hidden'>
                    <img
                    src="/assets/simbolo_imt.png"
                    alt="logo imt"
                    className='pointer-events-none absolute top-[-0.34%] left-[-11.43%] h-[92.21%] w-[400.99%] max-w-none'
                    />
                </div>

                <form 
                className='mt-[85px] flex-w-full flex-col gap-[52px]'
                onSubmit={handleSubmit}>

                <label className='flex flex-col gap-2'>
                    <span className='text-2xl leading-normal font-medium'>
                        Digite o seu ID
                    </span>
                    <input
                    type='text'
                    name='id'
                    autoComplete='username'
                    aria-label='Digite o seu ID'
                    className='h-[45px] w-full rounded-[64px] border border-[#0bb8a9] bg-white px-4 text-base text-[#05524b]
                     outline-none transition-shadow focus:ring-4 focus:ring-white/30'
                     />
                </label>
                <label className='flex flex-col gap-2'>
                    <span className='text-2xl leading-normal font-medium'>
                        Digite a sua senha
                    </span>
                    <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    aria-label="Digite a sua senha"
                    className="h-[45px] w-full rounded-[64px] border border-[#0bb8a9] bg-white px-4 text-base text-[#05524b] 
                    outline-none transition-shadow focus:ring-4 focus:ring-white/30"
                    />
                </label>
             </form>
            </div>
        </main>
  
)

}
