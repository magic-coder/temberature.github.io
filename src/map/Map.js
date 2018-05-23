import React from "react";
import { Map, Marker } from "react-amap";
import WebConstants from "../web_constants";
import axios from "../utils/customAxios";
import "./Map.less";
import { Map as IMap } from "immutable";

export default class OAMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: IMap()
    };
  }
  componentDidMount() {
    axios
      .get("/RetrieveEventByEventIdServlet", {
        params: {
          event_id: this.props.match.params.id,
          [WebConstants.TOKEN]: sessionStorage.getItem(WebConstants.TOKEN)
        }
      })
      .then(response => {
        console.log(response);

        this.setState(() => ({
          course: response.data
        }));
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  render() {
    return (
      <div className="OAMap">
        <Map zoom={11} amapkey={"2b268dc9feea7c014d85bb1ed8e7d911"}>
          <Marker
            position={{
              longitude: this.state.course.get("longitude") || 0,
              latitude: this.state.course.get("latitude") || 0
            }}
          />
        </Map>
      </div>
    );
  }
}
