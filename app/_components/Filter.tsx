"use client";

import {useRouter, usePathname, useSearchParams} from "next/navigation";
import Button from "./Button";

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pathName = usePathname();

  const activeFilter = searchParams.get("status") ?? "all";

  const handleFilterChange = (filter: string) => {
    //console.log(filter)
    const params = new URLSearchParams(searchParams);

    params.set("status", filter);
    router.replace(`${pathName}?${params.toString()}`, {scroll: false});
  };

  return (
    <div className="flex gap-4 border">
      <Button
        className="border-r px-5 font-semibold cursor"
        tab="all"
        type="button"
        handleFilterChange={handleFilterChange}
        activeTab={activeFilter}
      >
        All
      </Button>
      <Button
        className="border-r pr-5 font-semibold cursor"
        tab="transit"
        type="button"
        handleFilterChange={handleFilterChange}
        activeTab={activeFilter}
      >
        Transit
      </Button>
      <Button
        className="border-r pr-5 font-semibold cursor"
        tab="pending"
        type="button"
        handleFilterChange={handleFilterChange}
        activeTab={activeFilter}
      >
        Pending
      </Button>
      <Button
        className="pr-5 font-semibold cursor"
        tab="delivered"
        type="button"
        handleFilterChange={handleFilterChange}
        activeTab={activeFilter}
      >
        Delivered
      </Button>
    </div>
  );
};

export default Filter;
