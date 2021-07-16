import { Regular } from "../@types/regular";
import axios from "axios";
axios.defaults.baseURL = `${
  process.env.NEXT_PUBLIC_IHSAN_PAY_SERVER_BASE_URL
}`;
axios.defaults.headers.post["Content-Type"] = "application/json";

const getRegularsHandler = async (): Promise<Regular[]> => {
  try {
    const { data } = await axios.get(`/regulars`);
    const regulars = data.sort(
      (a: Regular, b: Regular) => b.updatedAt! - a.updatedAt!
    );
    return regulars;
  } catch (error) {
    return error.response;
  }
};
const getRegularHandler = async (id: string): Promise<Regular> => {
  try {
    const { data } = await axios.get(`/regulars/${id}`);
    return data;
  } catch (error) {
    return error.response;
  }
};
const createRegularHandler = async (regular: Regular): Promise<Regular> => {
  try {
    const { data } = await axios.post(`/regulars/`, regular);
    return data;
  } catch (error) {
    return error.response;
  }
};
const updateRegularHandler = async (regular: Regular): Promise<Regular> => {
  try {
    const { data } = await axios.put(
      `/regulars/${regular.partition_key}`,
      regular
    );
    return data;
  } catch (error) {
    return error.response;
  }
};
const deleteRegularHandler = async (regular: Regular): Promise<any> => {
  try {
    const { data, status } = await axios.delete(
      `/regulars/${regular.partition_key}`
    );
    return { message: data.message, status };
  } catch (error) {
    return error.response;
  }
};

export {
  getRegularsHandler,
  getRegularHandler,
  createRegularHandler,
  updateRegularHandler,
  deleteRegularHandler,
};
