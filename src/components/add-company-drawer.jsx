import { Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger 
} from "@/components/ui/drawer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "./ui/button";

const schema = z.object({
    name: z.string().min(1, "Company name is required"),
    logo: z 
        .any()
        .refine(
            (file) => 
                file[0] && 
                (file[0].type === "image/png" || 
                file[0].type === "image/jpeg"
            ),
            { message: "Invalid file type. Please upload a png or jpeg image."}
        ),
});

const AddCompanyDrawer = ({
    fetchCompanies
}) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <Drawer>
  <DrawerTrigger>Open</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Are you absolutely sure?</DrawerTitle>    </DrawerHeader>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
  )
}

export default AddCompanyDrawer