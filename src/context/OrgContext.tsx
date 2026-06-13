import { createContext, useContext, useState, type ReactNode } from "react";
import type { OrgResponse } from "../services/OrgService"
import type { UserResponse } from "../services/UserService";



const OrgContext = createContext<OrgContextType | undefined>(undefined);

type OrgProviderProps = {
    children: ReactNode;
}

type OrgContextType = {
    orgs: OrgResponse[] | null;
    selectedOrg: OrgResponse | null;
    selectedUser: UserResponse | null;

    setOrgs: (orgs: OrgResponse[]) => void
    setSelectedOrg: (selectedOrg: OrgResponse) => void
    setSelectedUser: (selectedUser: UserResponse) => void
    addOrg: (org: OrgResponse) => void
    addOrgs: (orgList: OrgResponse[]) => void
    addUserOrg: (user: UserResponse) => void
    removeOrgFromState: (orgId: number) => void
    updateOrgFromState: (updatedOrg: OrgResponse) => void
    clearOrgs: () => void
}

export default function OrgProvider({ children }: OrgProviderProps) {
    const [orgs, setOrgs] = useState<OrgResponse[]>([])
    const [selectedOrg, setSelectedOrg] = useState<OrgResponse | null>(null)
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)

    function addOrg(org: OrgResponse) {
        setOrgs((currentOrgs) => [...currentOrgs, org]);
    }

    function addUserOrg(user: UserResponse) {
        setSelectedUser(user);
    }

    function updateOrgFromState(updatedOrg: OrgResponse) {

        setOrgs(orgs => orgs.map(org => org?.id === updatedOrg.id ? updatedOrg : org))

        setSelectedOrg(org => org?.id === updatedOrg.id ? updatedOrg : org)
    }

    function removeOrgFromState(orgId: number) {

        setOrgs(orgs => orgs.filter(org => org?.id !== orgId))

        setSelectedOrg(org => org?.id === orgId ? null : org)
    }

    function addOrgs(orgList: OrgResponse[]) {


        setOrgs(orgList);
    }

    function clearOrgs() {
        setOrgs([]);
        setSelectedOrg(null);
        setSelectedUser(null);
    }


    return (
        <OrgContext.Provider
            value={{
                selectedUser,
                selectedOrg,
                orgs,
                addOrgs,
                setOrgs,
                clearOrgs,
                setSelectedOrg,
                setSelectedUser,
                addOrg,
                addUserOrg,
                updateOrgFromState,
                removeOrgFromState
            }}
        >
            {children}
        </OrgContext.Provider>
    );
}


export function useOrgs() {
    const context = useContext(OrgContext);

    if (context === undefined) {
        throw new Error("useOrgs must be used inside a OrgProvider");
    }

    return context;
}