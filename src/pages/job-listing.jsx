import { useSession } from "@clerk/clerk-react";
import { getJobs } from "@/api/jobsApi";
import { useEffect } from "react";

const JobListing = () => {

  const {session, isLoaded} = useSession()

const fetchJobs = async () => {
  if (!session) return;

  const token = await session.getToken({
    template: "supabase",
  });

  console.log("TOKEN:", token);

  const data = await getJobs(token);

  console.log("JOBS DATA:", data);
};

  useEffect(() => {
  if (!isLoaded || !session) return;

  fetchJobs();
}, [isLoaded, session]);

  return (
    <div>JobListing</div>
  );
};

export default JobListing;