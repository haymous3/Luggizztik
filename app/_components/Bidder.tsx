// import bidder_image from "@/public/bidders image.png";
// import Image from "next/image";

// type Bidder = {
//  id: number;
//   amount: number;
//   createdAt: Date;
//   userId: number;
//   shipmentId: number;
//   user: {
//     id: number;
//     name: string;
//     phoneNumber: string;
//   };
// };

// type BidderProps<T = Bidder> = {
//   load: T;
// };
// const Bidder = ({bid}: BidderProps) => {

//   const {} = bid;
//   return (
//     <li>
//       <div>
//         <h2>Name</h2>
//         <p>Phone Number</p>
//         <p>Truck Type</p>
//         <p>Amount</p>
//       </div>
//       <div>
//         <Image alt="bidders_image" src={bidder_image} />
//       </div>
//     </li>
//   );
// };

// export default Bidder;

import bidder_image from "@/public/bidders image.png";
import Image from "next/image";

type Bidder = {
  id: number;
  amount: number;
  createdAt: Date;
  userId: number;
  shipmentId: number;
  user: {
    id: number;
    name: string;
    phoneNumber: string;
  };
};

type BidderProps = {
  bid: Bidder;
};

const Bidder = ({bid}: BidderProps) => {
  const handleClick = () => {
    alert("Bid Selected");
  };
  return (
    <li
      className="flex items-center cursor-pointer justify-between w-full p-2 border-b"
      onClick={handleClick}
    >
      <div>
        <h3 className="font-bold">{bid.user.name}</h3>
        <p className="text-[#6E7D73]">Phone: {bid.user.phoneNumber}</p>
        <p>Bid Amount: ₦{bid.amount.toLocaleString()}</p>
        <p>Date: {new Date(bid.createdAt).toLocaleString()}</p>
      </div>

      <div>
        <Image alt="bidders_image" src={bidder_image} width={60} height={60} />
      </div>
    </li>
  );
};

export default Bidder;
