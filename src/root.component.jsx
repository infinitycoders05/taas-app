import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Router, Redirect } from "@reach/router";
import MyTeamsList from "./routes/MyTeamsList";
import MyTeamsDetails from "./routes/MyTeamsDetails";
import PositionDetails from "./routes/PositionDetails";
import ResourceBookingDetails from "./routes/ResourceBookingDetails";
import ResourceBookingForm from "./routes/ResourceBookingForm";
import JobDetails from "./routes/JobDetails";
import JobForm from "./routes/JobForm";
import TeamAccess from "./routes/TeamAccess";
import CreateNewTeam from "./routes/CreateNewTeam";
import CreateTeamLanding from "./routes/CreateNewTeam/pages/CreateTeamLanding";
import InputSkills from "./routes/CreateNewTeam/pages/InputSkills";
import InputJobDescription from "./routes/CreateNewTeam/pages/InputJobDescription";
import SelectRole from "./routes/CreateNewTeam/pages/SelectRole";
import CreateTaasPayment from "./routes/CreateNewTeam/pages/CreateTaasPayment";
import ReduxToastr from "react-redux-toastr";
import store from "./store";
import "./styles/main.vendor.scss";
import styles from "./styles/main.module.scss";

export default function Root() {
  useEffect(() => {
    const script = window.document.createElement("script");
    script.innerHTML = `
      window._chatlio = window._chatlio || [];
      ! function() {
          var t = document.getElementById("chatlio-widget-embed");
          if (t && window.ChatlioReact && _chatlio.init) return void _chatlio.init(t, ChatlioReact);
          for (var e = function(t) {
                  return function() {
                      _chatlio.push([t].concat(arguments))
                  }
              }, i = ["configure", "identify", "track", "show", "hide", "isShown", "isOnline", "page", "open", "showOrHide"], a = 0; a < i.length; a++) _chatlio[i[a]] || (_chatlio[i[a]] = e(i[a]));
          var n = document.createElement("script"),
              c = document.getElementsByTagName("script")[0];
          n.id = "chatlio-widget-embed", n.src = "https://w.chatlio.com/w.chatlio-widget.js", n.async = !0, n.setAttribute("data-embed-version", "2.3");
          n.setAttribute('data-widget-id', 'df6d6a4d-7193-4eaf-648b-4569f0e6b262');
          c.parentNode.insertBefore(n, c);
      }();
    `;
    window.document.body.appendChild(script);
    return () => {
      window.document.body.removeChild(
        document.querySelector("#chatlio-widget")
      );
    };
  }, []);
  return (
    <div className={styles["topcoder-micro-frontends-teams-app"]}>
      <Provider store={store}>
        <Router>
          <Redirect from="/taas" to="/taas/myteams" exact />
          <MyTeamsList path="/taas/myteams" />
          <MyTeamsDetails path="/taas/myteams/:teamId" />
          <JobDetails path="/taas/myteams/:teamId/positions/:jobId" />
          <JobForm path="/taas/myteams/:teamId/positions/:jobId/edit" />
          <JobForm path="/taas/myteams/:teamId/positions/new" />
          <ResourceBookingDetails path="/taas/myteams/:teamId/rb/:resourceBookingId" />
          <ResourceBookingForm path="/taas/myteams/:teamId/rb/:resourceBookingId/edit" />
          <PositionDetails path="/taas/myteams/:teamId/positions/:positionId/candidates/*candidateStatus" />
          <TeamAccess path="/taas/myteams/:teamId/access" />
          <CreateTaasPayment path="/taas/myteams/createnewteam/create-taas-payment" />
          <CreateNewTeam path="/taas/createnewteam">
            <CreateTeamLanding path="/" />
            <InputJobDescription path="jd/*" />
            <InputSkills path="skills/*" />
            <SelectRole path="role/*" />
          </CreateNewTeam>
        </Router>

        {/* Global config for Toastr popups */}
        <ReduxToastr
          timeOut={4000}
          position="bottom-left"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
        />
      </Provider>
    </div>
  );
}
