import { Special } from "@libTypes/special";
import axios from "axios";
import { Post } from "@libTypes/post";
axios.defaults.baseURL = `${
  process.env.NEXT_PUBLIC_IHSAN_PAY_SERVER_BASE_URL
}`;
axios.defaults.headers.post["Content-Type"] = "application/json";

const getSpecialsHandler = async (): Promise<Special[]> => {
  try {
    const { data } = await axios.get(`/specials`);
    const specials = data.sort(
      (a: Special, b: Special) => b.updatedAt! - a.updatedAt!
    );
    return specials;
  } catch (error) {
    return error.response;
  }
};
const getSpecialHandler = async (id: string): Promise<Special> => {
  try {
    const { data } = await axios.get(`/specials/${id}`);
    data.posts = data.posts.sort((a: Post, b: Post) => a.index - b.index!);
    return data;
  } catch (error) {
    return error.response;
  }
};
const createSpecialHandler = async (special: Special): Promise<Special> => {
  try {
    const { data } = await axios.post(`/specials/`, special);
    return data;
  } catch (error) {
    return error.response;
  }
};
const updateSpecialHandler = async (special: Special): Promise<Special> => {
  try {
    const { data } = await axios.put(
      `/specials/${special.partition_key}`,
      special
    );
    return data;
  } catch (error) {
    return error.response;
  }
};
const deleteSpecialHandler = async (special: Special): Promise<any> => {
  try {
    const { data, status } = await axios.delete(
      `/specials/${special.partition_key}`
    );
    return { message: data.message, status };
  } catch (error) {
    return error.response;
  }
};

export {
  getSpecialsHandler,
  getSpecialHandler,
  createSpecialHandler,
  updateSpecialHandler,
  deleteSpecialHandler,
};
