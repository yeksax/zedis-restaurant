import { getDashboardData } from "./actions";
import { DashboardContent } from "./components/DashboardContent";

export default async function Dashboard() {
  const dashboardData = await getDashboardData();
  
  return <DashboardContent {...dashboardData} />;
}

