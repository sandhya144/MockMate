import { isAuthenticated } from "@/lib/actions/auth.action";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { ReactNode } from "react";

const RootLayout = async ({ children }: { children: ReactNode }) => {

// dont be able to see homepage without login 

const isUserAuthenticated = await isAuthenticated();

if(!isUserAuthenticated) redirect('/sign-in');

// dont be able to see homepage without login 


  return (
    <div className="root-layout">
        <nav>
          <Link href="/" className="flex items-center gap-2" >
          <Image src="/bbot.png" alt="logo" width={38} height={32}/>
          <h2 className="text-primary-100">MockMate</h2>
          </Link>
        </nav>
        {children}
    </div>
  );
};

export default RootLayout;
