import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RengApp } from './App'
import './styles/app.css'

const rengRaiz = createRoot(document.getElementById('root') as HTMLElement)

if (import.meta.env.MODE === 'pruebas' && location.hash.startsWith('#/prueba-kit')) {
  void import('./pruebas/PruebaKitQuimica').then(({ RengPruebaKitQuimica }) =>
    rengRaiz.render(
      <StrictMode>
        <RengPruebaKitQuimica sabotaje={location.hash === '#/prueba-kit-sabotaje'} />
      </StrictMode>
    )
  )
} else {
  rengRaiz.render(
    <StrictMode>
      <RengApp />
    </StrictMode>
  )
}
