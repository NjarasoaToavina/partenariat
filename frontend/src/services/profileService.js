import api from "./api";

export const updateProfile = (formData) => {
  return api.post("/profile", formData);
};