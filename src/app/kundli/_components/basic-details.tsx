"use client";

import React, { useEffect, useState } from "react";

import { UserPersonalDetail } from "@/lib/utils/types";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react"; // spinner icon
import {
  getPersonKundliDetail,
  resetToDefaultUser,
  setKundliPerson,
} from "@/lib/store/reducer/kundli";
import { useAppDispatch, useAppSelector } from "@/lib/hook/redux-hook";

interface BasicDetailsProps {
  active?: number;
}

const BasicDetails: React.FC<BasicDetailsProps> = ({ active }) => {
  const [openedForOther, setOpenedForOther] = useState(false);
  const dispatch = useAppDispatch();
  const { kundliPerson, defaultUser } = useAppSelector((state) => state.kundli);
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();

  const [kundliDetail, setKundliDetail] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  console.log(i18n.language);
  
  const fetchKundliDetails = async () => {
    setLoading(true);
    try {
      const payload = await dispatch(
        getPersonKundliDetail({
          data: {
            ...kundliPerson,
            birthPlace: "Varanasi",
            latitude: 25.317645,
            longitude: 82.973915,
          },
          query: { lan: i18n.language },
        })
      ).unwrap();

      if (payload.success) {
        setKundliDetail(payload.data.data);
      }
    } catch (err) {
      toast.error("Error fetching kundli details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (active === 3) {
      fetchKundliDetails();
    }
  }, [dispatch, kundliPerson, active]);

  const handleUpdate = (updatedDetails: UserPersonalDetail) => {
    dispatch(setKundliPerson(updatedDetails));
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="animate-spin text-pink-500 h-8 w-8" />
        <p className="mt-2 text-gray-600">Please wait a moment</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-6">
      <Card className="p-6 shadow-md rounded-xl bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {kundliPerson.name}
          </h2>
          {pathname === "/chat" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(setKundliPerson(defaultUser))}
            >
              Reset
            </Button>
          )}
        </div>

        {pathname === "/chat" && (
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Details</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setOpenedForOther(false);
                setShowModal(true);
              }}
            >
              ✏️
            </Button>
          </div>
        )}

        <hr className="my-3 border-gray-200" />

        <div className="space-y-2">
          {kundliDetail &&
            Object.entries(kundliDetail).map(([key, value]) => {
              if (typeof value !== "object" && value !== null) {
                return (
                  <DetailRow
                    key={key}
                    label={key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    value={String(value)}
                  />
                );
              }
              return null;
            })}
        </div>
      </Card>

      {/* {showModal && (
        <PersonalDetailModal
          parent="basic detail personal modal"
          isOpen={showModal}
          onClose={() => {
            if (openedForOther) {
              dispatch(resetToDefaultUser());
              setOpenedForOther(false);
            }
            setShowModal(false);
          }}
          existingDetails={kundliPerson}
          onSubmit={handleUpdate}
        />
      )} */}
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-1">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="text-gray-900 text-right max-w-[60%]">{value}</span>
  </div>
);

export default BasicDetails;
