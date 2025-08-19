import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/apis";
import {
  EditAstrologerThunkInput,
  UserPersonalDetail,
} from "../../../utils/types";

type UserResponse = any;
type ThunkApiConfig = {
  rejectValue: any;
};

export const userDetail = createAsyncThunk<UserResponse, void, ThunkApiConfig>(
  "login/user-detail",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/users");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const postUserDetail = createAsyncThunk<
  UserResponse,
  UserPersonalDetail, // Accepts a User object as the payload
  ThunkApiConfig
>("post/user-detail", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/v1/users", payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const uploadProfileImage = createAsyncThunk<
  any, // response type
  FormData, // payload must be FormData
  { rejectValue: any }
>("image/upload-profile-POST", async (formData, { rejectWithValue }) => {
  console.log(formData, "this api hits,....");
  try {
    const response = await api.post(
      "/api/v1/users/upload/profile-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// export const editAstrologerUser = createAsyncThunk(
//   'astrologer/edit',
//   async ({id, astrologerData, imageFile}: any, {rejectWithValue}) => {
//     try {
//       const formData = new FormData();

//       const jsonBlob =new Blob(
//   [JSON.stringify(astrologerData)],
//   { type: "application/json" }
// ));

//       formData.append('data', jsonBlob);

//       if (imageFile) {
//         formData.append('image', imageFile);
//       }

//       const response = await api.put(`/api/v1/astrologers/${id}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   },
// );

export const editAstrologerUser = createAsyncThunk(
  "astrologer/edit",
  async (
    { id, astrologerData, imageFile }: EditAstrologerThunkInput,
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      formData.append(
        "data",
        new Blob([JSON.stringify(astrologerData)], { type: "application/json" })
      );
      if (imageFile) {
        // If imageFile is already a File/Blob, append directly
        // If it's an object with uri/name/type (e.g., React Native), convert to Blob first
        if (imageFile instanceof Blob) {
          formData.append("image", imageFile);
        } else if (imageFile.uri && imageFile.name && imageFile.type) {
          // Fetch the file and convert to Blob
          const response = await fetch(imageFile.uri);
          const blob = await response.blob();
          formData.append("image", blob, imageFile.name);
        }
      }

      const response = await api.put(`/api/v1/astrologers/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
