import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserOrganizations } from '../services/OrgService';
import { AppPaths } from '../routes/Route';
import { setOrgs, setSelectedOrg } from '../store/OrgSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';


function OrganizationPage() {

    const user = useAppSelector(state => state.auth.user);

    const canCreate = user?.privileges.includes("CREATE");

    const dispatch = useAppDispatch();
    const orgs = useAppSelector(state => state.org.orgs);
    const navigate = useNavigate()

    useEffect(() => {

        async function loadOrganizations() {
            const orgs = await getUserOrganizations();

            console.log(orgs)
            dispatch(setOrgs(orgs))
        }

        loadOrganizations();

    }, [dispatch])

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
                        orgs.length === 0 ? <p>No Organizations</p> : orgs.map((org) => {

                            console.log(org)

                            return <Link key={org.id} onClick={() => dispatch(setSelectedOrg(org))} to={AppPaths.organizationHome(org.id)}> {org.name}</Link>;

                        })
                    }
                </div>
            </section>
        </main>
    );
}

export default OrganizationPage


