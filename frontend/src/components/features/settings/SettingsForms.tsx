import { useState } from "react";

import { Form, Button } from "react-bootstrap";

import { UPDATE_USER_EMAIL } from "../../../graphql/mutations";
import { GET_LOGGEDIN_USER_DETAILS } from "../../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";

import { css } from "@emotion/react";
const settingsFormsStyles = css`
  margin: 60px 0;
`;

const SettingsForms = () => {
  const [email, setEmail] = useState("");

  //! ログイン中のユーザー情報を取得
  const { data: userData } = useQuery(GET_LOGGEDIN_USER_DETAILS, {
    fetchPolicy: "cache-and-network",
  });

  const [updateUserEmail, { loading, error }] = useMutation(UPDATE_USER_EMAIL);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserEmail({
      variables: {
        email,
        userId: userData?.getLoggedInUserDetails.id, // mutation に user id を渡す
      },
    });
    window.alert("Email address updated successfully!");
  };

  if (error) {
    console.log(error);
  }

  return (
    <section css={settingsFormsStyles}>
      <h2>Change Email Address</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Loading..." : "UPDATE"}
        </Button>
      </Form>
      <hr />
    </section>
  );
};

export default SettingsForms;
