import { useEffect, useState, type Key } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrgs } from '../context/OrgContext';
import { getUserOrganizations, type OrgResponse } from '../services/OrgService';
import { AppPaths } from '../routes/Route';
import { useAuth } from '../context/AuthContext';

function OrganizationPage() {

    const { user } = useAuth()

    const canCreate = user?.privileges.includes("CREATE");

    const [orgs, setOrgs] = useState<OrgResponse[]>([])
    const { setSelectedOrg } = useOrgs();
    const navigate = useNavigate()

    useEffect(() => {

        async function loadOrganizations() {
            const orgs = await getUserOrganizations();

            console.log(orgs)
            setOrgs(orgs)
        }

        loadOrganizations();

    }, []) //fix this

    // function testOrgs() {

    //     async function loadOrganizations() {
    //         const orgs = await getUserOrganizations();

    //         console.log(orgs)
    //         setOrgs(orgs)
    //     }

    //     loadOrganizations();
    // }


    return (
        <main>
            <section>
                <Link to={AppPaths.dashboardHome()}>home</Link>
                <h1>Organization</h1>
                <p>View and your active organizations.</p>

                {/* <button type="button" onClick={testOrgs} >Test ORGS</button> */}
                {

                    canCreate ? <button type="button" style={{ margin: "20px" }} onClick={() => navigate(AppPaths.adminOrganizations())}>
                        My Organization Admin
                    </button> : <></>

                }
                <div>
                    {
                        orgs.length === 0 ? <p>No Organizations</p> : orgs.map((org: OrgResponse, indx: Key | null | undefined) => {

                            console.log(org)

                            return <Link key={(indx)} onClick={() => setSelectedOrg(org)} to={AppPaths.organizationHome(org.id)}> {org.name}</Link>;

                        })
                    }
                </div>
            </section>
        </main>
    );
}

export default OrganizationPage



