import { connect } from "react-redux";
import Page from "./page";

export default connect(({ firebase: { auth, profile } }) => ({
  auth,
  profile
}))(Page);
