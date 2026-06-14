import { describe, expect, it } from "vitest";
import orgReducer, {
    addOrg,
    clearOrgs,
    removeOrgFromState,
    setSelectedOrg,
    setSelectedUser,
    updateOrgFromState,
} from "./OrgSlice";
import { makeOrg, makeUser } from "../test/factories";

describe("OrgSlice", () => {
    it("adds organizations to the cache", () => {
        const org = makeOrg();

        const nextState = orgReducer(undefined, addOrg(org));

        expect(nextState.orgs).toEqual([org]);
    });

    it("upserts an organization with the same id", () => {
        const org = makeOrg({ name: "Original" });
        const updatedOrg = makeOrg({ name: "Updated" });

        const withOrg = orgReducer(undefined, addOrg(org));
        const nextState = orgReducer(withOrg, addOrg(updatedOrg));

        expect(nextState.orgs).toHaveLength(1);
        expect(nextState.orgs[0].name).toBe("Updated");
    });

    it("updates selected organization when the selected org changes", () => {
        const org = makeOrg({ name: "Original" });
        const updatedOrg = makeOrg({ name: "Updated" });

        const withOrg = orgReducer(undefined, addOrg(org));
        const withSelectedOrg = orgReducer(withOrg, setSelectedOrg(org));
        const nextState = orgReducer(withSelectedOrg, updateOrgFromState(updatedOrg));

        expect(nextState.orgs[0]).toEqual(updatedOrg);
        expect(nextState.selectedOrg).toEqual(updatedOrg);
    });

    it("removes organizations and clears selected organization when needed", () => {
        const org = makeOrg();

        const withOrg = orgReducer(undefined, addOrg(org));
        const withSelectedOrg = orgReducer(withOrg, setSelectedOrg(org));
        const nextState = orgReducer(withSelectedOrg, removeOrgFromState(org.id));

        expect(nextState.orgs).toEqual([]);
        expect(nextState.selectedOrg).toBeNull();
    });

    it("stores selected user and clears all org state", () => {
        const org = makeOrg();
        const user = makeUser();

        const withOrg = orgReducer(undefined, addOrg(org));
        const withSelectedUser = orgReducer(withOrg, setSelectedUser(user));
        const nextState = orgReducer(withSelectedUser, clearOrgs());

        expect(nextState.orgs).toEqual([]);
        expect(nextState.selectedOrg).toBeNull();
        expect(nextState.selectedUser).toBeNull();
    });
});
