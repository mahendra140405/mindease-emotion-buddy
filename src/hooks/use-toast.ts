
// Re-export the toast hooks from shadcn's components
import { useToast as useShadcnToast } from "@/components/ui/toast-hooks";
import { toast } from "sonner";

export { useShadcnToast as useToast, toast };
