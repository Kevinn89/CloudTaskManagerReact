import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Organizaion from "../components/organization/Organizaion";
import NameSearchBox from "../components/searchBox/NameSearchBox";
import { AppPaths, RoutePatterns } from "../routes/Route";
import { addUserToOrg, deleteOrganization, getOrganization } from "../services/OrgService";
import { getNonOrgUsers, type UserResponse } from "../services/UserService";
import { removeOrgFromState, setSelectedOrg, setSelectedUser } from "../store/OrgSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

type OrganizationHomePageProps = {

    isAllowed: boolean;

}

function OrganizationHomePage({ isAllowed }: OrganizationHomePageProps) {

    const user = useAppSelector(state => state.auth.user);

    const { orgId } = useParams()

    const location = useLocation();

    const baseRoute = `/${location.pathname.split("/")[2]}`;

    const navigate = useNavigate()

    const canDELETE = user?.privileges.includes("DELETE");
    const canCreate = user?.privileges.includes("CREATE");

    const dispatch = useAppDispatch();
    const selectedOrg = useAppSelector(state => state.org.selectedOrg);
    const selectedUser = useAppSelector(state => state.org.selectedUser);

    const [userList, setUserList] = useState<UserResponse[]>([])

    useEffect(() => {

        const id = Number(orgId);

        async function getMyOrg() {

            const org = await getOrganization(id).catch(error => console.log(error));


            if (!org)
                throw new Error(`No Organization for id ${id}`);

            dispatch(setSelectedOrg(org))
        }

        async function getUserList() {
            const userList = await getNonOrgUsers(id).catch(error => console.log(error))
            if (!userList)
                return
            setUserList(userList);
        }
        getUserList();
        getMyOrg();

    }, [dispatch, orgId])

    async function removeOrg() {

        const id = Number(orgId);

        await deleteOrganization(
            id
        ).catch(error => console.log(error))

        dispatch(removeOrgFromState(id));
        navigate(AppPaths.adminOrganizations())

    }
    async function addUser(orgId: number, userId: number) {

        console.log(`OrgId: ${orgId} and UserId ${userId}`)

        await addUserToOrg(orgId, userId).catch(error => console.log(error));

        const updatedList = userList.filter(user => user.id != userId)

        setUserList(updatedList)

    }

    return (
        <div>
            {
                selectedOrg ? <Organizaion organization={selectedOrg} /> : <></>
            }
            {
                canCreate && isAllowed ? <NameSearchBox users={userList} onSelectUser={(user) => dispatch(setSelectedUser(user))} /> : <></>
            }
            {
                canDELETE && isAllowed ? <button type="button" style={{ margin: "20px" }} onClick={removeOrg}>
                    Delete
                </button> : <></>
            }
            {
                canCreate && isAllowed ? <button type="button" style={{ margin: "20px" }} onClick={() => {

                    if (!selectedUser) return;
                    addUser(Number(orgId), selectedUser.id);

                }}>
                    Add to Org
                </button> : <></>
            }

            <button type="button" style={{ margin: "20px" }} onClick={() => {

                navigate(RoutePatterns.organizaionRoot + baseRoute)
            }}>
                My Organizations
            </button>

        </div>
    )
}

export default OrganizationHomePage
