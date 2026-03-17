"use client";

import {useRouter, usePathname, useSearchParams} from "next/navigation";

const filters = [
  {key: "all", label: "All"},
  {key: "transit", label: "In Transit"},
  {key: "pending", label: "Pending"},
  {key: "delivered", label: "Delivered"},
];

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const activeFilter = searchParams.get("status") ?? "all";

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", filter);
    router.replace(`${pathName}?${params.toString()}`, {scroll: false});
  };

  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
      {filters.map(({key, label}) => (
        <button
          key={key}
          type="button"
          onClick={() => handleFilterChange(key)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            activeFilter === key
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default Filter;
