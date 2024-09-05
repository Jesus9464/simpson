import axios from "axios";
import { config } from "../config";

export const simpsonUrl = axios.create({
  baseURL: config.host,
  timeout: 1000,
});
