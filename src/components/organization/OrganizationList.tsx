import type { OrgResponse } from "../../services/OrgService";
import Organizaion from "./Organizaion";
import "/src/components/organization/Organization.css";

type OrgListProps =
    {
        orgs: OrgResponse[];
    }

function OrganizationList({ orgs }: OrgListProps) {


    return (
        <div className="organization-list">
            {
                orgs.length === 0 ? (
                    <div className="organization-empty">
                        <p className="organization-empty__title">No organizations yet</p>
                        <p className="organization-empty__copy">Organizations you create or join will appear here.</p>
                    </div>
                ) : orgs.map((org) => {
                    return <Organizaion key={org.id} organization={org} />;
                })
            }
        </div>
    )
}

export default OrganizationList
