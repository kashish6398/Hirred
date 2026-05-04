import { getJobs } from "@/api/jobsApi";
import { getCompanies } from "@/api/apiCompanies";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/job-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { State } from "country-state-city";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
    data: jobs,
    loading: loadingJobs,
  } = useFetch(getJobs, {
    searchQuery,
    location,
    company_id,
    initialLoading: true,
  })

  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies, 
  } = useFetch(getCompanies, {
    initialLoading: true,
  })

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);


  useEffect(() => {
    if (isLoaded) {
      fnJobs({ searchQuery, location, company_id });
    }
  }, [isLoaded, searchQuery, location, company_id]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSearchInput("");
    setLocation("");
    setCompany_id("");
  };


  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100vw"} color="#36d7b7" />
  }

  return (
    <div className="w-screen px-10 sm:px-20">
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl tracking-tighter text-center pb-8">
        Latest Jobs
      </h1>

      <form
        onSubmit={handleSearch}
        className="h-14 flex flex-row w-full gap-2 items-center mb-3"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title.."
          name="search-query"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-full flex-1 px-4 text-md"
        />
        <Button type="submit" className="h-full sm:w-28" variant="blue">
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="w-full sm:flex-1 h-14">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger className="w-full sm:flex-1 h-14">
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name, id }) => {
                return (
                  <SelectItem key={name} value={id}> 
                    {name}
                  </SelectItem>
                );
              })} 
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          className="w-full sm:flex-1 h-8 bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-900/40"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJobs === false && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length ? (
            jobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;