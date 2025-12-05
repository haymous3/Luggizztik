"use client";

import Filter from "./Filter";
import OverViewBox from "./OverViewBox";
import OverviewTable from "./OverviewTable";
// import {Table} from "./Table";

const Earnings = () => {
  return (
    <>
      <div className="flex gap-5 mt-4">
        <OverViewBox width="20%">
          <h3 className="w-[100%] font-semibold">This week</h3>
          <p>$125,000</p>
        </OverViewBox>
        <OverViewBox width="20%">
          <h3 className="w-[100%] font-semibold">This month</h3>
          <p>$485,000</p>
        </OverViewBox>
        <OverViewBox width="20%">
          <h3 className="w-[100%] font-semibold">Pending</h3>
          <p>$25,000</p>
        </OverViewBox>
      </div>
      {/* <Table.Root>
        <Table.Header>
          <div className="">
            <h1 className="text-brand-1 font-bold text-lg">Payment History</h1>
            <p className="font-semibold">
              Track your earnings and payment status
            </p>
          </div>
        </Table.Header>
        <Table.Body>
        </Table.Body>
      </Table.Root> */}

      <OverviewTable status="">
        <div>
          <h1 className="text-brand-1 font-bold text-lg">Payment History</h1>
          <p className="font-bold">Track your earnings and payment status</p>
        </div>
        <Filter />
      </OverviewTable>
    </>
  );
};

export default Earnings;
