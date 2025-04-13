
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
import { Link } from "react-router-dom";

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
        <Button variant="ghost" size="sm" className="w-full gap-1 text-mindease" asChild>
          <Link to={link}>
            Begin Exercise
            <ArrowRight size={16} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExerciseCard;
