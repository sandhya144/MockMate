import { Button } from '@/components/ui/button';
// import { dummyInterviews } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import InterviewCard from "@/components/InterviewCard";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {

const user = await getCurrentUser();

// parallel request {parallel data fetches}
  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;


  return (
   <>
    <section className='card-cta'>
      <div className='flex flex-col gap-6 max-w-lg'>
      <h2>
        Boost your confidence with AI enabled mock interviews and instant feedback.
      </h2>
      <p className='text-lg '> 
        Train with actual interview questions & receive immediate feedback.
      </p>

      <Button asChild className='btn-primary max-sm:w-full'>
      <Link href='/interview'>
       Start Your Interview
      </Link>
      </Button>

      </div>
      <Image src="/robotto.png" alt="robo-dude" width={400} height={400} className="max-sm:hidden"  />
    </section>

  
    <section className='flex flex-col gap-6 mt-8'>
      <h2>Your Interviews</h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                id={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>You haven't taken any interviews yet.</p>
          )}
        </div>
      </section>


    <section className='flex flex-col gap-6 mt-8'>
      <h2>Take an interview</h2>

      <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                id={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>There are no new interviews available. </p>
          )}
        </div>
      </section>

   </>
  );
};

export default Page;