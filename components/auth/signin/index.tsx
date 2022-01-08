import { signIn } from "next-auth/react"

export default function SignInWithProvider({ providers }: any) {
    return (
      <>
        {Object.values(providers).map((provider: any) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </>
    )
  }
  