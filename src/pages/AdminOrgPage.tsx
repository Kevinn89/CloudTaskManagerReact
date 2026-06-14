import { useEffect, type Key } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminOrgs, type OrgResponse } from '../services/OrgService';
import { AppPaths } from '../routes/Route';
import { addOrgs, setSelectedOrg } from '../store/OrgSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

function AdminOrgPage() {

    const user = useAppSelector(state => state.auth.user);

    const navigate = useNavigate()

    const dispatch = useAppDispatch();
    const orgs = useAppSelector(state => state.org.orgs);

    const canCreate = user?.privileges.includes("CREATE");


    if (!orgs) {

        return <p>No Organizations</p>
    }

    useEffect(() => {

        async function loadOrgs() {
            try {
                const response = await getAdminOrgs();

                console.log(response);
                dispatch(addOrgs(response));

            } catch (error) {
                console.log(error)
            }
        }
        loadOrgs();
    }, [])

    return (
        <main>
            <section>
                <Link to={AppPaths.organizations()}>home</Link>
                <h1>Manage your Organizations</h1>
                <p>View and manage your active projects.</p>
                {
                    canCreate ? <div>
                        <button type="button" style={{ marginTop: "20px" }} onClick={() => navigate(AppPaths.createOrganization())}>Create</button>

                    </div> : <></>
                }
            </section>
            <div>
                {
                    orgs.length === 0 ? <p>No Organizations</p> : orgs.map((org: OrgResponse, indx: Key | null | undefined) => {

                        return <Link key={(indx)} onClick={() => dispatch(setSelectedOrg(org))} to={AppPaths.adminOrganizationHome(org.id)}> {org.name}</Link>;

                    })
                }
            </div>
        </main>
    );

}

export default AdminOrgPage
