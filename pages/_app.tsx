import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {Toaster} from 'react-hot-toast'
import { SessionProvider, } from 'next-auth/react'

function MyApp({ Component, pageProps: {session,...pageProps} }: AppProps) {
  return (<SessionProvider session={session}><Component {...pageProps} /><Toaster /></SessionProvider>)
}

export default MyApp
