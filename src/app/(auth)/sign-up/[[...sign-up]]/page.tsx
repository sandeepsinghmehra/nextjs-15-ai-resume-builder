import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center h-screen p-3">
        <SignUp />
    </main>
  )
}