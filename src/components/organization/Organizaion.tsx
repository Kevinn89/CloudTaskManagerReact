import type { OrgResponse } from '../../services/OrgService';
import "/src/components/organization/Organization.css";

type OrganizationProps = {

    organization: OrgResponse;

}

function Organizaion({ organization }: OrganizationProps) {

    const { name, description, createdAt, memberCount } = organization
    const createdDate = new Date(createdAt);
    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0])
        .join("")
        .toUpperCase();

    const formattedDate = Number.isNaN(createdDate.getTime()) ? createdAt : new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(createdDate);

    return (
        <article className="organization-card">
            <div className="organization-card__header">
                <div className="organization-card__avatar" aria-hidden="true">
                    {initials || "O"}
                </div>
                <div>
                    <p className="organization-card__eyebrow">Organization</p>
                    <h2 className="organization-card__title">{name}</h2>
                </div>
            </div>

            <p className="organization-card__description">
                {description || "No description has been added for this organization."}
            </p>

            <div className="organization-card__meta" aria-label="Organization details">
                <div className="organization-card__stat">
                    <span>{memberCount}</span>
                    <small>{memberCount === 1 ? "Member" : "Members"}</small>
                </div>
                <div className="organization-card__stat">
                    <span>{formattedDate}</span>
                    <small>Created</small>
                </div>
            </div>
        </article>

    )
}

export default Organizaion
