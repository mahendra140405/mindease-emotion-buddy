
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface ExerciseCardProps {
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  link: string;
}

const ExerciseCard = ({
  title,
  description,
  duration,
  icon,
  link,
}: ExerciseCardProps) => {
  const navigate = useNavigate();
  
  const handleExerciseClick = () => {
    // Ensure we navigate to the correct exercise detail page
    navigate(link);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="mb-2 text-mindease">{icon}</div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{duration}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full gap-1 text-mindease"
          onClick={handleExerciseClick}
        >
          Begin Exercise
          <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExerciseCard;
