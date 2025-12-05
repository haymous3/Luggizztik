import OverViewBox from "./OverViewBox";

type DashBoardOverviewProps = {
  children: React.ReactNode;
  earnings: string;
  completed: string;
  rating: string;
};
const DashboardOverview = ({
  children,
  earnings,
  completed,
  rating,
}: DashBoardOverviewProps) => {
  return (
    <div className="flex justify-between mt-4">
      <div className="flex flex-wrap w-[50%] gap-4">
        <OverViewBox width="full">
          <span className="font-semibold text-lg">{children}</span>
        </OverViewBox>
        <div className="w-full flex gap-4">
          <OverViewBox width="15%">
            <p className="font-medium">Month Earning</p>
            <span className="text-xl font-semibold">{earnings}</span>
          </OverViewBox>
          <OverViewBox width="15%">
            <p className="font-medium">Completed</p>
            <span className="text-xl font-semibold">{completed}</span>
          </OverViewBox>
          <OverViewBox width="15%">
            <p className="font-medium">Rating</p>
            <span className="text-xl font-semibold">{rating}</span>
          </OverViewBox>
        </div>
      </div>

      <div>
        <h2>Map</h2>
      </div>
    </div>
  );
};

export default DashboardOverview;
