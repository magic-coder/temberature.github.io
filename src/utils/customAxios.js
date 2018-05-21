import axios from "axios";
import { fromJS } from "immutable";
// https://easy-mock.com/mock/5a3c67260df23b51b3614cfb
// https://www.jieshu.mobi:8181/YanglaoServer-war
export default axios.create({
  baseURL: "https://www.jieshu.mobi:8181/YanglaoServer-war",
  timeout: 10000,
  transformResponse: [
    data => {
      return fromJS(JSON.parse(data) || {});
    }
  ]
});
