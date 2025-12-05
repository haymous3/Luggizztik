"use client";

import {Table} from "@/app/_components/Table";
//import Filter from "./Filter";

// const shipments = [
//   {
//     details: {
//       name: "Shipment A",
//       status: "Transit",
//       from: "Lagos",
//       to: "Abuja",
//       driver: "John Adebayo",
//     },
//     time_price: {
//       eta: "3 hours",
//       price: "2500",
//     },
//   },
//   {
//     details: {
//       name: "Shipment B",
//       status: "Pickup Pending",
//       from: "Lagos",
//       to: "Ibadan",
//       driver: "John Adebayo",
//     },
//     time_price: {
//       eta: "3 hours",
//       price: "2500",
//     },
//   },
// ];

const shipments = [
  {
    name: "Shipment A",
    status: "Transit",
    from: "Lagos",
    to: "Abuja",
    driver: "John Adebayo",
    eta: "3 hours",
    price: "2500",
  },
  {
    name: "Shipment B",
    status: "Pickup Pending",
    from: "Lagos",
    to: "Ibadan",
    driver: "John Adebayo",
    eta: "3 hours",
    price: "2500",
  },
];
type OverViewTableProps = {
  status: string;
  children: React.ReactNode;
};

export default function OverviewTable({status, children}: OverViewTableProps) {
  let displayedShipment;
  //console.log(shipments);

  if (!status) displayedShipment = shipments;

  if (status === "all") displayedShipment = shipments;

  if (status === "transit") {
    displayedShipment = shipments.filter(
      (item) => item.status.toLowerCase() === "transit"
    );
  }
  if (status === "pending") {
    displayedShipment = shipments.filter(
      (item) => item.status.toLowerCase() === "pickup pending"
    );
  }

  return (
    <Table.Root>
      <Table.Header>
        <div className="flex justify-between items-center">{children}</div>
      </Table.Header>

      <Table.Body>
        {displayedShipment?.map((item, i) => (
          <Table.Row key={i} data={item} />
        ))}
      </Table.Body>
    </Table.Root>
  );
}
