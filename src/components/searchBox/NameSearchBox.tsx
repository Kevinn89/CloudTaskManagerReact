import { useMemo, useState } from "react";
import { type UserResponse } from "../../services/UserService";

type NameSearchBoxProps = {
    users: UserResponse[];
    onSelectUser: (user: UserResponse) => void;
};

export default function NameSearchBox({
    users,
    onSelectUser,
}: NameSearchBoxProps) {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const filteredUsers = useMemo(() => {
        const trimmedSearch = search.trim().toLowerCase();

        if (!trimmedSearch) {
            return [];
        }

        return users
            .filter((user) => user.name.toLowerCase().includes(trimmedSearch))
            .slice(0, 8);
    }, [search, users]);

    function handleSelectUser(user: UserResponse) {
        setSearch(user.name);
        setIsOpen(false);
        onSelectUser(user);
    }

    return (
        <div style={{ position: "relative", width: "300px" }}>
            <label htmlFor="name-search">Search name</label>

            <input
                id="name-search"
                type="text"
                value={search}
                placeholder="Type a name..."
                autoComplete="off"
                onFocus={() => {
                    if (search.trim()) {
                        setIsOpen(true);
                    }
                }}
                onChange={(event) => {
                    setSearch(event.target.value);
                    setIsOpen(true);
                }}
                style={{
                    width: "100%",
                    padding: "8px",
                }}
            />

            {isOpen && filteredUsers.length > 0 ? (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        border: "1px solid #ccc",
                        background: "gray",
                        zIndex: 10,
                        maxHeight: "200px",
                        overflowY: "auto",
                    }}
                >
                    {filteredUsers.map((user) => (
                        <button
                            key={user.id}
                            type="button"
                            onClick={() => {
                                handleSelectUser(user)
                            }}
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "8px",
                                textAlign: "left",
                                border: "none",
                                background: "gray",
                                cursor: "pointer",
                            }}
                        >
                            {user.name} — {user.email}
                        </button>
                    ))}
                </div>
            ) : null}

            {isOpen && search.trim() && filteredUsers.length === 0 ? (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        border: "1px solid #ccc",
                        background: "gray",
                        zIndex: 10,
                        padding: "8px",
                    }}
                >
                    No users found
                </div>
            ) : null}
        </div>
    );
}