"use client";

import {useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import Image from "next/image";
import {
  saveOnboarding,
  updateOnboardingStep,
  type OnboardingData,
} from "@/features/carrier/onboarding-actions";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/24/outline";

type TruckTypeOption = {id: number; name: string};

type OnboardingProps = {
  truckTypes: TruckTypeOption[];
  initialStep: number;
};


const TOTAL_STEPS = 5;

const defaultData: OnboardingData = {
  step1: {truckType: "", plateNumber: "", loadCapacity: "", condition: ""},
  step2: {
    baseCity: "",
    preferredRoutes: "",
    availableDays: [],
    availableFrom: "",
    availableTo: "",
    loadTypes: [],
  },
  step3: {
    preferredJobTypes: [],
    minPrice: "50000",
    maxPrice: "500000",
    maxDistance: "",
    notifyMatchingJobs: false,
    showOutsidePrefs: false,
    notifyWorkHoursOnly: false,
  },
  step4: {
    truckRegistration: "",
    insurance: "",
    roadworthiness: "",
    driverLicense: "",
    profilePhoto: "",
  },
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const LOAD_TYPES = [
  "Household Materials",
  "Vehicle Parts",
  "Others",
];

const JOB_TYPES = [
  "Full Truck Load",
  "Partial Load",
  "Fragile Goods",
  "Refrigerated Transport",
  "Hazardous Materials",
];

const NIGERIAN_CITIES = [
  "Lagos",
  "Abuja",
  "Kano",
  "Port Harcourt",
  "Ibadan",
  "Benin City",
  "Kaduna",
  "Enugu",
  "Warri",
  "Calabar",
  "Owerri",
  "Jos",
  "Ilorin",
  "Abeokuta",
  "Onitsha",
];

const CONDITIONS = [
  {value: "excellent", label: "Excellent"},
  {value: "good", label: "Good"},
  {value: "fair", label: "Fair"},
  {value: "needs_repair", label: "Needs Repair"},
];

const Onboarding = ({truckTypes, initialStep}: OnboardingProps) => {
  const [step, setStep] = useState(Math.min(initialStep + 1, TOTAL_STEPS));
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [isPending, startTransition] = useTransition();
  const [reviewExpanded, setReviewExpanded] = useState<Record<string, boolean>>(
    {}
  );
  const [confirmed, setConfirmed] = useState(false);
  const [showSpecify, setShowSpecify] = useState(false);
  const [specifyText, setSpecifyText] = useState("");
  const router = useRouter();

  const progress = (step / TOTAL_STEPS) * 100;

  function updateStep1(field: keyof OnboardingData["step1"], value: string) {
    setData((d) => ({...d, step1: {...d.step1, [field]: value}}));
  }

  function updateStep2(
    field: keyof OnboardingData["step2"],
    value: string | string[]
  ) {
    setData((d) => ({...d, step2: {...d.step2, [field]: value}}));
  }

  function toggleDay(day: string) {
    setData((d) => {
      const days = d.step2.availableDays.includes(day)
        ? d.step2.availableDays.filter((dd) => dd !== day)
        : [...d.step2.availableDays, day];
      return {...d, step2: {...d.step2, availableDays: days}};
    });
  }

  function toggleLoadType(lt: string) {
    setData((d) => {
      const types = d.step2.loadTypes.includes(lt)
        ? d.step2.loadTypes.filter((t) => t !== lt)
        : [...d.step2.loadTypes, lt];
      return {...d, step2: {...d.step2, loadTypes: types}};
    });
  }

  function toggleJobType(jt: string) {
    setData((d) => {
      const types = d.step3.preferredJobTypes.includes(jt)
        ? d.step3.preferredJobTypes.filter((t) => t !== jt)
        : [...d.step3.preferredJobTypes, jt];
      return {...d, step3: {...d.step3, preferredJobTypes: types}};
    });
  }

  function updateStep3(
    field: keyof OnboardingData["step3"],
    value: string | boolean
  ) {
    setData((d) => ({...d, step3: {...d.step3, [field]: value}}));
  }

  function updateStep4(field: keyof OnboardingData["step4"], value: string) {
    setData((d) => ({...d, step4: {...d.step4, [field]: value}}));
  }

  function goNext() {
    if (step < TOTAL_STEPS) {
      const nextStep = step + 1;
      setStep(nextStep);
      startTransition(() => {
        updateOnboardingStep(nextStep);
      });
    }
  }

  function goBack() {
    if (step > 1) setStep(step - 1);
  }

  function handleSubmit() {
    if (!confirmed) {
      toast.error("Please confirm that the details are correct.");
      return;
    }

    const finalData = {...data};
    if (showSpecify && specifyText) {
      finalData.step2 = {
        ...finalData.step2,
        loadTypes: [...finalData.step2.loadTypes, specifyText],
      };
    }

    startTransition(async () => {
      const result = await saveOnboarding(finalData);
      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/carrier");
      } else {
        toast.error(result.message);
      }
    });
  }

  function toggleReview(key: string) {
    setReviewExpanded((r) => ({...r, [key]: !r[key]}));
  }

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition";
  const selectClass =
    "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition appearance-none bg-white";
  const labelClass = "block text-sm font-semibold text-gray-900 mb-2";
  const checkboxClass =
    "h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-12 sm:pb-16">
      {/* Step 1: Truck image header */}
      {step === 1 && (
        <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6">
          <Image
            src="/onboarding/img_1.png"
            alt="Trucks"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Step 3: Truck image header */}
      {step === 3 && (
        <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6">
          <Image
            src="/onboarding/img_2.png"
            alt="Trucks"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end p-6">
            <h2 className="text-white text-2xl font-bold">
              Bidding Preferences
            </h2>
          </div>
        </div>
      )}

      {/* Progress */}
      <p className="text-sm text-gray-500 mb-2">
        Step {step} of {TOTAL_STEPS}
      </p>
      <div className="w-full h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gray-900 rounded-full transition-all duration-500"
          style={{width: `${progress}%`}}
        />
      </div>

      {/* ---------- STEP 1: Register Your Truck ---------- */}
      {step === 1 && (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Register Your Truck
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Please provide accurate details about your truck to ensure smooth
            operations and compliance.
          </p>

          <div className="space-y-5">
            <div>
              <label className={labelClass}>Truck Type</label>
              <select
                value={data.step1.truckType}
                onChange={(e) => updateStep1("truckType", e.target.value)}
                className={selectClass}
              >
                <option value="">Select your truck type</option>
                {truckTypes.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Plate Number</label>
              <input
                type="text"
                placeholder="e.g., XYZ-7890"
                value={data.step1.plateNumber}
                onChange={(e) => updateStep1("plateNumber", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Load Capacity</label>
              <input
                type="text"
                placeholder="e.g., 12,000 kg"
                value={data.step1.loadCapacity}
                onChange={(e) => updateStep1("loadCapacity", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Current Condition</label>
              <select
                value={data.step1.condition}
                onChange={(e) => updateStep1("condition", e.target.value)}
                className={selectClass}
              >
                <option value="">Select condition</option>
                {CONDITIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload area placeholder */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <p className="font-semibold text-gray-900 mb-1">
                Upload Truck Photo
              </p>
              <p className="text-sm text-gray-400 mb-3">
                Drag and drop or click to upload
              </p>
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Upload Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- STEP 2: Route & Availability ---------- */}
      {step === 2 && (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Set Your Route & Availability
          </h1>

          <div className="space-y-6">
            <div>
              <label className={labelClass}>Base Location</label>
              <select
                value={data.step2.baseCity}
                onChange={(e) => updateStep2("baseCity", e.target.value)}
                className={selectClass}
              >
                <option value="">Select your base city</option>
                {NIGERIAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Preferred Routes</label>
              <select
                value={data.step2.preferredRoutes}
                onChange={(e) =>
                  updateStep2("preferredRoutes", e.target.value)
                }
                className={selectClass}
              >
                <option value="">Select preferred operating routes</option>
                {NIGERIAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Availability
              </h3>
              <div className="space-y-2.5">
                {DAYS.map((day) => (
                  <label
                    key={day}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={data.step2.availableDays.includes(day)}
                      onChange={() => toggleDay(day)}
                      className={checkboxClass}
                    />
                    <span className="text-sm text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Availability Time
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="time"
                  placeholder="From"
                  value={data.step2.availableFrom}
                  onChange={(e) =>
                    updateStep2("availableFrom", e.target.value)
                  }
                  className={inputClass}
                />
                <input
                  type="time"
                  placeholder="To"
                  value={data.step2.availableTo}
                  onChange={(e) =>
                    updateStep2("availableTo", e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Load Types</h3>
              <div className="space-y-2.5">
                {LOAD_TYPES.map((lt) => (
                  <label
                    key={lt}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={data.step2.loadTypes.includes(lt)}
                      onChange={() => toggleLoadType(lt)}
                      className={checkboxClass}
                    />
                    <span className="text-sm text-gray-700">{lt}</span>
                  </label>
                ))}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSpecify}
                    onChange={() => setShowSpecify(!showSpecify)}
                    className={checkboxClass}
                  />
                  <span className="text-sm text-gray-700">Please specify</span>
                </label>
                {showSpecify && (
                  <input
                    type="text"
                    placeholder="Please specify"
                    value={specifyText}
                    onChange={(e) => setSpecifyText(e.target.value)}
                    className={inputClass}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- STEP 3: Bidding Preferences ---------- */}
      {step === 3 && (
        <div>
          {/* Title shown when no image header */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Preferred Job Types
              </h3>
              <div className="space-y-2.5">
                {JOB_TYPES.map((jt) => (
                  <label
                    key={jt}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={data.step3.preferredJobTypes.includes(jt)}
                      onChange={() => toggleJobType(jt)}
                      className={checkboxClass}
                    />
                    <span className="text-sm text-gray-700">{jt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Preferred Price Range
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="50,000"
                  value={data.step3.minPrice}
                  onChange={(e) => updateStep3("minPrice", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="500,000"
                  value={data.step3.maxPrice}
                  onChange={(e) => updateStep3("maxPrice", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Maximum Distance
              </h3>
              <input
                type="text"
                placeholder="e.g., 300 km"
                value={data.step3.maxDistance}
                onChange={(e) => updateStep3("maxDistance", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Notification Settings
              </h3>
              <div className="space-y-2.5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.step3.notifyMatchingJobs}
                    onChange={(e) =>
                      updateStep3("notifyMatchingJobs", e.target.checked)
                    }
                    className={checkboxClass}
                  />
                  <span className="text-sm text-gray-700">
                    Notify me about jobs matching preferences
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.step3.showOutsidePrefs}
                    onChange={(e) =>
                      updateStep3("showOutsidePrefs", e.target.checked)
                    }
                    className={checkboxClass}
                  />
                  <span className="text-sm text-gray-700">
                    Show jobs slightly outside preferences
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.step3.notifyWorkHoursOnly}
                    onChange={(e) =>
                      updateStep3("notifyWorkHoursOnly", e.target.checked)
                    }
                    className={checkboxClass}
                  />
                  <span className="text-sm text-gray-700">
                    Notify only during work hours (8 AM &ndash; 6 PM)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- STEP 4: Document Upload ---------- */}
      {step === 4 && (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Document Upload
          </h1>

          <div className="space-y-6">
            {[
              {
                key: "truckRegistration" as const,
                label: "Truck Registration Document",
              },
              {key: "insurance" as const, label: "Insurance Certificate"},
              {
                key: "roadworthiness" as const,
                label: "Roadworthiness Certificate (Optional)",
              },
              {key: "driverLicense" as const, label: "Driver's License"},
              {key: "profilePhoto" as const, label: "Profile Photo"},
            ].map((doc) => (
              <div key={doc.key}>
                <label className={labelClass}>{doc.label}</label>
                <input
                  type="text"
                  placeholder="Drag and drop or browse"
                  value={data.step4[doc.key]}
                  onChange={(e) => updateStep4(doc.key, e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- STEP 5: Review & Confirm ---------- */}
      {step === 5 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Review & Confirm
            </h1>

            <div className="space-y-3">
              {[
                {key: "truck", label: "Truck Details"},
                {key: "route", label: "Route & Availability"},
                {key: "prefs", label: "Preferences"},
                {key: "docs", label: "Uploaded Documents"},
              ].map((section) => (
                <div
                  key={section.key}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleReview(section.key)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition cursor-pointer"
                  >
                    <span className="font-medium text-gray-900">
                      {section.label}
                    </span>
                    {reviewExpanded[section.key] ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {reviewExpanded[section.key] && (
                    <div className="px-5 pb-4 text-sm text-gray-600 space-y-1 border-t border-gray-100 pt-3">
                      {section.key === "truck" && (
                        <>
                          <p>Type: {data.step1.truckType || "—"}</p>
                          <p>Plate: {data.step1.plateNumber || "—"}</p>
                          <p>Capacity: {data.step1.loadCapacity || "—"}</p>
                          <p>Condition: {data.step1.condition || "—"}</p>
                        </>
                      )}
                      {section.key === "route" && (
                        <>
                          <p>Base: {data.step2.baseCity || "—"}</p>
                          <p>
                            Days:{" "}
                            {data.step2.availableDays.join(", ") || "—"}
                          </p>
                          <p>
                            Time: {data.step2.availableFrom || "—"} &ndash;{" "}
                            {data.step2.availableTo || "—"}
                          </p>
                          <p>
                            Load Types:{" "}
                            {data.step2.loadTypes.join(", ") || "—"}
                          </p>
                        </>
                      )}
                      {section.key === "prefs" && (
                        <>
                          <p>
                            Job Types:{" "}
                            {data.step3.preferredJobTypes.join(", ") || "—"}
                          </p>
                          <p>
                            Price: {data.step3.minPrice || "—"} &ndash;{" "}
                            {data.step3.maxPrice || "—"}
                          </p>
                          <p>
                            Max Distance: {data.step3.maxDistance || "—"} km
                          </p>
                        </>
                      )}
                      {section.key === "docs" && (
                        <>
                          <p>
                            Registration:{" "}
                            {data.step4.truckRegistration || "Not uploaded"}
                          </p>
                          <p>
                            Insurance:{" "}
                            {data.step4.insurance || "Not uploaded"}
                          </p>
                          <p>
                            Roadworthiness:{" "}
                            {data.step4.roadworthiness || "Not uploaded"}
                          </p>
                          <p>
                            License:{" "}
                            {data.step4.driverLicense || "Not uploaded"}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <label className="flex items-center gap-3 mt-6 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className={checkboxClass}
              />
              <span className="text-sm text-gray-700">
                I confirm that the above details are correct.
              </span>
            </label>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="mt-5 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer"
            >
              {isPending ? "Submitting..." : "Submit & Finish Onboarding"}
            </button>
          </div>

          {/* Right side: success preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6">
              <Image
                src="/onboarding/img_3.png"
                alt="Welcome"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-2xl font-bold text-gray-900 text-center">
              You&apos;re all set! Welcome aboard, let&apos;s move loads.
            </p>
            <button
              type="button"
              onClick={() => router.push("/dashboard/carrier")}
              className="mt-4 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      {step < 5 && (
        <div className="flex justify-between mt-10">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition disabled:opacity-30 cursor-pointer"
          >
            Back
          </button>
          <button
            type="button"
            onClick={goNext}
            className="px-8 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition cursor-pointer"
          >
            {step === 4 ? "Continue" : "Next"}
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="flex justify-start mt-6 lg:hidden">
          <button
            type="button"
            onClick={goBack}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition cursor-pointer"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
