"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useUserRole } from "@/lib/hook/use-role";
import { useAppDispatch, useAppSelector } from "@/lib/hook/redux-hook";
import { editAstrologerUser } from "@/lib/store/reducer/user";
import { setAstrologer, setUser } from "@/lib/store/reducer/auth";
import { toast } from "sonner";
import { Loader2, Pencil } from "lucide-react";

const AstrologerProfileEdit = () => {
  const role = useUserRole();
  const { user, astrologer_detail } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [fields, setFields] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
    expertise: astrologer_detail?.expertise || "",
    about: astrologer_detail?.about || "",
    experienceYears: astrologer_detail?.experienceYears || 0,
    languages: astrologer_detail?.languages || "",
    pricePerMinuteChat: astrologer_detail?.pricePerMinuteChat || 0,
    pricePerMinuteVoice: astrologer_detail?.pricePerMinuteVoice || 0,
    pricePerMinuteVideo: astrologer_detail?.pricePerMinuteVideo || 0,
  });

  const [profileImage, setProfileImage] = useState<string>(
    user?.imgUri ?? "/imgs/male.jpg"
  );
  const [file, setFile] = useState<File | null>(null);

  const handlePickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      setFile(imageFile);
      setProfileImage(URL.createObjectURL(imageFile));
    }
  };

  const validateFields = () => {
    const newErrors: string[] = [];
    if (!fields.name.trim()) newErrors.push("Name is required");
    if (!fields.mobile.trim()) newErrors.push("Mobile is required");
    if (!fields.expertise.trim()) newErrors.push("Expertise is required");
    if (!fields.about.trim()) newErrors.push("About is required");
    if (fields.experienceYears <= 0)
      newErrors.push("Experience must be greater than 0");
    if (!fields.languages.trim()) newErrors.push("Languages are required");
    if (fields.pricePerMinuteChat <= 0)
      newErrors.push("Chat price must be greater than 0");
    if (fields.pricePerMinuteVoice <= 0)
      newErrors.push("Voice price must be greater than 0");
    if (fields.pricePerMinuteVideo <= 0)
      newErrors.push("Video price must be greater than 0");
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error(validationErrors[0]); // show first error
      return;
    }

    setErrors([]);
    setIsSaving(true);

    try {
      const payload = await dispatch(
        editAstrologerUser({
          id: astrologer_detail?.id ? astrologer_detail?.id : "",
          astrologerData: fields,
          imageFile: file
            ? {
                uri: URL.createObjectURL(file),
                name: file.name,
                type: file.type,
              }
            : null,
        })
      ).unwrap();

      if (payload.success) {
        dispatch(setUser(payload.astrologer?.user));
        dispatch(setAstrologer(payload.astrologer));
        toast.success("Astrologer updated successfully");
      }
    } catch (err) {
      toast.error("Form submission failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <CardContent>
        {/* Profile image upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24">
            <Image
              src={profileImage}
              alt="Profile"
              fill
              className="rounded-xl border object-cover"
            />
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 bg-white border rounded-full p-1 cursor-pointer shadow"
            >
              <Pencil size={16} />
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePickImage}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={fields.name}
            onChange={(e) => setFields({ ...fields, name: e.target.value })}
          />
          <Input
            placeholder="Mobile"
            value={fields.mobile}
            onChange={(e) => setFields({ ...fields, mobile: e.target.value })}
          />
          <Input
            placeholder="Expertise"
            value={fields.expertise}
            onChange={(e) => setFields({ ...fields, expertise: e.target.value })}
          />
          <Textarea
            placeholder="About"
            value={fields.about}
            onChange={(e:any) => setFields({ ...fields, about: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Experience (Years)"
            value={fields.experienceYears.toString()}
            onChange={(e) =>
              setFields({
                ...fields,
                experienceYears: parseInt(e.target.value) || 0,
              })
            }
          />
          <Input
            placeholder="Languages (comma-separated)"
            value={fields.languages}
            onChange={(e) =>
              setFields({ ...fields, languages: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Chat Price ₹/min"
            value={fields.pricePerMinuteChat.toString()}
            onChange={(e) =>
              setFields({
                ...fields,
                pricePerMinuteChat: parseFloat(e.target.value) || 0,
              })
            }
          />
          <Input
            type="number"
            placeholder="Voice Price ₹/min"
            value={fields.pricePerMinuteVoice.toString()}
            onChange={(e) =>
              setFields({
                ...fields,
                pricePerMinuteVoice: parseFloat(e.target.value) || 0,
              })
            }
          />
          <Input
            type="number"
            placeholder="Video Price ₹/min"
            value={fields.pricePerMinuteVideo.toString()}
            onChange={(e) =>
              setFields({
                ...fields,
                pricePerMinuteVideo: parseFloat(e.target.value) || 0,
              })
            }
          />

          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Updating..." : "Save"}
          </Button>
        </div>

        {/* Errors list */}
        {errors.length > 0 && (
          <div className="mt-6 text-red-600 text-sm space-y-1">
            <p className="font-semibold">Please fix the following errors:</p>
            {errors.map((err, i) => (
              <p key={i}>• {err}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AstrologerProfileEdit;
