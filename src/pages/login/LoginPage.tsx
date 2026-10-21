import './LoginPage.css'
import { useState, type FormEvent } from 'react';
import logoStrip from '../../assets/simbolo_imt.png'

export default function App() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    window.setTimeout(() => setIsSubmitting(false), 900)
  }

  return (
    <main className="min-h-dvh overflow-hidden bg-linear-to-b from-[#0bb8a9] to-[#05524b]">
      <form
        className="mx-auto flex min-h-dvh w-[min(490px,calc(100%-40px))] flex-col items-center pt-[clamp(48px,15.33vh,157px)] pb-12 max-[560px]:w-[min(430px,calc(100%-32px))] [@media(max-height:760px)]:justify-center [@media(max-height:760px)]:pt-9 [@media(max-height:760px)]:pb-9"
        onSubmit={handleSubmit}
      >
        <div
          className="relative h-[139px] w-[151px] shrink-0 overflow-hidden [@media(max-height:760px)]:h-[120px] [@media(max-height:760px)]:w-[130px] [@media(max-height:760px)]:scale-[0.86]"
          aria-label="Instituto Mais Transplantes"
        >
          <img
            className="pointer-events-none absolute top-[-0.47px] left-[-17.26px] h-[128.17px] w-auto max-w-none select-none"
            src={logoStrip}
            alt=""
          />
        </div>

        <div className="mt-[clamp(56px,8.3vh,85px)] mb-[clamp(48px,7.9vh,81px)] flex w-full flex-col gap-2 [@media(max-height:760px)]:mt-7 [@media(max-height:760px)]:mb-[34px]">
          <label
            className="font-['Inter:Medium'] text-2xl leading-normal font-medium text-white max-[560px]:text-xl"
            htmlFor="user-id"
          >
            Digite o seu ID
          </label>
          <input
            className="h-[45px] w-full rounded-[64px] border border-[#0bb8a9] bg-white px-4 font-['Inter:Medium'] text-base font-medium text-[#073f3a] outline-none transition-[border-color,box-shadow] duration-160 focus-visible:border-[#0984e3] focus-visible:shadow-[0_0_0_3px_rgb(255_255_255_/_35%)] motion-reduce:transition-none"
            id="user-id"
            name="userId"
            type="text"
            autoComplete="username"
            required
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <label
            className="font-['Inter:Medium'] text-2xl leading-normal font-medium text-white max-[560px]:text-xl"
            htmlFor="password"
          >
            Digite a sua senha
          </label>
          <input
            className="h-[45px] w-full rounded-[64px] border border-[#0bb8a9] bg-white px-4 font-['Inter:Medium'] text-base font-medium text-[#073f3a] outline-none transition-[border-color,box-shadow] duration-160 focus-visible:border-[#0984e3] focus-visible:shadow-[0_0_0_3px_rgb(255_255_255_/_35%)] motion-reduce:transition-none"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        <button
          className="mt-[clamp(52px,7.7vh,79px)] min-w-[108px] cursor-pointer rounded-full bg-[#0984e3] px-8 py-[23px] font-['Montserrat:SemiBold'] text-sm leading-none font-semibold whitespace-nowrap text-white shadow-[0_2px_4px_rgb(136_144_194_/_20%),0_5px_15px_rgb(37_44_97_/_15%)] transition-[background-color,box-shadow,transform] duration-160 hover:not-disabled:-translate-y-px hover:not-disabled:bg-[#0878cf] hover:not-disabled:shadow-[0_3px_6px_rgb(37_44_97_/_24%),0_8px_18px_rgb(37_44_97_/_20%)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white/65 active:not-disabled:translate-y-px disabled:cursor-wait disabled:opacity-78 motion-reduce:transition-none [@media(max-height:760px)]:mt-[38px] [@media(max-height:760px)]:py-[18px]"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}
