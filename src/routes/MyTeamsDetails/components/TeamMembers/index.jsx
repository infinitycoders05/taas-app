/**
 * TeamMembers
 *
 * Shows list of team members with a filter and pagination.
 */
import React, { useState, useCallback, useMemo } from "react";
import PT from "prop-types";
import "./styles.module.scss";
import _ from "lodash";
import moment from "moment";
import User from "components/User";
import CardHeader from "components/CardHeader";
// import Rating from "components/Rating";
import SkillsSummary from "components/SkillsSummary";
import ActionsMenu from "components/ActionsMenu";
import Button from "components/Button";
import Pagination from "components/Pagination";
import { DAY_FORMAT, TEAM_MEMBERS_PER_PAGE } from "constants";
import { formatMoney, formatReportIssueUrl } from "utils/format";
import Input from "components/Input";
import { skillShape } from "components/SkillsList";

const TeamMembers = ({ team }) => {
  const { resources } = team;
  const [filter, setFilter] = useState("");

  const filteredMembers = useMemo(
    () =>
      resources.filter((member) => {
        const filterLowerCase = filter.toLowerCase();
        const lookupFields = _.compact([
          member.handle,
          member.firstName,
          member.lastName,
          member.role,
          ..._.map(member.skills, "name"),
        ]).map((field) => field.toLowerCase());

        return _.some(
          lookupFields,
          (field) => field.indexOf(filterLowerCase) > -1
        );
      }),
    [resources, filter]
  );

  const onFilterChange = useCallback(
    (event) => {
      setFilter(event.target.value);
      setPage(1);
    },
    [setFilter]
  );

  const [perPage, setPerPage] = useState(TEAM_MEMBERS_PER_PAGE);
  const [page, setPage] = useState(1);
  const showMore = useCallback(() => {
    const newPerPage = perPage + TEAM_MEMBERS_PER_PAGE;
    const nextPageFirstItemNumber = page * perPage + 1;
    const newPage = Math.floor(nextPageFirstItemNumber / newPerPage) + 1;
    setPerPage(newPerPage);
    setPage(newPage);
  }, [perPage, setPerPage, page, setPage]);

  const pagesTotal = Math.ceil(filteredMembers.length / perPage);

  const pageMembers = useMemo(
    () => filteredMembers.slice((page - 1) * perPage, page * perPage),
    [filteredMembers, page, perPage]
  );

  const onPageClick = useCallback(
    (newPage) => {
      setPage(newPage);
    },
    [setPage]
  );

  return (
    <div styleName="team-members">
      <CardHeader
        title="ALL TEAM MEMBERS"
        aside={
          <Input
            placeholder="Filter by handle, name, role or skill"
            styleName="filter-input"
            value={filter}
            onChange={onFilterChange}
          />
        }
      />
      {resources.length === 0 && <div styleName="no-members">No members</div>}
      {resources.length > 0 && filteredMembers.length === 0 && (
        <div styleName="no-members">No members matching filter</div>
      )}
      {filteredMembers.length > 0 && (
        <div styleName="table">
          {pageMembers.map((member) => (
            <div styleName="table-row" key={member.id}>
              <div styleName="table-group-first">
                <div styleName="table-cell cell-user">
                  <User
                    user={{
                      ...member,
                      photoUrl: member.photo_url,
                    }}
                  />
                </div>
                <div styleName="table-group-first-inner">
                  <div styleName="table-cell cell-role">{member.role}</div>
                  <div styleName="table-cell cell-date">
                    {moment(member.startDate).format(DAY_FORMAT)} -{" "}
                    {moment(member.endDate).format(DAY_FORMAT)}
                  </div>
                  <div styleName="table-cell cell-money">
                    {formatMoney(member.weeklyCost || 0)}
                  </div>
                </div>
              </div>
              <div styleName="table-group-second">
                <div styleName="table-cell cell-skills">
                  <SkillsSummary
                    skills={member.skills}
                    skillMatched={member.skillMatched}
                  />
                </div>
                <div styleName="table-group-second-inner">
                  <div styleName="table-cell cell-rating">
                    {/* Hide Rating for now as per https://github.com/topcoder-platform/taas-app/issues/18 */}
                    {/* <Rating value={member.rating} short /> */}
                  </div>
                  <div styleName="table-cell cell-action">
                    <ActionsMenu
                      options={[
                        {
                          label: "Report an Issue",
                          action: () => {
                            window.open(
                              formatReportIssueUrl(
                                `Issue with ${member.handle} on ${team.name}`
                              )
                            );
                          },
                        },
                        { label: "Request an Extension", action: () => {} },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div styleName="controls">
        <Button
          type="secondary"
          onClick={showMore}
          disabled={
            filteredMembers.length === 0 || // if no members to show
            page === pagesTotal // if we are already on the last page
          }
        >
          Show More
        </Button>
        {filteredMembers.length > 0 && (
          <Pagination
            total={filteredMembers.length}
            currentPage={page}
            perPage={perPage}
            onPageClick={onPageClick}
          />
        )}
      </div>
    </div>
  );
};

TeamMembers.propTypes = {
  team: PT.shape({
    name: PT.string,
    resources: PT.arrayOf(
      PT.shape({
        id: PT.string,
        handle: PT.string,
        firstName: PT.string,
        lastName: PT.string,
        skills: PT.arrayOf(skillShape),
        skillMatched: PT.number,
      })
    ),
  }),
};

export default TeamMembers;
