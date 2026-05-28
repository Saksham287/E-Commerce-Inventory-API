import React from "react";

function Users() {
    return (
    <div>
        <h1>Users</h1>

        <p>Your backend does not have a GET users endpoint yet.</p>

        <table border="1" cellPadding="10">
        <thead>
            <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            </tr>
        </thead>

        <tbody>
            <tr>
            <td>1</td>
            <td>admin1</td>
            <td>Admin</td>
            </tr>
            <tr>
            <td>2</td>
            <td>staff1</td>
            <td>Staff</td>
            </tr>
        </tbody>
        </table>
    </div>
    );
}

export default Users;