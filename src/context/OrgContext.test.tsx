import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import OrgProvider, { useOrgs } from "./OrgContext";
import { makeOrg, makeUser } from "../test/factories";

function OrgContextHarness() {
    const {
        orgs,
        selectedOrg,
        selectedUser,
        addOrg,
        setSelectedOrg,
        setSelectedUser,
        updateOrgFromState,
        removeOrgFromState,
        clearOrgs,
    } = useOrgs();
    const org = makeOrg();
    const updatedOrg = makeOrg({ name: "Updated Platform Team", memberCount: 5 });
    const user = makeUser();

    return (
        <div>
            <p>Org count: {orgs?.length ?? 0}</p>
            <p>Selected org: {selectedOrg?.name ?? "none"}</p>
            <p>Selected user: {selectedUser?.name ?? "none"}</p>
            <button type="button" onClick={() => addOrg(org)}>Add org</button>
            <button type="button" onClick={() => setSelectedOrg(org)}>Select org</button>
            <button type="button" onClick={() => setSelectedUser(user)}>Select user</button>
            <button type="button" onClick={() => updateOrgFromState(updatedOrg)}>Update org</button>
            <button type="button" onClick={() => removeOrgFromState(org.id)}>Remove org</button>
            <button type="button" onClick={clearOrgs}>Clear orgs</button>
        </div>
    );
}

describe("OrgContext", () => {
    it("adds, selects, updates, removes, and clears organization state", async () => {
        const user = userEvent.setup();

        render(
            <OrgProvider>
                <OrgContextHarness />
            </OrgProvider>
        );

        expect(screen.getByText("Org count: 0")).toBeInTheDocument();
        expect(screen.getByText("Selected org: none")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Add org" }));
        expect(screen.getByText("Org count: 1")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Select org" }));
        expect(screen.getByText("Selected org: Platform Team")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Select user" }));
        expect(screen.getByText("Selected user: Taylor Admin")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Update org" }));
        expect(screen.getByText("Selected org: Updated Platform Team")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Remove org" }));
        expect(screen.getByText("Org count: 0")).toBeInTheDocument();
        expect(screen.getByText("Selected org: none")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Add org" }));
        await user.click(screen.getByRole("button", { name: "Select user" }));
        await user.click(screen.getByRole("button", { name: "Clear orgs" }));

        expect(screen.getByText("Org count: 0")).toBeInTheDocument();
        expect(screen.getByText("Selected user: none")).toBeInTheDocument();
    });
});
