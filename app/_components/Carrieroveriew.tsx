"use client";

import DashboardOverview from "./DashboardOverview";
import Filter from "./Filter";
import OverviewTable from "./OverviewTable";

const CarrierOverview = () => {
  return (
    <div>
      <DashboardOverview earnings="$485k" completed="89" rating="4.9">
        3 Active Job
      </DashboardOverview>
      <OverviewTable status="">
        <div>
          <h1 className="text-brand-1 font-bold text-lg">Recent Activity</h1>
          <p className="font-bold">Your latest jobs and earnings</p>
        </div>
        <Filter />
      </OverviewTable>
    </div>
  );
};

export default CarrierOverview;
