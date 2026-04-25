import { getCompanies } from "@/api/apiCompanies";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { State } from "country-state-city";
import { useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import z from "zod";

const schema = z.object({
  title: z.string().min(1, { message: "Job Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a Location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
})

const PostJob = () => {

  const { isLoaded, user } = useUser();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema),
  })

  const { fn: fnCompanies,
    data: companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);

  useFetch(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
  }

  return (
    <div className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
      <h1>Post a Job</h1>

      <form >
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </form>

      <Textarea placeholder="Job Description" {...register("description")} />
      {errors.description && <p className="text-red-500">{errors.description.message}</p>}

      <Select
      //value={location} 
      //onValueChange={(value) => setLocation(value)}
      >
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
      // value={company_id}
      // onValueChange={(value) => setCompany_id(value)}
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
    </div>

  );
};

export default PostJob;