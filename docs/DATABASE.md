# Luggizztik Database Documentation

## Overview

Luggizztik is a logistics marketplace connecting **shippers** (who need cargo moved) with **carriers** (trucking companies that move cargo). The database models the full lifecycle: user registration, company/driver/truck management, shipment creation, competitive bidding, job execution, real-time tracking, reviews, and notifications.

---

## Entity-Relationship Diagram

```mermaid
erDiagram
    User ||--o| CarrierCompany : "owns (if carrier)"
    User ||--o| Driver : "is driver profile"
    User ||--o{ Shipment : "creates (as shipper)"
    User ||--o{ Bid : "places"
    User ||--o{ Job : "assigned as driverUser"

    CarrierCompany ||--o{ Driver : "employs"
    CarrierCompany ||--o{ Truck : "owns"
    CarrierCompany ||--o{ CarrierRoute : "serves"

    Driver ||--o{ Job : "executes"
    Driver ||--o{ Truck : "assigned to"

    Truck ||--o{ Job : "used in"
    Truck ||--o{ TruckLocation : "has GPS pings"

    Location ||--o{ Shipment : "pickup"
    Location ||--o{ Shipment : "delivery"

    Shipment ||--o{ Bid : "receives bids"
    Shipment ||--o| Bid : "accepted bid"
    Shipment ||--o| Job : "becomes job"

    Bid ||--o| Job : "leads to"

    Job ||--o{ Tracking : "driver GPS pings"
    Job ||--o{ ShipmentTracking : "cargo GPS pings"

    User {
        int id PK
        string email UK
        string username UK
        string name
        string password
        string phoneNumber
        Role role
    }

    CarrierCompany {
        int id PK
        int userId FK_UK
        string companyName UK
        string address
    }

    Driver {
        int id PK
        int userId FK_UK
        int carrierId FK
        string licenseNumber
    }

    Truck {
        int id PK
        int carrierId FK
        int driverId FK
        string truckType
        int loadCapacity
        string plateNumber UK
        int yearOfManufacture
        TruckStatus status
    }

    Location {
        int id PK
        string address
        string city
        string state
        string country
        float latitude
        float longitude
    }

    Shipment {
        int id PK
        string cargoType
        int weight
        int distance
        int shipperId FK
        int pickupLocationId FK
        int deliveryLocationId FK
        datetime pickupDate
        datetime deliveryDate
        boolean urgent
        string additionalNote
        int budgetMin
        int budgetMax
        int acceptedBidId FK_UK
    }

    Bid {
        int id PK
        int amount
        BidStatus status
        int userId FK
        int shipmentId FK
    }

    Job {
        int id PK
        int shipmentId FK_UK
        int driverId FK
        int driverUserId FK
        int truckId FK
        int bidId FK_UK
        JobStatus status
        datetime startedAt
        datetime completedAt
    }

    Tracking {
        int id PK
        int jobId FK
        int driverId
        float latitude
        float longitude
        datetime recordedAt
    }

    ShipmentTracking {
        int id PK
        int jobId FK
        float latitude
        float longitude
        float speed
        datetime recordedAt
    }

    TruckLocation {
        int id PK
        int truckId FK
        float latitude
        float longitude
        datetime updatedAt
    }

    CarrierRoute {
        int id PK
        int carrierId FK
        string originCity
        string destinationCity
        RouteFrequency frequency
    }

    PricingRule {
        int id PK
        string truckType
        float ratePerKm
        float ratePerTon
        float baseFare
    }

    Review {
        int id PK
        int shipmentId
        int reviewerId
        int carrierId
        int rating
        string comment
    }

    Notification {
        int id PK
        int userId
        string title
        string message
        boolean read
    }

    CarrierVerification {
        int id PK
        int carrierId
        VerificationStatus status
        string documentUrl
    }
```

---

## Tables by Domain

### 1. User & Identity

#### `User`
The central account table. Every person on the platform has exactly one User record.

| Column | Purpose |
|--------|---------|
| `role` | Either `carrier` or `shipper` -- determines what the user can do |
| `email` / `username` | Unique login identifiers |
| `phoneNumber` | Required for contact during deliveries |

**Key relationships:**
- A **shipper** user creates `Shipment` records and places `Bid` records (though typically only carriers bid).
- A **carrier** user owns one `CarrierCompany` and may optionally have a `Driver` profile.

---

### 2. Carrier Organization

#### `CarrierCompany`
Represents a registered trucking/logistics company. One-to-one with a User who has `role = carrier`.

| Column | Purpose |
|--------|---------|
| `userId` | The User who owns this company (unique, 1:1) |
| `companyName` | Legal/brand name of the company |
| `address` | Company headquarters or registered address |

**Owns:** Trucks, Drivers, and CarrierRoutes.

#### `Driver`
A person who physically drives trucks. Linked to both a User account and a CarrierCompany.

| Column | Purpose |
|--------|---------|
| `userId` | The User account for this driver (unique, 1:1) |
| `carrierId` | Which CarrierCompany employs this driver |
| `licenseNumber` | Driving license identifier |

**Key relationships:**
- Assigned to `Truck` records (a truck optionally has one driver).
- Executes `Job` records (the actual delivery work).

#### `Truck`
A physical vehicle owned by a carrier company.

| Column | Purpose |
|--------|---------|
| `carrierId` | Owning CarrierCompany |
| `driverId` | Currently assigned Driver (nullable) |
| `truckType` | e.g. "Flatbed", "Refrigerated", "Box" |
| `loadCapacity` | Max weight the truck can carry |
| `plateNumber` | License plate (unique) |
| `status` | `AVAILABLE`, `IN_USE`, or `MAINTENANCE` |

#### `CarrierRoute`
Predefined routes a carrier regularly services. Useful for matching shipments to carriers who already travel that corridor.

| Column | Purpose |
|--------|---------|
| `carrierId` | Which CarrierCompany serves this route |
| `originCity` / `destinationCity` | The route corridor |
| `frequency` | `DAILY`, `WEEKLY`, or `OCCASIONAL` |

#### `CarrierVerification`
Tracks whether a carrier has been vetted/approved by the platform.

| Column | Purpose |
|--------|---------|
| `carrierId` | Which carrier is being verified |
| `status` | `PENDING`, `APPROVED`, or `REJECTED` |
| `documentUrl` | Link to uploaded verification documents |

---

### 3. Shipment & Bidding

#### `Location`
A reusable address/coordinate pair. Shipments reference two locations: pickup and delivery.

| Column | Purpose |
|--------|---------|
| `address` / `city` / `state` / `country` | Human-readable address |
| `latitude` / `longitude` | GPS coordinates for mapping and distance calculation |

#### `Shipment`
A shipper's request to move cargo from point A to point B. This is the core "job posting" of the marketplace.

| Column | Purpose |
|--------|---------|
| `shipperId` | The User who created this shipment |
| `cargoType` | Description of goods (e.g. "Electronics", "Furniture") |
| `weight` | Cargo weight |
| `distance` | Estimated distance (nullable, can be computed) |
| `pickupLocationId` / `deliveryLocationId` | Origin and destination Locations |
| `pickupDate` / `deliveryDate` | Scheduling window |
| `urgent` | Priority flag |
| `budgetMin` / `budgetMax` | The shipper's price range |
| `acceptedBidId` | Which Bid was chosen (nullable until accepted) |

**Lifecycle:** Created -> Receives Bids -> Bid Accepted -> Becomes a Job -> Delivered.

#### `Bid`
A carrier's price offer on a Shipment. Multiple carriers compete by bidding.

| Column | Purpose |
|--------|---------|
| `userId` | The carrier User placing the bid |
| `shipmentId` | Which Shipment this bid is for |
| `amount` | The proposed price |
| `status` | `PENDING`, `ACCEPTED`, `REJECTED`, or `CANCELLED` |

**Constraints:** A user can only bid once per shipment (`@@unique([userId, shipmentId])`).

**Two relations to Shipment:**
- `ShipmentBids` -- the normal "this bid belongs to this shipment" relation.
- `SelectedBid` -- the reverse of `Shipment.acceptedBidId`, marking this bid as the winner.

---

### 4. Job Execution

#### `Job`
Created when a Bid is accepted. Represents the actual delivery assignment -- linking the shipment, the winning bid, the assigned driver, and the truck.

| Column | Purpose |
|--------|---------|
| `shipmentId` | The Shipment being fulfilled (unique, 1:1) |
| `bidId` | The accepted Bid (unique, 1:1) |
| `driverId` | The Driver executing the delivery |
| `driverUserId` | Optional direct link to the Driver's User account |
| `truckId` | The Truck being used |
| `status` | Detailed lifecycle (see below) |
| `startedAt` / `completedAt` | Timestamps for the actual delivery window |

**Job Status Lifecycle:**
```
CREATED -> DRIVER_ASSIGNED -> DRIVER_EN_ROUTE -> ARRIVED_PICKUP
-> LOADING -> LOADED -> IN_TRANSIT -> ARRIVED_DESTINATION
-> UNLOADING -> DELIVERED -> COMPLETED
                    (or CANCELLED at any point)
```

---

### 5. Real-Time Tracking

#### `Tracking`
GPS breadcrumbs from the driver during a job. Used for live driver location.

| Column | Purpose |
|--------|---------|
| `jobId` | Which Job this ping belongs to |
| `driverId` | Which driver sent it |
| `latitude` / `longitude` | GPS coordinates |
| `recordedAt` | Timestamp of the reading |

#### `ShipmentTracking`
GPS breadcrumbs specifically for the shipment/cargo during transit. Includes speed data.

| Column | Purpose |
|--------|---------|
| `jobId` | Which Job this ping belongs to |
| `latitude` / `longitude` | GPS coordinates |
| `speed` | Vehicle speed at time of reading (nullable) |
| `recordedAt` | Timestamp |

#### `TruckLocation`
The latest known position of a truck (independent of any specific job). Useful for fleet management dashboards.

| Column | Purpose |
|--------|---------|
| `truckId` | Which Truck |
| `latitude` / `longitude` | Last known GPS position |
| `updatedAt` | When this reading was taken |

---

### 6. Platform Features

#### `PricingRule`
Platform-defined pricing formulas per truck type. Used to suggest or validate bid amounts.

| Column | Purpose |
|--------|---------|
| `truckType` | Matches `Truck.truckType` |
| `ratePerKm` | Price per kilometer |
| `ratePerTon` | Price per ton of cargo |
| `baseFare` | Minimum flat fee |

**Formula example:** `price = baseFare + (distance * ratePerKm) + (weight * ratePerTon)`

#### `Review`
Post-delivery ratings left by shippers about carriers.

| Column | Purpose |
|--------|---------|
| `shipmentId` | Which delivery is being reviewed |
| `reviewerId` | The User leaving the review (typically the shipper) |
| `carrierId` | The carrier being reviewed |
| `rating` | Numeric score |
| `comment` | Optional text feedback |

#### `Notification`
In-app notifications pushed to users (bid updates, job status changes, etc.).

| Column | Purpose |
|--------|---------|
| `userId` | Recipient |
| `title` / `message` | Notification content |
| `read` | Whether the user has seen it |

---

## Enums Reference

| Enum | Values | Used By |
|------|--------|---------|
| `Role` | `carrier`, `shipper` | `User.role` |
| `TruckStatus` | `AVAILABLE`, `IN_USE`, `MAINTENANCE` | `Truck.status` |
| `ShipmentStatus` | `OPEN`, `BIDDING`, `BID_ACCEPTED`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED` | (defined but not yet used as a column) |
| `BidStatus` | `PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED` | `Bid.status` |
| `JobStatus` | `CREATED`, `DRIVER_ASSIGNED`, `DRIVER_EN_ROUTE`, `ARRIVED_PICKUP`, `LOADING`, `LOADED`, `IN_TRANSIT`, `ARRIVED_DESTINATION`, `UNLOADING`, `DELIVERED`, `COMPLETED`, `CANCELLED` | `Job.status` |
| `RouteFrequency` | `DAILY`, `WEEKLY`, `OCCASIONAL` | `CarrierRoute.frequency` |
| `VerificationStatus` | `PENDING`, `APPROVED`, `REJECTED` | `CarrierVerification.status` |

---

## Core Business Flow

```
1. REGISTRATION
   Shipper signs up (role=shipper)
   Carrier signs up (role=carrier) -> creates CarrierCompany
       -> adds Trucks and Drivers to the company

2. SHIPMENT CREATION
   Shipper creates a Shipment with:
       - cargo details, pickup/delivery Locations, dates, budget range

3. BIDDING
   Carriers browse open Shipments
   Carriers place Bids (one per carrier per shipment)
   Shipper reviews Bids and accepts one
       -> Shipment.acceptedBidId is set
       -> Bid.status = ACCEPTED, others = REJECTED

4. JOB CREATION
   Accepted Bid triggers Job creation:
       - Links: Shipment + Bid + Driver + Truck
       - Job.status = CREATED

5. DELIVERY EXECUTION
   Driver progresses through Job statuses:
       CREATED -> DRIVER_EN_ROUTE -> ARRIVED_PICKUP -> LOADING
       -> LOADED -> IN_TRANSIT -> ARRIVED_DESTINATION
       -> UNLOADING -> DELIVERED -> COMPLETED
   GPS pings stored in Tracking + ShipmentTracking

6. POST-DELIVERY
   Shipper leaves a Review
   Notifications sent at each status change
```

---

## Standalone Tables (No Foreign Key Relations)

These tables store IDs referencing other tables but don't enforce FK constraints at the database level:

| Table | References | Notes |
|-------|-----------|-------|
| `Review` | `shipmentId`, `reviewerId`, `carrierId` | Could benefit from FKs to Shipment, User, CarrierCompany |
| `Notification` | `userId` | Could benefit from FK to User |
| `CarrierVerification` | `carrierId` | Could benefit from FK to CarrierCompany |
| `PricingRule` | (none) | Lookup table, joined by `truckType` string match |

> **Recommendation:** Consider adding explicit `@relation` fields to Review, Notification, and CarrierVerification for referential integrity and easier Prisma queries.
