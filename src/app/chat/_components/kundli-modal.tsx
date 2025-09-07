import Kundli from "@/app/kundli/_components/kundli-page";
import CustomModal from "@/components/common/modal";
import { on } from "events";
import React from "react";

function KundliModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <CustomModal
      header={{ title: "Kundli Detail" }}
      visible={true}
      onClose={() => {
        onClose();
      }}
    >
      <Kundli />
    </CustomModal>
  );
}

export default KundliModal;
