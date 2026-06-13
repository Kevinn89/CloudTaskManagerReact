import { useEffect, useState } from 'react';


import { useNavigate } from "react-router-dom";

import NameSearchBox from '../components/searchBox/NameSearchBox';
import { useAuth } from '../context/AuthContext';
import { useOrgs } from '../context/OrgContext';
import { addUserToOrg, deleteOrganization, getUserOrganizations, type OrgResponse } from '../services/OrgService';
import { getUsers, type UserResponse } from '../services/UserService';
import { AppPaths } from '../routes/Route';



function EditOrgPage() {

    const { user } = useAuth()

    const navigate = useNavigate()

    const canDELETE = user?.privileges.includes("DELETE") === true;

    if (!user)
        throw new Error("No User")

    const { selectedOrg, removeOrgFromState } = useOrgs();

    if (!selectedOrg) {

        return <p>No Organizations selected.</p>;
    }

    const { id, name, description, createdAt } = selectedOrg
    const [orgList, setOrgList] = useState<OrgResponse[]>([])
    const [userList, setUserList] = useState<UserResponse[]>([])

    useEffect(() => {

        async function getMyOrgs() {
            const orgs = await getUserOrganizations().catch(error => console.log(error))

            if (!orgs)
                return

            setOrgList(orgs);
        }

        async function getUserList() {

            const userList = await getUsers().catch(error => console.log(error))

            if (!userList)
                return

            setUserList(userList);

        }
        getUserList();
        getMyOrgs();

    }, [id])

    async function removeOrg() {

        console.log(id)

        await deleteOrganization(
            id
        ).catch(error => console.log(error))

        removeOrgFromState(id);
        navigate(AppPaths.organizations())

    }
    async function addUser(orgId: number, userId: number) {

        await addUserToOrg(orgId, userId);
    }

    return (
        <div>
            <p>Organization ID number: {id}</p>

            <form>
                <div>
                    <label>
                        Organization Name Change:
                        <input
                            type="text"
                            name="name"
                            value={name}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Organization Description Change:
                        <textarea
                            name="description"
                            value={description}
                            maxLength={500}
                            rows={10}
                            style={{
                                width: "100%",
                                height: "120px",
                                resize: "none",
                            }}
                        />
                    </label>
                </div>

                <NameSearchBox users={userList} onSelectUser={function (user: UserResponse): void {
                    throw new Error('Function not implemented.');
                }} />
                {

                    canDELETE ? <button type="button" style={{ margin: "20px" }} onClick={removeOrg}>
                        Delete
                    </button> : <></>

                }
                <button type="button" style={{ margin: "20px" }} onClick={() => navigate(AppPaths.organizations())}>
                    My Organizations
                </button>
            </form>
        </div>
    )
}
export default EditOrgPage;