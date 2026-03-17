"use client";

import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  TruckIcon,
  BriefcaseIcon,
  BanknotesIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {format} from "date-fns";
import Link from "next/link";
import Image from "next/image";
import type {CarrierProfileData} from "@/features/carrier/actions";

type ProfileProps = {
  data: CarrierProfileData;
};

function formatNaira(amount: number) {
  return `\u20A6${amount.toLocaleString()}`;
}

const Profile = ({data}: ProfileProps) => {
  const {user, company, stats, profile} = data;
  const memberSince = format(new Date(user.createdAt), "MMMM yyyy");

  return (
    <div className="space-y-6 mt-6 pb-10">
      {/* Complete Profile CTA */}
      {!user.onboardingCompleted && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900">
                Complete your profile
              </h3>
              <p className="text-sm text-amber-700">
                Carriers with complete profiles get 3x more job opportunities.
                Finish your onboarding to unlock all features.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/carrier/onboarding"
            className="flex-shrink-0 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Complete Profile
          </Link>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl p-8 shadow-sm">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 border-2 border-emerald-200">
            {user.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt="Profile"
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="w-12 h-12 text-emerald-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.name || user.username || "Carrier"}
              </h1>
              {user.onboardingCompleted ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <CheckBadgeIcon className="w-3.5 h-3.5" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                  Incomplete
                </span>
              )}
            </div>
            {company && (
              <p className="text-gray-500 mt-1 flex items-center gap-1.5">
                <BuildingOfficeIcon className="w-4 h-4" />
                {company.companyName}
              </p>
            )}
            <p className="text-sm text-gray-400 mt-1">
              Member since {memberSince}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl p-5 shadow-sm text-center">
          <BriefcaseIcon className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
          <p className="text-xs text-gray-500 mt-1">Total Jobs</p>
        </div>
        <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl p-5 shadow-sm text-center">
          <TruckIcon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {stats.activeJobs}
          </p>
          <p className="text-xs text-gray-500 mt-1">Active Jobs</p>
        </div>
        <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl p-5 shadow-sm text-center">
          <CheckBadgeIcon className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {stats.completedJobs}
          </p>
          <p className="text-xs text-gray-500 mt-1">Completed</p>
        </div>
        <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl p-5 shadow-sm text-center">
          <BanknotesIcon className="w-6 h-6 text-amber-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {formatNaira(stats.totalEarnings)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Earnings</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Contact Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100">
                <EnvelopeIcon className="w-4.5 h-4.5 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100">
                <PhoneIcon className="w-4.5 h-4.5 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.phoneNumber}
                </p>
              </div>
            </div>
            {company?.address && (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100">
                  <MapPinIcon className="w-4.5 h-4.5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Address</p>
                  <p className="text-sm font-medium text-gray-900">
                    {company.address}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fleet & Operations */}
        <div className="bg-gradient-to-r from-rose-950/5 via-white to-green-500/5 border border-gray-100 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Fleet & Operations
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100">
                <TruckIcon className="w-4.5 h-4.5 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Registered Trucks</p>
                <p className="text-sm font-medium text-gray-900">
                  {stats.trucksCount} truck{stats.trucksCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            {profile?.baseCity && (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100">
                  <MapPinIcon className="w-4.5 h-4.5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Base City</p>
                  <p className="text-sm font-medium text-gray-900">
                    {profile.baseCity}
                  </p>
                </div>
              </div>
            )}
            {profile && profile.availableDays.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100">
                  <CalendarDaysIcon className="w-4.5 h-4.5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Availability</p>
                  <p className="text-sm font-medium text-gray-900">
                    {profile.availableDays.join(", ")}
                  </p>
                </div>
              </div>
            )}
            {profile && profile.preferredJobTypes.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100 mt-0.5">
                  <BriefcaseIcon className="w-4.5 h-4.5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">
                    Preferred Job Types
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {profile.preferredJobTypes.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-100"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link
          href="/dashboard/carrier/onboarding"
          className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
        >
          {user.onboardingCompleted
            ? "Update Profile Details"
            : "Complete Onboarding"}
        </Link>
        <Link
          href="/dashboard/carrier"
          className="px-6 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Profile;
