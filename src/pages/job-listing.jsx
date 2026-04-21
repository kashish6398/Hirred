import { getJobs } from "@/api/jobsApi";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/job-card";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
    data: jobs,
    loading: loadingJobs,
  } = useFetch(getJobs, {
    searchQuery,
    location,
    company_id,
  })


  useEffect(() => {
    if(isLoaded){
      fnJobs({ searchQuery, location, company_id });
    }
  }, [isLoaded, searchQuery, location, company_id]);


  if(!isLoaded) {
    return <BarLoader className= "mb-4" width={"100%"} color="#36d7b7" />
  }

  return (
    <div className="w-screen px-10">
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl tracking-tighter text-center pb-8">
        Latest Jobs
      </h1>

      {/* Add filters here */}

      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJobs === false && (
        <div> 
          {jobs?.length ?(
          jobs.map((job) => {
            return (<JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />);
          })
        ) : (
          <div>No Jobs Found</div>
        )}


      </div>
      )}

        
    </div>
  );
};

export default JobListing;