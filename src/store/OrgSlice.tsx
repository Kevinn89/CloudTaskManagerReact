import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrgResponse } from "../services/OrgService";
import type { UserResponse } from "../services/UserService";

export type OrgState = {
    orgs: OrgResponse[];
    selectedOrg: OrgResponse | null;
    selectedUser: UserResponse | null;
};

const initialState: OrgState = {
    orgs: [],
    selectedOrg: null,
    selectedUser: null,
};

const orgSlice = createSlice({
    name: "org",
    initialState,
    reducers: {
        setOrgs(state, action: PayloadAction<OrgResponse[]>) {
            state.orgs = action.payload;
        },
        addOrg(state, action: PayloadAction<OrgResponse>) {
            const org = action.payload;
            const existingOrgIndex = state.orgs.findIndex(currentOrg => currentOrg.id === org.id);

            if (existingOrgIndex >= 0) {
                state.orgs[existingOrgIndex] = org;
                return;
            }

            state.orgs.push(org);
        },
        addOrgs(state, action: PayloadAction<OrgResponse[]>) {
            state.orgs = action.payload;
        },
        setSelectedOrg(state, action: PayloadAction<OrgResponse | null>) {
            state.selectedOrg = action.payload;
        },
        setSelectedUser(state, action: PayloadAction<UserResponse | null>) {
            state.selectedUser = action.payload;
        },
        addUserOrg(state, action: PayloadAction<UserResponse>) {
            state.selectedUser = action.payload;
        },
        removeOrgFromState(state, action: PayloadAction<number>) {
            const orgId = action.payload;

            state.orgs = state.orgs.filter(org => org.id !== orgId);

            if (state.selectedOrg?.id === orgId) {
                state.selectedOrg = null;
            }
        },
        updateOrgFromState(state, action: PayloadAction<OrgResponse>) {
            const updatedOrg = action.payload;
            const existingOrg = state.orgs.some(org => org.id === updatedOrg.id);

            state.orgs = existingOrg
                ? state.orgs.map(org => org.id === updatedOrg.id ? updatedOrg : org)
                : [...state.orgs, updatedOrg];

            if (state.selectedOrg?.id === updatedOrg.id) {
                state.selectedOrg = updatedOrg;
            }
        },
        clearOrgs() {
            return initialState;
        },
    },
});

export const {
    setOrgs,
    addOrg,
    addOrgs,
    setSelectedOrg,
    setSelectedUser,
    addUserOrg,
    removeOrgFromState,
    updateOrgFromState,
    clearOrgs,
} = orgSlice.actions;

export default orgSlice.reducer;
