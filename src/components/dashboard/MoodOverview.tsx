
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ResponsiveContainer, Bar, XAxis, Tooltip } from "recharts";

// Mock data
const mockMoodData = [
  { day: "Mon", mood: 3 },
  { day: "Tue", mood: 4 },
  { day: "Wed", mood: 2 },
  { day: "Thu", mood: 5 },
  { day: "Fri", mood: 3 },
  { day: "Sat", mood: 4 },
  { day: "Sun", mood: 5 },
];

const MoodOverview = () => {
  // Define the CustomTooltip component outside of the render function
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const moodValue = payload[0].value;
      let moodText = "";
      
      switch(moodValue) {
        case 1: moodText = "Very Sad"; break;
        case 2: moodText = "Sad"; break;
        case 3: moodText = "Neutral"; break;
        case 4: moodText = "Happy"; break;
        case 5: moodText = "Very Happy"; break;
        default: moodText = "Unknown";
      }
      
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">{payload[0].payload.day}</div>
            <div className="text-right font-medium">{moodText}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Weekly Mood Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={mockMoodData}>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="mood" 
              radius={[4, 4, 0, 0]} 
              fill="#0A4B4F" 
              barSize={30} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MoodOverview;
